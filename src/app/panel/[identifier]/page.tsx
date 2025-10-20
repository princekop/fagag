"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconTerminal, IconPlayerPlay, IconPlayerPause, IconRefresh, IconDatabase as IconRam, IconCpu, IconDisc, IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

type ServerData = {
  attributes: {
    uuid: string
    identifier: string
    name: string
    description: string
    status: string | null
    limits: {
      memory: number
      disk: number
      cpu: number
    }
    feature_limits: {
      databases: number
      allocations: number
      backups: number
    }
    relationships?: {
      allocations?: {
        data: Array<{
          attributes: {
            ip: string
            port: number
            is_default: boolean
          }
        }>
      }
    }
  }
}

type ResourceData = {
  attributes: {
    current_state: string
    is_suspended: boolean
    resources: {
      memory_bytes: number
      cpu_absolute: number
      disk_bytes: number
      network_rx_bytes: number
      network_tx_bytes: number
      uptime: number
    }
  }
}

export default function PanelPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<ServerData | null>(null)
  const [resources, setResources] = useState<ResourceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [command, setCommand] = useState("")
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [systemMessages, setSystemMessages] = useState<string[]>([])
  const [showSystemMessages, setShowSystemMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected")
  const [autoScroll, setAutoScroll] = useState(true)
  const [consoleFilter, setConsoleFilter] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const consoleEndRef = useRef<HTMLDivElement>(null)
  const consoleContainerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const commandInputRef = useRef<HTMLInputElement>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const isReconnectingRef = useRef(false)
  const lastConnectAttemptRef = useRef(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchServer()
      fetchResources()
      connectWebSocket()
      const interval = setInterval(fetchResources, 3000)
      return () => {
        clearInterval(interval)
        if (wsRef.current) {
          wsRef.current.close()
        }
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
      }
    }
  }, [status, identifier])

  const connectWebSocket = async () => {
    try {
      // Prevent multiple simultaneous connection attempts
      if (isReconnectingRef.current) {
        console.log("Already attempting to reconnect, skipping...")
        return
      }

      // Rate limit: Don't attempt reconnection more than once per 2 seconds
      const now = Date.now()
      if (now - lastConnectAttemptRef.current < 2000) {
        console.log("Rate limiting reconnection attempts")
        return
      }
      lastConnectAttemptRef.current = now

      isReconnectingRef.current = true

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }

      setWsStatus("connecting")
      setSystemMessages(prev => [...prev, `[System] Connecting to console...`])

      const res = await fetch(`/api/panel/${identifier}/websocket`)
      if (!res.ok) {
        const errorText = await res.text()
        setSystemMessages(prev => [
          ...prev,
          `[Error] Failed to get WebSocket credentials (${res.status})`,
          `[Debug] ${errorText.substring(0, 200)}`
        ])
        setWsStatus("error")
        scheduleReconnect()
        return
      }

      const data = await res.json()
      const wsUrl = data.data.socket
      const token = data.data.token

      if (!wsUrl || !token) {
        setSystemMessages(prev => [
          ...prev,
          `[Error] Invalid WebSocket credentials`,
          `[Debug] URL: ${wsUrl ? 'present' : 'missing'}, Token: ${token ? 'present' : 'missing'}`
        ])
        setWsStatus("error")
        return
      }

      setSystemMessages(prev => [
        ...prev,
        `[Debug] Connecting to: ${wsUrl.substring(0, 50)}...`
      ])

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setWsStatus("connected")
        setWsConnected(true)
        reconnectAttemptsRef.current = 0
        isReconnectingRef.current = false
        setSystemMessages(prev => [...prev, `[System] ✅ Console connected successfully`])
        
        // Authenticate with token
        ws.send(JSON.stringify({ event: "auth", args: [token] }))
        
        // Request logs
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: "send logs", args: [null] }))
          }
        }, 100)
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          if (message.event === "auth success") {
            setSystemMessages(prev => [...prev, `[System] Authenticated successfully`])
          } else if (message.event === "console output") {
            const output = message.args?.[0]
            if (output) {
              // Strip ANSI codes and format output
              const cleanOutput = stripAnsiCodes(output)
              setConsoleOutput(prev => [...prev.slice(-500), cleanOutput])
            }
          } else if (message.event === "status") {
            const status = message.args?.[0]
            if (status) {
              setSystemMessages(prev => [...prev, `[System] Server status: ${status}`])
              fetchResources()
            }
          } else if (message.event === "token expiring") {
            setSystemMessages(prev => [...prev, `[System] Token expiring - refreshing credentials...`])
            // Close current connection and reconnect with fresh token
            if (ws.readyState === WebSocket.OPEN) {
              ws.close(1000, "Token refresh")
            }
            setTimeout(() => {
              reconnectAttemptsRef.current = 0
              connectWebSocket()
            }, 500)
          } else if (message.event === "token expired") {
            setSystemMessages(prev => [...prev, `[System] Token expired - getting new credentials...`])
            if (ws.readyState === WebSocket.OPEN) {
              ws.close(1000, "Token expired")
            }
            setTimeout(() => {
              reconnectAttemptsRef.current = 0
              connectWebSocket()
            }, 500)
          }
        } catch (err) {
          console.error("WebSocket message error:", err)
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setSystemMessages(prev => [
          ...prev,
          `[Error] WebSocket connection failed`
        ])
        setWsStatus("error")
        setWsConnected(false)
        isReconnectingRef.current = false
      }

      ws.onclose = (event) => {
        setWsConnected(false)
        setWsStatus("disconnected")
        isReconnectingRef.current = false
        
        // Only reconnect if it's not a clean close
        if (event.code === 1000) {
          // Normal close - don't reconnect
          setSystemMessages(prev => [...prev, `[System] Connection closed`])
        } else if (event.code === 1006) {
          // Abnormal closure - likely token expired or connection dropped
          setSystemMessages(prev => [
            ...prev,
            `[System] Connection lost - will retry...`
          ])
          // Reset counter and schedule reconnect
          reconnectAttemptsRef.current = 0
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket()
          }, 3000) // Wait 3 seconds before reconnecting
        } else {
          // Other close codes - use normal reconnection logic
          scheduleReconnect()
        }
      }
    } catch (e) {
      console.error("Failed to connect WebSocket", e)
      setSystemMessages(prev => [...prev, `[Error] ${(e as Error).message}`])
      setWsStatus("error")
      setWsConnected(false)
      isReconnectingRef.current = false
      scheduleReconnect()
    }
  }

  const scheduleReconnect = () => {
    // Prevent scheduling if already reconnecting
    if (isReconnectingRef.current) {
      return
    }

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setSystemMessages(prev => [
        ...prev,
        `[Error] Maximum reconnection attempts reached`,
        `[System] Click 'Retry' button to reconnect manually`
      ])
      setWsStatus("error")
      return
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    const delay = Math.min(3000 * Math.pow(1.5, reconnectAttemptsRef.current), 15000)
    reconnectAttemptsRef.current++

    setSystemMessages(prev => [
      ...prev,
      `[System] Reconnecting in ${(delay / 1000).toFixed(0)}s... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
    ])

    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocket()
    }, delay)
  }

  const retryWebSocket = () => {
    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    // Reset state
    reconnectAttemptsRef.current = 0
    isReconnectingRef.current = false
    lastConnectAttemptRef.current = 0
    
    setSystemMessages(prev => [...prev, `[System] Manual retry...`])
    connectWebSocket()
  }

  const stripAnsiCodes = (text: string): string => {
    // Remove ANSI color codes
    return text.replace(/\x1b\[[0-9;]*m/g, '')
  }

  useEffect(() => {
    if (autoScroll) {
      consoleEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [consoleOutput, autoScroll])

  const handleScroll = () => {
    if (!consoleContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = consoleContainerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
    if (autoScroll !== isAtBottom) {
      setAutoScroll(isAtBottom)
    }
  }

  const fetchServer = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/panel/${identifier}`)
      if (res.ok) {
        const data = await res.json()
        setServer(data)
      }
    } catch (e) {
      console.error("Failed to load server", e)
    }
    setLoading(false)
  }

  const fetchResources = async () => {
    try {
      const res = await fetch(`/api/panel/${identifier}/resources`)
      if (res.ok) {
        const data = await res.json()
        setResources(data)
        setWsConnected(false)
        scheduleReconnect()
      }
    } catch (e) {
      console.error("Failed to load resources", e)
    }
  }

  const sendPowerAction = async (signal: string) => {
    setSystemMessages(prev => [...prev, `[System] Sending power action: ${signal}`])
    try {
      const res = await fetch(`/api/panel/${identifier}/power`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signal }),
      })
      if (res.ok) {
        setSystemMessages(prev => [...prev, `[System] Power action: ${signal} (success)`])
        setTimeout(fetchResources, 1000)
      } else {
        const text = await res.text()
        setSystemMessages(prev => [
          ...prev,
          `[Error] Power action failed (${res.status})`,
          text ? `[Error] ${text}` : `[Error] No response body.`,
        ])
      }
    } catch (e) {
      console.error("Failed to send power action", e)
      setSystemMessages(prev => [...prev, `[Error] ${(e as Error).message}`])
    }
  }

  const sendCommand = async (e?: React.FormEvent, cmd?: string) => {
    e?.preventDefault()
    const commandToSend = cmd || command
    if (!commandToSend.trim()) return

    setSending(true)
    setCommand("")
    setCommandHistory(prev => [commandToSend, ...prev.slice(0, 49)])
    setHistoryIndex(-1)
    
    // Try WebSocket first if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({
          event: "send command",
          args: [commandToSend]
        }))
        setSending(false)
        return
      } catch (e) {
        console.error("WebSocket command failed, falling back to REST API", e)
      }
    }
    
    // Fallback to REST API
    try {
      const res = await fetch(`/api/panel/${identifier}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: commandToSend }),
      })
      if (!res.ok) {
        setSystemMessages(prev => [...prev, `[Error] Failed to send command`])
      }
    } catch (e) {
      console.error("Failed to send command", e)
      setSystemMessages(prev => [...prev, `[Error] ${(e as Error).message}`])
    }
    
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand("")
      }
    }
  }

  const clearConsole = () => {
    setConsoleOutput([])
  }

  const copyConsole = () => {
    navigator.clipboard.writeText(consoleOutput.join("\n"))
    alert("Console copied to clipboard!")
  }

  const quickCommands = [
    { label: "List Players", cmd: "list" },
    { label: "Save World", cmd: "save-all" },
    { label: "Help", cmd: "help" },
    { label: "TPS", cmd: "tps" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading server...</p>
        </div>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Server not found</p>
        </div>
      </div>
    )
  }

  const serverAttrs = server.attributes
  const currentState = resources?.attributes?.current_state || "offline"
  const isRunning = currentState === "running"
  const allocations = serverAttrs.relationships?.allocations?.data || []
  const defaultAlloc = allocations.find(a => a.attributes.is_default) || allocations[0]

  const memoryUsed = resources?.attributes?.resources?.memory_bytes || 0
  const memoryLimit = serverAttrs.limits.memory * 1024 * 1024
  const memoryPercent = memoryLimit > 0 ? (memoryUsed / memoryLimit) * 100 : 0

  const cpuUsed = resources?.attributes?.resources?.cpu_absolute || 0
  const cpuLimit = serverAttrs.limits.cpu
  const cpuPercent = cpuLimit > 0 ? (cpuUsed / cpuLimit) * 100 : 0

  const diskUsed = resources?.attributes?.resources?.disk_bytes || 0
  const diskLimit = serverAttrs.limits.disk * 1024 * 1024
  const diskPercent = diskLimit > 0 ? (diskUsed / diskLimit) * 100 : 0

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Animated Purple Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 size-96 animate-pulse rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -right-1/4 top-1/3 size-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl delay-1000" />
        <div className="absolute bottom-0 left-1/3 size-96 animate-pulse rounded-full bg-purple-700/20 blur-3xl delay-500" />
      </div>

      {/* Sidebar */}
      <PanelSidebar
        identifier={identifier}
        serverName={serverAttrs.name}
        serverStatus={currentState}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header with Power Controls */}
        <div className="relative border-b border-purple-500/20 backdrop-blur-xl bg-black/80">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="hover:bg-purple-500/10 text-purple-300">
                  <Link href="/servers">
                    <IconArrowLeft className="size-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">{serverAttrs.name}</h1>
                  <p className="text-xs text-purple-400">
                    {defaultAlloc ? `${defaultAlloc.attributes.ip}:${defaultAlloc.attributes.port}` : serverAttrs.identifier}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Small Power Buttons */}
                <Button
                  onClick={() => sendPowerAction("start")}
                  disabled={isRunning}
                  size="sm"
                  className="h-9 px-4 border border-purple-500/50 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconPlayerPlay className="mr-2 size-3.5" />
                  Start
                </Button>
                <Button
                  onClick={() => sendPowerAction("stop")}
                  disabled={!isRunning}
                  size="sm"
                  className="h-9 px-4 border border-purple-500/50 bg-purple-700/20 hover:bg-purple-700/30 text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconPlayerPause className="mr-2 size-3.5" />
                  Stop
                </Button>
                <Button
                  onClick={() => sendPowerAction("restart")}
                  disabled={!isRunning}
                  size="sm"
                  className="h-9 px-4 border border-purple-500/50 bg-purple-800/20 hover:bg-purple-800/30 text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconRefresh className="mr-2 size-3.5" />
                  Restart
                </Button>
                
                <div className="h-6 w-px bg-purple-500/30 mx-2"></div>
                
                {/* Status Badge */}
                <Badge
                  variant="outline"
                  className={`border-0 ${
                    isRunning
                      ? "bg-purple-500/30 text-purple-300 shadow-lg shadow-purple-500/30"
                      : currentState === "starting"
                      ? "bg-purple-600/30 text-purple-400 shadow-lg shadow-purple-600/30"
                      : "bg-gray-700/30 text-gray-400"
                  }`}
                >
                  <span className={`mr-2 inline-block size-2 rounded-full ${isRunning ? 'bg-purple-400 animate-pulse' : 'bg-gray-400'}`} />
                  {currentState}
                </Badge>
                <Button size="sm" variant="outline" onClick={fetchResources} className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 h-9 px-3">
                  <IconRefresh className={`size-4 ${wsConnected ? 'text-purple-400' : 'text-gray-400'}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6 space-y-5">
        
        {/* Resource Stats - Purple Theme */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* RAM Card - Purple Theme */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 backdrop-blur-sm p-4 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <IconRam className="size-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-medium">RAM</p>
                <p className="text-lg font-bold text-white">{memoryPercent.toFixed(1)}%</p>
              </div>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-black/50 border border-purple-500/20">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-700"
                style={{ width: `${Math.min(memoryPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-purple-300 mt-2">
              {(memoryUsed / 1024 / 1024).toFixed(0)} MB / {serverAttrs.limits.memory} MB
            </p>
          </div>

          {/* CPU Card - Purple Theme */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 backdrop-blur-sm p-4 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <IconCpu className="size-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-medium">CPU</p>
                <p className="text-lg font-bold text-white">{cpuPercent.toFixed(1)}%</p>
              </div>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-black/50 border border-purple-500/20">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-700"
                style={{ width: `${Math.min(cpuPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-purple-300 mt-2">
              {cpuUsed.toFixed(0)}% / {cpuLimit}%
            </p>
          </div>

          {/* Disk Card - Purple Theme */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 backdrop-blur-sm p-4 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <IconDisc className="size-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-purple-400 font-medium">DISK</p>
                <p className="text-lg font-bold text-white">{diskPercent.toFixed(1)}%</p>
              </div>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-black/50 border border-purple-500/20">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-700"
                style={{ width: `${Math.min(diskPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-purple-300 mt-2">
              {(diskUsed / 1024 / 1024).toFixed(0)} MB / {serverAttrs.limits.disk} MB
            </p>
          </div>
        </div>

        {/* Console Section - Dedicated Purple Theme */}
        <div className="overflow-hidden rounded-xl border border-purple-500/30 bg-black/90 backdrop-blur-sm">
          <div className="border-b border-purple-500/20 bg-purple-950/20 px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <IconTerminal className="size-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Console</h3>
                  <p className="text-xs text-purple-400">Real-time server output</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`border-0 px-3 py-1 text-xs ${
                    wsStatus === "connected"
                      ? "bg-green-500/30 text-green-300 border border-green-500/50"
                      : wsStatus === "connecting"
                      ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                      : wsStatus === "error"
                      ? "bg-red-500/30 text-red-300 border border-red-500/50"
                      : "bg-gray-700/30 text-gray-400 border border-gray-700/50"
                  }`}
                >
                  <span className={`mr-2 inline-block size-1.5 rounded-full ${
                    wsStatus === "connected" ? 'bg-green-400 animate-pulse' :
                    wsStatus === "connecting" ? 'bg-yellow-400 animate-pulse' :
                    wsStatus === "error" ? 'bg-red-400' :
                    'bg-gray-400'
                  }`} />
                  {wsStatus === "connected" ? "Connected" : 
                   wsStatus === "connecting" ? "Connecting..." :
                   wsStatus === "error" ? "Error" :
                   "Disconnected"}
                </Badge>
                {wsStatus === "error" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={retryWebSocket}
                    className="hover:bg-purple-500/10 text-purple-300 hover:text-white h-8 px-3 text-xs"
                  >
                    Retry
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={copyConsole} className="hover:bg-purple-500/10 text-purple-300 hover:text-white h-8 px-3 text-xs">
                  Copy
                </Button>
                <Button size="sm" variant="ghost" onClick={clearConsole} className="hover:bg-purple-500/10 text-purple-300 hover:text-white h-8 px-3 text-xs">
                  Clear
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`hover:bg-purple-500/10 h-8 px-3 text-xs ${autoScroll ? 'text-purple-400' : 'text-purple-300 hover:text-white'}`}
                >
                  {autoScroll ? "Auto ✓" : "Auto ✗"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSystemMessages(!showSystemMessages)}
                  className={`hover:bg-purple-500/10 h-8 px-3 text-xs ${showSystemMessages ? 'text-blue-400' : 'text-purple-300 hover:text-white'}`}
                  title="Toggle system messages"
                >
                  {showSystemMessages ? "System ✓" : "System ✗"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Quick Commands */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-purple-400 flex items-center mr-1">Quick:</span>
              {quickCommands.map((qc, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  onClick={() => sendCommand(undefined, qc.cmd)}
                  disabled={!isRunning || sending}
                  className="h-7 px-3 text-xs border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 disabled:opacity-50"
                >
                  {qc.label}
                </Button>
              ))}
            </div>

            {/* Console Output */}
            <div 
              ref={consoleContainerRef}
              onScroll={handleScroll}
              className="relative h-[550px] overflow-y-auto rounded-lg border border-purple-500/20 bg-black p-4 font-mono text-sm text-purple-300"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.05) 1px, transparent 0)',
                backgroundSize: '30px 30px'
              }}
            >
              {showSystemMessages && systemMessages.length > 0 && (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  {systemMessages.slice(-10).map((msg, idx) => (
                    <div key={idx} className="text-xs text-blue-300 mb-1">{msg}</div>
                  ))}
                </div>
              )}
              {consoleOutput.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4 p-4 rounded-full bg-purple-500/10">
                    <IconTerminal className="size-16 text-purple-600" />
                  </div>
                  <p className="text-gray-400 text-lg font-bold mb-2">
                    {wsConnected ? "Waiting for console output..." : 
                     wsStatus === "connecting" ? "Connecting to console..." :
                     wsStatus === "error" ? "Connection Failed" :
                     "Console Ready"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {wsConnected ? "Start your server to see live console logs" :
                     wsStatus === "error" ? "Check console output above for error details" :
                     "Establishing connection..."}
                  </p>
                  {wsStatus === "error" && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg max-w-md">
                      <p className="text-red-400 text-sm font-semibold mb-2">⚠️ WebSocket Connection Issues</p>
                      <p className="text-gray-400 text-xs mb-3">Common causes:</p>
                      <ul className="text-left text-xs text-gray-400 space-y-1">
                        <li>• Pterodactyl panel WebSocket port (8080) is blocked</li>
                        <li>• SSL/TLS certificate mismatch</li>
                        <li>• Panel server is offline or unreachable</li>
                        <li>• CORS/proxy configuration issue</li>
                      </ul>
                      <p className="text-gray-500 text-xs mt-3">
                        Scroll up in console to see technical details
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {consoleOutput
                    .filter(line => !consoleFilter || line.toLowerCase().includes(consoleFilter.toLowerCase()))
                    .map((line, idx) => (
                    <div 
                      key={idx} 
                      className="mb-1 whitespace-pre-wrap break-words hover:bg-purple-500/10 px-2 py-0.5 -mx-2 rounded transition-colors"
                    >
                      {line}
                    </div>
                  ))}
                  <div ref={consoleEndRef} />
                </>
              )}
              {!autoScroll && (
                <button
                  onClick={() => {
                    setAutoScroll(true)
                    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="sticky bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-purple-500/30 border border-purple-500/50 text-purple-300 text-xs font-bold hover:bg-purple-500/40 transition-colors"
                >
                  Jump to bottom
                </button>
              )}
            </div>

            {/* Command Input */}
            <form onSubmit={sendCommand} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  ref={commandInputRef}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter command... (Use ↑↓ for history)"
                  disabled={!isRunning || sending}
                  className="flex-1 h-11 border border-purple-500/30 bg-black/50 font-mono text-white placeholder:text-gray-500 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 px-4"
                />
                <Button
                  type="submit"
                  disabled={!isRunning || sending || !command.trim()}
                  size="sm"
                  className="h-11 px-6 font-bold border border-purple-500/50 bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 disabled:opacity-50 transition-all"
                >
                  {sending ? "Sending..." : "Send"}
                </Button>
              </div>
              {commandHistory.length > 0 && (
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>History:</span>
                  <span className="text-purple-400">{commandHistory.length}</span>
                </div>
              )}
            </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

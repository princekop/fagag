"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { IconPlus, IconServer, IconPlayerPlay, IconPlayerPause, IconTrash, IconSettings, IconExternalLink, IconKey, IconCopy, IconRefresh } from "@tabler/icons-react"
import { broadcastServersUpdated } from "@/lib/profile-events"

type ServerItem = {
  id: string
  name: string
  type: string
  version: string
  software: string
  status: string
  maxPlayers: number
  currentPlayers: number
  ram: number
  disk: number
  pteroIdentifier?: string
  allocation?: {
    ip: string
    port: number
  }
}

function ServersPageContent() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [servers, setServers] = useState<ServerItem[]>([])
  const [showCreatedBanner, setShowCreatedBanner] = useState(false)
  const [panelCreds, setPanelCreds] = useState<{ email: string; password: string | null; hasPassword: boolean } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [resettingPassword, setResettingPassword] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchServers()
      fetchPanelCreds()
    }
  }, [status])

  // Show success banner if redirected with created=1
  useEffect(() => {
    const created = searchParams?.get("created") === "1"
    if (created) {
      setShowCreatedBanner(true)
      const t = setTimeout(() => setShowCreatedBanner(false), 4000)
      // Clean the query param from URL
      router.replace("/servers")
      return () => clearTimeout(t)
    }
  }, [searchParams])

  // Refresh on window focus and custom servers:updated events
  useEffect(() => {
    const onFocus = () => fetchServers()
    const onUpdated = () => fetchServers()
    window.addEventListener("focus", onFocus)
    window.addEventListener("servers:updated", onUpdated)
    return () => {
      window.removeEventListener("focus", onFocus)
      window.removeEventListener("servers:updated", onUpdated)
    }
  }, [])

  const fetchServers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/servers")
      if (res.ok) {
        const data = await res.json()
        setServers(data)
      }
    } catch (e) {
      console.error("Failed to load servers", e)
    }
    setLoading(false)
  }

  const fetchPanelCreds = async () => {
    try {
      const res = await fetch("/api/user/panel-password")
      if (res.ok) {
        const data = await res.json()
        setPanelCreds(data)
      }
    } catch (e) {
      console.error("Failed to load panel credentials", e)
    }
  }

  const resetPanelPassword = async () => {
    setResettingPassword(true)
    try {
      const res = await fetch("/api/user/panel-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      if (res.ok) {
        const data = await res.json()
        setPanelCreds(prev => prev ? { ...prev, password: data.password, hasPassword: true } : null)
        setShowPassword(true)
        alert("Panel password reset successfully!")
      } else {
        alert("Failed to reset panel password")
      }
    } catch (e) {
      console.error("Failed to reset password", e)
      alert("Failed to reset panel password")
    }
    setResettingPassword(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const toggleStatus = async (server: ServerItem) => {
    try {
      const newStatus = server.status === "online" ? "offline" : "online"
      const res = await fetch(`/api/servers/${server.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        await fetchServers()
        broadcastServersUpdated()
      }
    } catch (e) {
      console.error("Failed to update status", e)
    }
  }

  const deleteServer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this server?")) return
    try {
      const res = await fetch(`/api/servers/${id}`, { method: "DELETE" })
      if (res.ok) {
        setServers(prev => prev.filter(s => s.id !== id))
        broadcastServersUpdated()
      }
    } catch (e) {
      console.error("Failed to delete server", e)
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        {showCreatedBanner && (
          <div className="mb-4 rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700">
            Server created successfully. Provisioning has started.
          </div>
        )}
        {panelCreds && panelCreds.hasPassword && (
          <Card className="mb-6 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconKey className="size-5" />
                Panel Login Credentials
              </CardTitle>
              <CardDescription>Use these credentials to access the Pterodactyl panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">{panelCreds.email}</code>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(panelCreds.email || "")}>
                    <IconCopy className="size-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">
                    {showPassword ? panelCreds.password : "••••••••••••"}
                  </code>
                  <Button size="sm" variant="outline" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(panelCreds.password || "")}>
                    <IconCopy className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={resetPanelPassword} disabled={resettingPassword}>
                  <IconRefresh className="mr-2 size-4" />
                  {resettingPassword ? "Resetting..." : "Reset Password"}
                </Button>
                {process.env.NEXT_PUBLIC_PTERO_PANEL_URL && (
                  <Button size="sm" asChild>
                    <a href={process.env.NEXT_PUBLIC_PTERO_PANEL_URL} target="_blank" rel="noopener noreferrer">
                      <IconExternalLink className="mr-2 size-4" />
                      Open Panel
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Servers</h1>
            <p className="text-muted-foreground mt-2">Manage all your servers in one place</p>
          </div>
          <Button asChild>
            <Link href="/create">
              <IconPlus className="mr-2 size-4" />
              Create Server
            </Link>
          </Button>
        </div>
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">Loading servers...</CardContent>
          </Card>
        ) : servers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                <IconServer className="size-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">No Servers Yet</h3>
              <p className="text-muted-foreground mt-2 text-center max-w-md">
                Create your first server to get started with free Minecraft hosting. It only takes a minute!
              </p>
              <Button asChild className="mt-6" size="lg">
                <Link href="/create">
                  <IconPlus className="mr-2 size-4" />
                  Create Your First Server
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((s) => (
              <Card key={s.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {s.name}
                        <Badge
                          variant="outline"
                          className={
                            s.status === "online" || s.status === "running"
                              ? "bg-green-500/10 text-green-600"
                              : s.status === "starting"
                              ? "bg-blue-500/10 text-blue-600"
                              : s.status === "installing"
                              ? "bg-yellow-500/10 text-yellow-600"
                              : s.status === "suspended"
                              ? "bg-red-500/10 text-red-600"
                              : s.status === "offline" || s.status === "stopped"
                              ? "bg-gray-500/10 text-gray-600"
                              : "bg-gray-500/10 text-gray-600"
                          }
                        >
                          {s.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {s.type} {s.version} • {s.software}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {s.allocation && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Server IP</span>
                      <div className="flex items-center gap-1">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {s.allocation.ip}:{s.allocation.port}
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(`${s.allocation?.ip}:${s.allocation?.port}`)}
                        >
                          <IconCopy className="size-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Players</span>
                    <span className="font-medium">{s.currentPlayers ?? 0} / {s.maxPlayers ?? 20}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">RAM</span>
                    <span className="font-medium">{s.ram} GB</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => toggleStatus(s)} title="Start/Stop">
                      {s.status === "online" ? (
                        <IconPlayerPause className="size-4" />
                      ) : (
                        <IconPlayerPlay className="size-4" />
                      )}
                    </Button>
                    {s.pteroIdentifier ? (
                      <Button size="sm" variant="outline" asChild title="Manage Server">
                        <Link href={`/panel/${s.pteroIdentifier}`}>
                          <IconSettings className="size-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" title="Settings" disabled>
                        <IconSettings className="size-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => deleteServer(s.id)} title="Delete">
                      <IconTrash className="size-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function ServersPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="px-4 lg:px-6">
          <Card>
            <CardContent className="py-12 text-center">Loading servers...</CardContent>
          </Card>
        </div>
      </DashboardLayout>
    }>
      <ServersPageContent />
    </Suspense>
  )
}

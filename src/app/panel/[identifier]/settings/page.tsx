"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

export default function SettingsPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<any>(null)
  const [serverName, setServerName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchServer()
    }
  }, [status, identifier])

  const fetchServer = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/panel/${identifier}`)
      if (res.ok) {
        const data = await res.json()
        setServer(data)
        setServerName(data.attributes.name)
      }
    } catch (e) {
      console.error("Failed to load server", e)
    }
    setLoading(false)
  }

  const saveServerName = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/panel/${identifier}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: serverName })
      })
      if (res.ok) {
        alert("Server renamed successfully!")
        fetchServer()
      } else {
        alert("Failed to rename server")
      }
    } catch (e) {
      console.error("Failed to save", e)
      alert("Failed to rename server")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="text-white">Server not found</p>
      </div>
    )
  }

  const serverAttrs = server.attributes
  const allocations = serverAttrs.relationships?.allocations?.data || []
  const defaultAlloc = allocations.find((a: any) => a.attributes.is_default) || allocations[0]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 size-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-1/4 top-1/3 size-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
        <div className="absolute bottom-0 left-1/3 size-96 animate-pulse rounded-full bg-green-500/10 blur-3xl delay-500" />
      </div>

      {/* Sidebar */}
      <PanelSidebar
        identifier={identifier}
        serverName={serverAttrs.name}
        serverStatus={serverAttrs.status}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="relative border-b border-white/10 backdrop-blur-xl bg-black/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="hover:bg-white/10">
                  <Link href="/servers">
                    <IconArrowLeft className="size-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Server Settings</h1>
                  <p className="text-sm text-gray-400">{serverAttrs.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl space-y-6">
            {/* Server Information */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white">Server Information</h3>
                <p className="text-sm text-gray-400">View and manage your server details</p>
              </div>
              <div className="space-y-6 p-6">
                <div>
                  <label className="text-sm font-medium text-white">Server Name</label>
                  <Input
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">The name of your server as shown in the panel</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-white">Server ID</label>
                  <Input
                    value={serverAttrs.identifier}
                    disabled
                    className="mt-2 border-white/10 bg-white/5 text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-400">Unique identifier for your server</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-white">UUID</label>
                  <Input
                    value={serverAttrs.uuid}
                    disabled
                    className="mt-2 border-white/10 bg-white/5 text-gray-400 font-mono text-xs"
                  />
                  <p className="mt-1 text-xs text-gray-400">Server UUID (Read-only)</p>
                </div>

                <Button onClick={saveServerName} disabled={saving} className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30">
                  <IconDeviceFloppy className="mr-2 size-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            {/* Resource Limits */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white">Resource Limits</h3>
                <p className="text-sm text-gray-400">Your server's allocated resources</p>
              </div>
              <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-white">Memory</label>
                  <div className="mt-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-2xl font-bold text-white">{serverAttrs.limits.memory}</p>
                    <p className="text-xs text-gray-400">MB</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">CPU</label>
                  <div className="mt-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-2xl font-bold text-white">{serverAttrs.limits.cpu}</p>
                    <p className="text-xs text-gray-400">%</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Disk</label>
                  <div className="mt-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-2xl font-bold text-white">{serverAttrs.limits.disk}</p>
                    <p className="text-xs text-gray-400">MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Network */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white">Network Allocations</h3>
                <p className="text-sm text-gray-400">IP addresses and ports assigned to your server</p>
              </div>
              <div className="space-y-3 p-6">
                {allocations.map((alloc: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <code className="text-sm text-white">
                        {alloc.attributes.ip}:{alloc.attributes.port}
                      </code>
                      {alloc.attributes.is_default && (
                        <Badge className="border-0 bg-blue-500/20 text-xs text-blue-400">Primary</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

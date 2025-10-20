"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconNetwork, IconArrowLeft, IconRefresh, IconCopy, IconCheck, IconStar } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

export default function NetworkPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

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
      }
    } catch (e) {
      console.error("Failed to load server", e)
    }
    setLoading(false)
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
                <Button variant="ghost" size="sm" asChild className="hover:bg-white/10 text-gray-400 hover:text-white">
                  <Link href={`/panel/${identifier}`}>
                    <IconArrowLeft className="size-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Network</h1>
                  <p className="text-sm text-gray-400">{serverAttrs.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-400">
                  {allocations.length} allocation{allocations.length !== 1 ? 's' : ''}
                </Badge>
                <Button size="sm" variant="outline" onClick={fetchServer} className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                  <IconRefresh className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl space-y-6">
            {/* Network Allocations */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Network Allocations</h3>
                    <p className="text-sm text-gray-400">IP addresses and ports assigned to your server</p>
                  </div>
                  <Badge className="border-0 bg-blue-500/20 text-blue-400">
                    {allocations.length} / {serverAttrs.feature_limits?.allocations || 1}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                {allocations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <IconNetwork className="size-16 text-gray-600 mb-4" />
                    <p className="text-gray-400">No network allocations found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allocations.map((alloc: any, idx: number) => (
                      <div key={idx} className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="rounded-lg bg-blue-500/20 p-2 group-hover:bg-blue-500/30 transition-colors">
                            <IconNetwork className="size-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <code className="text-lg font-semibold text-white">
                                {alloc.attributes.ip}:{alloc.attributes.port}
                              </code>
                              <button
                                onClick={() => copyToClipboard(`${alloc.attributes.ip}:${alloc.attributes.port}`, `alloc-${idx}`)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                {copiedField === `alloc-${idx}` ? (
                                  <IconCheck className="size-4 text-green-400" />
                                ) : (
                                  <IconCopy className="size-4" />
                                )}
                              </button>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                              <span>Alias: {alloc.attributes.ip_alias || alloc.attributes.ip}</span>
                              {alloc.attributes.notes && (
                                <>
                                  <span>•</span>
                                  <span>{alloc.attributes.notes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {alloc.attributes.is_default && (
                            <Badge className="border-0 bg-green-500/20 text-green-400 flex items-center gap-1">
                              <IconStar className="size-3" />
                              Primary
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Connection Details */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white">Connection Details</h3>
                <p className="text-sm text-gray-400">Use these details to connect to your server</p>
              </div>
              <div className="space-y-4 p-6">
                {allocations.filter((a: any) => a.attributes.is_default).map((alloc: any, idx: number) => (
                  <div key={idx}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-white">Server Address</label>
                        <div className="mt-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                          <code className="text-white">{alloc.attributes.ip}</code>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white">Server Port</label>
                        <div className="mt-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                          <code className="text-white">{alloc.attributes.port}</code>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                      <p className="text-sm text-blue-300">
                        <strong>Connect using:</strong> {alloc.attributes.ip}:{alloc.attributes.port}
                      </p>
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

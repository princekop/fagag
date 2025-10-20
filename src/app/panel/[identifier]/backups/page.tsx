"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconArchive, IconTrash, IconDownload, IconArrowLeft, IconPlus, IconRefresh, IconLock, IconRestore, IconClock } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

type Backup = {
  uuid: string
  name: string
  bytes: number
  created_at: string
  completed_at: string
  is_successful: boolean
  checksum: string
}

export default function BackupsPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<any>(null)
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchServer()
      fetchBackups()
    }
  }, [status, identifier])

  const fetchServer = async () => {
    try {
      const res = await fetch(`/api/panel/${identifier}`)
      if (res.ok) {
        const data = await res.json()
        setServer(data)
      }
    } catch (e) {
      console.error("Failed to load server", e)
    }
  }

  const fetchBackups = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/panel/${identifier}/backups`)
      if (res.ok) {
        const data = await res.json()
        setBackups(data.data || [])
      }
    } catch (e) {
      console.error("Failed to load backups", e)
    }
    setLoading(false)
  }

  const createBackup = async () => {
    if (!confirm("Create a new backup? This may take a few minutes.")) return

    try {
      const res = await fetch(`/api/panel/${identifier}/backups`, {
        method: "POST"
      })
      if (res.ok) {
        alert("Backup started! Check back in a few minutes.")
        fetchBackups()
      } else {
        alert("Failed to create backup")
      }
    } catch (e) {
      console.error("Failed to create backup", e)
      alert("Failed to create backup")
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  if (loading && !server) {
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
                  <h1 className="text-2xl font-bold text-white">Backups</h1>
                  <p className="text-sm text-gray-400">{serverAttrs.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-400">
                  {backups.length} / {serverAttrs.feature_limits?.backups || 0} backups
                </Badge>
                <Button 
                  size="sm" 
                  onClick={createBackup} 
                  disabled={backups.length >= (serverAttrs.feature_limits?.backups || 0)}
                  className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none"
                >
                  <IconPlus className="mr-2 size-4" />
                  Create Backup
                </Button>
                <Button size="sm" variant="outline" onClick={fetchBackups} className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                  <IconRefresh className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6">
          <div className="grid gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="size-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading backups...</span>
                </div>
              </div>
            ) : backups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-white/5 p-6 mb-4">
                  <IconArchive className="size-16 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No backups yet</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Create your first backup to preserve your server data. Backups can be used to restore your server.
                </p>
                <Button onClick={createBackup} className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30">
                  <IconPlus className="mr-2 size-4" />
                  Create Backup
                </Button>
              </div>
            ) : (
              backups.map((backup) => (
                <div key={backup.uuid} className="group overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl hover:border-green-500/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-3 transition-colors ${backup.is_successful ? 'bg-green-500/20 group-hover:bg-green-500/30' : 'bg-red-500/20'}`}>
                          <IconArchive className={`size-6 ${backup.is_successful ? 'text-green-400' : 'text-red-400'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white">{backup.name}</h3>
                            {backup.checksum && (
                              <IconLock className="size-4 text-yellow-400" title="Locked backup" />
                            )}
                            {backup.is_successful && (
                              <Badge className="bg-green-500/10 text-green-400 text-xs">Success</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">UUID: {backup.uuid.substring(0, 8)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-white/5 p-3">
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Size</span>
                          <span className="text-sm text-white font-semibold">{formatBytes(backup.bytes)}</span>
                        </div>
                        <div className="rounded-lg bg-white/5 p-3">
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Created</span>
                          <span className="text-sm text-white">{formatDate(backup.created_at)}</span>
                        </div>
                      </div>
                      {backup.completed_at && (
                        <div className="rounded-lg bg-white/5 p-3">
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Completed</span>
                          <span className="text-sm text-white">{formatDate(backup.completed_at)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400">
                        <IconRestore className="mr-2 size-4" />
                        Restore
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                        <IconDownload className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="hover:bg-red-500/10 text-gray-400 hover:text-red-400 h-8 w-8 p-0">
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

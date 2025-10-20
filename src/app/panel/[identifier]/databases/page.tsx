"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconDatabase, IconTrash, IconArrowLeft, IconPlus, IconRefresh, IconEye, IconEyeOff, IconCopy, IconCheck, IconKey } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

type Database = {
  id: string
  name: string
  username: string
  connectionFrom: string
  maxConnections: number
}

export default function DatabasesPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<any>(null)
  const [databases, setDatabases] = useState<Database[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchServer()
      fetchDatabases()
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

  const fetchDatabases = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/panel/${identifier}/databases`)
      if (res.ok) {
        const data = await res.json()
        setDatabases(data.data || [])
      }
    } catch (e) {
      console.error("Failed to load databases", e)
    }
    setLoading(false)
  }

  const createDatabase = async () => {
    const name = prompt("Enter database name:")
    if (!name) return

    try {
      const res = await fetch(`/api/panel/${identifier}/databases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ database: name, remote: "%" })
      })
      if (res.ok) {
        alert("Database created successfully!")
        fetchDatabases()
      } else {
        alert("Failed to create database")
      }
    } catch (e) {
      console.error("Failed to create database", e)
      alert("Failed to create database")
    }
  }

  const deleteDatabase = async (dbId: string) => {
    if (!confirm("Delete this database? This cannot be undone!")) return

    try {
      const res = await fetch(`/api/panel/${identifier}/databases/${dbId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        alert("Database deleted successfully!")
        fetchDatabases()
      } else {
        alert("Failed to delete database")
      }
    } catch (e) {
      console.error("Failed to delete database", e)
      alert("Failed to delete database")
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const togglePasswordVisibility = (dbId: string) => {
    setShowPassword(prev => ({ ...prev, [dbId]: !prev[dbId] }))
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
                  <h1 className="text-2xl font-bold text-white">Databases</h1>
                  <p className="text-sm text-gray-400">{serverAttrs.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-400">
                  {databases.length} / {serverAttrs.feature_limits?.databases || 0} databases
                </Badge>
                <Button 
                  size="sm" 
                  onClick={createDatabase} 
                  disabled={databases.length >= (serverAttrs.feature_limits?.databases || 0)}
                  className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none"
                >
                  <IconPlus className="mr-2 size-4" />
                  Create Database
                </Button>
                <Button size="sm" variant="outline" onClick={fetchDatabases} className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
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
                  <span>Loading databases...</span>
                </div>
              </div>
            ) : databases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-white/5 p-6 mb-4">
                  <IconDatabase className="size-16 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No databases yet</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Create your first database to start storing data for your server applications.
                </p>
                <Button onClick={createDatabase} className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30">
                  <IconPlus className="mr-2 size-4" />
                  Create Database
                </Button>
              </div>
            ) : (
              databases.map((db) => (
                <div key={db.id} className="group overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl hover:border-blue-500/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-500/20 p-3 group-hover:bg-blue-500/30 transition-colors">
                          <IconDatabase className="size-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{db.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">MySQL Database</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteDatabase(db.id)} 
                        className="hover:bg-red-500/10 text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                        title="Delete Database"
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* Database Name */}
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Database</span>
                          <button
                            onClick={() => copyToClipboard(db.name, `db-${db.id}`)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedField === `db-${db.id}` ? (
                              <IconCheck className="size-3.5 text-green-400" />
                            ) : (
                              <IconCopy className="size-3.5" />
                            )}
                          </button>
                        </div>
                        <code className="text-sm text-white font-mono">{db.name}</code>
                      </div>

                      {/* Username */}
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Username</span>
                          <button
                            onClick={() => copyToClipboard(db.username, `user-${db.id}`)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedField === `user-${db.id}` ? (
                              <IconCheck className="size-3.5 text-green-400" />
                            ) : (
                              <IconCopy className="size-3.5" />
                            )}
                          </button>
                        </div>
                        <code className="text-sm text-white font-mono">{db.username}</code>
                      </div>

                      {/* Connection Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-white/5 p-3">
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Connection From</span>
                          <code className="text-sm text-white font-mono">{db.connectionFrom}</code>
                        </div>
                        <div className="rounded-lg bg-white/5 p-3">
                          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Max Connections</span>
                          <span className="text-sm text-white font-semibold">{db.maxConnections}</span>
                        </div>
                      </div>
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

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconUsers, IconTrash, IconArrowLeft, IconPlus, IconRefresh, IconShield, IconKey } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

type SubUser = {
  uuid: string
  username: string
  email: string
  image: string | null
  created_at: string
  permissions: string[]
}

export default function UsersPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<any>(null)
  const [users, setUsers] = useState<SubUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchServer()
      fetchUsers()
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

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // TODO: Wire to Pterodactyl sub-users API
      setUsers([])
    } catch (e) {
      console.error("Failed to load users", e)
    }
    setLoading(false)
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
                <Button variant="ghost" size="sm" asChild className="hover:bg-white/10">
                  <Link href="/servers">
                    <IconArrowLeft className="size-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Sub-Users</h1>
                  <p className="text-sm text-gray-400">{serverAttrs.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30">
                  <IconPlus className="mr-2 size-4" />
                  Invite User
                </Button>
                <Button size="sm" variant="outline" onClick={fetchUsers} className="border-white/10 bg-white/5 hover:bg-white/10">
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
                <p className="text-gray-400">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-white/5 p-6 mb-4">
                  <IconUsers className="size-16 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No sub-users yet</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Invite other users to help manage this server. You can control their permissions.
                </p>
                <Button className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30">
                  <IconPlus className="mr-2 size-4" />
                  Invite User
                </Button>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.uuid} className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Added:</span>
                            <span className="text-white">{formatDate(user.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IconKey className="size-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {user.permissions.length} permission{user.permissions.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                        <IconShield className="mr-2 size-4" />
                        Permissions
                      </Button>
                      <Button size="sm" variant="ghost" className="hover:bg-red-500/10 hover:text-red-400">
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

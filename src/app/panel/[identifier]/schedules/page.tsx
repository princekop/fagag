"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconClock, IconTrash, IconArrowLeft, IconPlus, IconRefresh, IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

type Schedule = {
  id: string
  name: string
  cron: {
    day_of_week: string
    day_of_month: string
    hour: string
    minute: string
  }
  is_active: boolean
  is_processing: boolean
  last_run_at: string | null
  next_run_at: string
}

export default function SchedulesPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<any>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchServer()
      fetchSchedules()
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

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/panel/${identifier}/schedules`)
      if (res.ok) {
        const data = await res.json()
        setSchedules(data.data || [])
      }
    } catch (e) {
      console.error("Failed to load schedules", e)
    }
    setLoading(false)
  }

  const formatCron = (cron: Schedule['cron']) => {
    return `${cron.minute} ${cron.hour} ${cron.day_of_month} * ${cron.day_of_week}`
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Never"
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
                  <h1 className="text-2xl font-bold text-white">Schedules</h1>
                  <p className="text-sm text-gray-400">{serverAttrs.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30">
                  <IconPlus className="mr-2 size-4" />
                  Create Schedule
                </Button>
                <Button size="sm" variant="outline" onClick={fetchSchedules} className="border-white/10 bg-white/5 hover:bg-white/10">
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
                <p className="text-gray-400">Loading schedules...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-white/5 p-6 mb-4">
                  <IconClock className="size-16 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No schedules yet</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Create automated tasks that run on a schedule. Perfect for backups, restarts, and commands.
                </p>
                <Button className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30">
                  <IconPlus className="mr-2 size-4" />
                  Create Schedule
                </Button>
              </div>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 ${schedule.is_active ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                        <IconClock className={`size-6 ${schedule.is_active ? 'text-green-400' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{schedule.name}</h3>
                          {schedule.is_processing && (
                            <Badge className="border-0 bg-blue-500/20 text-blue-400">Running</Badge>
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Cron Expression:</span>
                            <code className="rounded bg-white/5 px-2 py-1 text-gray-300 font-mono">
                              {formatCron(schedule.cron)}
                            </code>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Last Run:</span>
                            <span className="text-white">{formatDate(schedule.last_run_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Next Run:</span>
                            <span className="text-white">{formatDate(schedule.next_run_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                        {schedule.is_active ? <IconPlayerPause className="size-4" /> : <IconPlayerPlay className="size-4" />}
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

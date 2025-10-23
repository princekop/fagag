"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SectionCards } from "@/components/section-cards"
import Link from "next/link"
import { IconPlus, IconRocket, IconBook, IconCoin, IconClock, IconActivity } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

type Activity = {
  type: "transaction" | "afk"
  description: string
  amount: number
  createdAt: string
}

type ServerItem = {
  id: string
  name: string
  status: string
  ram: number
  cpu: number
  disk: number
}

export default function Page() {
  const { data: session, status } = useSession()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loadingActivity, setLoadingActivity] = useState(true)
  const [servers, setServers] = useState<ServerItem[]>([])
  const [serverStats, setServerStats] = useState({ total: 0, online: 0, offline: 0 })

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    } else if (status === "authenticated") {
      fetchActivity()
      fetchServers()
      // Real-time updates every 5 seconds
      const interval = setInterval(() => {
        fetchActivity()
        fetchServers()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [status])

  // Listen for server updates
  useEffect(() => {
    const onServersUpdated = () => fetchServers()
    window.addEventListener("servers:updated", onServersUpdated)
    return () => window.removeEventListener("servers:updated", onServersUpdated)
  }, [])

  const fetchActivity = async () => {
    setLoadingActivity(true)
    try {
      const res = await fetch("/api/activity")
      if (res.ok) {
        const data = await res.json()
        setActivities(data)
      }
    } catch (e) {
      console.error("Failed to load activity", e)
    }
    setLoadingActivity(false)
  }

  const fetchServers = async () => {
    try {
      const res = await fetch("/api/servers")
      if (res.ok) {
        const data = await res.json()
        setServers(data.slice(0, 5)) // Show latest 5
        setServerStats({
          total: data.length,
          online: data.filter((s: ServerItem) => s.status === "online").length,
          offline: data.filter((s: ServerItem) => s.status === "offline" || s.status === "starting").length,
        })
      }
    } catch (e) {
      console.error("Failed to load servers", e)
    }
  }

  if (status === "loading") {
    return <DashboardLayout><div className="px-4 lg:px-6">Loading...</div></DashboardLayout>
  }

  if (!session) {
    redirect("/login")
  }
  
  return (
    <DashboardLayout>
      <SectionCards />
      
      {/* Quick Actions */}
      <div className="px-4 lg:px-8 mb-10 overflow-visible">
        <h2 className="mb-6 text-3xl font-bold">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Quick Actions
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="card-smoky border-primary/30 bg-smoky-gradient">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/20 border-2 border-primary/30">
                  <IconPlus className="size-7 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Create Server</CardTitle>
                  <CardDescription className="text-sm">Deploy a new server instantly</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="btn-primary w-full">
                <Link href="/create">
                  <IconPlus className="mr-2 size-5" />
                  Create New Server
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-smoky border-accent/30 bg-purple-smoky">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-xl bg-accent/20 border-2 border-accent/30">
                  <IconRocket className="size-7 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Upgrade</CardTitle>
                  <CardDescription className="text-sm">Get more resources</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-accent/40 hover:bg-accent/20 hover:border-accent/60 transition-all">
                <Link href="/shop/specs">
                  <IconRocket className="mr-2 size-5" />
                  Buy Specs
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-smoky border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-xl bg-amber-500/20 border-2 border-amber-500/30">
                  <IconBook className="size-7 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Documentation</CardTitle>
                  <CardDescription className="text-sm">Learn how to use Sjnodes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-amber-500/40 hover:bg-amber-500/20 hover:border-amber-500/60 transition-all">
                <Link href="/docs">
                  <IconBook className="mr-2 size-5" />
                  View Docs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 lg:px-8 mb-10 overflow-visible">
        <Card className="card-smoky border-primary/30 overflow-hidden">
          <CardHeader className="bg-smoky-gradient border-b border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Recent Activity
                  </span>
                </CardTitle>
                <CardDescription className="text-sm mt-2">Your latest transactions and coin earnings</CardDescription>
              </div>
              <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-lg bg-primary/20 border border-primary/30 glow-primary">
                <IconActivity className="size-6 text-primary" />
                <span className="text-sm font-bold">{activities.length} Activities</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loadingActivity ? (
              <div className="py-12 text-center">
                <div className="inline-flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                  <span className="text-sm font-medium text-muted-foreground">Loading activity...</span>
                </div>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <IconActivity className="size-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No recent activity yet.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Your transactions will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, idx) => (
                  <div key={idx} className="group relative flex items-center gap-5 rounded-xl border border-border/30 bg-smoky-card p-5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover-lift">
                    <div className={`relative flex size-14 items-center justify-center rounded-xl shadow-lg ${activity.amount > 0 ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 ring-2 ring-green-500/40' : 'bg-gradient-to-br from-red-500/20 to-red-600/20 ring-2 ring-red-500/40'}`}>
                      {activity.type === "afk" ? (
                        <IconClock className={`size-7 ${activity.amount > 0 ? 'text-green-400' : 'text-red-400'}`} />
                      ) : (
                        <IconCoin className={`size-7 ${activity.amount > 0 ? 'text-green-400' : 'text-red-400'}`} />
                      )}
                      <div className={`absolute -top-1 -right-1 size-3 rounded-full ${activity.amount > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse-glow`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold truncate group-hover:text-primary transition-colors">{activity.description}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap shadow-md ${activity.amount > 0 ? 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30' : 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30'}`}>
                      <span className="text-xl">{activity.amount > 0 ? '+' : ''}{activity.amount}</span>
                      <IconCoin className="size-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

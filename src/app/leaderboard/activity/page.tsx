"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconActivity, IconMedal, IconServer, IconClock, IconCoin } from "@tabler/icons-react"

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  servers: number
  uptime: string
  tasks: number
  avatar: string
}

export default function ActivityLeaderboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [topActive, setTopActive] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchLeaderboard()
    }
  }, [status])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard/activity")
      if (response.ok) {
        const data = await response.json()
        setTopActive(data)
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) return null

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconActivity className="size-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold">Activity Leaderboard</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Most active users based on overall engagement
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Most Active Users</CardTitle>
                <CardDescription>Rankings based on combined activity score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topActive.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No leaderboard data available yet
                    </div>
                  ) : null}
                  {topActive.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        user.rank <= 3
                          ? "bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`flex size-12 items-center justify-center rounded-full font-bold flex-shrink-0 ${
                            user.rank === 1
                              ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                              : user.rank === 2
                              ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                              : user.rank === 3
                              ? "bg-gradient-to-br from-cyan-400 to-cyan-600 text-white"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {user.rank <= 3 ? user.avatar : `#${user.rank}`}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{user.username}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <IconActivity className="size-3 text-blue-500" />
                              <span>{user.score} pts</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IconServer className="size-3" />
                              <span>{user.servers} servers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IconClock className="size-3" />
                              <span>{user.uptime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IconCoin className="size-3 text-primary" />
                              <span>{user.tasks} tasks</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {user.rank <= 3 && (
                        <Badge
                          className={`flex-shrink-0 ${
                            user.rank === 1
                              ? "bg-blue-500/10 text-blue-600"
                              : user.rank === 2
                              ? "bg-gray-400/10 text-gray-600"
                              : "bg-cyan-500/10 text-cyan-600"
                          }`}
                        >
                          <IconMedal className="mr-1 size-3" />
                          {user.rank === 1 ? "Gold" : user.rank === 2 ? "Silver" : "Bronze"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Your Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted mx-auto mb-3">
                    <span className="text-2xl font-bold">#-</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">You're not ranked yet</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-semibold">0 pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Servers</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tasks</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Score</CardTitle>
                <CardDescription>How it's calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Server uptime</span>
                  <span className="font-medium">40%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tasks completed</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AFK time</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Servers created</span>
                  <span className="font-medium">10%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Rewards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🥇 1st Place</span>
                  <Badge className="bg-blue-500/10 text-blue-600">2000 coins</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🥈 2nd Place</span>
                  <Badge className="bg-gray-400/10 text-gray-600">1000 coins</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🥉 3rd Place</span>
                  <Badge className="bg-cyan-500/10 text-cyan-600">500 coins</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Pro Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Maintain high server uptime and complete daily tasks to boost your activity score. Consistency is key!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

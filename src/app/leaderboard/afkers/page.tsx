"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconFlame, IconMedal, IconClock } from "@tabler/icons-react"

type LeaderboardEntry = {
  user: {
    id: string
    name: string | null
    email: string | null
  } | undefined
  totalMinutes: number
  totalCoins: number
  sessions: number
}

export default function AfkersLeaderboardPage() {
  const { data: session, status } = useSession()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState<{ rank: number; data: LeaderboardEntry } | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    } else if (status === "authenticated") {
      fetchLeaderboard()
      const interval = setInterval(fetchLeaderboard, 10000) // Real-time: update every 10s
      return () => clearInterval(interval)
    }
  }, [status])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard/afk")
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data.slice(0, 10))
        
        // Find user's rank
        const userEmail = session?.user?.email
        const userIndex = data.findIndex((entry: LeaderboardEntry) => entry.user?.email === userEmail)
        if (userIndex !== -1) {
          setUserRank({ rank: userIndex + 1, data: data[userIndex] })
        }
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard", e)
    }
    setLoading(false)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getAvatar = (rank: number) => {
    const avatars = ["🔥", "⏰", "⚡", "🎮", "⏳", "💪", "🌟", "🎯", "🏃", "👑"]
    return avatars[rank - 1] || "🎮"
  }

  if (status === "loading" || loading) {
    return <DashboardLayout><div className="px-4 lg:px-6">Loading...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconFlame className="size-12 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold">Top AFK Players</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Most dedicated AFK earners this month
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 AFK Champions</CardTitle>
                <CardDescription>Rankings based on total AFK time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No AFK data yet. Start earning to appear on the leaderboard!</p>
                  ) : (
                    leaderboard.map((entry, index) => {
                      const rank = index + 1
                      const username = entry.user?.name || entry.user?.email?.split("@")[0] || "Anonymous"
                      return (
                        <div
                          key={entry.user?.id || index}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                            rank <= 3
                              ? "bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20"
                              : "bg-muted/30 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex size-12 items-center justify-center rounded-full font-bold ${
                                rank === 1
                                  ? "bg-gradient-to-br from-orange-400 to-red-600 text-white"
                                  : rank === 2
                                  ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                                  : rank === 3
                                  ? "bg-gradient-to-br from-amber-400 to-orange-600 text-white"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              {rank <= 3 ? getAvatar(rank) : `#${rank}`}
                            </div>
                            <div>
                              <p className="font-semibold">{username}</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <IconClock className="size-4 text-orange-500" />
                                  <span>{formatTime(entry.totalMinutes)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconFlame className="size-4 text-red-500" />
                                  <span>{entry.totalCoins} coins</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {rank <= 3 && (
                            <Badge
                              className={
                                rank === 1
                                  ? "bg-orange-500/10 text-orange-600"
                                  : rank === 2
                                  ? "bg-gray-400/10 text-gray-600"
                                  : "bg-amber-500/10 text-amber-600"
                              }
                            >
                              <IconMedal className="mr-1 size-3" />
                              {rank === 1 ? "Gold" : rank === 2 ? "Silver" : "Bronze"}
                            </Badge>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Your Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted mx-auto mb-3">
                    <span className="text-2xl font-bold">#{userRank ? userRank.rank : "-"}</span>
                  </div>
                  {userRank ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-2">Your current rank</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                          <IconClock className="size-4 text-orange-500" />
                          <span>{formatTime(userRank.data.totalMinutes)}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                          <IconFlame className="size-4 text-red-500" />
                          <span>{userRank.data.totalCoins} coins</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-2">You're not ranked yet. Start earning AFK coins!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>Milestone rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🔥 100 hours</span>
                  <Badge variant="outline">+200 coins</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">⚡ 7 day streak</span>
                  <Badge variant="outline">+150 coins</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">👑 Top 10</span>
                  <Badge variant="outline">+300 coins</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🏆 Top 3</span>
                  <Badge className="bg-orange-500/10 text-orange-600">+500 coins</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Maintain a daily streak to earn bonus multipliers. The longer you stay consistent, the more coins you earn per minute!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

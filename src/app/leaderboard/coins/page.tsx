import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconTrophy, IconMedal, IconCoin } from "@tabler/icons-react"
import { prisma } from "@/lib/prisma"

export const revalidate = 60 // Revalidate every 60 seconds for real-time updates

export default async function CoinsLeaderboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  // Fetch real top users from database
  const users = await prisma.user.findMany({
    orderBy: { coins: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      coins: true,
    }
  })

  const topUsers = users.map((user, index) => ({
    rank: index + 1,
    username: user.name || user.email?.split('@')[0] || 'Anonymous',
    coins: user.coins || 0,
    avatar: user.image || null,
  }))

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconTrophy className="size-12 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold">Coins Leaderboard</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Top coin earners this month
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Players</CardTitle>
                <CardDescription>Rankings based on total coins earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topUsers.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        user.rank <= 3
                          ? "bg-gradient-to-r from-primary/10 to-transparent border border-primary/20"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex size-12 items-center justify-center rounded-full font-bold overflow-hidden ${
                            user.rank === 1
                              ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-2 ring-amber-400"
                              : user.rank === 2
                              ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white ring-2 ring-gray-400"
                              : user.rank === 3
                              ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white ring-2 ring-orange-400"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">{user.username.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{user.username}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconCoin className="size-4 text-primary" />
                            <span>{user.coins.toLocaleString()} coins</span>
                          </div>
                        </div>
                      </div>
                      {user.rank <= 3 && (
                        <Badge
                          className={
                            user.rank === 1
                              ? "bg-amber-500/10 text-amber-600"
                              : user.rank === 2
                              ? "bg-gray-400/10 text-gray-600"
                              : "bg-orange-500/10 text-orange-600"
                          }
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
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Your Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted mx-auto mb-3">
                    <span className="text-2xl font-bold">#-</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">You're not ranked yet</p>
                  <div className="flex items-center justify-center gap-2 text-lg font-bold">
                    <IconCoin className="size-5 text-primary" />
                    <span>0 Coins</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rewards</CardTitle>
                <CardDescription>Monthly prizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🥇 1st Place</span>
                  <Badge className="bg-amber-500/10 text-amber-600">1000 bonus</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🥈 2nd Place</span>
                  <Badge className="bg-gray-400/10 text-gray-600">500 bonus</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">🥉 3rd Place</span>
                  <Badge className="bg-orange-500/10 text-orange-600">250 bonus</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Top 10</span>
                  <Badge variant="outline">100 bonus</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Reset</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Leaderboard resets on the 1st of every month. Start earning now!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

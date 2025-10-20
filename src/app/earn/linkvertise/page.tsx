import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconLink, IconCoin, IconExternalLink, IconCheck } from "@tabler/icons-react"

export default async function LinkvertisePage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const links = [
    { id: 1, reward: 10, title: "Quick Link", description: "Complete a short link", duration: "30 seconds" },
    { id: 2, reward: 25, title: "Medium Link", description: "Complete a medium link", duration: "1 minute" },
    { id: 3, reward: 50, title: "Long Link", description: "Complete a longer link", duration: "2 minutes" },
  ]

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Linkvertise Rewards</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Complete links and earn coins instantly
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <IconCoin className="size-5 text-primary" />
            <span className="font-semibold">Total Earned: 0 Coins</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {links.map((link) => (
              <Card key={link.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {link.title}
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">
                          +{link.reward} Coins
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">{link.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconLink className="size-4" />
                      <span>Completion time: {link.duration}</span>
                    </div>
                    <Button>
                      <IconExternalLink className="mr-2 size-4" />
                      Complete Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Simple steps to earn coins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Choose a Link</p>
                    <p className="text-muted-foreground text-sm">Select a link based on reward and duration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Complete the Link</p>
                    <p className="text-muted-foreground text-sm">Follow instructions and wait for the timer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Earn Coins</p>
                    <p className="text-muted-foreground text-sm">Coins are added to your balance automatically</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Links Completed</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coins Earned</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily Limit</span>
                  <span className="font-semibold">0 / 10</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <IconCheck className="size-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Maximum 10 links per day</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <IconCheck className="size-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Wait for full timer before closing</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <IconCheck className="size-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Don't use VPN or ad blockers</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <IconCheck className="size-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>One account per person</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leaderboard</CardTitle>
                <CardDescription>Top earners this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">1. User123</span>
                  <Badge variant="outline">2,500 coins</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">2. ProGamer</span>
                  <Badge variant="outline">2,100 coins</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">3. CoinMaster</span>
                  <Badge variant="outline">1,850 coins</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

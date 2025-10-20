"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconGift, IconCoin, IconBrandDiscord, IconBrandTwitter, IconBrandYoutube, IconCheck } from "@tabler/icons-react"

const iconMap: Record<string, any> = {
  IconBrandDiscord,
  IconBrandTwitter,
  IconBrandYoutube,
  IconGift
}

interface Task {
  id: string
  platform: string
  description: string
  reward: number
  link: string
  actionLabel: string
  icon: string
  color: string
  completed: boolean
}

export default function Join4RewardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks()
    }
  }, [status])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/join4reward")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskClick = async (task: Task) => {
    if (task.completed) return

    // Open the link in a new tab
    window.open(task.link, "_blank")

    // Mark as processing
    setProcessing(task.id)

    // After a delay, allow claiming
    setTimeout(async () => {
      try {
        const response = await fetch("/api/join4reward/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId: task.id })
        })

        if (response.ok) {
          const data = await response.json()
          // Refresh tasks to show completion
          fetchTasks()
          alert(`Congratulations! You earned ${data.reward} coins!`)
        } else {
          const error = await response.json()
          alert(error.error || "Failed to complete task")
        }
      } catch (error) {
        console.error("Error completing task:", error)
        alert("Failed to complete task")
      } finally {
        setProcessing(null)
      }
    }, 3000)
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

  const totalRewards = tasks.reduce((sum, task) => sum + (task.completed ? 0 : task.reward), 0)
  const completedCount = tasks.filter(task => task.completed).length

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Join4Reward</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Complete social tasks and earn bonus coins
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <IconCoin className="size-5 text-primary" />
            <span className="font-semibold">Available Rewards: {totalRewards} Coins</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {tasks.map((task) => {
              const Icon = iconMap[task.icon] || IconGift
              return (
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-12 items-center justify-center rounded-lg bg-gradient-to-br ${task.color}`}>
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {task.platform}
                            {task.completed ? (
                              <Badge className="bg-green-500/10 text-green-600">
                                <IconCheck className="mr-1 size-3" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                +{task.reward} Coins
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">{task.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Complete this task to earn {task.reward} coins
                      </p>
                      <Button 
                        disabled={task.completed || processing === task.id}
                        onClick={() => handleTaskClick(task)}
                      >
                        {processing === task.id ? "Processing..." : task.completed ? "Claimed" : task.actionLabel}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardHeader>
                <CardTitle>More Tasks Coming Soon!</CardTitle>
                <CardDescription>Check back regularly for new opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We're constantly adding new social tasks and partner programs. Follow us on social media to stay updated on new earning opportunities!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tasks Completed</span>
                  <span className="font-semibold">{completedCount} / {tasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coins Earned</span>
                  <span className="font-semibold">
                    {tasks.reduce((sum, task) => sum + (task.completed ? task.reward : 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <span className="font-semibold">{totalRewards} coins</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-4">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Complete Task</p>
                    <p className="text-muted-foreground text-sm">Follow, subscribe, or join as instructed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Verify</p>
                    <p className="text-muted-foreground text-sm">Click the button to verify completion</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Get Rewarded</p>
                    <p className="text-muted-foreground text-sm">Coins added instantly to your balance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">
                  <IconGift className="inline size-5 mr-2" />
                  Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete all tasks to unlock a bonus multiplier for your AFK earnings! Stay connected with our community to get exclusive benefits.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

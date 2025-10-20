"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconClock, IconCoin, IconPlayerPlay, IconPlayerStop, IconCheck } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function AfkPage() {
  const { data: session, status } = useSession()
  const [isActive, setIsActive] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [todayStats, setTodayStats] = useState({ time: 0, coins: 0, streak: 0 })
  const [loading, setLoading] = useState(false)
  const [isWindowFocused, setIsWindowFocused] = useState(true)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const [secondsInMinute, setSecondsInMinute] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status])

  // Security: Track window focus
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true)
    const handleBlur = () => setIsWindowFocused(false)
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Security: Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        // Only count if window is focused AND tab is visible
        if (!isWindowFocused || !isTabVisible) {
          return
        }
        
        setElapsedTime(prev => prev + 1)
        setSecondsInMinute(prev => {
          const newSeconds = prev + 1
          
          // Every 60 seconds, verify and award coins
          if (newSeconds >= 60) {
            verifyMinute()
            return 0
          }
          
          return newSeconds
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, isWindowFocused, isTabVisible])

  const verifyMinute = async () => {
    try {
      const res = await fetch('/api/afk/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secondsElapsed: 60 })
      })
      
      if (res.ok) {
        const data = await res.json()
        setCoinsEarned(data.totalSessionCoins)
      }
    } catch (e) {
      console.error('Failed to verify AFK minute', e)
    }
  }

  const startAfk = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/afk/start", {
        method: "POST",
      })
      const data = await res.json()
      if (res.ok) {
        setIsActive(true)
        setSessionId(data.id)
        setElapsedTime(0)
        setCoinsEarned(0)
      } else {
        alert(data.error || "Failed to start AFK session")
      }
    } catch (error) {
      console.error("Error starting AFK:", error)
      alert("Failed to start AFK session")
    }
    setLoading(false)
  }

  const stopAfk = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/afk/stop", {
        method: "POST",
      })
      const data = await res.json()
      if (res.ok) {
        setIsActive(false)
        setSessionId(null)
        alert(`AFK session ended! You earned ${data.coinsEarned} coins!`)
        setTodayStats(prev => ({
          time: prev.time + Math.floor(elapsedTime / 60),
          coins: prev.coins + data.coinsEarned,
          streak: prev.streak
        }))
        setElapsedTime(0)
        setCoinsEarned(0)
      } else {
        alert(data.error || "Failed to stop AFK session")
      }
    } catch (error) {
      console.error("Error stopping AFK:", error)
      alert("Failed to stop AFK session")
    }
    setLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentRate = () => {
    const minutes = Math.floor(elapsedTime / 60)
    if (minutes >= 30) return 3
    if (minutes >= 10) return 2
    return 1
  }

  if (status === "loading") {
    return <DashboardLayout><div className="px-4 lg:px-6">Loading...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">AFK Coin System</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Earn free coins by staying active on the page
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconPlayerPlay className="size-6 text-primary" />
                  AFK Timer
                </CardTitle>
                <CardDescription>Start earning coins right now</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className={`flex size-32 items-center justify-center rounded-full border-8 transition-all ${
                      isActive
                        ? isWindowFocused && isTabVisible
                          ? "border-green-500/50 bg-green-500/10 animate-pulse"
                          : "border-red-500/50 bg-red-500/10"
                        : "border-primary/20 bg-primary/5"
                    }`}>
                      <div className="text-center">
                        <div className="text-3xl font-bold">{formatTime(elapsedTime)}</div>
                        <div className="text-xs text-muted-foreground">Time</div>
                      </div>
                    </div>
                  </div>
                  {!isWindowFocused || !isTabVisible ? (
                    <Badge className="mt-6 bg-red-500/10 text-red-600 px-4 py-2">
                      ⚠️ Window not focused - Timer paused
                    </Badge>
                  ) : (
                    <Badge className="mt-6 bg-green-500/10 text-green-600 px-4 py-2">
                      <IconCoin className="mr-2 size-4" />
                      Earned: {coinsEarned} Coins
                    </Badge>
                  )}
                  {!isActive ? (
                    <Button size="lg" className="mt-8" onClick={startAfk} disabled={loading}>
                      <IconPlayerPlay className="mr-2 size-4" />
                      {loading ? 'Starting...' : 'Start AFK Timer'}
                    </Button>
                  ) : (
                    <Button size="lg" className="mt-8" variant="destructive" onClick={stopAfk} disabled={loading}>
                      <IconPlayerStop className="mr-2 size-4" />
                      {loading ? 'Stopping...' : 'Stop & Claim Coins'}
                    </Button>
                  )}
                  <p className="text-muted-foreground text-sm mt-4 text-center max-w-md">
                    Keep this page open and active to earn coins. The longer you stay, the more you earn!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Simple and passive coin earning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Click Start</p>
                    <p className="text-muted-foreground text-sm">Begin your AFK session by clicking the start button</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Stay Active</p>
                    <p className="text-muted-foreground text-sm">Keep this page open and active in your browser</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Earn Coins</p>
                    <p className="text-muted-foreground text-sm">Automatically earn coins every minute you're active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earning Rates</CardTitle>
                <CardDescription>Coins per minute</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Per minute</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600">2 coins/min</Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                  ⚠️ Window must stay focused to earn coins
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time Active</span>
                  <span className="font-semibold">{todayStats.time} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coins Earned</span>
                  <span className="font-semibold">{todayStats.coins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Session</span>
                  <span className="font-semibold">{Math.floor(elapsedTime / 60)} min</span>
                </div>
              </CardContent>
            </Card>

            {/* Ad Placeholder */}
            <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Advertisement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                  Ad Space - 300x300
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

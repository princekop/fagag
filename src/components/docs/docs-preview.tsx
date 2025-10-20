"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { IconRefresh, IconEye, IconActivity, IconServer } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function DocsPreview() {
  const [activity, setActivity] = useState<any[]>([])
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setRefreshing(true)
    try {
      // Fetch recent activity
      const activityRes = await fetch("/api/activity")
      if (activityRes.ok) {
        const activityData = await activityRes.json()
        setActivity(activityData.slice(0, 5))
      }

      // Fetch servers
      const serversRes = await fetch("/api/servers")
      if (serversRes.ok) {
        const serversData = await serversRes.json()
        setServers(serversData.slice(0, 3))
      }
    } catch (error) {
      console.error("Failed to fetch preview data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <IconEye className="size-5" />
          <span className="font-semibold">Live Preview</span>
        </motion.div>

        <motion.h2
          className="text-5xl font-black text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          See It In Action
        </motion.h2>
        <motion.p
          className="text-xl text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Real-time data from the platform showcasing actual features
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-white/10 bg-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/20">
                  <IconActivity className="size-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Recent Activity</h3>
                  <p className="text-xs text-gray-400">Live from /api/activity</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchData}
                disabled={refreshing}
                className="border-white/20"
              >
                <IconRefresh className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <div className="p-6 space-y-3">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-white/10" />
                        <Skeleton className="h-3 w-1/2 bg-white/10" />
                      </div>
                    </div>
                  ))}
                </>
              ) : activity.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No recent activity
                </div>
              ) : (
                activity.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className={`flex size-10 items-center justify-center rounded-full ${
                      item.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <span className="text-lg">{item.amount > 0 ? '💰' : '📊'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={
                      item.amount > 0 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }>
                      {item.amount > 0 ? '+' : ''}{item.amount}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Servers Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-white/10 bg-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <IconServer className="size-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Active Servers</h3>
                  <p className="text-xs text-gray-400">Live from /api/servers</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchData}
                disabled={refreshing}
                className="border-white/20"
              >
                <IconRefresh className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <div className="p-6 space-y-3">
              {loading ? (
                <>
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-3 p-4 rounded-lg bg-white/5">
                      <Skeleton className="h-5 w-1/2 bg-white/10" />
                      <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-4 bg-white/10" />
                        <Skeleton className="h-4 bg-white/10" />
                      </div>
                    </div>
                  ))}
                </>
              ) : servers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No servers found
                </div>
              ) : (
                servers.map((server, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white">{server.name}</h4>
                      <Badge className="bg-green-500/20 text-green-400">
                        ● {server.status || 'Active'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="ml-2 text-white font-medium">
                          {server.type || 'Game Server'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">RAM:</span>
                        <span className="ml-2 text-white font-medium">
                          {server.memory || '2GB'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Code Example */}
      <motion.div
        className="mt-12 rounded-xl border border-white/10 bg-black/50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-3 text-sm text-gray-400 font-mono">preview.tsx</span>
        </div>
        <pre className="p-6 text-sm text-green-400 font-mono overflow-x-auto">
{`// Fetch activity data
const fetchData = async () => {
  const res = await fetch("/api/activity")
  const data = await res.json()
  setActivity(data)
}

// Real-time updates every 30 seconds
useEffect(() => {
  fetchData()
  const interval = setInterval(fetchData, 30000)
  return () => clearInterval(interval)
}, [])`}
        </pre>
      </motion.div>
    </section>
  )
}

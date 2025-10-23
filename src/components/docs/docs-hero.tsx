"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { IconSparkles, IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function DocsHero() {
  const [stats, setStats] = useState({ users: 0, servers: 0, uptime: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      // Use mock data
      setStats({ users: 1247, servers: 3891, uptime: 99.9 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
      
      {/* Minimal Glow Effects */}
      <motion.div
        className="absolute top-32 right-1/4 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 px-4 py-2 text-sm bg-primary/20 text-primary border-primary/30">
            <IconSparkles className="size-4 mr-2" />
            Premium Game Server Hosting Platform
          </Badge>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Sjnodes Platform
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Professional game server hosting with powerful features, real-time monitoring, and comprehensive control panel
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-6 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/dashboard">
            <button className="group px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200">
              <span className="flex items-center gap-2">
                Get Started
                <IconArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </Link>
          <a href="#features">
            <button className="px-8 py-3 rounded-lg font-semibold text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200">
              View Features
            </button>
          </a>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white/[0.02] border-white/5 p-5">
                  <Skeleton className="h-8 w-20 mx-auto mb-2 bg-white/5" />
                  <Skeleton className="h-4 w-24 mx-auto bg-white/5" />
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="bg-white/[0.02] border-white/5 p-5 hover:bg-white/[0.04] transition-all">
                <div className="text-3xl font-bold text-white">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="text-gray-500 text-sm mt-1">Active Users</div>
              </Card>
              <Card className="bg-white/[0.02] border-white/5 p-5 hover:bg-white/[0.04] transition-all">
                <div className="text-3xl font-bold text-white">
                  {stats.servers.toLocaleString()}+
                </div>
                <div className="text-gray-500 text-sm mt-1">Servers Hosted</div>
              </Card>
              <Card className="bg-white/[0.02] border-white/5 p-5 hover:bg-white/[0.04] transition-all">
                <div className="text-3xl font-bold text-white">
                  {stats.uptime}%
                </div>
                <div className="text-gray-500 text-sm mt-1">Uptime</div>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}

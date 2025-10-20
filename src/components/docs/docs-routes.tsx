"use client"

import { motion } from "framer-motion"
import { IconTerminal2, IconApi, IconRoute, IconCode } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const routes = [
  {
    method: "GET",
    path: "/api/user/profile",
    description: "Fetch user profile with coins, resources, and server limits",
    response: `{
  "id": "user_123",
  "name": "John Doe",
  "email": "user@example.com",
  "coins": 1250,
  "ramLimit": 4096,
  "diskLimit": 10240,
  "cpuLimit": 100,
  "serverSlots": 3
}`
  },
  {
    method: "GET",
    path: "/api/servers",
    description: "Get all user servers with status and configuration",
    response: `{
  "servers": [
    {
      "id": "srv_456",
      "name": "My Minecraft Server",
      "status": "running",
      "players": "5/20",
      "uptime": "2d 14h"
    }
  ]
}`
  },
  {
    method: "POST",
    path: "/api/servers/create",
    description: "Create a new game server with specified configuration",
    response: `{
  "success": true,
  "serverId": "srv_789",
  "status": "deploying",
  "estimatedTime": "45s"
}`
  },
  {
    method: "GET",
    path: "/api/shop/coins",
    description: "Fetch available coin packages for purchase",
    response: `{
  "packages": [
    {
      "id": "pkg_100",
      "coins": 100,
      "price": 99,
      "bonus": 0
    }
  ]
}`
  },
  {
    method: "POST",
    path: "/api/coins/earn",
    description: "Claim AFK rewards or complete Join4Reward tasks",
    response: `{
  "success": true,
  "coinsEarned": 5,
  "newBalance": 1255
}`
  },
  {
    method: "GET",
    path: "/api/leaderboard/coins",
    description: "Get top users ranked by coin balance",
    response: `{
  "leaderboard": [
    {
      "rank": 1,
      "username": "CoinMaster",
      "coins": 15750
    }
  ]
}`
  },
]

export function DocsRoutes() {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <IconApi className="size-5" />
          <span className="font-semibold">API Documentation</span>
        </motion.div>

        <motion.h2
          className="text-5xl font-black text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Available Routes
        </motion.h2>
        <motion.p
          className="text-xl text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Comprehensive API endpoints for all platform features
        </motion.p>
      </div>

      <div className="space-y-6">
        {routes.map((route, index) => (
          <motion.div
            key={route.path}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Badge 
                    className={`font-mono font-bold ${
                      route.method === "GET" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {route.method}
                  </Badge>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <code className="text-lg font-mono text-white">{route.path}</code>
                    <p className="text-gray-400 mt-2">{route.description}</p>
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer text-sm text-primary hover:text-primary/80 flex items-center gap-2">
                      <IconCode className="size-4" />
                      View Response Example
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 rounded-lg bg-black/50 border border-white/10 p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400 font-mono">
                        {route.response}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Authentication Info */}
      <motion.div
        className="mt-12 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/20">
            <IconTerminal2 className="size-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
            <p className="text-gray-300">
              All API requests require authentication using session cookies. Make sure you're logged in before making requests.
            </p>
            <code className="block mt-3 text-sm text-amber-400 bg-black/50 rounded p-2 font-mono">
              Authorization: Session-based (NextAuth)
            </code>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

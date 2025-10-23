"use client"

import { motion } from "framer-motion"
import { IconServer, IconRocket, IconDeviceGamepad2, IconSettings, IconCheck, IconClock } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComponentFlow, NeonPointer } from "@/components/showcase/geometric-connector"

export default function ServersShowcase() {
  const games = [
    { name: "Minecraft", icon: "🎮", users: "2.5M+", color: "from-green-500 to-emerald-600" },
    { name: "Discord Bots", icon: "🤖", users: "500K+", color: "from-blue-500 to-cyan-600" },
    { name: "FiveM", icon: "🚗", users: "1M+", color: "from-purple-500 to-pink-600" },
    { name: "Rust", icon: "⚔️", users: "750K+", color: "from-orange-500 to-red-600" },
    { name: "Terraria", icon: "🌍", users: "300K+", color: "from-teal-500 to-cyan-600" },
    { name: "ARK", icon: "🦖", users: "450K+", color: "from-amber-500 to-yellow-600" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
              Server Management
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Complete Server Control
              </span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Deploy, manage, and scale game servers in seconds. Support for 15+ game types with one-click deployment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Multi-Game Support */}
      <section id="games" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Multi-Game Support">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-3">15+ Supported Games</h2>
                <p className="text-gray-500">From Minecraft to FiveM, we've got you covered</p>
              </div>

              {/* Geometric Layout */}
              <div className="relative">
                {/* Central Hub */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="relative">
                    <div className="size-32 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary/30 flex items-center justify-center backdrop-blur-xl">
                      <IconServer className="size-16 text-primary" />
                    </div>
                    <NeonPointer targetId="hub" delay={0.5} />
                  </div>
                </motion.div>

                {/* Orbiting Game Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-32 pb-32">
                  {games.map((game, index) => (
                    <motion.div
                      key={game.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="relative group border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Connection Line */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                          <motion.line
                            x1="50%"
                            y1="50%"
                            x2="50%"
                            y2="-100%"
                            stroke="rgb(139, 92, 246)"
                            strokeWidth="1"
                            strokeOpacity="0.2"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          />
                        </svg>

                        <div className="relative text-center space-y-3">
                          <div className="text-4xl">{game.icon}</div>
                          <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                          <div className="text-sm text-gray-500">{game.users} players</div>
                          <div className={`h-1 w-full rounded-full bg-gradient-to-r ${game.color} opacity-50`} />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* One-Click Deployment */}
      <section id="deploy" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="One-Click Deployment">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-3">30-Second Setup</h2>
                <p className="text-gray-500">From selection to live server in seconds</p>
              </div>

              {/* Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {[
                  { step: "1", title: "Select Game", icon: IconDeviceGamepad2, time: "2s" },
                  { step: "2", title: "Choose Location", icon: IconSettings, time: "3s" },
                  { step: "3", title: "Configure Resources", icon: IconSettings, time: "5s" },
                  { step: "4", title: "Deploy", icon: IconRocket, time: "20s" }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative"
                  >
                    <Card className="border-white/5 bg-white/[0.02] p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="size-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-lg">
                            {item.step}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <IconClock className="size-3" />
                            {item.time}
                          </div>
                        </div>
                        <item.icon className="size-8 text-gray-400" />
                        <h3 className="font-semibold text-white">{item.title}</h3>
                      </div>
                    </Card>

                    {/* Arrow Connector */}
                    {index < 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                        className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2"
                      >
                        <div className="text-primary text-2xl">→</div>
                      </motion.div>
                    )}

                    {/* Neon Pointer */}
                    {index === 0 && <NeonPointer targetId={`step-${index}`} delay={1} />}
                  </motion.div>
                ))}
              </div>

              {/* Result */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="mt-12 text-center"
              >
                <Card className="inline-block border-primary/30 bg-gradient-to-br from-primary/10 to-purple-500/10 p-6">
                  <div className="flex items-center gap-3">
                    <IconCheck className="size-6 text-green-400" />
                    <span className="text-lg font-semibold text-white">Server Live in 30 Seconds!</span>
                  </div>
                </Card>
              </motion.div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* Resource Allocation */}
      <section id="resources" className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Dynamic Resource Allocation">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-3">Scale as You Grow</h2>
                <p className="text-gray-500">Flexible resource management with real-time adjustments</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "RAM", range: "512MB - 32GB", desc: "Memory allocation", color: "from-blue-500 to-cyan-500" },
                  { title: "CPU", range: "25% - 400%", desc: "Processing power", color: "from-purple-500 to-pink-500" },
                  { title: "Storage", range: "1GB - 500GB", desc: "Disk space", color: "from-amber-500 to-orange-500" }
                ].map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Card className="border-white/5 bg-white/[0.02] p-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">{resource.title}</h3>
                        <div className={`h-2 w-full rounded-full bg-gradient-to-r ${resource.color} opacity-50`} />
                        <div className="text-sm text-gray-400">{resource.desc}</div>
                        <div className="text-lg font-semibold text-primary">{resource.range}</div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Deploy Your Server?</h2>
          <p className="text-gray-500 mb-8">Join thousands of game server hosts using Sjnodes</p>
          <div className="flex items-center justify-center gap-4">
            <a href="/dashboard">
              <button className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all">
                Get Started
              </button>
            </a>
            <a href="/docs#pricing">
              <button className="px-8 py-3 rounded-lg font-semibold border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                View Pricing
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

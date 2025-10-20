"use client"

import { motion } from "framer-motion"
import { IconApi, IconRocket, IconShield, IconCode, IconLock, IconCheck, IconTerminal2, IconDatabase, IconBolt } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComponentFlow, NeonPointer } from "@/components/showcase/geometric-connector"

export default function TechnicalShowcase() {
  const apiEndpoints = [
    { method: "GET", path: "/api/user/profile", desc: "Fetch user data" },
    { method: "GET", path: "/api/servers", desc: "List all servers" },
    { method: "POST", path: "/api/servers/create", desc: "Create new server" },
    { method: "GET", path: "/api/shop/coins", desc: "Get coin packages" },
    { method: "GET", path: "/api/leaderboard/:type", desc: "Get rankings" },
    { method: "POST", path: "/api/coins/earn", desc: "Claim rewards" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
              Technical Excellence
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Enterprise-Grade Infrastructure
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              RESTful API, real-time WebSocket updates, and military-grade security built into every layer
            </p>
          </motion.div>
        </div>
      </section>

      {/* RESTful API */}
      <section id="api" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="RESTful API - Full Access">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Complete API Access</h2>
                <p className="text-gray-500">Integrate with your applications using our comprehensive API</p>
              </div>

              {/* API Architecture */}
              <div className="relative mb-12">
                {/* Central API Gateway */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="flex justify-center mb-12"
                >
                  <div className="relative">
                    <div className="size-32 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 flex flex-col items-center justify-center backdrop-blur-xl">
                      <IconApi className="size-16 text-blue-400 mb-2" />
                      <div className="text-xs font-semibold text-blue-400">API Gateway</div>
                    </div>
                    <NeonPointer targetId="api-hub" delay={0.5} />
                  </div>
                </motion.div>

                {/* API Endpoints Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <motion.div
                      key={endpoint.path}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs font-mono ${
                              endpoint.method === 'GET' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }`}>
                              {endpoint.method}
                            </Badge>
                            <span className="text-xs text-gray-600">200ms avg</span>
                          </div>
                          <code className="text-xs text-white font-mono block truncate">{endpoint.path}</code>
                          <p className="text-xs text-gray-500">{endpoint.desc}</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* API Features */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "RESTful Design", icon: IconCode, desc: "Standard HTTP methods and status codes" },
                  { title: "JSON Responses", icon: IconDatabase, desc: "Clean, predictable data structure" },
                  { title: "Authentication", icon: IconLock, desc: "Secure session-based auth with NextAuth" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Card className="border-white/5 bg-white/[0.02] p-6">
                      <feature.icon className="size-10 text-primary mb-3" />
                      <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Code Example */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-12"
              >
                <Card className="border-white/5 bg-black/50 overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-red-500" />
                      <div className="size-2.5 rounded-full bg-yellow-500" />
                      <div className="size-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-gray-500 ml-3 font-mono">api-example.js</span>
                  </div>
                  <pre className="p-6 text-sm font-mono overflow-x-auto">
                    <code className="text-green-400">{`// Fetch user profile
const response = await fetch('/api/user/profile')
const data = await response.json()

console.log(data)
// Output:
{
  "id": "user_123",
  "coins": 1250,
  "servers": 3,
  "ramLimit": 4096
}`}</code>
                  </pre>
                </Card>
              </motion.div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* Real-time Updates */}
      <section id="realtime" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Real-Time Updates">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">WebSocket Integration</h2>
                <p className="text-gray-500">Live data synchronization across all clients</p>
              </div>

              {/* Data Flow */}
              <div className="grid md:grid-cols-3 gap-8 relative">
                {[
                  { title: "Server Events", icon: IconRocket, desc: "Status changes broadcast instantly", delay: 0 },
                  { title: "Live Updates", icon: IconBolt, desc: "Coins, resources sync in real-time", delay: 0.2 },
                  { title: "User Actions", icon: IconTerminal2, desc: "Activity reflected immediately", delay: 0.4 }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: feature.delay }}
                    className="relative"
                  >
                    <Card className="border-white/5 bg-white/[0.02] p-6">
                      <div className="size-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <feature.icon className="size-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-white text-center mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500 text-center">{feature.desc}</p>
                    </Card>

                    {/* Arrow */}
                    {index < 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: feature.delay + 0.3 }}
                        className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-primary text-2xl"
                      >
                        →
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-12 grid md:grid-cols-2 gap-6"
              >
                {[
                  "No manual refresh needed",
                  "5-second update intervals",
                  "Automatic reconnection",
                  "Optimized data transfer"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <IconCheck className="size-4 text-green-400" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Military-Grade Security">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Security First</h2>
                <p className="text-gray-500">Multiple layers of protection for your data and servers</p>
              </div>

              {/* Security Layers */}
              <div className="relative">
                {/* Center Shield */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="size-32 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center backdrop-blur-xl">
                    <IconShield className="size-16 text-green-400" />
                  </div>
                  <NeonPointer targetId="security" delay={0.5} />
                </motion.div>

                {/* Security Features */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-32 pb-32">
                  {[
                    { title: "End-to-End Encryption", icon: "🔐", desc: "All data encrypted in transit and at rest" },
                    { title: "DDoS Protection", icon: "🛡️", desc: "Enterprise-level mitigation systems" },
                    { title: "Secure Authentication", icon: "🔑", desc: "NextAuth with session validation" },
                    { title: "SQL Injection Protection", icon: "💉", desc: "Prisma ORM prevents attacks" },
                    { title: "Rate Limiting", icon: "⏱️", desc: "API abuse prevention built-in" },
                    { title: "Audit Logging", icon: "📋", desc: "Complete activity trail for compliance" }
                  ].map((security, index) => (
                    <motion.div
                      key={security.title}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all relative group">
                        {/* Connection Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                          <motion.line
                            x1="50%"
                            y1="50%"
                            x2="50%"
                            y2={index < 3 ? "100%" : "0%"}
                            stroke="rgb(34, 197, 94)"
                            strokeWidth="1"
                            strokeOpacity="0.2"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          />
                        </svg>

                        <div className="text-center space-y-3">
                          <div className="text-4xl">{security.icon}</div>
                          <h3 className="font-semibold text-white">{security.title}</h3>
                          <p className="text-sm text-gray-500">{security.desc}</p>
                          <div className="flex items-center justify-center gap-1 text-green-400 text-xs font-medium">
                            <IconCheck className="size-3" />
                            <span>Active</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="mt-12"
              >
                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6">
                  <div className="flex items-start gap-4">
                    <IconLock className="size-8 text-green-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Industry Standards</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        We follow OWASP security guidelines, implement HTTPS everywhere, and conduct regular security audits. 
                        Your data is backed up daily with point-in-time recovery available.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">HTTPS Only</Badge>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Daily Backups</Badge>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">OWASP Compliant</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Built on Solid Foundation</h2>
          <p className="text-gray-500 mb-8">Enterprise-grade technology powering your game servers</p>
          <a href="/docs#features">
            <button className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Explore All Features
            </button>
          </a>
        </div>
      </section>
    </div>
  )
}

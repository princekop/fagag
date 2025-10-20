"use client"

import { motion } from "framer-motion"
import { IconCheck, IconX, IconChartBar, IconClock, IconCoin, IconShield, IconBolt } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardShowcase() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <Badge className="px-4 py-2 bg-primary/20 text-primary border-primary/30">
              Dashboard Overview
            </Badge>
            
            <h1 className="text-6xl font-black bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
              Why Our Dashboard Dominates
            </h1>
            
            <p className="text-xl text-gray-300">
              A centralized control center that puts competitors to shame. Real-time insights, 
              one-click actions, and intuitive design that actually makes sense.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-4xl font-black text-center mb-12">
            <span className="text-white">LustNode vs </span>
            <span className="text-gray-600">Others</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Our Dashboard */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-purple-500/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <IconCheck className="size-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">LustNode Dashboard</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <IconCheck className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Real-time Statistics</div>
                    <div className="text-sm text-gray-400">Live updates every second, no refresh needed</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconCheck className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">One-Click Actions</div>
                    <div className="text-sm text-gray-400">Deploy servers in 30 seconds, not 10 minutes</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconCheck className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Activity Feed</div>
                    <div className="text-sm text-gray-400">Every transaction tracked, fully transparent</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconCheck className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Resource Monitoring</div>
                    <div className="text-sm text-gray-400">Visual cards showing exact usage, not confusing graphs</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconCheck className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Mobile Responsive</div>
                    <div className="text-sm text-gray-400">Perfect on phone, tablet, desktop - everywhere</div>
                  </div>
                </li>
              </ul>
            </Card>

            {/* Others */}
            <Card className="border-white/10 bg-white/5 p-8 opacity-70">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <IconX className="size-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400">Typical Competitors</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <IconX className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-400">Outdated Stats</div>
                    <div className="text-sm text-gray-500">Manual refresh required, data delayed</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconX className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-400">Complex Setup</div>
                    <div className="text-sm text-gray-500">10+ steps just to create a server</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconX className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-400">Hidden Information</div>
                    <div className="text-sm text-gray-500">No transaction history or audit trail</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconX className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-400">Confusing UI</div>
                    <div className="text-sm text-gray-500">Cluttered interface with tech jargon</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <IconX className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-400">Desktop Only</div>
                    <div className="text-sm text-gray-500">Breaks on mobile, unusable on tablets</div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Breakdown */}
      <section id="stats" className="py-20 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-4xl font-black text-center mb-4">Real-time Statistics</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            No more guessing. See exactly what's happening with your resources, servers, and coins - updated live.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-white/10 bg-white/5 p-6">
              <IconChartBar className="size-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Resource Cards</h3>
              <p className="text-gray-400 text-sm">
                Beautiful animated cards showing RAM, CPU, Disk, and Server usage with progress bars and exact numbers.
              </p>
            </Card>

            <Card className="border-white/10 bg-white/5 p-6">
              <IconBolt className="size-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Live Updates</h3>
              <p className="text-gray-400 text-sm">
                Data refreshes automatically every 5 seconds. You see changes happen in real-time without lifting a finger.
              </p>
            </Card>

            <Card className="border-white/10 bg-white/5 p-6">
              <IconShield className="size-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Accurate</h3>
              <p className="text-gray-400 text-sm">
                Direct API integration ensures you're seeing actual data, not cached or estimated values.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section id="actions" className="py-20 border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-4xl font-black text-center mb-4">Quick Actions</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Everything you need is one click away. No buried menus, no confusing navigation.
          </p>

          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Create Server</h3>
                  <p className="text-gray-400 mb-4">
                    Prominent card with gradient background, large icon, and instant button. From dashboard to deployed server in 30 seconds.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="size-1.5 rounded-full bg-primary" />
                      Choose game type
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="size-1.5 rounded-full bg-primary" />
                      Select location
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="size-1.5 rounded-full bg-primary" />
                      Deploy instantly
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Manage Servers</h3>
                  <p className="text-gray-400 mb-4">
                    Direct link to all your servers with status indicators, resource usage, and control buttons visible immediately.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="size-1.5 rounded-full bg-primary" />
                      Start/Stop/Restart
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="size-1.5 rounded-full bg-primary" />
                      View console
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="size-1.5 rounded-full bg-primary" />
                      Configure settings
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Documentation</h3>
                  <p className="text-gray-400 mb-4">
                    Integrated help with search, examples, and API docs - never leave the dashboard to find answers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Support Access</h3>
                  <p className="text-gray-400 mb-4">
                    Direct Discord link, ticket system, and FAQ - get help in seconds, not hours of email chains.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <section id="activity" className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-4xl font-black text-center mb-4">Activity Feed</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Complete transparency. Every coin earned, spent, or refunded is logged and visible instantly.
          </p>

          <div className="max-w-3xl mx-auto">
            <Card className="border-white/10 bg-white/5 p-6">
              <div className="space-y-4">
                {[
                  { action: "AFK reward earned", coins: "+5", time: "2 minutes ago", positive: true },
                  { action: "Purchased RAM upgrade", coins: "-50", time: "1 hour ago", positive: false },
                  { action: "Join4Reward completed", coins: "+25", time: "3 hours ago", positive: true },
                  { action: "Server created", coins: "-0", time: "5 hours ago", positive: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-full flex items-center justify-center ${
                        item.positive ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        <IconCoin className={`size-5 ${item.positive ? 'text-green-400' : 'text-red-400'}`} />
                      </div>
                      <div>
                        <div className="font-semibold">{item.action}</div>
                        <div className="text-xs text-gray-500">{item.time}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {item.coins} coins
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-bold mb-2">Why This Matters:</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Track every transaction - no hidden charges</li>
                  <li>• Dispute resolution made easy with complete history</li>
                  <li>• Export data anytime for your records</li>
                  <li>• Real-time updates, not daily summaries</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Experience the Difference?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join 1,200+ users who chose the smarter dashboard. Start free, upgrade when you're ready.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/dashboard">
              <button className="px-8 py-4 bg-gradient-to-r from-primary to-purple-500 rounded-xl font-bold text-lg shadow-lg shadow-primary/50 hover:shadow-2xl hover:shadow-primary/70 transition-all duration-300">
                Get Started Free
              </button>
            </a>
            <a href="/docs#pricing">
              <button className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                View Pricing
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

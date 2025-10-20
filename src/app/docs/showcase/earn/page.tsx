"use client"

import { motion } from "framer-motion"
import { IconClock, IconGift, IconUsers, IconCoin, IconCheck, IconChartLine, IconBolt } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComponentFlow, NeonPointer } from "@/components/showcase/geometric-connector"

export default function EarnShowcase() {
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
            <Badge className="mb-4 px-4 py-2 bg-green-500/20 text-green-400 border-green-500/30">
              Free Earning System
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Zero Investment Required
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Earn coins for free through AFK system, tasks, and referrals. No payment needed to get started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* AFK System */}
      <section id="afk" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="AFK Rewards - Passive Income">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Earn While You Sleep</h2>
                <p className="text-gray-500">1-5 coins per minute, completely passive</p>
              </div>

              {/* Flow Visualization */}
              <div className="relative">
                {/* Start Point */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex justify-center mb-12"
                >
                  <Card className="inline-block border-primary/30 bg-gradient-to-br from-primary/10 to-purple-500/10 p-6">
                    <div className="flex items-center gap-3">
                      <IconClock className="size-8 text-primary" />
                      <div className="text-left">
                        <div className="text-lg font-bold">Visit AFK Page</div>
                        <div className="text-sm text-gray-400">Start earning immediately</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Arrow Down */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: "3rem" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="w-0.5 bg-gradient-to-b from-primary to-primary/30 mx-auto mb-12"
                />

                {/* Earning Tiers */}
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { time: "1 min", coins: "1-2", icon: "⏱️" },
                    { time: "10 min", coins: "10-20", icon: "⏰" },
                    { time: "1 hour", coins: "60-300", icon: "🕐" },
                    { time: "1 day", coins: "1440-7200", icon: "📅" }
                  ].map((tier, index) => (
                    <motion.div
                      key={tier.time}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="relative"
                    >
                      <Card className="border-white/5 bg-white/[0.02] p-6 text-center hover:bg-white/[0.04] transition-all">
                        {index === 1 && <NeonPointer targetId={`tier-${index}`} delay={1} />}
                        <div className="text-4xl mb-3">{tier.icon}</div>
                        <div className="text-2xl font-bold text-white mb-2">{tier.time}</div>
                        <div className="text-sm text-gray-500 mb-3">Earns</div>
                        <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-400">
                          <IconCoin className="size-5" />
                          {tier.coins}
                        </div>
                      </Card>

                      {/* Connection Line */}
                      {index < 3 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.7 }}
                          className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-primary/40 text-xl"
                        >
                          →
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="mt-12 grid md:grid-cols-3 gap-4"
                >
                  {[
                    "No interaction needed",
                    "Works 24/7",
                    "Automatic tracking"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                      <IconCheck className="size-4 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* Task Completion */}
      <section id="tasks" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Task Completion - Instant Rewards">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Complete Simple Tasks</h2>
                <p className="text-gray-500">Earn 10-100 coins per task, verified instantly</p>
              </div>

              {/* Task Types */}
              <div className="relative">
                {/* Central Task Hub */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="size-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 flex items-center justify-center backdrop-blur-xl">
                    <IconGift className="size-16 text-purple-400" />
                  </div>
                  <NeonPointer targetId="task-hub" delay={0.5} />
                </motion.div>

                {/* Task Cards */}
                <div className="grid md:grid-cols-2 gap-8 pt-40 pb-40">
                  {[
                    { type: "Join Discord", reward: "25", icon: "💬", desc: "Join our server", difficulty: "Easy" },
                    { type: "Follow Social", reward: "15", icon: "👥", desc: "Follow on Twitter/Instagram", difficulty: "Easy" },
                    { type: "Visit Website", reward: "10", icon: "🌐", desc: "Visit partner sites", difficulty: "Easy" },
                    { type: "Complete Survey", reward: "50", icon: "📋", desc: "Quick questionnaire", difficulty: "Medium" }
                  ].map((task, index) => (
                    <motion.div
                      key={task.type}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 }}
                    >
                      <Card className="border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all relative group">
                        {/* Connection to center */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                          <motion.line
                            x1="50%"
                            y1="50%"
                            x2="50%"
                            y2={index < 2 ? "100%" : "0%"}
                            stroke="rgb(168, 85, 247)"
                            strokeWidth="1"
                            strokeOpacity="0.2"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
                          />
                        </svg>

                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{task.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-white">{task.type}</h3>
                              <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                                {task.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{task.desc}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xl font-bold text-purple-400">
                                <IconCoin className="size-5" />
                                +{task.reward}
                              </div>
                              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all">
                                Start Task
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-12 grid md:grid-cols-3 gap-6"
              >
                {[
                  { label: "New Tasks", value: "Daily", icon: IconGift },
                  { label: "Verification", value: "Instant", icon: IconBolt },
                  { label: "Success Rate", value: "99%", icon: IconChartLine }
                ].map((stat, i) => (
                  <Card key={i} className="border-white/5 bg-white/[0.02] p-4 text-center">
                    <stat.icon className="size-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </Card>
                ))}
              </motion.div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* Referral System */}
      <section id="referral" className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Referral System - Earn from Friends">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Invite & Earn</h2>
                <p className="text-gray-500">Earn coins when your friends sign up and use the platform</p>
              </div>

              {/* Referral Flow */}
              <div className="grid md:grid-cols-3 gap-8 relative">
                {[
                  { step: "1", title: "Share Link", desc: "Get your unique referral link", icon: IconUsers, reward: "0" },
                  { step: "2", title: "Friend Joins", desc: "They sign up using your link", icon: IconCheck, reward: "50" },
                  { step: "3", title: "You Both Earn", desc: "Ongoing rewards for activity", icon: IconCoin, reward: "10%" }
                ].map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative"
                  >
                    <Card className="border-white/5 bg-white/[0.02] p-6">
                      <div className="text-center space-y-4">
                        <div className="size-12 mx-auto rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xl">
                          {step.step}
                        </div>
                        <step.icon className="size-10 text-gray-400 mx-auto" />
                        <h3 className="font-semibold text-white">{step.title}</h3>
                        <p className="text-sm text-gray-500">{step.desc}</p>
                        {step.reward !== "0" && (
                          <div className="flex items-center justify-center gap-1 text-green-400 font-bold">
                            <IconCoin className="size-4" />
                            +{step.reward}
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Arrow */}
                    {index < 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.3 }}
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
                className="mt-12"
              >
                <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-purple-500/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">Unlimited Earnings</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "No referral limit",
                      "Lifetime commissions",
                      "Track all referrals",
                      "Instant coin credit"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <IconCheck className="size-4 text-green-400" />
                        <span>{benefit}</span>
                      </div>
                    ))}
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
          <h2 className="text-3xl font-bold mb-4">Start Earning Free Coins Today</h2>
          <p className="text-gray-500 mb-8">No payment required, start earning immediately</p>
          <a href="/earn/afk">
            <button className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Start Earning Now
            </button>
          </a>
        </div>
      </section>
    </div>
  )
}

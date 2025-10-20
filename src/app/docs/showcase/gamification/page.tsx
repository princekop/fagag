"use client"

import { motion } from "framer-motion"
import { IconTrophy, IconShield, IconGift, IconMedal, IconCrown, IconStar, IconFlame, IconCoin, IconClock } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComponentFlow, NeonPointer } from "@/components/showcase/geometric-connector"

export default function GamificationShowcase() {
  const leaderboardData = [
    { rank: 1, user: "CoinMaster", score: "15,750", avatar: "👑", color: "from-amber-500 to-yellow-500" },
    { rank: 2, user: "ServerKing", score: "12,340", avatar: "🎮", color: "from-gray-400 to-gray-500" },
    { rank: 3, user: "ProGamer", score: "10,500", avatar: "⚡", color: "from-orange-500 to-red-500" },
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
            <Badge className="mb-4 px-4 py-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
              Gamification System
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Engagement & Retention
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Competitive rankings, milestone rewards, and monthly prizes keep users coming back
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leaderboards */}
      <section id="leaderboards" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Competitive Rankings">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Live Leaderboards</h2>
                <p className="text-gray-500">Three competitive categories updated in real-time</p>
              </div>

              {/* Leaderboard Types */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { title: "Top Coins", icon: IconCoin, color: "from-amber-500 to-yellow-500", desc: "Highest coin earners" },
                  { title: "Top Afkers", icon: IconClock, color: "from-green-500 to-emerald-500", desc: "Most AFK time" },
                  { title: "Top Activity", icon: IconFlame, color: "from-red-500 to-orange-500", desc: "Most active users" }
                ].map((board, index) => (
                  <motion.div
                    key={board.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Card className="border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all relative group">
                      {index === 0 && <NeonPointer targetId={`board-${index}`} delay={0.5} />}
                      <div className={`size-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${board.color} p-0.5`}>
                        <div className="size-full rounded-full bg-black flex items-center justify-center">
                          <board.icon className="size-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white text-center mb-2">{board.title}</h3>
                      <p className="text-sm text-gray-500 text-center">{board.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Sample Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-white/5 bg-white/[0.02] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Top Coins - This Month</h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Live</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {leaderboardData.map((player, index) => (
                      <motion.div
                        key={player.rank}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          player.rank === 1 ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30' :
                          player.rank === 2 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                          'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30'
                        }`}
                      >
                        <div className={`size-12 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-2xl font-bold shadow-lg`}>
                          {player.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{player.user}</div>
                          <div className="text-sm text-gray-400">Rank #{player.rank}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">{player.score}</div>
                          <div className="text-xs text-gray-500">coins</div>
                        </div>
                        {player.rank === 1 && <IconCrown className="size-6 text-amber-400" />}
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* Achievements */}
      <section id="achievements" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Milestone Rewards">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Unlock Achievements</h2>
                <p className="text-gray-500">Earn badges and rewards for reaching milestones</p>
              </div>

              {/* Achievement Grid */}
              <div className="relative">
                {/* Central Trophy */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="size-28 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 flex items-center justify-center backdrop-blur-xl">
                    <IconTrophy className="size-14 text-purple-400" />
                  </div>
                  <NeonPointer targetId="trophy" delay={0.5} />
                </motion.div>

                {/* Achievement Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-32 pb-32">
                  {[
                    { title: "First Server", icon: "🚀", reward: "50", desc: "Create your first server", rarity: "Common" },
                    { title: "Coin Collector", icon: "💰", reward: "100", desc: "Earn 1,000 coins", rarity: "Rare" },
                    { title: "AFK Master", icon: "⏰", reward: "150", desc: "100 hours AFK time", rarity: "Epic" },
                    { title: "Task Hunter", icon: "🎯", reward: "75", desc: "Complete 50 tasks", rarity: "Rare" },
                    { title: "Referral King", icon: "👥", reward: "200", desc: "Invite 10 friends", rarity: "Epic" },
                    { title: "Server Pro", icon: "🖥️", reward: "300", desc: "Manage 5 servers", rarity: "Legendary" }
                  ].map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
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
                            stroke="rgb(168, 85, 247)"
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
                          <div className="text-5xl">{achievement.icon}</div>
                          <div>
                            <h3 className="font-semibold text-white mb-1">{achievement.title}</h3>
                            <Badge className={`text-xs ${
                              achievement.rarity === 'Legendary' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              achievement.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                              achievement.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{achievement.desc}</p>
                          <div className="flex items-center justify-center gap-1 text-primary font-bold">
                            <IconCoin className="size-4" />
                            +{achievement.reward}
                          </div>
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

      {/* Monthly Prizes */}
      <section id="prizes" className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Top Player Rewards">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Monthly Prize Pool</h2>
                <p className="text-gray-500">Compete for bonus coins at the end of each month</p>
              </div>

              {/* Prize Tiers */}
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { position: "🥇 1st", reward: "1,000", color: "from-amber-500 to-yellow-500" },
                  { position: "🥈 2nd", reward: "500", color: "from-gray-400 to-gray-500" },
                  { position: "🥉 3rd", reward: "250", color: "from-orange-500 to-red-500" },
                  { position: "🏆 Top 10", reward: "100", color: "from-primary to-purple-500" }
                ].map((prize, index) => (
                  <motion.div
                    key={prize.position}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Card className={`border-white/5 bg-gradient-to-br ${prize.color} bg-opacity-10 p-6 text-center`}>
                      <div className="text-4xl mb-3">{prize.position.split(' ')[0]}</div>
                      <div className="text-sm text-gray-400 mb-2">{prize.position.split(' ')[1]} Place</div>
                      <div className="text-3xl font-bold text-white mb-1">{prize.reward}</div>
                      <div className="text-sm text-gray-500">Bonus Coins</div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-12"
              >
                <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-purple-500/10 p-6">
                  <div className="flex items-start gap-4">
                    <IconMedal className="size-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Fair Competition</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Leaderboards reset on the 1st of every month. Everyone starts fresh with equal opportunity to win.
                      </p>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <IconStar className="size-4 text-primary" />
                          <span>Real-time updates</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <IconShield className="size-4 text-primary" />
                          <span>Anti-cheat protected</span>
                        </div>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Compete?</h2>
          <p className="text-gray-500 mb-8">Join the leaderboards and start earning rewards</p>
          <a href="/leaderboard/coins">
            <button className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all">
              View Leaderboards
            </button>
          </a>
        </div>
      </section>
    </div>
  )
}

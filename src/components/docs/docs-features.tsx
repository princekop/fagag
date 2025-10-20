"use client"

import { motion } from "framer-motion"
import { 
  IconServer, IconCoin, IconClock, IconGift, IconTrophy, 
  IconShield, IconBolt, IconDatabase, IconWorld, IconCheck,
  IconDeviceGamepad2, IconCloudUpload, IconLock
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: IconServer,
    title: "Easy Server Creation",
    description: "Deploy game servers instantly with one click. Choose from Minecraft, Discord Bots, FiveM, and more.",
    color: "from-blue-500 to-cyan-500",
    preview: "1-click deployment"
  },
  {
    icon: IconCoin,
    title: "Coins System",
    description: "Earn coins through AFK system or purchase them. Use coins to upgrade your server resources.",
    color: "from-amber-500 to-orange-500",
    preview: "Earn & spend freely"
  },
  {
    icon: IconClock,
    title: "AFK Rewards",
    description: "Earn passive coins by keeping the AFK page open. Automatic tracking and rewards every minute.",
    color: "from-green-500 to-emerald-500",
    preview: "1-5 coins/minute"
  },
  {
    icon: IconGift,
    title: "Join4Reward Tasks",
    description: "Complete simple tasks like joining Discord servers or following social media to earn instant coins.",
    color: "from-purple-500 to-pink-500",
    preview: "10-100 coins/task"
  },
  {
    icon: IconTrophy,
    title: "Leaderboards",
    description: "Compete for top positions in Coins, AFK Time, and Activity leaderboards. Win monthly bonus rewards.",
    color: "from-red-500 to-rose-500",
    preview: "Monthly prizes"
  },
  {
    icon: IconShield,
    title: "DDoS Protection",
    description: "Enterprise-grade DDoS protection keeps your servers online 24/7 with automatic mitigation.",
    color: "from-indigo-500 to-blue-500",
    preview: "Always protected"
  },
  {
    icon: IconBolt,
    title: "High Performance",
    description: "Premium hardware with NVMe SSD storage and latest generation CPUs for maximum performance.",
    color: "from-yellow-500 to-amber-500",
    preview: "Lightning fast"
  },
  {
    icon: IconDatabase,
    title: "Auto Backups",
    description: "Automatic daily backups with one-click restore. Never lose your server data again.",
    color: "from-teal-500 to-cyan-500",
    preview: "Daily backups"
  },
  {
    icon: IconWorld,
    title: "Global Locations",
    description: "Choose from multiple server locations worldwide for the lowest latency to your players.",
    color: "from-violet-500 to-purple-500",
    preview: "Worldwide coverage"
  },
]

export function DocsFeatures() {
  return (
    <section id="features" className="py-16 lg:py-20">
      <div className="text-center mb-12">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Core Features
        </motion.h2>
        <motion.p
          className="text-gray-500 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Everything you need to run professional game servers
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group relative border-white/5 bg-white/[0.02] p-6 h-full hover:bg-white/[0.04] transition-all duration-200">
                <div className="space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-white/5">
                    <Icon className="size-6 text-gray-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                  
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                      <IconCheck className="size-3" />
                      {feature.preview}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { IconTool, IconArrowLeft, IconSparkles, IconClock, IconRocket } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ComingSoonProps {
  title?: string
  description?: string
  progress?: number
}

export function ComingSoon({ 
  title = "Page Under Construction",
  description = "This showcase page is being crafted with care. Check back soon for amazing content and features!",
  progress = 65
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-purple-500/10 blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 md:p-12 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.5 }}
              className="mb-6"
            >
              <div className="inline-flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 relative">
                <IconTool className="size-12 text-primary" />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="mb-4 px-4 py-2 bg-primary/20 text-primary border-primary/30">
                <IconClock className="size-3.5 mr-2" />
                Coming Soon
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {title}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed"
            >
              {description}
            </motion.p>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <IconSparkles className="size-4 text-primary" />
                <span className="text-sm text-gray-500">Building something special...</span>
              </div>
              <div className="h-1.5 w-full max-w-xs mx-auto bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 relative"
                >
                  <motion.div
                    animate={{
                      x: ["-100%", "200%"]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-3 text-xs font-medium text-primary"
              >
                {progress}% Complete
              </motion.div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/docs">
                <button className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all">
                  <IconArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Docs
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                  <IconRocket className="size-4" />
                  Go to Dashboard
                </button>
              </Link>
            </motion.div>
          </Card>

          {/* Additional Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid md:grid-cols-3 gap-4 mt-6"
          >
            {[
              { label: "Live Pages", value: "6", icon: "✅", color: "from-green-500/20 to-emerald-500/20" },
              { label: "In Progress", value: "2", icon: "🚧", color: "from-amber-500/20 to-yellow-500/20" },
              { label: "Planned", value: "4", icon: "✨", color: "from-primary/20 to-purple-500/20" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className={`border-white/5 bg-gradient-to-br ${stat.color} p-4 text-center hover:scale-105 transition-transform`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated Dots */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-2 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="size-2 rounded-full bg-primary"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { IconLoader2 } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl p-12">
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex justify-center mb-6"
            >
              <div className="size-16 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-0.5">
                <div className="size-full rounded-full bg-black flex items-center justify-center">
                  <IconLoader2 className="size-8 text-primary" />
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold text-white">Loading...</h2>
              <p className="text-sm text-gray-400">Preparing your content</p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-8">
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
            </div>
          </Card>

          {/* Skeleton Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3 mt-6"
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-white/5 bg-white/[0.02] p-4">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="space-y-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-white/5" />
                  <div className="h-3 w-full rounded bg-white/5" />
                  <div className="h-2 w-3/4 rounded bg-white/5" />
                </motion.div>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { IconAlertTriangle, IconRefresh, IconArrowLeft } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 size-96 rounded-full bg-amber-500/20 blur-3xl"
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 relative">
                <IconAlertTriangle className="size-12 text-amber-400" />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full border-2 border-amber-500/30"
                />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="mb-4 px-4 py-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
                Error Occurred
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
                Something Went Wrong
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 mb-2 max-w-md mx-auto"
            >
              An unexpected error occurred while loading this page. Don't worry, it's not your fault!
            </motion.p>

            {/* Error Details (in dev mode) */}
            {process.env.NODE_ENV === 'development' && error.message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <Card className="border-amber-500/20 bg-amber-500/5 p-4 mt-4">
                  <div className="text-xs text-left font-mono text-amber-400 break-all">
                    {error.message}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <button
                onClick={reset}
                className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                <IconRefresh className="size-4 group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </button>
              <Link href="/docs">
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                  <IconArrowLeft className="size-4" />
                  Back to Docs
                </button>
              </Link>
            </motion.div>
          </Card>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6"
          >
            <Card className="border-white/5 bg-white/[0.02] p-6">
              <div className="text-center">
                <h3 className="font-semibold text-white mb-2">Need Help?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  If this error persists, please contact our support team
                </p>
                <div className="flex items-center justify-center gap-4">
                  <a 
                    href="https://discord.gg/mBP9bejg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Join Discord
                  </a>
                  <span className="text-gray-600">•</span>
                  <Link href="/dashboard" className="text-sm text-primary hover:underline">
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

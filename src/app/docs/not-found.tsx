"use client"

import { motion } from "framer-motion"
import { IconFileOff, IconArrowLeft, IconSearch, IconHome } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function NotFound() {
  const quickLinks = [
    { label: "Dashboard Overview", href: "/docs/showcase/dashboard", icon: "📊" },
    { label: "Server Management", href: "/docs/showcase/servers", icon: "🖥️" },
    { label: "Shop System", href: "/docs/showcase/shop", icon: "🛒" },
    { label: "Earning System", href: "/docs/showcase/earn", icon: "💰" },
    { label: "Gamification", href: "/docs/showcase/gamification", icon: "🏆" },
    { label: "Technical Details", href: "/docs/showcase/technical", icon: "⚡" }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 left-1/3 size-96 rounded-full bg-red-500/20 blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 md:p-12">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="text-center mb-6"
            >
              <div className="inline-flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
                <IconFileOff className="size-12 text-red-400" />
              </div>
            </motion.div>

            {/* 404 Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-4"
            >
              <Badge className="px-4 py-2 bg-red-500/20 text-red-400 border-red-500/30 text-lg font-bold">
                404
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-5xl font-bold mb-4 text-center"
            >
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Page Not Found
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 mb-8 text-center max-w-md mx-auto"
            >
              The page you're looking for doesn't exist or has been moved. Try one of these popular pages instead.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link href="/docs">
                <button className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all">
                  <IconArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Docs
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                  <IconHome className="size-4" />
                  Dashboard
                </button>
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <IconSearch className="size-4 text-gray-500" />
                <span className="text-sm text-gray-500 font-medium">Popular Pages</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {quickLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Link href={link.href}>
                      <Card className="border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-primary/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{link.icon}</div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                              {link.label}
                            </div>
                          </div>
                          <IconArrowLeft className="size-4 text-gray-600 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Card>

          {/* Error Code Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ delay: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: -1 }}
          >
            <div className="text-[20rem] font-black text-white">404</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

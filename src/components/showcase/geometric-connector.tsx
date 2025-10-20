"use client"

import { motion } from "framer-motion"

interface ConnectorProps {
  from: "top" | "bottom" | "left" | "right"
  to: "top" | "bottom" | "left" | "right"
  label?: string
  delay?: number
}

export function GeometricConnector({ from, to, label, delay = 0 }: ConnectorProps) {
  const getPath = () => {
    if (from === "bottom" && to === "top") {
      return "M 0 0 L 0 40 L 50 40 L 50 80"
    }
    if (from === "right" && to === "left") {
      return "M 0 0 L 40 0 L 40 50 L 80 50"
    }
    return "M 0 0 L 50 50"
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        <motion.path
          d={getPath()}
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
      
      {label && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-1 bg-primary/20 border border-primary/30 rounded text-xs font-medium text-primary whitespace-nowrap"
        >
          {label}
        </motion.div>
      )}
    </div>
  )
}

export function NeonPointer({ targetId, delay = 0 }: { targetId: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0, 1.5, 1, 0],
        x: [0, 10, 0, -10, 0],
        y: [0, -10, 0, 10, 0]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 2
      }}
      className="absolute z-50 pointer-events-none"
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(139, 92, 246, 0.5) 50%, transparent 100%)",
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)"
      }}
    />
  )
}

export function ComponentFlow({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      {title && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{title}</span>
          </div>
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}

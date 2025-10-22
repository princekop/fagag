"use client"

import { ReactNode, useEffect, useState } from "react"
import { AnimatePresence, MotionConfig } from "framer-motion"
import { usePathname } from "next/navigation"
import { PageTransition } from "@/components/page-transition"

interface RouteTransitionProviderProps {
  children: ReactNode
}

export function RouteTransitionProvider({ children }: RouteTransitionProviderProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // On first render (server-side), render without animations to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={pathname}>{children}</PageTransition>
      </AnimatePresence>
    </MotionConfig>
  )
}

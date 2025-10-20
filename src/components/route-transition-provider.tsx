"use client"

import { ReactNode } from "react"
import { AnimatePresence, MotionConfig } from "framer-motion"
import { usePathname } from "next/navigation"
import { PageTransition } from "@/components/page-transition"

interface RouteTransitionProviderProps {
  children: ReactNode
}

export function RouteTransitionProvider({ children }: RouteTransitionProviderProps) {
  const pathname = usePathname()

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={pathname}>{children}</PageTransition>
      </AnimatePresence>
    </MotionConfig>
  )
}

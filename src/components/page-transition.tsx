"use client"

import { motion, type Variants } from "framer-motion"
import { PropsWithChildren } from "react"

const easeInOut: [number, number, number, number] = [0.22, 1, 0.36, 1]
const easeExit: [number, number, number, number] = [0.4, 0, 1, 1]

const variants: Variants = {
  initial: { opacity: 0, y: 24, filter: "blur(12px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: easeInOut,
    },
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: "blur(12px)",
    transition: {
      duration: 0.45,
      ease: easeExit,
    },
  },
}

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className="min-h-svh"
    >
      {children}
    </motion.div>
  )
}

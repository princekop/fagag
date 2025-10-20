"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type AuthLayoutProps = {
  brand: ReactNode
  children: ReactNode
  overlayEyebrow?: string
  overlayTitle: string
  overlayDescription: string
  className?: string
}

type AuthVideoPanelProps = {
  className?: string
  eyebrow?: string
  title: string
  description: string
}

const VIDEO_SRC =
  "https://www.youtube.com/embed/CiQJSR4mYJ4?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playlist=CiQJSR4mYJ4&vq=hd2160"

function AuthVideoPanel({ className, eyebrow = "Live preview", title, description }: AuthVideoPanelProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl", className)}>
      <div className="absolute inset-0">
        <iframe
          title="LustNode dashboard"
          src={VIDEO_SRC}
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
          allowFullScreen
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/82 via-slate-950/35 to-slate-900/85 backdrop-blur-md" />
      </div>
      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
        <div className="rounded-2xl border border-white/15 bg-white/12 p-6 text-white shadow-[0_25px_70px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">{eyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-white/75 sm:text-base">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function AuthLayout({
  brand,
  children,
  overlayEyebrow = "Live preview",
  overlayTitle,
  overlayDescription,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-foreground",
        "px-4 py-12 sm:px-6 lg:px-10",
        className,
      )}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(147,51,234,0.12),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.16] mix-blend-soft-light" />
      </div>
      <motion.section
        initial={{ opacity: 0, y: 48, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.96 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 grid w-full max-w-[1080px] gap-10 rounded-[32px] border border-white/8 bg-white/[0.06] p-6 shadow-[0_50px_140px_rgba(15,23,42,0.55)] backdrop-blur-3xl sm:p-8 lg:grid-cols-[410px_minmax(0,1fr)] lg:p-12"
      >
        <div className="flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 lg:justify-start"
          >
            {brand}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5, ease: [0.17, 0.85, 0.25, 1] }}
            className="mx-auto w-full max-w-sm space-y-6"
          >
            {children}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative hidden h-[520px] lg:block"
        >
          <AuthVideoPanel
            className="absolute inset-0"
            eyebrow={overlayEyebrow}
            title={overlayTitle}
            description={overlayDescription}
          />
        </motion.div>
      </motion.section>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="pointer-events-none absolute bottom-6 w-full max-w-[420px] lg:hidden"
      >
        <AuthVideoPanel
          className="border border-white/10 bg-white/[0.05] shadow-[0_30px_80px_rgba(15,23,42,0.5)]"
          eyebrow={overlayEyebrow}
          title={overlayTitle}
          description={overlayDescription}
        />
      </motion.div>
    </div>
  )
}

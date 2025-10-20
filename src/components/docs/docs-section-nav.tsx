"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const sections = [
  { id: "hero", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "routes", label: "API" },
  { id: "preview", label: "Preview" },
  { id: "pricing", label: "Pricing" },
]

export function DocsSectionNav() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="mt-6 space-y-1">
      <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-3">
        Quick Jump
      </div>
      {sections.map((section) => {
        const isActive = activeSection === section.id
        
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`group relative w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
            }`}
          >
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeSection"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <span className={isActive ? "ml-2" : ""}>{section.label}</span>
          </button>
        )
      })}
    </div>
  )
}

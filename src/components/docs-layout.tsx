"use client"

import Link from "next/link"
import { IconMenu2 } from "@tabler/icons-react"
import { ReactNode, useState } from "react"
import { DocsSidebar } from "./docs/docs-sidebar"

export function DocsLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/98 backdrop-blur-xl flex-shrink-0">
        <div className="flex h-14 items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 p-2 rounded-lg hover:bg-white/5 transition-colors lg:hidden"
          >
            <IconMenu2 className="size-5 text-gray-400" />
          </button>

          <Link href="/docs" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 p-1">
              <img 
                src="https://i.postimg.cc/tCyDLdDB/IMG-0100.png" 
                alt="Sjnodes Logo" 
                className="size-full object-contain"
              />
            </div>
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Sjnodes
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
              Features
            </a>
            <a href="#routes" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
              API
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:flex flex-shrink-0 h-full">
          <DocsSidebar />
        </div>

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] lg:hidden">
              <DocsSidebar />
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

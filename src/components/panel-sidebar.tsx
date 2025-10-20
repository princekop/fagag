"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { IconTerminal, IconFiles, IconDatabase, IconSettings, IconCpu, IconChartBar, IconArchive, IconUsers, IconBrandDocker, IconClock } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type PanelSidebarProps = {
  identifier: string
  serverName: string
  serverStatus: string
}

export function PanelSidebar({ identifier, serverName, serverStatus }: PanelSidebarProps) {
  const pathname = usePathname()
  
  const navigation = [
    { name: "Console", href: `/panel/${identifier}`, icon: IconTerminal, active: pathname === `/panel/${identifier}` },
    { name: "Files", href: `/panel/${identifier}/files`, icon: IconFiles, active: pathname?.includes("/files") },
    { name: "Databases", href: `/panel/${identifier}/databases`, icon: IconDatabase, active: pathname?.includes("/databases") },
    { name: "Schedules", href: `/panel/${identifier}/schedules`, icon: IconClock, active: pathname?.includes("/schedules") },
    { name: "Backups", href: `/panel/${identifier}/backups`, icon: IconArchive, active: pathname?.includes("/backups") },
    { name: "Network", href: `/panel/${identifier}/network`, icon: IconChartBar, active: pathname?.includes("/network") },
    { name: "Startup", href: `/panel/${identifier}/startup`, icon: IconBrandDocker, active: pathname?.includes("/startup") },
    { name: "Settings", href: `/panel/${identifier}/settings`, icon: IconSettings, active: pathname?.includes("/settings") },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
      {/* Server Info */}
      <div className="border-b border-white/10 p-4">
        <h2 className="truncate text-lg font-semibold text-white">{serverName}</h2>
        <div className="mt-2 flex items-center gap-2">
          <div className={`size-2 rounded-full ${serverStatus === "running" ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
          <span className="text-sm text-gray-400 capitalize">{serverStatus || "offline"}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-white/10 text-white shadow-lg"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Resource Usage */}
      <div className="border-t border-white/10 p-4">
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-gray-400">CPU</span>
              <span className="text-white">0%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-blue-400 transition-all" />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-gray-400">RAM</span>
              <span className="text-white">0 MB</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-0 bg-gradient-to-r from-green-500 to-green-400 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

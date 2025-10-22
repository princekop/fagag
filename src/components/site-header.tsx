"use client"

import { useSession } from "next-auth/react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUserProfile } from "@/lib/profile-events"
import { IconCoin } from "@tabler/icons-react"

export function SiteHeader() {
  const { data: session } = useSession()
  const userName = session?.user?.name || "User"
  const { profile } = useUserProfile()

  return (
    <header className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center gap-2 border-b border-border/50 bg-smoky-card/95 backdrop-blur-md transition-all ease-linear w-full">
      <div className="flex w-full items-center gap-1.5 sm:gap-2 px-2 sm:px-4 md:px-6">
        <SidebarTrigger className="size-8 hover:bg-primary/10 rounded-md transition-colors flex-shrink-0" />
        <Separator
          orientation="vertical"
          className="h-6 bg-border/50 flex-shrink-0"
        />
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 overflow-hidden">
          <img 
            src="https://i.postimg.cc/wjdwQmYB/welcome.webp" 
            alt="Welcome" 
            className="size-6 sm:size-8 md:size-10 object-contain flex-shrink-0"
          />
          <h1 className="text-xs sm:text-sm md:text-base font-bold truncate">
            Welcome <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">{userName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-primary/15 px-2 sm:px-3 py-1.5 text-xs sm:text-sm shadow-md ring-1 ring-primary/30 glow-primary">
            <IconCoin className="size-3.5 sm:size-4 text-primary flex-shrink-0" />
            <span className="font-bold whitespace-nowrap">{profile ? profile.coins : "--"}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

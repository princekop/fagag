"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  IconDashboard,
  IconPlus,
  IconServer,
  IconCoin,
  IconShoppingCart,
  IconClock,
  IconLink,
  IconGift,
  IconTrophy,
  IconActivity,
  IconFlame,
  IconMapPin,
  IconDatabase,
  IconUsers,
  IconServerCog,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Create Server",
      url: "/create",
      icon: IconPlus,
    },
    {
      title: "My Servers",
      url: "/servers",
      icon: IconServer,
    },
  ],
  navShop: [
    {
      title: "Buy Coins",
      url: "/shop/coins",
      icon: IconCoin,
    },
    {
      title: "Buy Specs",
      url: "/shop/specs",
      icon: IconShoppingCart,
    },
  ],
  navEarnCoin: [
    {
      title: "AFK System",
      url: "/earn/afk",
      icon: IconClock,
    },
    {
      title: "Join4Reward",
      url: "/earn/join4reward",
      icon: IconGift,
    },
  ],
  navLeaderboard: [
    {
      title: "Top Coins",
      url: "/leaderboard/coins",
      icon: IconTrophy,
    },
    {
      title: "Top Afkers",
      url: "/leaderboard/afkers",
      icon: IconFlame,
    },
    {
      title: "Top Activity",
      url: "/leaderboard/activity",
      icon: IconActivity,
    },
  ],
  navAdmin: [
    {
      title: "Ptero Nests",
      url: "/admin/ptero/nests",
      icon: IconDatabase,
    },
    {
      title: "Ptero Eggs",
      url: "/admin/ptero/eggs",
      icon: IconDatabase,
    },
    {
      title: "Ptero Nodes",
      url: "/admin/ptero/nodes",
      icon: IconServer,
    },
    {
      title: "Manage Shop",
      url: "/admin/shop",
      icon: IconShoppingCart,
    },
    {
      title: "Join4Reward Tasks",
      url: "/admin/join4reward",
      icon: IconGift,
    },
    {
      title: "Leaderboard",
      url: "/admin/leaderboard",
      icon: IconTrophy,
    },
    {
      title: "Add Location",
      url: "/admin/locations",
      icon: IconMapPin,
    },
    {
      title: "Add Node",
      url: "/admin/nodes",
      icon: IconDatabase,
    },
    {
      title: "Manage Users",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Manage Servers",
      url: "/admin/servers",
      icon: IconServerCog,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const realUser = {
    name: session?.user?.name || data.user.name,
    email: session?.user?.email || data.user.email,
    avatar: session?.user?.image || data.user.avatar,
  }
  
  // Check if user is admin
  const isAdmin = session?.user?.role === "admin"
  
  return (
    <Sidebar collapsible="offcanvas" className="bg-sidebar border-r border-sidebar-border flex flex-col h-full" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-smoky-gradient py-4 px-3 flex-shrink-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-2 hover:bg-sidebar-accent/50 transition-colors w-full"
            >
              <a href="/dashboard" className="flex items-center gap-3 w-full">
                <div className="flex size-10 items-center justify-center rounded-lg overflow-hidden bg-primary/20 ring-2 ring-primary/30 p-1 flex-shrink-0">
                  <img 
                    src="https://i.postimg.cc/J0f7gdct/IMG-0102.png" 
                    alt="Sjnodes Logo" 
                    className="size-full object-contain"
                  />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0 flex-1">
                  <span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Sjnodes</span>
                  <span className="text-xs text-muted-foreground/80 font-medium">Free Hosting</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="py-1.5 space-y-1">
          <h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-primary">Main</h2>
          <NavMain items={data.navMain} />
        </div>
        <div className="py-1.5 space-y-1 border-t border-sidebar-border/50 mt-3">
          <h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-purple-400">Shop</h2>
          <NavMain items={data.navShop} />
        </div>
        <div className="py-1.5 space-y-1 border-t border-sidebar-border/50 mt-3">
          <h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-amber-400">Earn Coin</h2>
          <NavMain items={data.navEarnCoin} />
        </div>
        <div className="py-1.5 space-y-1 border-t border-sidebar-border/50 mt-3">
          <h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-green-400">Leaderboard</h2>
          <NavMain items={data.navLeaderboard} />
        </div>
        {isAdmin && (
          <div className="py-1.5 space-y-1 border-t border-sidebar-border/50 mt-3">
            <h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-red-400">Admin</h2>
            <NavMain items={data.navAdmin} />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 p-3 mt-auto flex-shrink-0 bg-sidebar/50 backdrop-blur-sm">
        <NavUser user={realUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

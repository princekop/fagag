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
    avatar: "/avatars/shadcn.jpg",
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
  return (
    <Sidebar collapsible="offcanvas" className="bg-sidebar border-r border-sidebar-border" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-smoky-gradient py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-3 hover:bg-sidebar-accent/50 transition-colors"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-lg overflow-hidden bg-primary/20 ring-2 ring-primary/30 p-1">
                  <img 
                    src="https://i.postimg.cc/CKdJdbfB/19b2c766c17a246f80df6be88559acd5.png" 
                    alt="LustNode Logo" 
                    className="size-full object-contain"
                  />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">LustNode</span>
                  <span className="text-xs text-muted-foreground font-medium">Free Hosting</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        <div className="py-3 space-y-1">
          <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-primary/90">Main</h2>
          <NavMain items={data.navMain} />
        </div>
        <div className="py-3 space-y-1 border-t border-sidebar-border/50">
          <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-purple-400/90">Shop</h2>
          <NavMain items={data.navShop} />
        </div>
        <div className="py-3 space-y-1 border-t border-sidebar-border/50">
          <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-amber-400/90">Earn Coin</h2>
          <NavMain items={data.navEarnCoin} />
        </div>
        <div className="py-3 space-y-1 border-t border-sidebar-border/50">
          <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-green-400/90">LeaderBoard</h2>
          <NavMain items={data.navLeaderboard} />
        </div>
        <div className="py-3 space-y-1 border-t border-sidebar-border/50">
          <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-red-400/90">Admin</h2>
          <NavMain items={data.navAdmin} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={realUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

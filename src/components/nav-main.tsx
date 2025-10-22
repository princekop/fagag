"use client"

import Link from "next/link"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent>
        <SidebarMenu className="space-y-0.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild 
                className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/80 py-2.5 px-3 text-sm font-medium transition-colors rounded-md"
              >
                <Link href={item.url} className="flex items-center gap-3 w-full min-w-0">
                  {item.icon && <item.icon className="size-[18px] flex-shrink-0 opacity-80" />}
                  <span className="truncate flex-1">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

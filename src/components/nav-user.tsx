"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"
import { signOut } from "next-auth/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cred, setCred] = useState<{ panelUrl: string; email: string | null; linked: boolean; password: string | null } | null>(null)

  const loadCred = async () => {
    try {
      const res = await fetch("/api/ptero/credentials")
      if (res.ok) setCred(await res.json())
    } catch {}
  }

  useEffect(() => {
    if (open) loadCred()
  }, [open])

  const resetPassword = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ptero/credentials", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setCred((c) => c ? { ...c, password: data.password } : c)
      } else {
        alert(data.error || "Failed to reset password")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconUserCircle />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconCreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconNotification />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <span onClick={() => setOpen(true)} className="cursor-pointer">
                <IconUserCircle />
                Panel Credentials
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Pterodactyl Credentials</SheetTitle>
            <SheetDescription>Use these to login to your panel.</SheetDescription>
          </SheetHeader>
          <div className="px-4 space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">Panel URL</div>
              <div className="text-sm font-medium break-all">{cred?.panelUrl || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="text-sm font-medium">{cred?.email || user.email}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Password</div>
              <div className="text-sm font-medium">{cred?.password ? cred.password : "Not set yet"}</div>
            </div>
            <div className="pt-2">
              <Button size="sm" onClick={resetPassword} disabled={loading} className="w-full">{loading ? "Resetting..." : "Reset Password"}</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </SidebarMenu>
  )
}

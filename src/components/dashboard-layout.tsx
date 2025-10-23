import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ReactNode } from "react"

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-mobile": "20rem",
          "--header-height": "60px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <SiteHeader />
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-smoky-dark">
          <div className="w-full min-h-full flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

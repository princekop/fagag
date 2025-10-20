"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  IconDashboard, IconServer, IconCoin, IconShoppingCart, IconClock, 
  IconGift, IconTrophy, IconUsers, IconSettings, IconChevronDown,
  IconChevronRight, IconCircleFilled, IconArrowRight, IconBook,
  IconApi, IconShield, IconRocket, IconDeviceGamepad2
} from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DocsSectionNav } from "./docs-section-nav"

interface NavItem {
  title: string
  icon: any
  href?: string
  children?: NavItem[]
  description?: string
}

const sidebarData: NavItem[] = [
  {
    title: "Dashboard Overview",
    icon: IconDashboard,
    href: "/docs/showcase/dashboard",
    description: "Centralized control center",
    children: [
      {
        title: "Real-time Statistics",
        icon: IconBook,
        href: "/docs/showcase/dashboard#stats",
        description: "Live resource monitoring"
      },
      {
        title: "Quick Actions",
        icon: IconRocket,
        href: "/docs/showcase/dashboard#actions",
        description: "One-click operations"
      },
      {
        title: "Activity Feed",
        icon: IconTrophy,
        href: "/docs/showcase/dashboard#activity",
        description: "Transaction history"
      }
    ]
  },
  {
    title: "Server Management",
    icon: IconServer,
    description: "Complete server control",
    children: [
      {
        title: "Multi-Game Support",
        icon: IconDeviceGamepad2,
        href: "/docs/showcase/servers#games",
        description: "15+ game types"
      },
      {
        title: "One-Click Deployment",
        icon: IconRocket,
        href: "/docs/showcase/servers#deploy",
        description: "30-second setup"
      },
      {
        title: "Resource Allocation",
        icon: IconSettings,
        href: "/docs/showcase/servers#resources",
        description: "Dynamic scaling"
      }
    ]
  },
  {
    title: "Monetization System",
    icon: IconShoppingCart,
    description: "Flexible pricing model",
    children: [
      {
        title: "Coin Packages",
        icon: IconCoin,
        href: "/docs/showcase/shop#coins",
        description: "Affordable bundles"
      },
      {
        title: "Resource Upgrades",
        icon: IconShoppingCart,
        href: "/docs/showcase/shop#upgrades",
        description: "Pay-as-you-grow"
      },
      {
        title: "Admin Controls",
        icon: IconSettings,
        href: "/docs/showcase/shop#admin",
        description: "Complete customization"
      }
    ]
  },
  {
    title: "Free Earning System",
    icon: IconCoin,
    description: "Zero investment required",
    children: [
      {
        title: "AFK Rewards",
        icon: IconClock,
        href: "/docs/showcase/earn#afk",
        description: "Passive income"
      },
      {
        title: "Task Completion",
        icon: IconGift,
        href: "/docs/showcase/earn#tasks",
        description: "Instant rewards"
      },
      {
        title: "Referral System",
        icon: IconUsers,
        href: "/docs/showcase/earn#referral",
        description: "Earn from friends"
      }
    ]
  },
  {
    title: "Gamification",
    icon: IconTrophy,
    description: "Engagement & retention",
    children: [
      {
        title: "Leaderboards",
        icon: IconTrophy,
        href: "/docs/showcase/gamification#leaderboards",
        description: "Competitive rankings"
      },
      {
        title: "Achievements",
        icon: IconShield,
        href: "/docs/showcase/gamification#achievements",
        description: "Milestone rewards"
      },
      {
        title: "Monthly Prizes",
        icon: IconGift,
        href: "/docs/showcase/gamification#prizes",
        description: "Top player rewards"
      }
    ]
  },
  {
    title: "Technical Excellence",
    icon: IconApi,
    description: "Enterprise-grade infrastructure",
    children: [
      {
        title: "RESTful API",
        icon: IconApi,
        href: "/docs/showcase/technical#api",
        description: "Full API access"
      },
      {
        title: "Real-time Updates",
        icon: IconRocket,
        href: "/docs/showcase/technical#realtime",
        description: "WebSocket integration"
      },
      {
        title: "Security",
        icon: IconShield,
        href: "/docs/showcase/technical#security",
        description: "Military-grade encryption"
      }
    ]
  }
]

function NavNode({ item, level = 0, isLast = false }: { item: NavItem; level?: number; isLast?: boolean }) {
  const [isOpen, setIsOpen] = useState(level === 0)
  const Icon = item.icon
  const hasChildren = item.children && item.children.length > 0

  return (
    <div className="relative">
      {/* Connection Line */}
      {level > 0 && (
        <>
          {/* Horizontal line */}
          <div 
            className="absolute left-[-24px] top-[20px] w-[20px] h-[2px] bg-gradient-to-r from-primary/30 to-primary/60"
            style={{ top: '20px' }}
          />
          {/* Vertical line */}
          {!isLast && (
            <div 
              className="absolute left-[-24px] top-[20px] w-[2px] bg-gradient-to-b from-primary/30 to-transparent"
              style={{ height: 'calc(100% + 16px)' }}
            />
          )}
        </>
      )}

      <div className={cn("group relative", level > 0 && "ml-6")}>
        {/* Main Node */}
        <motion.div
          className={cn(
            "flex items-center gap-2.5 p-2.5 rounded-lg transition-all cursor-pointer",
            level === 0 
              ? "bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/[0.07] mb-2" 
              : "hover:bg-white/[0.03] border border-transparent"
          )}
          onClick={() => hasChildren && setIsOpen(!isOpen)}
          whileHover={{ x: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Arrow/Expand Icon */}
          {hasChildren && (
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconChevronRight className={cn(
                "size-4",
                level === 0 ? "text-primary" : "text-gray-400"
              )} />
            </motion.div>
          )}
          {!hasChildren && (
            <IconCircleFilled className="size-2 text-gray-600" />
          )}

          {/* Icon with clean background */}
          <div className={cn(
            "flex size-7 items-center justify-center rounded-md",
            level === 0 
              ? "bg-primary/10" 
              : "bg-white/5"
          )}>
            <Icon className={cn(
              "size-3.5",
              level === 0 ? "text-primary" : "text-gray-500"
            )} />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            {item.href ? (
              <Link href={item.href} className="block">
                <div className={cn(
                  "font-medium truncate",
                  level === 0 ? "text-gray-100 text-sm" : "text-gray-400 text-xs"
                )}>
                  {item.title}
                </div>
                {item.description && level === 0 && (
                  <div className="text-[10px] text-gray-600 truncate mt-0.5">
                    {item.description}
                  </div>
                )}
              </Link>
            ) : (
              <>
                <div className={cn(
                  "font-medium truncate",
                  level === 0 ? "text-gray-100 text-sm" : "text-gray-400 text-xs"
                )}>
                  {item.title}
                </div>
                {item.description && level === 0 && (
                  <div className="text-[10px] text-gray-600 truncate mt-0.5">
                    {item.description}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Link indicator */}
          {item.href && (
            <IconArrowRight className="size-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </motion.div>

        {/* Children */}
        {hasChildren && (
          <motion.div
            initial={false}
            animate={{ 
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2 relative">
              {item.children!.map((child, index) => (
                <NavNode 
                  key={child.title} 
                  item={child} 
                  level={level + 1}
                  isLast={index === item.children!.length - 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function DocsSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.aside
      className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-white/5 bg-gradient-to-b from-black via-black/95 to-black backdrop-blur-xl scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent"
      animate={{ width: isCollapsed ? 80 : 300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contents</span>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <IconChevronRight className="size-3.5 text-gray-500" />
            </motion.div>
          </button>
        </div>

        {/* Navigation Tree */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            {sidebarData.map((item, index) => (
              <NavNode 
                key={item.title} 
                item={item}
                isLast={index === sidebarData.length - 1}
              />
            ))}
          </motion.div>
        )}

        {/* Collapsed State - Icons Only */}
        {isCollapsed && (
          <div className="space-y-3">
            {sidebarData.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-primary/20 hover:shadow-md hover:shadow-primary/20 transition-all duration-200 cursor-pointer"
                  title={item.title}
                >
                  <Icon className="size-5 text-gray-400 hover:text-primary transition-colors" />
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Page Section Navigator */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <DocsSectionNav />
          </motion.div>
        )}

        {/* Minimal Footer Info */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 pt-4 border-t border-white/5"
          >
            <div className="text-[10px] text-gray-600 space-y-1">
              <div>Total Sections: 6</div>
              <div>Last Updated: Today</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  )
}

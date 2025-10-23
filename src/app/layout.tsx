import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { RouteTransitionProvider } from "@/components/route-transition-provider"
import { SessionProvider } from "@/components/providers/session-provider"

// Using Inter as a reliable fallback font
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Sjnodes - Best Free Aternos Alternative | Free Minecraft Server Hosting",
  description: "Sjnodes is the best free Aternos alternative for Minecraft server hosting. Create and manage unlimited free game servers with 24/7 uptime. Easy setup, powerful controls, and no credit card required.",
  keywords: [
    "alternos alternative",
    "free minecraft server hosting",
    "free server hosting",
    "minecraft server",
    "game server hosting",
    "free game server",
    "alternos",
    "server management",
    "minecraft hosting",
    "free hosting platform",
    "24/7 server hosting",
    "game server management",
    "Sjnodes",
    "indian hosting",
    "made in India",
    "server control panel",
    "free server slots",
  ],
  openGraph: {
    title: "Sjnodes - Best Free Aternos Alternative",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sjnodes - Free Hosting",
    description: "The best free Aternos-like hosting dashboard with coins, shop, and leaderboard system. 24/7 uptime, easy setup, unlimited servers.",
  },
  icons: {
    icon: [
      { url: "https://i.postimg.cc/tCyDLdDB/IMG-0100.png", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <RouteTransitionProvider>{children}</RouteTransitionProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

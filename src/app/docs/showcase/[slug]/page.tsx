import { ComingSoon } from "@/components/showcase/coming-soon"
import { notFound } from "next/navigation"

const showcasePages = {
  dashboard: true,
  servers: true,
  shop: true,
  earn: true,
  gamification: true,
  technical: true,
}

const pageInfo: Record<string, { title: string; description: string; progress: number }> = {
  "advanced-features": {
    title: "Advanced Features",
    description: "Exploring cutting-edge capabilities and power-user features. This comprehensive guide is being developed.",
    progress: 45
  },
  "integrations": {
    title: "Third-Party Integrations",
    description: "Connect with Discord, Stripe, and other services. Integration documentation coming soon.",
    progress: 30
  },
  "analytics": {
    title: "Analytics Dashboard",
    description: "Deep insights into your server performance and user behavior. Analytics showcase in development.",
    progress: 55
  },
  "custom-domains": {
    title: "Custom Domains",
    description: "Set up your own branded domain for the dashboard. Documentation being prepared.",
    progress: 40
  }
}

export default async function ShowcasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // If the page exists in our showcase pages, this route shouldn't render
  // (the actual page will render instead)
  if ((showcasePages as any)[slug]) {
    return null
  }

  // Get page info or use defaults
  const info = pageInfo[slug] || {
    title: "Showcase Page",
    description: "This amazing feature showcase is currently under development. Stay tuned for updates!",
    progress: 50
  }

  return <ComingSoon {...info} />
}

export function generateStaticParams() {
  return [
    { slug: "advanced-features" },
    { slug: "integrations" },
    { slug: "analytics" },
    { slug: "custom-domains" }
  ]
}

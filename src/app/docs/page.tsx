"use client"

import { DocsHero } from "@/components/docs/docs-hero"
import { DocsFeatures } from "@/components/docs/docs-features"
import { DocsRoutes } from "@/components/docs/docs-routes"
import { DocsPreview } from "@/components/docs/docs-preview"
import { DocsPricing } from "@/components/docs/docs-pricing"
import { DocsFooter } from "@/components/docs/docs-footer"

export default function DocsPage() {
  return (
    <div className="relative bg-black">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div id="hero">
          <DocsHero />
        </div>
        <div id="features" className="border-t border-white/5">
          <DocsFeatures />
        </div>
        <div id="routes" className="border-t border-white/5">
          <DocsRoutes />
        </div>
        <div id="preview" className="border-t border-white/5">
          <DocsPreview />
        </div>
        <div id="pricing" className="border-t border-white/5">
          <DocsPricing />
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-white/5">
        <DocsFooter />
      </div>
    </div>
  )
}

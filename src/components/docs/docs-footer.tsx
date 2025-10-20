"use client"

import { IconBrandDiscord, IconBrandGithub, IconBrandTwitter, IconMail, IconHeart } from "@tabler/icons-react"
import Link from "next/link"

export function DocsFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Servers", href: "/servers" },
      { label: "Shop", href: "/shop/coins" },
      { label: "Earn Coins", href: "/earn/afk" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "#routes" },
      { label: "Leaderboards", href: "/leaderboard/coins" },
      { label: "Support", href: "https://discord.gg/mBP9bejg" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "#pricing" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  }

  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <img 
                  src="https://i.postimg.cc/CKdJdbfB/19b2c766c17a246f80df6be88559acd5.png" 
                  alt="LustNode Logo" 
                  className="size-8 object-contain"
                />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                LustNode
              </span>
            </div>
            
            <p className="text-gray-400 max-w-md">
              Professional game server hosting platform with powerful features, real-time monitoring, 
              and comprehensive control panel. Start for free today.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://discord.gg/mBP9bejg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all"
              >
                <IconBrandDiscord className="size-5" />
              </a>
              <a 
                href="#" 
                className="flex size-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <IconBrandGithub className="size-5" />
              </a>
              <a 
                href="#" 
                className="flex size-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <IconBrandTwitter className="size-5" />
              </a>
              <a 
                href="mailto:support@lustnode.com" 
                className="flex size-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <IconMail className="size-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} LustNode. All rights reserved. Built with{" "}
              <IconHeart className="inline size-4 text-red-500 fill-red-500" />{" "}
              for gamers.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

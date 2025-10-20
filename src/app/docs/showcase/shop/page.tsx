"use client"

import { motion } from "framer-motion"
import { IconCoin, IconShoppingCart, IconSettings, IconCheck, IconArrowRight, IconShield } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComponentFlow, NeonPointer } from "@/components/showcase/geometric-connector"

export default function ShopShowcase() {
  const coinPackages = [
    { coins: 100, price: 99, bonus: 0, popular: false },
    { coins: 500, price: 499, bonus: 50, popular: true },
    { coins: 1000, price: 999, bonus: 150, popular: false },
    { coins: 2500, price: 1999, bonus: 500, popular: false },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
              Monetization System
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Flexible Pricing Model
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Affordable coin packages and pay-as-you-grow resource upgrades
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coin Packages */}
      <section id="coins" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Coin Packages">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Affordable Bundles</h2>
                <p className="text-gray-500">Purchase coins to upgrade servers and unlock features</p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 relative">
                {coinPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.coins}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className={`border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all ${
                      pkg.popular ? 'ring-2 ring-primary/50' : ''
                    }`}>
                      {pkg.popular && (
                        <>
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge className="bg-primary text-white border-primary/50">POPULAR</Badge>
                          </div>
                          <NeonPointer targetId={`pkg-${index}`} delay={0.5} />
                        </>
                      )}
                      
                      <div className="text-center space-y-4">
                        <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                          <IconCoin className="size-8 text-primary" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{pkg.coins} Coins</div>
                          {pkg.bonus > 0 && (
                            <div className="text-sm text-green-400">+{pkg.bonus} Bonus</div>
                          )}
                        </div>
                        <div className="text-3xl font-bold text-primary">₹{pkg.price}</div>
                        <button className={`w-full py-2 rounded-lg font-semibold transition-all ${
                          pkg.popular 
                            ? 'bg-white text-black hover:bg-gray-100' 
                            : 'border border-white/10 hover:bg-white/5'
                        }`}>
                          Purchase
                        </button>
                      </div>
                    </Card>

                    {/* Connection Arrow */}
                    {index < coinPackages.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-primary/30 text-xl"
                      >
                        →
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* Resource Upgrades */}
      <section id="upgrades" className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Pay-As-You-Grow Model">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Resource Upgrades</h2>
                <p className="text-gray-500">Scale your server resources using coins</p>
              </div>

              {/* Flow Diagram */}
              <div className="relative">
                {/* Central Coin Store */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="size-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 flex items-center justify-center backdrop-blur-xl">
                    <IconCoin className="size-12 text-amber-400" />
                  </div>
                </motion.div>

                {/* Upgrade Options */}
                <div className="grid md:grid-cols-2 gap-8 pt-32 pb-32">
                  {[
                    { title: "RAM +2GB", cost: 50, icon: "💾", benefit: "More players, better performance" },
                    { title: "Storage +10GB", cost: 30, icon: "📦", benefit: "More mods and worlds" },
                    { title: "CPU Priority", cost: 100, icon: "⚡", benefit: "Reduced lag, better TPS" },
                    { title: "Server Slot +1", cost: 75, icon: "🖥️", benefit: "Create more servers" }
                  ].map((upgrade, index) => (
                    <motion.div
                      key={upgrade.title}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 }}
                    >
                      <Card className="border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all relative group">
                        {/* Connection Line to Center */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                          <motion.line
                            x1="50%"
                            y1="50%"
                            x2="50%"
                            y2={index < 2 ? "100%" : "0%"}
                            stroke="rgb(251, 191, 36)"
                            strokeWidth="1"
                            strokeOpacity="0.2"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
                          />
                        </svg>

                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{upgrade.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">{upgrade.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{upgrade.benefit}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-amber-400 font-bold">
                                <IconCoin className="size-4" />
                                <span>{upgrade.cost}</span>
                              </div>
                              <button className="px-4 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm transition-all">
                                Upgrade
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* Admin Controls */}
      <section id="admin" className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <ComponentFlow title="Complete Customization">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Admin Controls</h2>
                <p className="text-gray-500">Full control over your shop configuration</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Create Packages", desc: "Add custom coin bundles", icon: IconShoppingCart },
                  { title: "Set Pricing", desc: "Configure all prices", icon: IconCoin },
                  { title: "Manage Items", desc: "Edit or remove anytime", icon: IconSettings }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-white/5 bg-white/[0.02] p-6">
                      <feature.icon className="size-10 text-primary mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                      <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                        <IconCheck className="size-4" />
                        <span>Full Access</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-purple-500/10 p-6">
                  <div className="flex items-start gap-4">
                    <IconShield className="size-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Secure Payment Integration</h3>
                      <p className="text-sm text-gray-400">
                        Ready for Razorpay/Stripe integration. All transactions encrypted and secure.
                        Full audit trail for every purchase.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </ComponentFlow>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Monetizing Your Platform</h2>
          <p className="text-gray-500 mb-8">Flexible pricing that grows with your business</p>
          <div className="flex items-center justify-center gap-4">
            <a href="/docs#pricing">
              <button className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all">
                View Full Pricing
                <IconArrowRight className="size-4" />
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

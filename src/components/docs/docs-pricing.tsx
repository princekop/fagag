"use client"

import { motion } from "framer-motion"
import { IconCheck, IconStar, IconBrandDiscord, IconCode, IconRocket } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Full Hosted",
    price: "₹499",
    period: "Monthly",
    description: "Complete hosted solution - we manage everything for you",
    icon: IconRocket,
    color: "from-blue-500 to-cyan-500",
    popular: false,
    features: [
      "Fully managed hosting",
      "24/7 server uptime",
      "Automatic updates",
      "DDoS protection",
      "Daily backups",
      "Priority support",
      "All features included",
      "Unlimited coins earning",
    ]
  },
  {
    name: "Full Source Code",
    price: "₹4,999",
    period: "One-time",
    description: "Get the complete codebase and deploy anywhere you want",
    icon: IconCode,
    color: "from-primary to-purple-500",
    popular: true,
    features: [
      "Complete source code",
      "Full ownership",
      "Self-hosting ready",
      "Documentation included",
      "Future updates (6 months)",
      "Setup assistance",
      "Customization allowed",
      "No recurring fees",
    ]
  },
  {
    name: "Custom Development",
    price: "Custom",
    period: "Contact Us",
    description: "Need something specific? We build tailored solutions",
    icon: IconStar,
    color: "from-amber-500 to-orange-500",
    popular: false,
    features: [
      "Tailored to your needs",
      "Custom features",
      "Integration support",
      "Dedicated developer",
      "Flexible pricing",
      "Long-term support",
      "White-label option",
      "Full consultation",
    ]
  },
]

export function DocsPricing() {
  return (
    <section id="pricing" className="py-16 lg:py-20 relative">
      <div className="relative">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Simple Pricing
          </motion.h2>
          <motion.p
            className="text-gray-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Choose the plan that fits your needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className={`group relative overflow-hidden border-white/10 bg-white/5 p-8 h-full hover:border-white/20 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-primary/50' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-500 px-4 py-1 rounded-bl-xl">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <IconStar className="size-3" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative space-y-6">
                    {/* Icon */}
                    <div className={`inline-flex size-16 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} p-0.5`}>
                      <div className="flex size-full items-center justify-center rounded-xl bg-black">
                        <Icon className="size-8 text-white" />
                      </div>
                    </div>

                    {/* Plan Details */}
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="py-4 border-y border-white/10">
                      <div className="flex items-end gap-2">
                        <span className={`text-5xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        {plan.period !== "Contact Us" && (
                          <span className="text-gray-400 mb-2">/ {plan.period}</span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <IconCheck className={`size-5 flex-shrink-0 mt-0.5 bg-gradient-to-br ${plan.color} bg-clip-text text-transparent`} />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <div className="pt-6">
                      {plan.period === "Contact Us" ? (
                        <a href="https://discord.gg/mBP9bejg" target="_blank" rel="noopener noreferrer">
                          <Button className={`w-full bg-gradient-to-r ${plan.color} text-white font-bold shadow-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300`}>
                            <IconBrandDiscord className="mr-2 size-5" />
                            Join Discord
                          </Button>
                        </a>
                      ) : (
                        <Button 
                          className={`w-full ${
                            plan.popular 
                              ? `bg-gradient-to-r ${plan.color} text-white` 
                              : 'bg-white/10 text-white hover:bg-white/20'
                          } font-bold shadow-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300`}
                        >
                          {plan.period === "Monthly" ? "Start Hosting" : "Get Source Code"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Custom Development CTA */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl" />
            
            <div className="relative text-center space-y-4">
              <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary/20 mb-4">
                <IconBrandDiscord className="size-8 text-primary" />
              </div>
              
              <h3 className="text-3xl font-black text-white">Need Custom Development?</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Join our Discord community to discuss your custom requirements. We offer tailored solutions, 
                integrations, and white-label options for your specific needs.
              </p>
              
              <div className="pt-4">
                <a href="https://discord.gg/mBP9bejg" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-primary to-purple-500 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-primary/50 hover:shadow-2xl hover:shadow-primary/70 transition-all duration-300">
                    <IconBrandDiscord className="mr-2 size-6" />
                    Join Discord Community
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { IconCoin, IconClock, IconGift, IconShoppingCart, IconCheck } from "@tabler/icons-react"

export default function CoinsDocsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
          <IconCoin className="size-4" />
          Core Concept
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Coins System
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Learn how to earn, spend, and manage coins on Sjnodes to enhance your server hosting experience.
        </p>
      </div>

      {/* What are Coins */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">What are Coins?</h2>
        <Card className="border-white/10 bg-white/5 p-6">
          <p className="text-gray-300 leading-relaxed">
            Coins are the virtual currency used on Sjnodes. You can earn coins for free through various activities or purchase them to instantly upgrade your servers. Coins allow you to unlock premium features, increase server resources, and get more server slots.
          </p>
        </Card>
      </div>

      {/* How to Earn Coins */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">How to Earn Coins</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AFK System */}
          <Card className="border-white/10 bg-gradient-to-br from-green-500/10 to-transparent p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/20">
                <IconClock className="size-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">AFK System</h3>
            </div>
            <p className="text-gray-300">
              Earn coins automatically while you're online! Simply visit the AFK page and start earning. The longer you stay, the more you earn.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <IconCheck className="size-4 text-green-400" />
                <span>Earn 1-5 coins per minute</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <IconCheck className="size-4 text-green-400" />
                <span>No effort required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <IconCheck className="size-4 text-green-400" />
                <span>Available 24/7</span>
              </div>
            </div>
          </Card>

          {/* Join4Reward */}
          <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/20">
                <IconGift className="size-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Join4Reward</h3>
            </div>
            <p className="text-gray-300">
              Complete simple tasks like joining Discord servers, following social media, or visiting websites to earn instant coin rewards.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <IconCheck className="size-4 text-purple-400" />
                <span>Earn 10-100 coins per task</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <IconCheck className="size-4 text-purple-400" />
                <span>New tasks daily</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <IconCheck className="size-4 text-purple-400" />
                <span>Instant verification</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Purchase Coins */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20">
              <IconShoppingCart className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white">Purchase Coins</h3>
          </div>
          <p className="text-gray-300">
            Need coins fast? Purchase them directly to instantly boost your balance. We offer various packages with bonus coins on larger purchases.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-white">100 Coins</div>
              <div className="text-primary font-semibold">₹99</div>
            </div>
            <div className="rounded-lg bg-white/5 border border-primary/30 p-4 text-center ring-2 ring-primary/20">
              <div className="text-xs text-primary font-bold mb-1">POPULAR</div>
              <div className="text-2xl font-bold text-white">500 Coins</div>
              <div className="text-primary font-semibold">₹499</div>
              <div className="text-xs text-green-400">+50 Bonus</div>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-white">1000 Coins</div>
              <div className="text-primary font-semibold">₹999</div>
              <div className="text-xs text-green-400">+150 Bonus</div>
            </div>
          </div>
        </Card>
      </div>

      {/* How to Spend Coins */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">How to Spend Coins</h2>
        
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Server Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <IconCheck className="size-5 text-primary mt-0.5" />
                  <span><strong>RAM:</strong> 50 coins for +2GB</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="size-5 text-primary mt-0.5" />
                  <span><strong>Storage:</strong> 30 coins for +10GB</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="size-5 text-primary mt-0.5" />
                  <span><strong>CPU Priority:</strong> 100 coins</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Additional Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <IconCheck className="size-5 text-primary mt-0.5" />
                  <span><strong>Server Slot:</strong> 75 coins for +1 slot</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="size-5 text-primary mt-0.5" />
                  <span><strong>Priority Support:</strong> Access faster support</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="size-5 text-primary mt-0.5" />
                  <span><strong>Premium Plugins:</strong> Unlock exclusive mods</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <Card className="border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">💡 Pro Tips</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• Keep the AFK page open while you work or study to earn passive coins</li>
          <li>• Check Join4Reward daily for new high-value tasks</li>
          <li>• Larger coin packages offer better value with bonus coins</li>
          <li>• Participate in monthly leaderboards to win bonus coins</li>
          <li>• Refer friends to earn coins when they sign up</li>
        </ul>
      </Card>
    </div>
  )
}

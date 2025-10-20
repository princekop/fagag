"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCpu, IconDatabase, IconServer, IconCheck, IconCoin } from "@tabler/icons-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { broadcastProfileUpdated } from "@/lib/profile-events"

export default function BuySpecsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status])

  const specPackages = [
    {
      id: 1,
      name: "RAM Boost",
      description: "+2 GB RAM",
      icon: IconDatabase,
      cost: 50,
      features: ["Increase to 6 GB total", "Better performance", "Handle more players"],
    },
    {
      id: 2,
      name: "Storage Expansion",
      description: "+10 GB Storage",
      icon: IconServer,
      cost: 30,
      features: ["Increase to 20 GB total", "More world data", "Install more mods"],
    },
    {
      id: 3,
      name: "CPU Priority",
      description: "Dedicated CPU",
      icon: IconCpu,
      cost: 100,
      features: ["Priority processing", "Reduced lag", "Better TPS"],
    },
    {
      id: 4,
      name: "Server Slot",
      description: "+1 Server Slot",
      icon: IconServer,
      cost: 75,
      features: ["Create more servers", "Manage multiple games", "Test configurations"],
    },
  ]

  const handlePurchase = async (id: number) => {
    // Map item id to upgrade type and cost
    let type = ""
    let cost = 0
    switch (id) {
      case 1:
        type = "ram"; cost = 50; break
      case 2:
        type = "disk"; cost = 30; break
      case 3:
        type = "cpu"; cost = 100; break
      case 4:
        type = "server_slot"; cost = 75; break
      default:
        return
    }

    try {
      setPurchasingId(String(id))
      const res = await fetch("/api/coins/spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, cost })
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Purchased successfully! New balance: ${data.newBalance} coins`)
        broadcastProfileUpdated()
      } else {
        alert(data.error || "Purchase failed")
      }
    } catch (e) {
      console.error("Purchase error", e)
      alert("Purchase failed")
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Buy Server Specs</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Upgrade your server resources using coins
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <IconCoin className="size-5 text-primary" />
            <span className="font-semibold">Your Balance: 0 Coins</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {specPackages.map((spec) => (
            <Card key={spec.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
                    <spec.icon className="size-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center mt-4">{spec.name}</CardTitle>
                <CardDescription className="text-center">{spec.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  {spec.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <IconCheck className="size-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <IconCoin className="size-5 text-primary" />
                  <span className="text-2xl font-bold">{spec.cost}</span>
                  <span className="text-muted-foreground">Coins</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handlePurchase(spec.id)} disabled={purchasingId === String(spec.id)}>
                  {purchasingId === String(spec.id) ? "Processing..." : "Purchase"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Simple upgrade process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold">Choose Your Upgrade</p>
                  <p className="text-muted-foreground text-sm">Select the spec you want to add to your account</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold">Pay with Coins</p>
                  <p className="text-muted-foreground text-sm">Use your coin balance to purchase</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold">Instant Activation</p>
                  <p className="text-muted-foreground text-sm">Specs are added immediately to your account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader>
              <CardTitle>Need Coins?</CardTitle>
              <CardDescription>Get coins to purchase these upgrades</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                You can buy coins directly or earn them for free through our AFK system, completing tasks, and more!
              </p>
              <div className="flex gap-2">
                <Button className="flex-1">Buy Coins</Button>
                <Button variant="outline" className="flex-1">Earn Free</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

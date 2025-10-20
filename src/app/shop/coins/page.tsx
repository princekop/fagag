"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCoin, IconCheck, IconStar, IconLoader2 } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { useUserProfile } from "@/lib/profile-events"
import { Skeleton } from "@/components/ui/skeleton"

interface CoinPackage {
  id: string
  name: string
  description: string
  value: number
  price: number
  isActive: boolean
  bonus?: number
  popular?: boolean
}

export default function BuyCoinsPage() {
  const { data: session, status } = useSession()
  const { profile } = useUserProfile()
  const [packages, setPackages] = useState<CoinPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status])

  useEffect(() => {
    fetchPackages()
    // Real-time updates every 10 seconds
    const interval = setInterval(fetchPackages, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/shop/coins")
      if (res.ok) {
        const data = await res.json()
        setPackages(data.filter((p: CoinPackage) => p.isActive))
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (pkg: CoinPackage) => {
    setPurchasing(pkg.id)
    try {
      // Simulate payment process
      const res = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: pkg.id, type: "coin_package" })
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Purchase successful! You now have ${data.newBalance} coins!`)
        // Refresh user data
        window.location.reload()
      } else {
        alert(data.error || "Purchase failed")
      }
    } catch (error) {
      console.error("Purchase error:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setPurchasing(null)
    }
  }

  if (status === "loading" || loading) {
    return <DashboardLayout><CoinPackagesSkeletons /></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Buy Coins</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Purchase coins to upgrade your servers and unlock premium features
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 ring-2 ring-primary/20 shadow-lg">
            <IconCoin className="size-6 text-primary" />
            <span className="font-bold text-lg">Your Balance: {profile?.coins ?? 0} Coins</span>
          </div>
        </div>

        {packages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <IconCoin className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No coin packages available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => {
              const totalCoins = pkg.value + (pkg.bonus || 0)
              const popular = pkg.popular || pkg.value === 500
              return (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden transition-all hover:shadow-lg hover:scale-105 ${
                    popular ? "border-primary/50 shadow-md scale-[1.02]" : ""
                  }`}
                >
                  {popular && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-r from-primary to-purple-500 px-3 py-1.5">
                      <div className="flex items-center gap-1 text-xs font-bold text-white">
                        <IconStar className="size-3" />
                        POPULAR
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-center">
                      <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 ring-2 ring-primary/30">
                        <IconCoin className="size-10 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-2xl mt-4">{pkg.name}</CardTitle>
                    {(pkg.bonus || 0) > 0 && (
                      <Badge className="mx-auto bg-green-500/10 text-green-600 ring-1 ring-green-500/20">
                        +{pkg.bonus} Bonus Coins
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">₹{pkg.price}</div>
                    <p className="text-muted-foreground text-sm">
                      Total: <span className="font-semibold text-foreground">{totalCoins} Coins</span>
                    </p>
                    {pkg.description && (
                      <p className="text-xs text-muted-foreground">{pkg.description}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full shadow-md" 
                      variant={popular ? "default" : "outline"}
                      onClick={() => handlePurchase(pkg)}
                      disabled={purchasing !== null}
                    >
                      {purchasing === pkg.id ? (
                        <>
                          <IconLoader2 className="mr-2 size-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Purchase Now"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>What can you do with coins?</CardTitle>
              <CardDescription>Unlock premium features and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <IconCheck className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Upgrade Server Resources</p>
                    <p className="text-muted-foreground text-sm">Add more RAM, CPU, and storage to your servers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <IconCheck className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Create More Servers</p>
                    <p className="text-muted-foreground text-sm">Increase your server slot limit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <IconCheck className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Premium Features</p>
                    <p className="text-muted-foreground text-sm">Access advanced server configurations and mods</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <IconCheck className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Priority Support</p>
                    <p className="text-muted-foreground text-sm">Get faster response times from our team</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function CoinPackagesSkeletons() {
  return (
    <div className="px-4 lg:px-6 space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <Skeleton className="h-12 w-48 mx-auto rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-4">
              <Skeleton className="size-20 rounded-full mx-auto" />
              <Skeleton className="h-8 w-32 mx-auto mt-4" />
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <Skeleton className="h-10 w-24 mx-auto" />
              <Skeleton className="h-4 w-36 mx-auto" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

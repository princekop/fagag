import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId, type } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const item = await prisma.shopItem.findUnique({
      where: { id: itemId }
    })

    if (!item || !item.isActive) {
      return NextResponse.json({ error: "Item not available" }, { status: 404 })
    }

    // For coin packages, this would integrate with payment gateway
    // For now, simulating the purchase
    if (type === "coin_package") {
      // In production, you would:
      // 1. Create a payment session with Razorpay/Stripe
      // 2. Return payment URL
      // 3. Handle webhook for payment confirmation
      // 4. Credit coins after successful payment
      
      // For demo purposes, simulating immediate credit
      const newBalance = user.coins + item.value
      
      await prisma.user.update({
        where: { id: user.id },
        data: { coins: newBalance }
      })

      // Log transaction
      await prisma.coinTransaction.create({
        data: {
          userId: user.id,
          type: "purchase",
          description: `Purchased ${item.name}`,
          amount: item.value
        }
      })

      return NextResponse.json({ 
        success: true, 
        newBalance,
        message: "Purchase successful!"
      })
    }

    return NextResponse.json({ error: "Invalid purchase type" }, { status: 400 })
  } catch (error) {
    console.error("Purchase error:", error)
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 })
  }
}

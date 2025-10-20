import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST earn coins from various sources
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { type, amount, description } = body

    // Create transaction and update user coins
    const [transaction, updatedUser] = await prisma.$transaction([
      prisma.coinTransaction.create({
        data: {
          userId: user.id,
          amount,
          type,
          description,
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          coins: { increment: amount }
        }
      })
    ])

    return NextResponse.json({
      transaction,
      newBalance: updatedUser.coins
    })
  } catch (error) {
    console.error("Error earning coins:", error)
    return NextResponse.json({ error: "Failed to earn coins" }, { status: 500 })
  }
}

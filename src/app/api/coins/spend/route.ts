import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST spend coins on upgrades
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
    const { type, cost } = body

    // Check if user has enough coins
    if (user.coins < cost) {
      return NextResponse.json({ error: "Insufficient coins" }, { status: 400 })
    }

    let updateData: any = {
      coins: { decrement: cost }
    }

    let description = ""

    // Apply upgrade based on type (support legacy names)
    switch (type) {
      case "ram":
      case "ram_boost":
        updateData.ram = { increment: 2 }
        description = "RAM +2 GB"
        break
      case "disk":
      case "storage_boost":
        updateData.disk = { increment: 10 }
        description = "Disk +10 GB"
        break
      case "cpu":
      case "cpu_priority":
        updateData.cpu = { increment: 100 } // +100% = +1 core unit
        description = "CPU +100%"
        break
      case "server_slot":
        updateData.serverSlots = { increment: 1 }
        description = "Server Slot +1"
        break
      default:
        return NextResponse.json({ error: "Invalid upgrade type" }, { status: 400 })
    }

    const [transaction, updatedUser] = await prisma.$transaction([
      prisma.coinTransaction.create({
        data: {
          userId: user.id,
          amount: -cost,
          type: "upgrade",
          description,
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: updateData
      })
    ])

    return NextResponse.json({
      transaction,
      newBalance: updatedUser.coins,
      user: updatedUser
    })
  } catch (error) {
    console.error("Error spending coins:", error)
    return NextResponse.json({ error: "Failed to spend coins" }, { status: 500 })
  }
}

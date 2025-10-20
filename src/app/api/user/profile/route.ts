import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET user profile with stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        servers: true,
        coinTransactions: {
          orderBy: { createdAt: "desc" },
          take: 10
        },
        afkSessions: {
          where: { isActive: true }
        },
        taskCompletions: true,
        _count: {
          select: {
            servers: true,
            coinTransactions: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate stats
    const totalCoinsEarned = await prisma.coinTransaction.aggregate({
      where: {
        userId: user.id,
        amount: { gt: 0 }
      },
      _sum: {
        amount: true
      }
    })

    const totalCoinsSpent = await prisma.coinTransaction.aggregate({
      where: {
        userId: user.id,
        amount: { lt: 0 }
      },
      _sum: {
        amount: true
      }
    })

    const totalAfkTime = await prisma.afkSession.aggregate({
      where: { userId: user.id },
      _sum: {
        duration: true,
        coinsEarned: true
      }
    })

    return NextResponse.json({
      ...user,
      stats: {
        totalCoinsEarned: totalCoinsEarned._sum.amount || 0,
        totalCoinsSpent: Math.abs(totalCoinsSpent._sum.amount || 0),
        totalAfkMinutes: totalAfkTime._sum.duration || 0,
        totalAfkCoins: totalAfkTime._sum.coinsEarned || 0,
      }
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST verify AFK session and award coins
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        afkSessions: {
          where: { isActive: true },
          orderBy: { startTime: "desc" },
          take: 1,
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const activeSession = user.afkSessions[0]
    if (!activeSession) {
      return NextResponse.json({ error: "No active AFK session" }, { status: 400 })
    }

    const body = await request.json()
    const { secondsElapsed } = body

    // Security: Verify time is reasonable (max 65 seconds per minute to account for slight delays)
    if (secondsElapsed < 55 || secondsElapsed > 65) {
      return NextResponse.json({ error: "Invalid verification time" }, { status: 400 })
    }

    // Award 2 coins per minute verified
    const minutesVerified = 1
    const coinsToAward = 2

    // Update session
    const now = new Date()
    const durationMinutes = Math.floor((now.getTime() - activeSession.startTime.getTime()) / 1000 / 60)

    await prisma.afkSession.update({
      where: { id: activeSession.id },
      data: {
        duration: durationMinutes,
        coinsEarned: activeSession.coinsEarned + coinsToAward,
      }
    })

    // Award coins to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { increment: coinsToAward }
      }
    })

    // Create transaction record
    await prisma.coinTransaction.create({
      data: {
        userId: user.id,
        amount: coinsToAward,
        type: "afk",
        description: `AFK reward - ${minutesVerified} minute(s)`,
      }
    })

    return NextResponse.json({
      success: true,
      coinsAwarded: coinsToAward,
      totalCoins: user.coins + coinsToAward,
      totalSessionCoins: activeSession.coinsEarned + coinsToAward,
    })
  } catch (error) {
    console.error("Error verifying AFK:", error)
    return NextResponse.json({ error: "Failed to verify AFK" }, { status: 500 })
  }
}

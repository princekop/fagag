import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST stop AFK session
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        afkSessions: {
          where: { isActive: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.afkSessions.length === 0) {
      return NextResponse.json({ error: "No active AFK session" }, { status: 400 })
    }

    const activeSession = user.afkSessions[0]
    const now = new Date()
    const duration = Math.floor((now.getTime() - activeSession.startTime.getTime()) / 1000 / 60) // minutes

    // Calculate coins earned based on duration
    let coinsPerMinute = 1
    if (duration >= 30) coinsPerMinute = 3
    else if (duration >= 10) coinsPerMinute = 2

    const coinsEarned = Math.floor(duration * coinsPerMinute)

    // Update session and user
    const [updatedSession, , updatedUser] = await prisma.$transaction([
      prisma.afkSession.update({
        where: { id: activeSession.id },
        data: {
          endTime: now,
          duration,
          coinsEarned,
          isActive: false
        }
      }),
      prisma.coinTransaction.create({
        data: {
          userId: user.id,
          amount: coinsEarned,
          type: "afk",
          description: `AFK for ${duration} minutes`
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          coins: { increment: coinsEarned }
        }
      })
    ])

    return NextResponse.json({
      session: updatedSession,
      coinsEarned,
      newBalance: updatedUser.coins
    })
  } catch (error) {
    console.error("Error stopping AFK session:", error)
    return NextResponse.json({ error: "Failed to stop AFK session" }, { status: 500 })
  }
}

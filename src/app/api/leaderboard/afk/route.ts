import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET AFK leaderboard
export async function GET() {
  try {
    const afkStats = await prisma.afkSession.groupBy({
      by: ["userId"],
      _sum: {
        duration: true,
        coinsEarned: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          duration: "desc"
        }
      },
      take: 100
    })

    // Get user details
    const userIds = afkStats.map(stat => stat.userId)
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    const userMap = new Map(users.map(u => [u.id, u]))

    const leaderboard = afkStats.map(stat => ({
      user: userMap.get(stat.userId),
      totalMinutes: stat._sum.duration || 0,
      totalCoins: stat._sum.coinsEarned || 0,
      sessions: stat._count.id
    }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Error fetching AFK leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}

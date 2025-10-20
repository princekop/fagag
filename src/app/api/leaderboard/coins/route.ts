import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET coins leaderboard
export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      where: {
        coins: { gt: 0 }
      },
      select: {
        id: true,
        name: true,
        email: true,
        coins: true,
      },
      orderBy: {
        coins: "desc"
      },
      take: 100
    })

    return NextResponse.json(topUsers)
  } catch (error) {
    console.error("Error fetching coins leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}

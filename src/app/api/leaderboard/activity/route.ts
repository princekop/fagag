import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { type: "activity" },
      orderBy: { score: "desc" },
      take: 10
    })

    const formattedEntries = entries.map((entry: any, index: number) => ({
      rank: index + 1,
      username: entry.username,
      score: entry.score,
      servers: entry.servers,
      uptime: entry.uptime || "0%",
      tasks: entry.tasks,
      avatar: entry.avatar || "🎮"
    }))

    return NextResponse.json(formattedEntries)
  } catch (error) {
    console.error("Error fetching activity leaderboard:", error)
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}

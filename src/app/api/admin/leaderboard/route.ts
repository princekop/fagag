import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all leaderboard entries
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"

    const entries = await prisma.leaderboardEntry.findMany({
      where: type !== "all" ? { type } : undefined,
      orderBy: [{ type: "asc" }, { score: "desc" }]
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error fetching leaderboard entries:", error)
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    )
  }
}

// POST - Create new leaderboard entry
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, userId, username, avatar, score, servers, uptime, tasks } = body

    if (!type || !userId || !username || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const entry = await prisma.leaderboardEntry.upsert({
      where: {
        type_userId: {
          type,
          userId
        }
      },
      update: {
        username,
        avatar,
        score: parseInt(score),
        servers: servers !== undefined ? parseInt(servers) : 0,
        uptime,
        tasks: tasks !== undefined ? parseInt(tasks) : 0
      },
      create: {
        type,
        userId,
        username,
        avatar,
        score: parseInt(score),
        servers: servers !== undefined ? parseInt(servers) : 0,
        uptime,
        tasks: tasks !== undefined ? parseInt(tasks) : 0
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error creating leaderboard entry:", error)
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    )
  }
}

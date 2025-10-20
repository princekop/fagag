import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
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

    // Fetch recent coin transactions (last 10)
    const transactions = await prisma.coinTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    // Fetch recent AFK sessions (last 5 completed)
    const afkSessions = await prisma.afkSession.findMany({
      where: { userId: user.id, isActive: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Combine and sort by createdAt
    const activities = [
      ...transactions.map((t) => ({
        type: "transaction" as const,
        description: t.description,
        amount: t.amount,
        createdAt: t.createdAt,
      })),
      ...afkSessions.map((a) => ({
        type: "afk" as const,
        description: `AFK session ended - ${a.duration} min`,
        amount: a.coinsEarned,
        createdAt: a.createdAt,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10)

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}

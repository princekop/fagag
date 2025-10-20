import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST start AFK session
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

    // Check if already has active session
    if (user.afkSessions.length > 0) {
      return NextResponse.json({ error: "AFK session already active" }, { status: 400 })
    }

    const afkSession = await prisma.afkSession.create({
      data: {
        userId: user.id,
      }
    })

    return NextResponse.json(afkSession)
  } catch (error) {
    console.error("Error starting AFK session:", error)
    return NextResponse.json({ error: "Failed to start AFK session" }, { status: 500 })
  }
}

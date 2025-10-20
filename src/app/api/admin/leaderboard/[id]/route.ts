import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Update leaderboard entry
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { username, avatar, score, servers, uptime, tasks } = body

    const entry = await prisma.leaderboardEntry.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(avatar !== undefined && { avatar }),
        ...(score !== undefined && { score: parseInt(score) }),
        ...(servers !== undefined && { servers: parseInt(servers) }),
        ...(uptime !== undefined && { uptime }),
        ...(tasks !== undefined && { tasks: parseInt(tasks) })
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error updating leaderboard entry:", error)
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    )
  }
}

// DELETE - Delete leaderboard entry
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.leaderboardEntry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting leaderboard entry:", error)
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { powerActionByServerId } from "@/lib/pterodactyl"

// DELETE server
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
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

    const { id } = await ctx.params
    const server = await prisma.server.findUnique({
      where: { id },
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // Check ownership or admin
    if (server.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Free up node resources
    if (server.nodeId) {
      await prisma.node.update({
        where: { id: server.nodeId },
        data: {
          usedRam: { decrement: server.ram },
          usedDisk: { decrement: server.disk },
          usedCpu: { decrement: server.cpu },
        }
      })
    }

    await prisma.server.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Server deleted successfully" })
  } catch (error) {
    console.error("Error deleting server:", error)
    return NextResponse.json({ error: "Failed to delete server" }, { status: 500 })
  }
}

// PATCH update server status
export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
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

    const { id } = await ctx.params
    const server = await prisma.server.findUnique({
      where: { id },
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    if (server.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    // Attempt to mirror status change to Pterodactyl if linked
    try {
      let signal: "start" | "stop" | "restart" | "kill" | undefined
      if (status === "online" || status === "start") signal = "start"
      else if (status === "offline" || status === "stop") signal = "stop"
      else if (status === "restart") signal = "restart"
      if (signal && server.pteroId) {
        const ok = await powerActionByServerId(Number(server.pteroId), signal)
        if (!ok) console.warn("Pterodactyl power action failed for server", server.id)
      }
    } catch (e) {
      console.warn("Pterodactyl action skipped:", (e as Error)?.message)
    }

    const updatedServer = await prisma.server.update({
      where: { id },
      data: { status },
      include: {
        node: {
          include: {
            location: true
          }
        }
      }
    })

    return NextResponse.json(updatedServer)
  } catch (error) {
    console.error("Error updating server:", error)
    return NextResponse.json({ error: "Failed to update server" }, { status: 500 })
  }
}

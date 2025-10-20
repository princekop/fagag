import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all nodes
export async function GET() {
  try {
    const nodes = await prisma.node.findMany({
      include: {
        location: true,
        _count: {
          select: { servers: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(nodes)
  } catch (error) {
    console.error("Error fetching nodes:", error)
    return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 })
  }
}

// POST create node (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, locationId, ip, ram, cpu, disk } = body

    const node = await prisma.node.create({
      data: {
        name,
        locationId,
        ip,
        ram: parseInt(ram),
        cpu: parseInt(cpu),
        disk: parseInt(disk)
      },
      include: {
        location: true
      }
    })

    return NextResponse.json(node, { status: 201 })
  } catch (error) {
    console.error("Error creating node:", error)
    return NextResponse.json({ error: "Failed to create node" }, { status: 500 })
  }
}

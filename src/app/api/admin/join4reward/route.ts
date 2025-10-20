import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all join4reward tasks
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tasks = await prisma.join4RewardTask.findMany({
      orderBy: { sortOrder: "asc" }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching join4reward tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

// POST - Create new join4reward task
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { platform, description, reward, link, actionLabel, icon, color, isActive, sortOrder } = body

    if (!platform || !description || !reward || !link || !actionLabel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const task = await prisma.join4RewardTask.create({
      data: {
        platform,
        description,
        reward: parseInt(reward),
        link,
        actionLabel,
        icon: icon || "IconGift",
        color: color || "from-primary/20 to-transparent",
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error creating join4reward task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}

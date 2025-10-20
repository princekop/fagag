import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST - Complete a join4reward task
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { taskId } = body

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      )
    }

    // Get the task
    const task = await prisma.join4RewardTask.findUnique({
      where: { id: taskId }
    })

    if (!task || !task.isActive) {
      return NextResponse.json(
        { error: "Task not found or inactive" },
        { status: 404 }
      )
    }

    // Check if already completed
    const existing = await prisma.taskCompletion.findUnique({
      where: {
        userId_taskType: {
          userId: session.user.id,
          taskType: task.platform.toLowerCase()
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Task already completed" },
        { status: 400 }
      )
    }

    // Create completion record and update user coins in a transaction
    const result = await prisma.$transaction([
      prisma.taskCompletion.create({
        data: {
          userId: session.user.id,
          taskType: task.platform.toLowerCase(),
          reward: task.reward
        }
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          coins: {
            increment: task.reward
          }
        }
      }),
      prisma.coinTransaction.create({
        data: {
          userId: session.user.id,
          amount: task.reward,
          type: "join4reward",
          description: `Completed ${task.platform} task: ${task.description}`
        }
      })
    ])

    return NextResponse.json({
      success: true,
      reward: task.reward,
      newBalance: result[1].coins
    })
  } catch (error) {
    console.error("Error completing join4reward task:", error)
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    )
  }
}

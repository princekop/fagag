import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch active join4reward tasks for users
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get active tasks
    const tasks = await prisma.join4RewardTask.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    })

    // Get user's completed tasks
    const completedTasks = await prisma.taskCompletion.findMany({
      where: { userId: session.user.id }
    })

    // Map completed task types
    const completedTaskTypes = completedTasks.map((t: any) => t.taskType.toLowerCase())

    // Format response with completion status
    const formattedTasks = tasks.map((task: any) => ({
      id: task.id,
      platform: task.platform,
      description: task.description,
      reward: task.reward,
      link: task.link,
      actionLabel: task.actionLabel,
      icon: task.icon,
      color: task.color,
      completed: completedTaskTypes.includes(task.platform.toLowerCase())
    }))

    return NextResponse.json(formattedTasks)
  } catch (error) {
    console.error("Error fetching join4reward tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

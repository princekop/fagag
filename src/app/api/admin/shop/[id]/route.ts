import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH update shop item (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    
    const item = await prisma.shopItem.update({
      where: { id },
      data: body
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error updating shop item:", error)
    return NextResponse.json({ error: "Failed to update shop item" }, { status: 500 })
  }
}

// DELETE shop item (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    await prisma.shopItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Shop item deleted successfully" })
  } catch (error) {
    console.error("Error deleting shop item:", error)
    return NextResponse.json({ error: "Failed to delete shop item" }, { status: 500 })
  }
}

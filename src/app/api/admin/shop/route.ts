import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all shop items
export async function GET() {
  try {
    const items = await prisma.shopItem.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ]
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching shop items:", error)
    return NextResponse.json({ error: "Failed to fetch shop items" }, { status: 500 })
  }
}

// POST create shop item (admin only)
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
    const { name, description, type, value, price, image } = body

    const item = await prisma.shopItem.create({
      data: {
        name,
        description,
        type,
        value,
        price,
        image: image || null
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating shop item:", error)
    return NextResponse.json({ error: "Failed to create shop item" }, { status: 500 })
  }
}

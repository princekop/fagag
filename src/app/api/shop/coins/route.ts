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

    const items = await prisma.shopItem.findMany({
      where: {
        type: "coin_package",
        isActive: true
      },
      orderBy: {
        sortOrder: "asc"
      }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching coin packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

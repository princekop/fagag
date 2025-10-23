import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * Check if the current user is an admin
 * Returns the user object if admin, or NextResponse error if not
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return {
      error: NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 }),
      user: null
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  })

  if (!user || user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 }),
      user: null
    }
  }

  return { error: null, user }
}

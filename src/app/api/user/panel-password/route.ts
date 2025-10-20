import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { encrypt, decrypt } from "@/lib/crypto"
import { updateApplicationUserPassword } from "@/lib/pterodactyl"
import crypto from "crypto"

function genStrongPassword(): string {
  const a = crypto.randomUUID().replace(/-/g, "")
  const b = Buffer.from(crypto.randomBytes(8)).toString("base64").replace(/[^a-zA-Z0-9]/g, "")
  return `Ln!${a.slice(0,8)}${b.slice(0,8)}Aa1!`
}

// GET current panel password
export async function GET() {
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

    let password = null
    if (user.pteroPasswordEnc) {
      try {
        password = decrypt(user.pteroPasswordEnc)
      } catch {
        password = null
      }
    }

    return NextResponse.json({
      email: user.email,
      hasPassword: !!password,
      password,
      pteroUserId: user.pteroUserId,
    })
  } catch (error) {
    console.error("Error fetching panel password:", error)
    return NextResponse.json({ error: "Failed to fetch panel password" }, { status: 500 })
  }
}

// POST set/reset panel password
export async function POST(request: Request) {
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

    if (!user.pteroUserId) {
      return NextResponse.json({ error: "No panel account linked" }, { status: 400 })
    }

    const body = await request.json()
    const customPassword = body.password

    const password = customPassword || genStrongPassword()

    // Update password on Pterodactyl panel
    const success = await updateApplicationUserPassword(user.pteroUserId, password)
    if (!success) {
      return NextResponse.json({ error: "Failed to update password on panel" }, { status: 500 })
    }

    // Save encrypted password to database
    await prisma.user.update({
      where: { id: user.id },
      data: { pteroPasswordEnc: encrypt(password) }
    })

    return NextResponse.json({ 
      success: true,
      password,
      message: customPassword ? "Password updated successfully" : "Password reset successfully"
    })
  } catch (error) {
    console.error("Error updating panel password:", error)
    return NextResponse.json({ error: "Failed to update panel password" }, { status: 500 })
  }
}

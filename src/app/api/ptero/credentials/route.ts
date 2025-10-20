import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { decrypt, encrypt } from "@/lib/crypto"
import { updateApplicationUserPassword } from "@/lib/pterodactyl"

function genStrongPassword(): string {
  const crypto = require("crypto") as typeof import("crypto")
  const a = crypto.randomUUID().replace(/-/g, "")
  const b = Buffer.from(crypto.randomBytes(8)).toString("base64").replace(/[^a-zA-Z0-9]/g, "")
  return `Ln!${a.slice(0,8)}${b.slice(0,8)}Aa1!`
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const panelUrl = (process.env.PTERO_PANEL_URL || "").replace(/\/$/, "")
    const payload = {
      panelUrl,
      email: user.email,
      linked: !!user.pteroUserId,
      password: user.pteroPasswordEnc ? (() => { try { return decrypt(user.pteroPasswordEnc) } catch { return null } })() : null,
    }
    return NextResponse.json(payload)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (!user.pteroUserId) return NextResponse.json({ error: "Panel user not linked" }, { status: 400 })

    const newPassword = genStrongPassword()
    const ok = await updateApplicationUserPassword(user.pteroUserId, newPassword)
    if (!ok) return NextResponse.json({ error: "Failed to update panel password" }, { status: 500 })

    await prisma.user.update({ where: { id: user.id }, data: { pteroPasswordEnc: encrypt(newPassword) } })
    return NextResponse.json({ ok: true, password: newPassword })
  } catch (e) {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}

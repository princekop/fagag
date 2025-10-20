import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { listApplicationNests } from "@/lib/pterodactyl"

export async function GET() {
  try {
    const nests = await prisma.pteroNest.findMany({
      include: { eggs: true },
      orderBy: { pteroId: "asc" }
    })
    return NextResponse.json(nests)
  } catch (e) {
    return NextResponse.json({ error: "Failed to list nests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!admin || (admin as any).role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json().catch(() => ({}))

    if (body?.sync) {
      const data = await listApplicationNests()
      for (const d of data) {
        const attr = d?.attributes
        if (!attr) continue
        await prisma.pteroNest.upsert({
          where: { pteroId: attr.id },
          update: { name: attr.name, isEnabled: true },
          create: { pteroId: attr.id, name: attr.name, isEnabled: true },
        })
      }
      const nests = await prisma.pteroNest.findMany({ orderBy: { pteroId: "asc" } })
      return NextResponse.json({ ok: true, nests })
    }

    // Manual add
    const { pteroId, name, isEnabled } = body
    if (!pteroId || !name) return NextResponse.json({ error: "pteroId and name are required" }, { status: 400 })
    const nest = await prisma.pteroNest.upsert({
      where: { pteroId: Number(pteroId) },
      update: { name, isEnabled: isEnabled ?? true },
      create: { pteroId: Number(pteroId), name, isEnabled: isEnabled ?? true },
    })
    return NextResponse.json(nest)
  } catch (e) {
    return NextResponse.json({ error: "Failed to save nest" }, { status: 500 })
  }
}

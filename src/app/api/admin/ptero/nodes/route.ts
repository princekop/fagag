import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { listApplicationNodes } from "@/lib/pterodactyl"

export async function GET() {
  try {
    const nodes = await prisma.pteroNode.findMany({ orderBy: { pteroId: "asc" } })
    return NextResponse.json(nodes)
  } catch (e) {
    return NextResponse.json({ error: "Failed to list nodes" }, { status: 500 })
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
      const data = await listApplicationNodes()
      for (const d of data) {
        const attr = d?.attributes
        if (!attr) continue
        await prisma.pteroNode.upsert({
          where: { pteroId: attr.id },
          update: {
            name: attr.name,
            isEnabled: true,
            locationPteroId: attr.location_id ?? null,
          },
          create: {
            pteroId: attr.id,
            name: attr.name,
            isEnabled: true,
            locationPteroId: attr.location_id ?? null,
          },
        })
      }
      const nodes = await prisma.pteroNode.findMany({ orderBy: { pteroId: "asc" } })
      return NextResponse.json({ ok: true, nodes })
    }

    const { pteroId, name, locationPteroId, isEnabled } = body
    if (!pteroId || !name) return NextResponse.json({ error: "pteroId and name are required" }, { status: 400 })
    const node = await prisma.pteroNode.upsert({
      where: { pteroId: Number(pteroId) },
      update: { name, isEnabled: isEnabled ?? true, locationPteroId: locationPteroId ? Number(locationPteroId) : null },
      create: { pteroId: Number(pteroId), name, isEnabled: isEnabled ?? true, locationPteroId: locationPteroId ? Number(locationPteroId) : null },
    })
    return NextResponse.json(node)
  } catch (e) {
    return NextResponse.json({ error: "Failed to save node" }, { status: 500 })
  }
}

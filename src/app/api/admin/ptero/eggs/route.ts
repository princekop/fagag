import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { listApplicationNests, listApplicationEggs } from "@/lib/pterodactyl"

export async function GET() {
  try {
    const eggs = await prisma.pteroEgg.findMany({
      orderBy: { pteroId: "asc" }
    })
    return NextResponse.json(eggs)
  } catch (e) {
    return NextResponse.json({ error: "Failed to list eggs" }, { status: 500 })
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
      const nests = await listApplicationNests()
      for (const n of nests) {
        const nAttr = n?.attributes
        if (!nAttr) continue
        const nestId = nAttr.id as number
        const eggs = await listApplicationEggs(nestId)
        for (const e of eggs) {
          const attr = e?.attributes
          if (!attr) continue
          let dockerImage = attr.docker_image as string
          if (!dockerImage && attr.docker_images) {
            const images = Object.values(attr.docker_images as Record<string, string>)
            dockerImage = (images[0] as string) || ""
          }
          await prisma.pteroEgg.upsert({
            where: { pteroId: attr.id as number },
            update: {
              name: attr.name,
              dockerImage: dockerImage || null,
              startup: (attr.startup as string) || null,
              isEnabled: true,
              nestPteroId: nestId,
            },
            create: {
              pteroId: attr.id as number,
              nestPteroId: nestId,
              name: attr.name,
              dockerImage: dockerImage || null,
              startup: (attr.startup as string) || null,
              isEnabled: true,
            }
          })
        }
      }
      const out = await prisma.pteroEgg.findMany({ orderBy: { pteroId: "asc" } })
      return NextResponse.json({ ok: true, eggs: out })
    }

    // Manual add
    const { pteroId, nestPteroId, name, dockerImage, startup, isEnabled } = body
    if (!pteroId || !nestPteroId || !name) return NextResponse.json({ error: "pteroId, nestPteroId and name are required" }, { status: 400 })
    const egg = await prisma.pteroEgg.upsert({
      where: { pteroId: Number(pteroId) },
      update: { name, dockerImage: dockerImage || null, startup: startup || null, isEnabled: isEnabled ?? true, nestPteroId: Number(nestPteroId) },
      create: { pteroId: Number(pteroId), nestPteroId: Number(nestPteroId), name, dockerImage: dockerImage || null, startup: startup || null, isEnabled: isEnabled ?? true },
    })
    return NextResponse.json(egg)
  } catch (e) {
    return NextResponse.json({ error: "Failed to save egg" }, { status: 500 })
  }
}

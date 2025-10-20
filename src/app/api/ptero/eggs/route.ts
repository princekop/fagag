import { NextResponse } from "next/server"
import { listApplicationEggs } from "@/lib/pterodactyl"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const nestId = Number(searchParams.get("nestId") || 0)
    if (!nestId) return NextResponse.json({ error: "nestId is required" }, { status: 400 })

    const data = await listApplicationEggs(nestId)
    const eggs = (data || []).map((d: any) => {
      const a = d?.attributes || {}
      const dockerImages = a.docker_images ? Object.values(a.docker_images as Record<string, string>) : (a.docker_image ? [a.docker_image] : [])
      return {
        id: a.id as number,
        name: a.name as string,
        startup: a.startup as string | undefined,
        dockerImages: dockerImages as string[],
        variables: Array.isArray(a.relationships?.variables?.data) ? a.relationships.variables.data.map((v: any) => v?.attributes) : [],
      }
    }).filter((e: any) => typeof e.id === "number" && !!e.name)

    return NextResponse.json(eggs)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch eggs" }, { status: 500 })
  }
}

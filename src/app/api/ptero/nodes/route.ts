import { NextResponse } from "next/server"
import { listApplicationNodes } from "@/lib/pterodactyl"

export async function GET() {
  try {
    const data = await listApplicationNodes()
    const nodes = (data || []).map((d: any) => ({
      id: d?.attributes?.id as number,
      name: d?.attributes?.name as string,
      locationId: d?.attributes?.location_id as number | undefined,
    })).filter((n: any) => typeof n.id === "number" && !!n.name)
    return NextResponse.json(nodes)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 })
  }
}

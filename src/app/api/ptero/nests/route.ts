import { NextResponse } from "next/server"
import { listApplicationNests } from "@/lib/pterodactyl"

export async function GET() {
  try {
    const data = await listApplicationNests()
    const nests = (data || []).map((d: any) => ({
      id: d?.attributes?.id as number,
      name: d?.attributes?.name as string,
      description: d?.attributes?.description as string | undefined,
    })).filter((n: any) => typeof n.id === "number" && !!n.name)
    return NextResponse.json(nests)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch nests" }, { status: 500 })
  }
}

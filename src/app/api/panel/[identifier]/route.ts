import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const rawPanelUrl =
  process.env.PTERO_PANEL_URL ||
  process.env.NEXT_PUBLIC_PTERO_PANEL_URL ||
  process.env.PTERODACTYL_PANEL_URL ||
  process.env.PANEL_URL ||
  ""
const PANEL_URL = rawPanelUrl ? rawPanelUrl.replace(/\/$/, "") : undefined

const CLIENT_API_KEY =
  process.env.PTERO_CLIENT_API_KEY ||
  process.env.NEXT_PUBLIC_PTERO_CLIENT_API_KEY ||
  process.env.PTERODACTYL_CLIENT_API_KEY ||
  process.env.CLIENT_API_KEY

const REQUIRE_AUTH = (process.env.PTERO_REQUIRE_AUTH ?? "true").toLowerCase() !== "false"

async function clientRequest(path: string, init?: RequestInit) {
  if (!PANEL_URL || !CLIENT_API_KEY) {
    throw new Error("Panel not configured")
  }
  const res = await fetch(`${PANEL_URL}/api/client${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${CLIENT_API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })
  return res
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ identifier: string }> }
) {
  try {
    const session = REQUIRE_AUTH ? await getServerSession(authOptions) : null
    if (REQUIRE_AUTH && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { identifier } = await ctx.params
    const res = await clientRequest(`/servers/${identifier}?include=allocations,variables`)
    
    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to fetch server:", text)
      return NextResponse.json({ error: "Failed to fetch server" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching server:", error)
    return NextResponse.json({ error: "Failed to fetch server" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// WebSocket endpoint info - client will connect directly to Pterodactyl WS
export async function GET(
  request: Request,
  ctx: { params: Promise<{ identifier: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { identifier } = await ctx.params
    const PANEL_URL = process.env.PTERO_PANEL_URL?.replace(/\/$/, "")
    const CLIENT_API_KEY = process.env.PTERO_CLIENT_API_KEY

    if (!PANEL_URL || !CLIENT_API_KEY) {
      return NextResponse.json({ error: "Panel not configured" }, { status: 500 })
    }

    // Get websocket details from Pterodactyl
    const res = await fetch(`${PANEL_URL}/api/client/servers/${identifier}/websocket`, {
      headers: {
        "Authorization": `Bearer ${CLIENT_API_KEY}`,
        "Accept": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to get websocket info:", text)
      return NextResponse.json({ error: "Failed to get websocket info" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error getting websocket info:", error)
    return NextResponse.json({ error: "Failed to get websocket info" }, { status: 500 })
  }
}

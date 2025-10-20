import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const PANEL_URL = process.env.PTERO_PANEL_URL?.replace(/\/$/, "")
const CLIENT_API_KEY = process.env.PTERO_CLIENT_API_KEY

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

// DELETE delete database
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ identifier: string; databaseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { identifier, databaseId } = await ctx.params
    const res = await clientRequest(`/servers/${identifier}/databases/${databaseId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to delete database:", text)
      return NextResponse.json({ error: "Failed to delete database" }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting database:", error)
    return NextResponse.json({ error: "Failed to delete database" }, { status: 500 })
  }
}

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

// POST rename server
export async function POST(
  request: Request,
  ctx: { params: Promise<{ identifier: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { identifier } = await ctx.params
    const body = await request.json()
    const { name } = body

    const res = await clientRequest(`/servers/${identifier}/settings/rename`, {
      method: "POST",
      body: JSON.stringify({ name }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to rename server:", text)
      return NextResponse.json({ error: "Failed to rename server" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error renaming server:", error)
    return NextResponse.json({ error: "Failed to rename server" }, { status: 500 })
  }
}

// POST reinstall server
export async function PUT(
  request: Request,
  ctx: { params: Promise<{ identifier: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { identifier } = await ctx.params

    const res = await clientRequest(`/servers/${identifier}/settings/reinstall`, {
      method: "POST",
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to reinstall server:", text)
      return NextResponse.json({ error: "Failed to reinstall server" }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reinstalling server:", error)
    return NextResponse.json({ error: "Failed to reinstall server" }, { status: 500 })
  }
}

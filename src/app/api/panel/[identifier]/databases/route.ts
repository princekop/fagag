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

// GET list databases
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
    const res = await clientRequest(`/servers/${identifier}/databases`)
    
    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to list databases:", text)
      return NextResponse.json({ error: "Failed to list databases" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error listing databases:", error)
    return NextResponse.json({ error: "Failed to list databases" }, { status: 500 })
  }
}

// POST create database
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
    const { database, remote } = body

    const res = await clientRequest(`/servers/${identifier}/databases`, {
      method: "POST",
      body: JSON.stringify({
        database: database,
        remote: remote || "%",
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to create database:", text)
      return NextResponse.json({ error: "Failed to create database" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating database:", error)
    return NextResponse.json({ error: "Failed to create database" }, { status: 500 })
  }
}

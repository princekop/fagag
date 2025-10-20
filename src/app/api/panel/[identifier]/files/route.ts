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

// GET list files in directory
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
    const { searchParams } = new URL(request.url)
    const directory = searchParams.get("directory") || "/"

    console.log(`[FILES] Fetching files for server ${identifier}, directory: ${directory}`)
    
    const res = await clientRequest(`/servers/${identifier}/files/list?directory=${encodeURIComponent(directory)}`)
    
    if (!res.ok) {
      const text = await res.text()
      console.error("[FILES] Failed to list files:", res.status, text)
      return NextResponse.json({ error: "Failed to list files", details: text }, { status: res.status })
    }

    const data = await res.json()
    console.log("[FILES] Response from Pterodactyl:", JSON.stringify(data).substring(0, 500))
    console.log("[FILES] Data type:", typeof data, "Is array:", Array.isArray(data))
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

// POST create folder or rename file
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
    const { action, path, name } = body

    if (action === "create_folder") {
      const res = await clientRequest(`/servers/${identifier}/files/create-folder`, {
        method: "POST",
        body: JSON.stringify({ root: path || "/", name }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Failed to create folder:", text)
        return NextResponse.json({ error: "Failed to create folder" }, { status: res.status })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in file operation:", error)
    return NextResponse.json({ error: "Failed to perform file operation" }, { status: 500 })
  }
}

// DELETE delete file or folder
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ identifier: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { identifier } = await ctx.params
    const { searchParams } = new URL(request.url)
    const file = searchParams.get("file")
    const directory = searchParams.get("directory") || "/"

    if (!file) {
      return NextResponse.json({ error: "File path required" }, { status: 400 })
    }

    const res = await clientRequest(`/servers/${identifier}/files/delete`, {
      method: "POST",
      body: JSON.stringify({
        root: directory,
        files: [file],
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to delete file:", text)
      return NextResponse.json({ error: "Failed to delete file" }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

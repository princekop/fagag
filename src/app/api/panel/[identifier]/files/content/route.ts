import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const PANEL_URL = process.env.PTERO_PANEL_URL?.replace(/\/$/, "")
const CLIENT_API_KEY = process.env.PTERO_CLIENT_API_KEY

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
    const file = searchParams.get("file")

    if (!file) {
      return NextResponse.json({ error: "File path required" }, { status: 400 })
    }

    const res = await fetch(
      `${PANEL_URL}/api/client/servers/${identifier}/files/contents?file=${encodeURIComponent(file)}`,
      {
        headers: {
          "Authorization": `Bearer ${CLIENT_API_KEY}`,
          "Accept": "*/*",
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to read file" }, { status: res.status })
    }

    // Get the content type from response or guess from file extension
    const contentType = res.headers.get('Content-Type') || 'application/octet-stream'
    const buffer = await res.arrayBuffer()
    
    return new NextResponse(buffer, {
      headers: { 
        "Content-Type": contentType,
        "Cache-Control": "no-cache"
      }
    })
  } catch (error) {
    console.error("Error reading file:", error)
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 })
  }
}

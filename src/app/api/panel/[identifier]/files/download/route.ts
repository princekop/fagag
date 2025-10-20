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

    // Get signed download URL from Pterodactyl
    const res = await fetch(
      `${PANEL_URL}/api/client/servers/${identifier}/files/download?file=${encodeURIComponent(file)}`,
      {
        headers: {
          "Authorization": `Bearer ${CLIENT_API_KEY}`,
          "Accept": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to get download URL:", text)
      return NextResponse.json({ error: "Failed to get download URL" }, { status: res.status })
    }

    const data = await res.json()
    const downloadUrl = data.attributes?.url

    if (!downloadUrl) {
      return NextResponse.json({ error: "No download URL in response" }, { status: 500 })
    }

    // Fetch the actual file from the signed URL
    const fileRes = await fetch(downloadUrl)
    
    if (!fileRes.ok) {
      return NextResponse.json({ error: "Failed to download file" }, { status: fileRes.status })
    }

    // Get the file content
    const fileBuffer = await fileRes.arrayBuffer()
    
    // Extract filename from path
    const fileName = file.split('/').pop() || 'download'
    
    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': fileRes.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
      }
    })
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}

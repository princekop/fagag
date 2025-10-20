import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const PANEL_URL = process.env.PTERO_PANEL_URL?.replace(/\/$/, "")
const CLIENT_API_KEY = process.env.PTERO_CLIENT_API_KEY

export const config = {
  api: {
    bodyParser: false,
  },
}

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
    const formData = await request.formData()
    const file = formData.get("file") as File
    const directory = formData.get("directory") as string || "/"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get file content
    const buffer = await file.arrayBuffer()
    const content = Buffer.from(buffer)
    
    // First, write the file using the write endpoint
    const filePath = directory === "/" ? `/${file.name}` : `${directory}/${file.name}`
    
    const res = await fetch(
      `${PANEL_URL}/api/client/servers/${identifier}/files/write?file=${encodeURIComponent(filePath)}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLIENT_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: content,
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error("Upload failed:", res.status, text)
      return NextResponse.json(
        { error: "Upload failed", details: text }, 
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file", details: (error as Error).message }, 
      { status: 500 }
    )
  }
}

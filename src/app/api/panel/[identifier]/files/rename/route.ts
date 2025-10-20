import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const PANEL_URL = process.env.PTERO_PANEL_URL?.replace(/\/$/, "")
const CLIENT_API_KEY = process.env.PTERO_CLIENT_API_KEY

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
    const { root, from, to } = await request.json()

    if (!from || !to) {
      return NextResponse.json({ error: "From and to paths required" }, { status: 400 })
    }

    const res = await fetch(
      `${PANEL_URL}/api/client/servers/${identifier}/files/rename`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${CLIENT_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ root: root || "/", files: [{ from, to }] }),
        cache: "no-store",
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error("Failed to rename file:", text)
      return NextResponse.json({ error: "Failed to rename file" }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error renaming file:", error)
    return NextResponse.json({ error: "Failed to rename file" }, { status: 500 })
  }
}

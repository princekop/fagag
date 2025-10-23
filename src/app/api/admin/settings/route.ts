import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get admin settings
export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if settings exist, if not return defaults
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      // Create default settings
      settings = await prisma.settings.create({
        data: {
          defaultRam: 4,
          defaultCpu: 100,
          defaultDisk: 10,
          defaultServerSlots: 1,
        },
      })
    }

    return NextResponse.json({
      defaultRam: settings.defaultRam,
      defaultCpu: settings.defaultCpu,
      defaultDisk: settings.defaultDisk,
      defaultServerSlots: settings.defaultServerSlots,
    })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update admin settings
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { defaultRam, defaultCpu, defaultDisk, defaultServerSlots } = body

    // Validate inputs
    if (
      defaultRam < 1 || defaultRam > 128 ||
      defaultCpu < 0 || defaultCpu > 1000 ||
      defaultDisk < 1 || defaultDisk > 1000 ||
      defaultServerSlots < 1 || defaultServerSlots > 50
    ) {
      return NextResponse.json({ error: "Invalid settings values" }, { status: 400 })
    }

    // Check if settings exist
    let settings = await prisma.settings.findFirst()

    if (settings) {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          defaultRam,
          defaultCpu,
          defaultDisk,
          defaultServerSlots,
        },
      })
    } else {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          defaultRam,
          defaultCpu,
          defaultDisk,
          defaultServerSlots,
        },
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

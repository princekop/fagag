import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerByExternalId, createServer } from "@/lib/pterodactyl"
import { getApplicationEgg } from "@/lib/pterodactyl"
import { findApplicationUserByEmail, createApplicationUser } from "@/lib/pterodactyl"
import { encrypt } from "@/lib/crypto"
import crypto from "crypto"

async function fetchJson(url: string, headers: Record<string, string>) {
  const res = await fetch(url, { headers, cache: "no-store" })
  if (!res.ok) return null
  try { return await res.json() } catch { return null }
}
async function buildEnvForEgg(eggId: number, memoryMB: number, version: string, software: string) {
  // Base sensible defaults for Minecraft-type eggs
  const base: Record<string, string | number | boolean> = {
    EULA: true,
    MEMORY: `${memoryMB}M`,
    VERSION: version,
    MINECRAFT_VERSION: version,
    TYPE: software,
    SERVER_JARFILE: "server.jar",
    BUILD_NUMBER: "latest",
  }
  try {
    if (!eggId) return base
    const egg = await getApplicationEgg(Number(eggId))
    const rel = (egg as any)?.relationships
    const vars = Array.isArray(rel?.variables?.data) ? rel.variables.data.map((v: any) => v?.attributes || {}) : []
    for (const v of vars) {
      const key = v?.env_variable as string | undefined
      if (!key) continue
      if (base[key] === undefined) {
        // only fill if not already set by base
        const def = v?.default_value
        if (def !== undefined && def !== null && def !== "") base[key] = def
      }
    }
  } catch {}
  return base
}

function genStrongPassword(): string {
  const a = crypto.randomUUID().replace(/-/g, "")
  const b = Buffer.from(crypto.randomBytes(8)).toString("base64").replace(/[^a-zA-Z0-9]/g, "")
  return `Ln!${a.slice(0,8)}${b.slice(0,8)}Aa1!`
}

async function autoDiscoverPteroConfig(version: string, software: string) {
  const base = (process.env.PTERO_PANEL_URL || "").replace(/\/$/, "")
  const appHeaders = {
    Authorization: `Bearer ${process.env.PTERO_API_KEY || ""}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  }
  const clientHeaders = {
    Authorization: `Bearer ${process.env.PTERO_CLIENT_API_KEY || ""}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  }

  // Get client account (email) to map to application user id
  const account = await fetchJson(`${base}/api/client/account`, clientHeaders)
  const email = account?.attributes?.email as string | undefined

  let userId: number | null = null
  if (email) {
    const users = await fetchJson(`${base}/api/application/users?filter[email]=${encodeURIComponent(email)}`, appHeaders)
    const data = users?.data ?? []
    userId = (data[0]?.attributes?.id as number) || null
  }

  // Discover locations
  const locs = await fetchJson(`${base}/api/application/locations`, appHeaders)
  const locationIds: number[] = (locs?.data ?? []).map((d: any) => d?.attributes?.id).filter((x: any) => typeof x === "number")

  // Discover nests/eggs (prefer minecraft/paper)
  const nests = await fetchJson(`${base}/api/application/nests`, appHeaders)
  const nestList: Array<{ id: number; name: string }> = (nests?.data ?? []).map((d: any) => ({ id: d?.attributes?.id, name: d?.attributes?.name }))
  const mcNest = nestList.find((n) => (n.name || "").toLowerCase().includes("mine")) || nestList[0]
  let eggId: number | null = null
  let dockerImage = ""
  let startup = ""
  if (mcNest) {
    const eggs = await fetchJson(`${base}/api/application/nests/${mcNest.id}/eggs?include=variables`, appHeaders)
    const arr = eggs?.data ?? []
    const pick = (preferred: string[]) => arr.find((e: any) => preferred.some((p) => (e?.attributes?.name || "").toLowerCase().includes(p))) || arr[0]
    const egg = pick(["paper", "purpur", "spigot", "vanilla", "fabric", "forge", "minecraft"])
    if (egg) {
      eggId = egg?.attributes?.id as number
      dockerImage = egg?.attributes?.docker_image as string
      if (!dockerImage && egg?.attributes?.docker_images) {
        const images = Object.values(egg?.attributes?.docker_images as Record<string, string>)
        dockerImage = (images[0] as string) || "ghcr.io/pterodactyl/yolks:java_21"
      }
      startup = (egg?.attributes?.startup as string) || "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar"
    }
  }

  return {
    userId,
    eggId,
    dockerImage,
    startup,
    locations: locationIds,
    // basic env defaults, panel egg variables will override if provided later
    environment: {
      EULA: true,
      MEMORY: "{{SERVER_MEMORY}}M",
      VERSION: version,
      TYPE: software,
    } as Record<string, string | number | boolean>,
  }
}

// GET all servers for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const servers = await prisma.server.findMany({
      where: { userId: user.id },
      include: {
        node: {
          include: {
            location: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(servers)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 })
  }
}

// POST create new server
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { servers: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure Pterodactyl application user exists for this user
    let panelUserId = user.pteroUserId ?? null
    if (!panelUserId && user.email) {
      try {
        console.log(`[SERVER CREATE] Attempting to find/create panel user for: ${user.email}`)
        const found = await findApplicationUserByEmail(user.email)
        if (found?.id) {
          console.log(`[SERVER CREATE] Found existing panel user: ${found.id}`)
          panelUserId = found.id
        } else {
          console.log(`[SERVER CREATE] Panel user not found, creating new one...`)
          const baseUsername = (user.name?.trim() || user.email.split("@")[0]).replace(/[^a-zA-Z0-9_\-\.]/g, "_").slice(0, 24)
          const uniqueSuffix = user.id.slice(0, 8)
          const username = `${baseUsername}_${uniqueSuffix}` || `user_${user.id.slice(0,8)}`
          const firstName = user.name?.split(" ")[0] || user.email.split("@")[0] || "User"
          const lastName = user.name?.split(" ").slice(1).join(" ") || "LustNode"
          const password = genStrongPassword()
          console.log(`[SERVER CREATE] Attempting to create panel user: ${username}`)
          const created = await createApplicationUser({ email: user.email, username, password, first_name: firstName, last_name: lastName })
          if (created?.id) {
            console.log(`[SERVER CREATE] Panel user created successfully: ${created.id}`)
            panelUserId = created.id
            try {
              await prisma.user.update({ where: { id: user.id }, data: { pteroPasswordEnc: encrypt(password) } })
            } catch (e) {
              console.error(`[SERVER CREATE] Failed to save encrypted password:`, e)
            }
          } else {
            console.error(`[SERVER CREATE] Failed to create panel user - API returned null`)
          }
        }
        if (panelUserId) {
          await prisma.user.update({ where: { id: user.id }, data: { pteroUserId: panelUserId } })
          console.log(`[SERVER CREATE] Saved panel user ID ${panelUserId} to database`)
        }
      } catch (e) {
        console.error(`[SERVER CREATE] Error during panel user creation:`, e)
      }
    } else if (panelUserId) {
      console.log(`[SERVER CREATE] Using existing panel user ID: ${panelUserId}`)
    }

    // We do NOT auto-discover owner via client token; servers must be owned by the logged-in user's panel account.

    // Check server slots
    if (user.servers.length >= user.serverSlots) {
      return NextResponse.json({ error: "Server slot limit reached" }, { status: 400 })
    }

    const body = await request.json()
    const { name, type, version, software, pteroEggId, pteroNodeLocationId, ram, disk, cpu, description } = body as {
      name: string; type?: string; version?: string; software?: string;
      pteroEggId?: number; pteroNodeLocationId?: number;
      ram?: number; disk?: number; cpu?: number; description?: string;
    }
    
    // Set defaults if not provided (for compatibility with Pterodactyl-only creation)
    const serverType = type || "minecraft-java"
    const serverVersion = version || "latest"
    const serverSoftware = software || "vanilla"

    // Determine desired resources for this server based on user's specs and posted values
    const maxRam = Math.max(1, Number(user.ram ?? 4))
    const maxDisk = Math.max(1, Number(user.disk ?? 10))
    const maxCpuPercent = Math.max(50, Number(user.cpu ?? 100))
    const desiredRam = Math.min(Math.max(1, Number(ram ?? 4)), maxRam)
    const desiredDisk = Math.min(Math.max(1, Number(disk ?? 10)), maxDisk)
    const chosenCpuPercent = Math.min(Math.max(50, Number(cpu ?? 100)), maxCpuPercent)
    const chosenCpuCores = Math.max(1, Math.floor(chosenCpuPercent / 100))

    // Fetch online nodes ordered by least used RAM and pick one that has enough free capacity
    const candidateNodes = await prisma.node.findMany({
      where: { status: "online" },
      orderBy: { usedRam: "asc" }
    })

    const availableNode = candidateNodes.find((n) => (n.ram - n.usedRam) >= desiredRam && (n.disk - n.usedDisk) >= desiredDisk)

    const server = await prisma.server.create({
      data: {
        name,
        type: serverType,
        version: serverVersion,
        software: serverSoftware,
        userId: user.id,
        nodeId: availableNode?.id ?? null,
        ram: desiredRam,
        cpu: chosenCpuCores,
        disk: desiredDisk,
        description: description && description.length ? description : undefined,
      },
      include: {
        node: {
          include: {
            location: true
          }
        }
      }
    })

    // Update node usage if assigned
    if (availableNode) {
      await prisma.node.update({
        where: { id: availableNode.id },
        data: {
          usedRam: { increment: server.ram },
          usedDisk: { increment: server.disk },
          usedCpu: { increment: server.cpu },
        }
      })
    }

    // Attempt to link with existing Pterodactyl server by external_id (our server.id)
    try {
      const ptero = await getServerByExternalId(server.id)
      if (ptero && ptero.id) {
        await prisma.server.update({
          where: { id: server.id },
          data: {
            pteroId: String(ptero.id),
            pteroIdentifier: ptero.identifier,
            pteroExternalId: ptero.external_id ?? server.id,
          }
        })
      } else {
        // If not linked, try to provision on Pterodactyl using
        // (0) request overrides, (1) explicit env, (2) admin-managed eggs/nodes, (3) auto-discovery
        const PANEL_URL = process.env.PTERO_PANEL_URL
        const API_KEY = process.env.PTERO_API_KEY
        const ownerUserId = panelUserId || 0
        const PTERO_EGG_ID = Number(process.env.PTERO_EGG_ID || 0)
        const PTERO_DOCKER_IMAGE = process.env.PTERO_DOCKER_IMAGE || ""
        const PTERO_LOCATION_IDS = (process.env.PTERO_LOCATION_IDS || "")
          .split(",").map((s) => Number(s.trim())).filter(Boolean)
        const PTERO_STARTUP = process.env.PTERO_STARTUP || ""
        const PTERO_ENV_JSON = process.env.PTERO_ENV_JSON || ""

        const canProvision = PANEL_URL && API_KEY && PTERO_EGG_ID && PTERO_DOCKER_IMAGE && PTERO_LOCATION_IDS.length
        // (0) Request overrides: explicit egg and location IDs
        if (pteroEggId || pteroNodeLocationId) {
          if (!ownerUserId) {
            return NextResponse.json({ error: "No panel user for this account. Admin API must be configured to create a panel user automatically." }, { status: 400 })
          }
          const memoryMB = desiredRam * 1024
          const match = pteroEggId ? await prisma.pteroEgg.findUnique({ where: { pteroId: Number(pteroEggId) } }) : null
          let dockerImageOverride = match?.dockerImage || process.env.PTERO_DOCKER_IMAGE || ""
          let startupOverride: string | undefined = match?.startup || process.env.PTERO_STARTUP || undefined
          if (!match && pteroEggId) {
            const egg = await getApplicationEgg(Number(pteroEggId))
            const attr = egg?.attributes || {}
            if (!dockerImageOverride) {
              if (attr.docker_image) dockerImageOverride = attr.docker_image as string
              else if (attr.docker_images) {
                const imgs = Object.values(attr.docker_images as Record<string, string>)
                dockerImageOverride = (imgs[0] as string) || dockerImageOverride
              }
            }
            if (!startupOverride && attr.startup) startupOverride = attr.startup as string
          }
          const env = await buildEnvForEgg(match?.pteroId || Number(pteroEggId) || Number(process.env.PTERO_EGG_ID || 0), memoryMB, version, software)
          const p = await createServer({
            name,
            externalId: server.id,
            userId: ownerUserId,
            eggId: match?.pteroId || Number(pteroEggId) || Number(process.env.PTERO_EGG_ID || 0),
            dockerImage: dockerImageOverride,
            startup: startupOverride,
            environment: env,
            memoryMB,
            diskMB: desiredDisk * 1024,
            cpuPercent: chosenCpuPercent,
            locations: pteroNodeLocationId ? [Number(pteroNodeLocationId)] : ((process.env.PTERO_LOCATION_IDS || "").split(",").map(s=>Number(s.trim())).filter(Boolean)),
          })
          if (p && p.id) {
            await prisma.server.update({
              where: { id: server.id },
              data: {
                pteroId: String(p.id),
                pteroIdentifier: p.identifier,
                pteroExternalId: p.external_id ?? server.id,
                status: "starting",
              }
            })
          }
        } else if (canProvision) {
          if (!ownerUserId) {
            return NextResponse.json({ error: "No panel user for this account. Admin API must be configured to create a panel user automatically." }, { status: 400 })
          }
          let environment: Record<string, string | number | boolean> = {}
          try { environment = PTERO_ENV_JSON ? JSON.parse(PTERO_ENV_JSON) : {} } catch {}
          // Merge panel egg defaults with env overrides
          const memoryMB = desiredRam * 1024
          const eggEnv = await buildEnvForEgg(PTERO_EGG_ID, memoryMB, version, software)
          environment = { ...eggEnv, ...environment }

          const p = await createServer({
            name,
            externalId: server.id,
            userId: ownerUserId,
            eggId: PTERO_EGG_ID,
            dockerImage: PTERO_DOCKER_IMAGE,
            startup: PTERO_STARTUP,
            environment,
            memoryMB,
            diskMB: desiredDisk * 1024,
            cpuPercent: chosenCpuPercent,
            locations: PTERO_LOCATION_IDS,
          })
          if (p && p.id) {
            await prisma.server.update({
              where: { id: server.id },
              data: {
                pteroId: String(p.id),
                pteroIdentifier: p.identifier,
                pteroExternalId: p.external_id ?? server.id,
                status: "starting",
              }
            })
          }
        } else {
          // Try admin-managed eggs and nodes
          const enabledEggs = await prisma.pteroEgg.findMany({ where: { isEnabled: true }, orderBy: { pteroId: 'asc' } })
          const match = enabledEggs.find((e) => (e.name || '').toLowerCase().includes((software || '').toLowerCase())) || enabledEggs[0]
          const enabledNodes = await prisma.pteroNode.findMany({ where: { isEnabled: true }, orderBy: { pteroId: 'asc' } })
          const locationIds = Array.from(new Set((enabledNodes.map(n => n.locationPteroId).filter((x): x is number => typeof x === 'number'))))

          if (match) {
            const finalOwner = panelUserId || 0
            if (!finalOwner) {
              return NextResponse.json({ error: "No panel user for this account. Admin API must be configured to create a panel user automatically." }, { status: 400 })
            }
            const memoryMB = desiredRam * 1024
            const env = await buildEnvForEgg(match.pteroId, memoryMB, version, software)
            const p = await createServer({
              name,
              externalId: server.id,
              userId: finalOwner,
              eggId: match.pteroId,
              dockerImage: match.dockerImage || "",
              startup: match.startup || undefined,
              environment: env,
              memoryMB,
              diskMB: desiredDisk * 1024,
              cpuPercent: chosenCpuPercent,
              locations: locationIds.length ? locationIds : [],
            })
            if (p && p.id) {
              await prisma.server.update({
                where: { id: server.id },
                data: {
                  pteroId: String(p.id),
                  pteroIdentifier: p.identifier,
                  pteroExternalId: p.external_id ?? server.id,
                  status: "starting",
                }
              })
            } else {
              // Fallback: auto-discover everything
              const disc = await autoDiscoverPteroConfig(version, software)
              if (disc.eggId && disc.dockerImage && panelUserId) {
                const q = await createServer({
                  name,
                  externalId: server.id,
                  userId: panelUserId,
                  eggId: disc.eggId,
                  dockerImage: disc.dockerImage,
                  startup: disc.startup,
                  environment: disc.environment,
                  memoryMB: desiredRam * 1024,
                  diskMB: desiredDisk * 1024,
                  cpuPercent: chosenCpuPercent,
                  locations: (disc.locations && disc.locations.length) ? disc.locations : [],
                })
                if (q && q.id) {
                  await prisma.server.update({
                    where: { id: server.id },
                    data: {
                      pteroId: String(q.id),
                      pteroIdentifier: q.identifier,
                      pteroExternalId: q.external_id ?? server.id,
                      status: "starting",
                    }
                  })
                }
              }
            }
          }
        }
      }
    } catch (e) {
      // non-fatal if pterodactyl is not configured or server not found
      console.warn("Pterodactyl link skipped:", (e as Error)?.message)
    }

    return NextResponse.json(server, { status: 201 })
  } catch (error) {
    console.error("Error creating server:", error)
    return NextResponse.json({ error: "Failed to create server" }, { status: 500 })
  }
}

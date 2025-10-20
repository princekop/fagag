export type PteroServer = {
  id: number
  identifier: string
  external_id: string | null
}

export async function getApplicationEgg(eggId: number): Promise<any | null> {
  try {
    const res = await appRequest(`/eggs/${eggId}?include=variables`)
    if (!res.ok) return null
    const json = await res.json()
    return json?.attributes ? { attributes: json.attributes, relationships: json.relationships } : null
  } catch {
    return null
  }
}

export async function listApplicationNests(): Promise<any[]> {
  try {
    const res = await appRequest(`/nests`)
    if (!res.ok) return []
    const json = await res.json()
    return json?.data ?? []
  } catch {
    return []
  }
}

export async function listApplicationEggs(nestId: number): Promise<any[]> {
  try {
    const res = await appRequest(`/nests/${nestId}/eggs?include=variables`)
    if (!res.ok) return []
    const json = await res.json()
    return json?.data ?? []
  } catch {
    return []
  }
}

export async function listApplicationNodes(): Promise<any[]> {
  try {
    const res = await appRequest(`/nodes`)
    if (!res.ok) return []
    const json = await res.json()
    return json?.data ?? []
  } catch {
    return []
  }
}

export async function findApplicationUserByEmail(email: string): Promise<{ id: number } | null> {
  try {
    const res = await appRequest(`/users?filter[email]=${encodeURIComponent(email)}`)
    if (!res.ok) return null
    const json = await res.json()
    const data = json?.data ?? []
    if (!data.length) return null
    return { id: data[0]?.attributes?.id as number }
  } catch {
    return null
  }
}

export async function createApplicationUser(params: { email: string; username: string; first_name?: string; last_name?: string; password: string }): Promise<{ id: number } | null> {
  try {
    const body = {
      email: params.email,
      username: params.username,
      first_name: params.first_name ?? params.username,
      last_name: params.last_name ?? "",
      password: params.password,
    }
    const res = await appRequest(`/users`, { method: "POST", body: JSON.stringify(body) })
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`[PTERO] Failed to create user. Status: ${res.status}, Response:`, errorText)
      return null
    }
    const json = await res.json()
    return { id: json?.attributes?.id as number }
  } catch (e) {
    console.error(`[PTERO] Exception creating user:`, e)
    return null
  }
}

export async function updateApplicationUserPassword(id: number, password: string): Promise<boolean> {
  try {
    const res = await appRequest(`/users/${id}`, { method: "PATCH", body: JSON.stringify({ password }) })
    return res.ok
  } catch {
    return false
  }
}

const PANEL_URL = process.env.PTERO_PANEL_URL
const API_KEY = process.env.PTERO_API_KEY
const CLIENT_API_KEY = process.env.PTERO_CLIENT_API_KEY

function ensureConfigured() {
  if (!PANEL_URL || !API_KEY) return false
  return true
}

async function appRequest(path: string, init?: RequestInit) {
  if (!ensureConfigured()) throw new Error("Pterodactyl not configured")
  const res = await fetch(`${PANEL_URL!.replace(/\/$/, "")}/api/application${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })
  return res
}

async function clientRequest(path: string, init?: RequestInit) {
  if (!PANEL_URL || !CLIENT_API_KEY) throw new Error("Pterodactyl client API not configured")
  const res = await fetch(`${PANEL_URL!.replace(/\/$/, "")}/api/client${path}`, {
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

export async function getServerByExternalId(externalId: string): Promise<PteroServer | null> {
  try {
    const res = await appRequest(`/servers/external/${encodeURIComponent(externalId)}`)
    if (!res.ok) return null
    const json = await res.json()
    return json?.attributes as PteroServer
  } catch {
    return null
  }
}

export async function powerActionByServerId(serverId: number, signal: "start" | "stop" | "restart" | "kill") {
  try {
    const res = await appRequest(`/servers/${serverId}/power`, {
      method: "POST",
      body: JSON.stringify({ signal }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function powerActionByIdentifier(identifier: string, signal: "start" | "stop" | "restart" | "kill") {
  try {
    const res = await clientRequest(`/servers/${identifier}/power`, {
      method: "POST",
      body: JSON.stringify({ signal }),
    })
    return res.ok
  } catch {
    return false
  }
}

export type CreateServerParams = {
  name: string
  externalId: string
  userId: number
  eggId: number
  dockerImage: string
  startup?: string
  environment: Record<string, string | number | boolean>
  memoryMB: number
  diskMB: number
  cpuPercent: number
  locations: number[]
}

export async function createServer(params: CreateServerParams): Promise<PteroServer | null> {
  try {
    const body = {
      name: params.name,
      user: params.userId,
      external_id: params.externalId,
      egg: params.eggId,
      docker_image: params.dockerImage,
      startup: params.startup ?? "",
      environment: params.environment,
      limits: {
        memory: params.memoryMB,
        swap: 0,
        disk: params.diskMB,
        io: 500,
        cpu: params.cpuPercent,
      },
      feature_limits: {
        databases: 1,
        backups: 1,
        allocations: 1,
      },
      deploy: {
        locations: params.locations,
        dedicated_ip: false,
        port_range: [],
      },
      start_on_completion: true,
    }

    const res = await appRequest(`/servers`, {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      console.warn("Pterodactyl create server failed:", text)
      return null
    }
    const json = await res.json()
    return json?.attributes as PteroServer
  } catch (e) {
    console.warn("Pterodactyl create error:", (e as Error)?.message)
    return null
  }
}

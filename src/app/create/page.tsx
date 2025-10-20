"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconServer, IconWorld, IconCpu, IconDatabase } from "@tabler/icons-react"
import { broadcastServersUpdated } from "@/lib/profile-events"

export default function CreateServerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userSpecs, setUserSpecs] = useState<any>(null)
  const [nests, setNests] = useState<any[]>([])
  const [eggs, setEggs] = useState<any[]>([])
  const [nodes, setNodes] = useState<any[]>([])
  const [selectedNestId, setSelectedNestId] = useState<string>("")
  const [selectedEggId, setSelectedEggId] = useState<string>("")
  const [selectedLocId, setSelectedLocId] = useState<string>("")
  const [selRam, setSelRam] = useState<number>(4)
  const [selDisk, setSelDisk] = useState<number>(10)
  const [selCpu, setSelCpu] = useState<number>(100) // percent
  const [formData, setFormData] = useState({
    name: "",
    type: "minecraft-java",
    version: "1.21.5",
    software: "vanilla",
    description: "",
  })

  const fetchPanelOptions = async () => {
    try {
      const nestsRes = await fetch("/api/ptero/nests")
      if (nestsRes.ok) {
        const nests = await nestsRes.json()
        setNests(nests)
        if (nests.length && !selectedNestId) {
          setSelectedNestId(String(nests[0].id))
          await fetchEggs(String(nests[0].id))
        }
      }
      const nodesRes = await fetch("/api/ptero/nodes")
      if (nodesRes.ok) setNodes(await nodesRes.json())
    } catch (e) {
      console.error("Error fetching Ptero options:", e)
    }
  }

  const fetchEggs = async (nestId: string) => {
    try {
      setEggs([])
      const res = await fetch(`/api/ptero/eggs?nestId=${nestId}`)
      if (res.ok) {
        const data = await res.json()
        setEggs(data)
      }
    } catch (e) {
      console.error("Error fetching eggs:", e)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
    if (status === "authenticated") {
      fetchUserSpecs()
      fetchPanelOptions()
    }
  }, [status])

  const fetchUserSpecs = async () => {
    try {
      const res = await fetch("/api/user/profile")
      if (res.ok) {
        const data = await res.json()
        setUserSpecs(data)
        // Initialize sliders within available specs
        const maxRam = Math.max(4, Number(data?.ram ?? 4))
        const maxDisk = Math.max(10, Number(data?.disk ?? 10))
        const maxCpu = Math.max(50, Number(data?.cpu ?? 100))
        setSelRam(Math.min(4, maxRam))
        setSelDisk(Math.min(10, maxDisk))
        setSelCpu(Math.min(100, maxCpu))
      }
    } catch (error) {
      console.error("Error fetching user specs:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          description: formData.description?.trim?.() || undefined,
          ram: selRam,
          disk: selDisk,
          cpu: selCpu,
          pteroEggId: selectedEggId ? Number(selectedEggId) : undefined,
          pteroNodeLocationId: selectedLocId ? Number(selectedLocId) : undefined,
        })
      })

      const data = await res.json()

      if (res.ok) {
        broadcastServersUpdated()
        router.push("/servers?created=1")
      } else {
        alert(data.error || "Failed to create server")
      }
    } catch (error) {
      console.error("Error creating server:", error)
      alert("Failed to create server")
    }

    setLoading(false)
  }

  if (status === "loading") {
    return <DashboardLayout><div className="px-4 lg:px-6">Loading...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Server</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Server Configuration</CardTitle>
                <CardDescription>Configure your new Minecraft server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Server Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Server"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description (optional)</Label>
                  <Input
                    id="desc"
                    placeholder="Short description"
                    value={(formData as any).description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value } as any)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Server Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="minecraft-java">Minecraft Java Edition</option>
                    <option value="minecraft-bedrock" disabled>Minecraft Bedrock (Coming Soon)</option>
                    <option value="custom" disabled>Custom (Coming Soon)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="version">Minecraft Version</Label>
                    <select
                      id="version"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      required
                    >
                      <option value="1.21.5">1.21.5 (Latest)</option>
                      <option value="1.21.4">1.21.4</option>
                      <option value="1.21.3">1.21.3</option>
                      <option value="1.20.4">1.20.4</option>
                      <option value="1.20.1">1.20.1</option>
                      <option value="1.19.4">1.19.4</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="software">Server Software</Label>
                    <select
                      id="software"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.software}
                      onChange={(e) => setFormData({ ...formData, software: e.target.value })}
                      required
                    >
                      <option value="vanilla">Vanilla</option>
                      <option value="paper">Paper</option>
                      <option value="spigot">Spigot</option>
                      <option value="forge">Forge</option>
                      <option value="fabric">Fabric</option>
                    </select>
                  </div>
                </div>

                {(nests.length > 0 || eggs.length > 0 || nodes.length > 0) && (
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-medium">Software (Nest) and Mode (Egg)</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nest">Pterodactyl Nest</Label>
                        <select
                          id="nest"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={selectedNestId}
                          onChange={async (e) => {
                            const v = e.target.value
                            setSelectedNestId(v)
                            setSelectedEggId("")
                            await fetchEggs(v)
                          }}
                        >
                          <option value="">Auto</option>
                          {nests.map((n) => (
                            <option key={n.id} value={n.id}>{`#${n.id} ${n.name}`}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="egg">Pterodactyl Egg</Label>
                        <select
                          id="egg"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={selectedEggId}
                          onChange={(e) => setSelectedEggId(e.target.value)}
                        >
                          <option value="">Auto (panel)</option>
                          {eggs.map((e) => (
                            <option key={e.id} value={e.id}>{`#${e.id} ${e.name}`}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loc">Node Location ID</Label>
                        <select
                          id="loc"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={selectedLocId}
                          onChange={(e) => setSelectedLocId(e.target.value)}
                        >
                          <option value="">Auto (panel)</option>
                          {Array.from(new Set(nodes.map((n) => n.locationId).filter((x) => typeof x === 'number'))).map((locId: any) => (
                            <option key={locId} value={locId}>{`Location ${locId}`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resources */}
                <div className="space-y-4 pt-2">
                  <p className="text-sm font-medium">Resources</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span>RAM</span><span>{selRam} GB</span></div>
                      <input type="range" min={1} max={Math.max(4, Number(userSpecs?.ram ?? 4))} step={1} value={selRam} onChange={(e)=>setSelRam(Number(e.target.value))} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span>Disk</span><span>{selDisk} GB</span></div>
                      <input type="range" min={1} max={Math.max(10, Number(userSpecs?.disk ?? 10))} step={1} value={selDisk} onChange={(e)=>setSelDisk(Number(e.target.value))} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span>CPU</span><span>{selCpu}%</span></div>
                      <input type="range" min={50} max={Math.max(50, Number(userSpecs?.cpu ?? 100))} step={10} value={selCpu} onChange={(e)=>setSelCpu(Number(e.target.value))} className="w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 px-0">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Server"}
                </Button>
              </CardFooter>
            </Card>
            </form>
          </div>

          {/* Resource Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Included Resources</CardTitle>
                <CardDescription>Free tier specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconCpu className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">CPU</p>
                    <p className="text-xs text-muted-foreground">Shared vCPU</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconDatabase className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">RAM</p>
                    <p className="text-xs text-muted-foreground">4 GB Memory</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconServer className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Storage</p>
                    <p className="text-xs text-muted-foreground">10 GB SSD</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Need More?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade your resources with coins or purchase specs for better performance.
                </p>
                <Button variant="outline" className="w-full">
                  View Shop
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

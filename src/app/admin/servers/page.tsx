"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconServer, IconTrash, IconSearch, IconPlayerStop, IconPlayerPlay, IconSettings, IconEye, IconRefresh } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Server {
  id: string
  name: string
  userId: string
  status: string
  ram: number
  cpu: number
  disk: number
  createdAt: string
  user?: {
    email: string
    name: string
  }
}

export default function ManageServersPage() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/servers")
      if (res.ok) {
        const data = await res.json()
        setServers(data)
      }
    } catch (error) {
      console.error("Failed to fetch servers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this server? This action cannot be undone.")) return
    
    try {
      const res = await fetch(`/api/servers/${id}`, { method: "DELETE" })
      if (res.ok) {
        alert("Server deleted successfully")
        fetchServers()
      } else {
        alert("Failed to delete server")
      }
    } catch (error) {
      console.error("Failed to delete server:", error)
      alert("Failed to delete server")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-600"
      case "offline":
        return "bg-gray-500/10 text-gray-600"
      case "starting":
        return "bg-blue-500/10 text-blue-600"
      case "error":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Manage Servers</h1>
          <p className="text-muted-foreground mt-2">View and manage all user servers</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[250px]">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search servers by name or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button size="sm" variant="outline" onClick={fetchServers}>
                <IconRefresh className="mr-2 size-4" />
                Refresh
              </Button>
              <Badge variant="outline">Total: {servers.length} servers</Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-600">
                Online: {servers.filter(s => s.status === "running").length}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Loading servers...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredServers.map((server) => (
              <Card key={server.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <IconServer className="size-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{server.name}</h3>
                          <Badge className={getStatusColor(server.status)}>
                            {server.status || "offline"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                          Owner: {server.user?.email || "Unknown"} {server.user?.name && `(${server.user.name})`}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">RAM:</span>
                            <span className="font-medium ml-2">{server.ram} GB</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CPU:</span>
                            <span className="font-medium ml-2">{server.cpu}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Disk:</span>
                            <span className="font-medium ml-2">{server.disk} GB</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <span className="font-medium ml-2">
                              {new Date(server.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link href={`/servers/${server.id}`}>
                          <IconEye className="mr-2 size-4" />
                          View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(server.id)}
                      >
                        <IconTrash className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredServers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No servers found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

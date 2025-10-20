"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconDatabase, IconEdit, IconTrash, IconPlus, IconServer } from "@tabler/icons-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function NodesPage() {
  const [nodes, setNodes] = useState([
    {
      id: 1,
      name: "Node-MUM-01",
      location: "Mumbai, India",
      ip: "103.123.45.67",
      ram: 64,
      cpu: 16,
      disk: 1000,
      status: "online"
    },
  ])
  
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    ip: "",
    ram: "",
    cpu: "",
    disk: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newNode = {
      id: nodes.length + 1,
      ...formData,
      ram: parseInt(formData.ram),
      cpu: parseInt(formData.cpu),
      disk: parseInt(formData.disk),
      status: "online"
    }
    setNodes([...nodes, newNode])
    setFormData({ name: "", location: "", ip: "", ram: "", cpu: "", disk: "" })
    setIsAdding(false)
  }

  const handleDelete = (id: number) => {
    setNodes(nodes.filter(node => node.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Nodes</h1>
            <p className="text-muted-foreground mt-2">Add and configure server nodes</p>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)}>
            <IconPlus className="mr-2 size-4" />
            Add Node
          </Button>
        </div>

        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Node</CardTitle>
              <CardDescription>Configure a new server node</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Node Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Node-MUM-01"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Mumbai, India"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input
                    id="ip"
                    placeholder="e.g., 103.123.45.67"
                    value={formData.ip}
                    onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ram">RAM (GB)</Label>
                    <Input
                      id="ram"
                      type="number"
                      placeholder="64"
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpu">CPU Cores</Label>
                    <Input
                      id="cpu"
                      type="number"
                      placeholder="16"
                      value={formData.cpu}
                      onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disk">Disk (GB)</Label>
                    <Input
                      id="disk"
                      type="number"
                      placeholder="1000"
                      value={formData.disk}
                      onChange={(e) => setFormData({ ...formData, disk: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="submit">Add Node</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nodes.map((node) => (
            <Card key={node.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconDatabase className="size-5 text-primary" />
                  {node.name}
                </CardTitle>
                <CardDescription>{node.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-mono">{node.ip}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">RAM</span>
                  <span className="font-semibold">{node.ram} GB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">CPU</span>
                  <span className="font-semibold">{node.cpu} Cores</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Disk</span>
                  <span className="font-semibold">{node.disk} GB</span>
                </div>
                <div className="pt-2">
                  <Badge className={node.status === "online" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}>
                    {node.status}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <IconEdit className="mr-2 size-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDelete(node.id)}
                >
                  <IconTrash className="mr-2 size-4 text-destructive" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

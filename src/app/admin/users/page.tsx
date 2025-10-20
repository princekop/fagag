"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconUsers, IconEdit, IconTrash, IconSearch, IconCoin, IconServer, IconShield, IconX } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [editingUser, setEditingUser] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }
  
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchUsers()
        alert("User deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user")
    }
  }

  const toggleStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status === "active" ? "suspended" : "active" })
      })
      if (res.ok) await fetchUsers()
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  const toggleRole = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: role === "user" ? "admin" : "user" })
      })
      if (res.ok) await fetchUsers()
    } catch (error) {
      console.error("Error toggling role:", error)
    }
  }

  const openEditModal = (user: any) => {
    setEditingUser({
      id: user.id,
      coins: user.coins || 0,
      ram: user.ram || 4,
      cpu: user.cpu || 100,
      disk: user.disk || 10,
      serverSlots: user.serverSlots || 1
    })
    setShowEditModal(true)
  }

  const handleUpdateSpecs = async () => {
    if (!editingUser) return
    
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coins: parseInt(editingUser.coins),
          ram: parseInt(editingUser.ram),
          cpu: parseInt(editingUser.cpu),
          disk: parseInt(editingUser.disk),
          serverSlots: parseInt(editingUser.serverSlots)
        })
      })
      
      if (res.ok) {
        await fetchUsers()
        setShowEditModal(false)
        setEditingUser(null)
        alert("User specs updated successfully!")
      } else {
        alert("Failed to update user specs")
      }
    } catch (error) {
      console.error("Error updating specs:", error)
      alert("Failed to update user specs")
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground mt-2">View and manage all user accounts</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="outline">Total: {users.length} users</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <IconUsers className="size-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge
                          variant="outline"
                          className={user.role === "admin" ? "bg-purple-500/10 text-purple-600" : ""}
                        >
                          {user.role === "admin" ? <IconShield className="mr-1 size-3" /> : null}
                          {user.role}
                        </Badge>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }
                        >
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
                      
                      <div className="flex items-center gap-4 mt-3 flex-wrap text-sm">
                        <div className="flex items-center gap-1">
                          <IconCoin className="size-4 text-primary" />
                          <span className="font-medium">{user.coins}</span>
                          <span className="text-muted-foreground">coins</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconServer className="size-4 text-blue-500" />
                          <span className="font-medium">{user.servers}</span>
                          <span className="text-muted-foreground">servers</span>
                        </div>
                        <div className="text-muted-foreground">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRole(user.id, user.role)}
                    >
                      {user.role === "user" ? "Make Admin" : "Remove Admin"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(user.id, user.status)}
                    >
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>
                      <IconEdit className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(user.id)}
                    >
                      <IconTrash className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No users found matching your search.</p>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Edit User Specs</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => setShowEditModal(false)}>
                    <IconX className="size-4" />
                  </Button>
                </div>
                <CardDescription>Update coins and server specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coins">Coins</Label>
                  <Input
                    id="coins"
                    type="number"
                    value={editingUser.coins}
                    onChange={(e) => setEditingUser({ ...editingUser, coins: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ram">RAM (GB)</Label>
                  <Input
                    id="ram"
                    type="number"
                    value={editingUser.ram}
                    onChange={(e) => setEditingUser({ ...editingUser, ram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU (%)</Label>
                  <Input
                    id="cpu"
                    type="number"
                    value={editingUser.cpu}
                    onChange={(e) => setEditingUser({ ...editingUser, cpu: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">100 = 1 core, 200 = 2 cores, etc.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disk">Disk (GB)</Label>
                  <Input
                    id="disk"
                    type="number"
                    value={editingUser.disk}
                    onChange={(e) => setEditingUser({ ...editingUser, disk: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slots">Server Slots</Label>
                  <Input
                    id="slots"
                    type="number"
                    value={editingUser.serverSlots}
                    onChange={(e) => setEditingUser({ ...editingUser, serverSlots: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardContent className="flex gap-2">
                <Button onClick={handleUpdateSpecs} className="flex-1">
                  Update Specs
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconTrophy, IconEdit, IconTrash, IconPlus, IconActivity, IconFlame, IconCoin } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LeaderboardEntry {
  id: string
  type: string
  userId: string
  username: string
  avatar?: string
  score: number
  servers: number
  uptime?: string
  tasks: number
}

export default function LeaderboardAdminPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [formData, setFormData] = useState({
    type: "coins",
    userId: "",
    username: "",
    avatar: "",
    score: "",
    servers: "0",
    uptime: "",
    tasks: "0"
  })

  useEffect(() => {
    fetchEntries()
  }, [filterType])

  const fetchEntries = async () => {
    try {
      const url = filterType !== "all" ? `/api/admin/leaderboard?type=${filterType}` : "/api/admin/leaderboard"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error("Error fetching entries:", error)
      alert("Failed to fetch leaderboard entries")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingEntry 
        ? `/api/admin/leaderboard/${editingEntry.id}`
        : "/api/admin/leaderboard"
      
      const method = editingEntry ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingEntry ? "Entry updated successfully" : "Entry created successfully")
        fetchEntries()
        resetForm()
      } else {
        throw new Error("Failed to save entry")
      }
    } catch (error) {
      console.error("Error saving entry:", error)
      alert("Failed to save entry")
    }
  }

  const handleEdit = (entry: LeaderboardEntry) => {
    setEditingEntry(entry)
    setFormData({
      type: entry.type,
      userId: entry.userId,
      username: entry.username,
      avatar: entry.avatar || "",
      score: entry.score.toString(),
      servers: entry.servers.toString(),
      uptime: entry.uptime || "",
      tasks: entry.tasks.toString()
    })
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      const response = await fetch(`/api/admin/leaderboard/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        alert("Entry deleted successfully")
        fetchEntries()
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
      alert("Failed to delete entry")
    }
  }

  const resetForm = () => {
    setFormData({
      type: "coins",
      userId: "",
      username: "",
      avatar: "",
      score: "",
      servers: "0",
      uptime: "",
      tasks: "0"
    })
    setIsAdding(false)
    setEditingEntry(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "coins": return <IconCoin className="size-4 text-yellow-500" />
      case "afk": return <IconFlame className="size-4 text-orange-500" />
      case "activity": return <IconActivity className="size-4 text-blue-500" />
      default: return <IconTrophy className="size-4" />
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Leaderboard</h1>
            <p className="text-muted-foreground mt-2">Add and manage leaderboard entries</p>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="coins">Coins</SelectItem>
                <SelectItem value="afk">AFK</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsAdding(!isAdding)}>
              <IconPlus className="mr-2 size-4" />
              Add Entry
            </Button>
          </div>
        </div>

        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingEntry ? "Edit Entry" : "Add New Entry"}</CardTitle>
              <CardDescription>
                {editingEntry ? "Update leaderboard entry" : "Create a new leaderboard entry"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      disabled={!!editingEntry}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coins">Coins</SelectItem>
                        <SelectItem value="afk">AFK</SelectItem>
                        <SelectItem value="activity">Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                      id="userId"
                      placeholder="user_123abc"
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      required
                      disabled={!!editingEntry}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="PlayerName"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar (Emoji or URL)</Label>
                    <Input
                      id="avatar"
                      placeholder="🎮"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="score">Score</Label>
                    <Input
                      id="score"
                      type="number"
                      placeholder="1000"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servers">Servers</Label>
                    <Input
                      id="servers"
                      type="number"
                      placeholder="0"
                      value={formData.servers}
                      onChange={(e) => setFormData({ ...formData, servers: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="uptime">Uptime (for activity)</Label>
                    <Input
                      id="uptime"
                      placeholder="95%"
                      value={formData.uptime}
                      onChange={(e) => setFormData({ ...formData, uptime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tasks">Tasks (for activity)</Label>
                    <Input
                      id="tasks"
                      type="number"
                      placeholder="0"
                      value={formData.tasks}
                      onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="submit">
                  {editingEntry ? "Update Entry" : "Add Entry"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-lg">
                      {entry.avatar || "👤"}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {entry.username}
                        {getTypeIcon(entry.type)}
                        <Badge variant="outline" className="capitalize">{entry.type}</Badge>
                      </CardTitle>
                      <CardDescription className="text-xs">User ID: {entry.userId}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{entry.score}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Servers:</span>
                    <span className="ml-2 font-semibold">{entry.servers}</span>
                  </div>
                  {entry.uptime && (
                    <div>
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="ml-2 font-semibold">{entry.uptime}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="ml-2 font-semibold">{entry.tasks}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(entry)}>
                  <IconEdit className="mr-2 size-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDelete(entry.id)}
                >
                  <IconTrash className="mr-2 size-4 text-destructive" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}

          {entries.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No leaderboard entries yet. Click "Add Entry" to create one.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

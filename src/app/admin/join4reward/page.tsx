"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { IconGift, IconEdit, IconTrash, IconPlus, IconCoin } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  platform: string
  description: string
  reward: number
  link: string
  actionLabel: string
  icon: string
  color: string
  isActive: boolean
  sortOrder: number
}

export default function Join4RewardAdminPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    platform: "",
    description: "",
    reward: "",
    link: "",
    actionLabel: "",
    icon: "IconBrandDiscord",
    color: "from-primary/20 to-transparent",
    isActive: true,
    sortOrder: "0"
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/admin/join4reward")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      alert("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingTask 
        ? `/api/admin/join4reward/${editingTask.id}`
        : "/api/admin/join4reward"
      
      const method = editingTask ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingTask ? "Task updated successfully" : "Task created successfully")
        fetchTasks()
        resetForm()
      } else {
        throw new Error("Failed to save task")
      }
    } catch (error) {
      console.error("Error saving task:", error)
      alert("Failed to save task")
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      platform: task.platform,
      description: task.description,
      reward: task.reward.toString(),
      link: task.link,
      actionLabel: task.actionLabel,
      icon: task.icon,
      color: task.color,
      isActive: task.isActive,
      sortOrder: task.sortOrder.toString()
    })
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      const response = await fetch(`/api/admin/join4reward/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        alert("Task deleted successfully")
        fetchTasks()
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      alert("Failed to delete task")
    }
  }

  const resetForm = () => {
    setFormData({
      platform: "",
      description: "",
      reward: "",
      link: "",
      actionLabel: "",
      icon: "IconBrandDiscord",
      color: "from-primary/20 to-transparent",
      isActive: true,
      sortOrder: "0"
    })
    setIsAdding(false)
    setEditingTask(null)
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
            <h1 className="text-3xl font-bold">Manage Join4Reward Tasks</h1>
            <p className="text-muted-foreground mt-2">Add and manage social reward tasks</p>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)}>
            <IconPlus className="mr-2 size-4" />
            Add Task
          </Button>
        </div>

        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingTask ? "Edit Task" : "Add New Task"}</CardTitle>
              <CardDescription>
                {editingTask ? "Update task details" : "Create a new social reward task"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform Name</Label>
                    <Input
                      id="platform"
                      placeholder="e.g., Discord, Twitter, YouTube"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward (Coins)</Label>
                    <Input
                      id="reward"
                      type="number"
                      placeholder="100"
                      value={formData.reward}
                      onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the task..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link URL</Label>
                  <Input
                    id="link"
                    type="url"
                    placeholder="https://discord.gg/invite"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actionLabel">Button Label</Label>
                    <Input
                      id="actionLabel"
                      placeholder="Join Server"
                      value={formData.actionLabel}
                      onChange={(e) => setFormData({ ...formData, actionLabel: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      placeholder="0"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon Name</Label>
                  <Input
                    id="icon"
                    placeholder="IconBrandDiscord"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use Tabler icon names: IconBrandDiscord, IconBrandTwitter, IconBrandYoutube, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color Gradient</Label>
                  <Input
                    id="color"
                    placeholder="from-indigo-500/20 to-purple-500/20"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use Tailwind gradient classes
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="submit">
                  {editingTask ? "Update Task" : "Add Task"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconGift className="size-5 text-primary" />
                  {task.platform}
                </CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    <IconCoin className="mr-1 size-3" />
                    {task.reward} coins
                  </Badge>
                  {task.isActive ? (
                    <Badge className="bg-green-500/10 text-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Button:</span> {task.actionLabel}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Order:</span> {task.sortOrder}
                  </p>
                  <p className="text-muted-foreground truncate">
                    <span className="font-medium">Link:</span>{" "}
                    <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {task.link}
                    </a>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(task)}>
                  <IconEdit className="mr-2 size-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDelete(task.id)}
                >
                  <IconTrash className="mr-2 size-4 text-destructive" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}

          {tasks.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No tasks yet. Click "Add Task" to create one.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

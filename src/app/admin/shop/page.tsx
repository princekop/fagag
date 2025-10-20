"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconShoppingCart, IconEdit, IconTrash, IconPlus, IconCoin, IconDatabase, IconCpu, IconServer } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface ShopItem {
  id: string
  name: string
  description: string
  type: string
  value: number
  price: number
  image?: string
  isActive: boolean
  sortOrder: number
}

export default function AdminShopPage() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "coin_package",
    value: "",
    price: "",
    image: ""
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/shop")
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Error fetching items:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = editingItem ? `/api/admin/shop/${editingItem.id}` : "/api/admin/shop"
      const method = editingItem ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          value: parseInt(formData.value),
          price: parseInt(formData.price)
        })
      })

      if (res.ok) {
        await fetchItems()
        setFormData({ name: "", description: "", type: "coin_package", value: "", price: "", image: "" })
        setIsAdding(false)
        setEditingItem(null)
        alert(editingItem ? "Item updated successfully!" : "Item created successfully!")
      } else {
        const data = await res.json()
        alert(data.error || "Failed to save item")
      }
    } catch (error) {
      console.error("Error saving item:", error)
      alert("Failed to save item")
    }
    setLoading(false)
  }

  const handleEdit = (item: ShopItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      type: item.type,
      value: item.value.toString(),
      price: item.price.toString(),
      image: item.image || ""
    })
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    
    try {
      const res = await fetch(`/api/admin/shop/${id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchItems()
        alert("Item deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item")
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/shop/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive })
      })
      if (res.ok) {
        await fetchItems()
      }
    } catch (error) {
      console.error("Error toggling item:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "coin_package": return IconCoin
      case "ram": return IconDatabase
      case "cpu": return IconCpu
      case "disk": return IconDatabase
      case "server_slot": return IconServer
      default: return IconShoppingCart
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "coin_package": return "Coin Package"
      case "ram": return "RAM"
      case "cpu": return "CPU"
      case "disk": return "Disk"
      case "server_slot": return "Server Slot"
      default: return type
    }
  }

  const getValueLabel = (type: string, value: number) => {
    switch (type) {
      case "coin_package": return `${value} Coins`
      case "ram": return `${value} GB RAM`
      case "cpu": return `${value}% CPU`
      case "disk": return `${value} GB Disk`
      case "server_slot": return `${value} Slot${value > 1 ? 's' : ''}`
      default: return value
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Shop</h1>
            <p className="text-muted-foreground mt-2">Configure shop items and prices</p>
          </div>
          <Button onClick={() => {
            setIsAdding(!isAdding)
            setEditingItem(null)
            setFormData({ name: "", description: "", type: "coin_package", value: "", price: "", image: "" })
          }}>
            <IconPlus className="mr-2 size-4" />
            Add Item
          </Button>
        </div>

        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingItem ? "Edit Item" : "Add New Item"}</CardTitle>
              <CardDescription>Configure shop item details</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., 100 Coins Package"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="coin_package">Coin Package</option>
                      <option value="ram">RAM</option>
                      <option value="cpu">CPU</option>
                      <option value="disk">Disk</option>
                      <option value="server_slot">Server Slot</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this item..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      placeholder="100"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.type === "coin_package" ? "Coins" : 
                       formData.type === "ram" ? "GB" :
                       formData.type === "cpu" ? "%" :
                       formData.type === "disk" ? "GB" : "Slots"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">In Indian Rupees</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setIsAdding(false)
                  setEditingItem(null)
                }}>
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = getTypeIcon(item.type)
            return (
              <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="size-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-semibold">{getValueLabel(item.type, item.value)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Price:</span>
                    <span className="text-xl font-bold text-primary">₹{item.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Status:</span>
                    <Badge className={item.isActive ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-600"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(item)}>
                    <IconEdit className="mr-2 size-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleActive(item.id, item.isActive)}>
                    {item.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                    <IconTrash className="size-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {items.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <IconShoppingCart className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No shop items yet. Click "Add Item" to create one.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

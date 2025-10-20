"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconMapPin, IconEdit, IconTrash, IconPlus, IconPhoto } from "@tabler/icons-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function LocationsPage() {
  const [locations, setLocations] = useState([
    { id: 1, name: "Mumbai, India", description: "Asia Pacific datacenter with low latency", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400" },
    { id: 2, name: "Singapore", description: "High-speed Asian connectivity hub", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400" },
  ])
  
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    imageFile: null as File | null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add location logic here
    const newLocation = {
      id: locations.length + 1,
      name: formData.name,
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400"
    }
    setLocations([...locations, newLocation])
    setFormData({ name: "", description: "", image: "", imageFile: null })
    setIsAdding(false)
  }

  const handleDelete = (id: number) => {
    setLocations(locations.filter(loc => loc.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Locations</h1>
            <p className="text-muted-foreground mt-2">Add and manage server locations</p>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)}>
            <IconPlus className="mr-2 size-4" />
            Add Location
          </Button>
        </div>

        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Location</CardTitle>
              <CardDescription>Create a new server location</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mumbai, India"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this location..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Or upload an image below</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageFile">Upload Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                    />
                    <IconPhoto className="size-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="submit">Add Location</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconMapPin className="size-5 text-primary" />
                  {location.name}
                </CardTitle>
                <CardDescription>{location.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Active</Badge>
                  <Badge variant="outline">0 Nodes</Badge>
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
                  onClick={() => handleDelete(location.id)}
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

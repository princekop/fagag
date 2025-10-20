"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function AdminPteroEggsPage() {
  const [eggs, setEggs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ pteroId: "", nestPteroId: "", name: "", dockerImage: "", startup: "", isEnabled: true })

  const load = async () => {
    try {
      const res = await fetch("/api/admin/ptero/eggs")
      if (res.ok) setEggs(await res.json())
    } catch {}
  }

  useEffect(() => { load() }, [])

  const syncFromPanel = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/ptero/eggs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sync: true }) })
      if (res.ok) await load()
    } finally { setLoading(false) }
  }

  const addManual = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        pteroId: Number(form.pteroId),
        nestPteroId: Number(form.nestPteroId),
        dockerImage: form.dockerImage || null,
        startup: form.startup || null,
      }
      const res = await fetch("/api/admin/ptero/eggs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (res.ok) {
        setForm({ pteroId: "", nestPteroId: "", name: "", dockerImage: "", startup: "", isEnabled: true })
        await load()
      }
    } finally { setLoading(false) }
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pterodactyl Eggs</h1>
            <p className="text-muted-foreground mt-2">Sync from panel or add manually</p>
          </div>
          <Button onClick={syncFromPanel} disabled={loading}>{loading ? "Syncing..." : "Sync from Panel"}</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Egg manually</CardTitle>
            <CardDescription>Provide Pterodactyl Egg ID, Nest ID and details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addManual} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pteroId">Egg ID</Label>
                <Input id="pteroId" type="number" value={form.pteroId} onChange={(e) => setForm({ ...form, pteroId: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nestPteroId">Nest ID</Label>
                <Input id="nestPteroId" type="number" value={form.nestPteroId} onChange={(e) => setForm({ ...form, nestPteroId: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dockerImage">Docker Image</Label>
                <Input id="dockerImage" value={form.dockerImage} onChange={(e) => setForm({ ...form, dockerImage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup">Startup</Label>
                <Input id="startup" value={form.startup} onChange={(e) => setForm({ ...form, startup: e.target.value })} />
              </div>
              <div className="md:col-span-5 flex items-end">
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eggs.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">#{e.pteroId} {e.name} {e.isEnabled ? <Badge className="bg-green-500/10 text-green-600">Enabled</Badge> : <Badge variant="outline">Disabled</Badge>}</CardTitle>
                <CardDescription>Nest: {e.nestPteroId} • Image: {e.dockerImage || "(panel default)"}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

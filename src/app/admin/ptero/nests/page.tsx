"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function AdminPteroNestsPage() {
  const [nests, setNests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ pteroId: "", name: "", isEnabled: true })

  const load = async () => {
    try {
      const res = await fetch("/api/admin/ptero/nests")
      if (res.ok) setNests(await res.json())
    } catch {}
  }

  useEffect(() => { load() }, [])

  const syncFromPanel = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/ptero/nests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sync: true }) })
      if (res.ok) await load()
    } finally { setLoading(false) }
  }

  const addManual = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/ptero/nests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, pteroId: Number(form.pteroId) }) })
      if (res.ok) {
        setForm({ pteroId: "", name: "", isEnabled: true })
        await load()
      }
    } finally { setLoading(false) }
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pterodactyl Nests</h1>
            <p className="text-muted-foreground mt-2">Sync from panel or add manually</p>
          </div>
          <Button onClick={syncFromPanel} disabled={loading}>{loading ? "Syncing..." : "Sync from Panel"}</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Nest manually</CardTitle>
            <CardDescription>Provide Pterodactyl Nest ID and name</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addManual} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pteroId">Nest ID</Label>
                <Input id="pteroId" type="number" value={form.pteroId} onChange={(e) => setForm({ ...form, pteroId: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nests.map((n) => (
            <Card key={n.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">#{n.pteroId} {n.name} {n.isEnabled ? <Badge className="bg-green-500/10 text-green-600">Enabled</Badge> : <Badge variant="outline">Disabled</Badge>}</CardTitle>
                <CardDescription>Eggs: {n.eggs?.length ?? 0}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

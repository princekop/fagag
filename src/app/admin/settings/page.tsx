"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconSettings, IconDeviceFloppy } from "@tabler/icons-react"

type Settings = {
  defaultRam: number
  defaultCpu: number
  defaultDisk: number
  defaultServerSlots: number
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({
    defaultRam: 4,
    defaultCpu: 100,
    defaultDisk: 10,
    defaultServerSlots: 1,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/dashboard")
      } else {
        fetchSettings()
      }
    }
  }, [status, session])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (e) {
      console.error("Failed to fetch settings", e)
    }
    setLoading(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setMessage("Settings saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to save settings")
      }
    } catch (e) {
      console.error("Failed to save settings", e)
      setMessage("Error saving settings")
    }
    setSaving(false)
  }

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="px-4 lg:px-6">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <IconSettings className="size-8" />
            Free Specs Configuration
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure default resource limits for new users
          </p>
        </div>

        {message && (
          <Card className={message.includes("success") ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}>
            <CardContent className="py-3">
              <p className={message.includes("success") ? "text-green-400" : "text-red-400"}>
                {message}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Default Resource Limits</CardTitle>
            <CardDescription>
              These limits will be applied to all new users upon registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ram">Default RAM (GB)</Label>
                <Input
                  id="ram"
                  type="number"
                  min="1"
                  max="128"
                  value={settings.defaultRam}
                  onChange={(e) => setSettings({ ...settings, defaultRam: parseInt(e.target.value) || 1 })}
                />
                <p className="text-xs text-muted-foreground">
                  Amount of RAM each user gets by default
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpu">Default CPU (%)</Label>
                <Input
                  id="cpu"
                  type="number"
                  min="0"
                  max="1000"
                  value={settings.defaultCpu}
                  onChange={(e) => setSettings({ ...settings, defaultCpu: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  CPU percentage each user gets (100% = 1 core)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disk">Default Disk (GB)</Label>
                <Input
                  id="disk"
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.defaultDisk}
                  onChange={(e) => setSettings({ ...settings, defaultDisk: parseInt(e.target.value) || 1 })}
                />
                <p className="text-xs text-muted-foreground">
                  Amount of disk space each user gets
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serverSlots">Default Server Slots</Label>
                <Input
                  id="serverSlots"
                  type="number"
                  min="1"
                  max="50"
                  value={settings.defaultServerSlots}
                  onChange={(e) => setSettings({ ...settings, defaultServerSlots: parseInt(e.target.value) || 1 })}
                />
                <p className="text-xs text-muted-foreground">
                  Number of servers each user can create
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={saving} size="lg">
                <IconDeviceFloppy className="mr-2 size-5" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

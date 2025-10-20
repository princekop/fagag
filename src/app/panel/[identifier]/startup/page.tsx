"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IconArrowLeft, IconDeviceFloppy, IconBrandDocker } from "@tabler/icons-react"
import Link from "next/link"
import { PanelSidebar } from "@/components/panel-sidebar"

export default function StartupPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const identifier = params?.identifier as string

  const [server, setServer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [variables, setVariables] = useState<any[]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchServer()
    }
  }, [status, identifier])

  const fetchServer = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/panel/${identifier}`)
      if (res.ok) {
        const data = await res.json()
        setServer(data)
        // Extract variables from server data
        const vars = data.relationships?.variables?.data || []
        setVariables(vars)
      }
    } catch (e) {
      console.error("Failed to load server", e)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="text-white">Server not found</p>
      </div>
    )
  }

  const serverAttrs = server.attributes

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 size-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-1/4 top-1/3 size-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
        <div className="absolute bottom-0 left-1/3 size-96 animate-pulse rounded-full bg-green-500/10 blur-3xl delay-500" />
      </div>

      {/* Sidebar */}
      <PanelSidebar
        identifier={identifier}
        serverName={serverAttrs.name}
        serverStatus={serverAttrs.status}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="relative border-b border-white/10 backdrop-blur-xl bg-black/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="hover:bg-white/10">
                  <Link href="/servers">
                    <IconArrowLeft className="size-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Startup Settings</h1>
                  <p className="text-sm text-gray-400">{serverAttrs.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl space-y-6">
            {/* Docker Image */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <IconBrandDocker className="size-6 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Docker Image</h3>
                    <p className="text-sm text-gray-400">The Docker container image used for this server</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Input
                  value="ghcr.io/pterodactyl/yolks:java_17"
                  disabled
                  className="border-white/10 bg-white/5 text-gray-400 font-mono text-sm"
                />
                <p className="mt-2 text-xs text-gray-400">
                  This setting can only be changed by an administrator
                </p>
              </div>
            </div>

            {/* Startup Command */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white">Startup Command</h3>
                <p className="text-sm text-gray-400">Command executed when the server starts</p>
              </div>
              <div className="p-6">
                <Textarea
                  value="java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}"
                  disabled
                  className="min-h-24 border-white/10 bg-white/5 text-gray-400 font-mono text-sm"
                />
                <p className="mt-2 text-xs text-gray-400">
                  This setting can only be changed by an administrator
                </p>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white">Environment Variables</h3>
                <p className="text-sm text-gray-400">Configure server environment settings</p>
              </div>
              <div className="space-y-4 p-6">
                {variables.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-400">No environment variables configured</p>
                  </div>
                ) : (
                  variables.map((variable: any, idx: number) => (
                    <div key={idx}>
                      <label className="text-sm font-medium text-white">
                        {variable.attributes.name}
                      </label>
                      <Input
                        value={variable.attributes.server_value || variable.attributes.default_value}
                        className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                        placeholder={variable.attributes.default_value}
                      />
                      {variable.attributes.description && (
                        <p className="mt-1 text-xs text-gray-400">{variable.attributes.description}</p>
                      )}
                    </div>
                  ))
                )}
                <Button className="border-green-500/50 bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/30">
                  <IconDeviceFloppy className="mr-2 size-4" />
                  Save Variables
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

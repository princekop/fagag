"use client"

import { useEffect, useState } from "react"

export type UserProfile = {
  id: string
  email: string | null
  name: string | null
  image: string | null
  coins: number
  ram: number
  cpu: number
  disk: number
  serverSlots: number
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()

    const onVis = () => {
      if (document.visibilityState === "visible") fetchProfile()
    }
    const onUpdate = () => fetchProfile()
    document.addEventListener("visibilitychange", onVis)
    window.addEventListener("profile:updated", onUpdate)
    return () => {
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("profile:updated", onUpdate)
    }
  }, [])

  return { profile, loading, refresh: fetchProfile }
}

export function broadcastProfileUpdated() {
  try {
    window.dispatchEvent(new Event("profile:updated"))
  } catch {}
}

export function broadcastServersUpdated() {
  try {
    window.dispatchEvent(new Event("servers:updated"))
  } catch {}
}

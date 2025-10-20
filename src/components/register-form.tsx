"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FancyButton } from "@/components/ui/fancy-button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? "Failed to register")
      } else {
        router.push(`/login?callbackUrl=/dashboard`)
      }
    } catch (e) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Create your account
          </h1>
          <p className="text-sm font-semibold text-foreground/90 text-balance">
            Enter your details below to create an account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name" className="font-semibold text-foreground">Name</FieldLabel>
          <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="email" className="font-semibold text-foreground">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="password" className="font-semibold text-foreground">Password</FieldLabel>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field>
          <FancyButton type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </FancyButton>
        </Field>
        {error ? (
          <p className="text-destructive text-sm" role="alert">{error}</p>
        ) : null}
        <FieldDescription className="text-center text-sm font-semibold text-foreground/90">
          Already have an account? <a href="/login" className="font-bold text-primary underline underline-offset-4 hover:text-primary/80">Log in</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}

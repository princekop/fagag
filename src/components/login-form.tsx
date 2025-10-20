"use client"

import Image from "next/image"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FancyButton } from "@/components/ui/fancy-button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const KITTY_IMAGE = "https://i.postimg.cc/zf6WpwZ1/kitty.webp"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await signIn("credentials", {
        redirect: true,
        callbackUrl,
        email,
        password,
      })

      if (response && response.error) {
        setError(response.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Login to your account
            </h1>
            <div className="relative hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/15 shadow-lg backdrop-blur-md lg:flex">
              <Image src={KITTY_IMAGE} alt="Playful kitty" fill className="object-cover" />
              <div className="pointer-events-none absolute inset-0 rounded-full border border-white/60 bg-white/25" />
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground/90 text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email" className="font-semibold text-foreground">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="font-semibold text-foreground">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm font-bold text-foreground/90 underline-offset-4 hover:text-primary"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </Field>

        <Field>
          <FancyButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </FancyButton>
        </Field>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            className="font-semibold"
            onClick={() => signIn("github", { callbackUrl })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button>
          <FieldDescription className="text-center text-sm font-semibold text-foreground/90">
            Don&apos;t have an account? <a href="/register" className="font-bold text-primary underline underline-offset-4 hover:text-primary/80">Sign up</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

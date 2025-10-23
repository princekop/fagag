import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Paths that require authentication
  const protectedPaths = ["/dashboard", "/servers", "/create", "/panel", "/shop", "/earn", "/leaderboard"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  // Admin-only paths
  const adminPaths = ["/admin", "/api/admin"]
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p))

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Check authentication for protected paths
  if (isProtected) {
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Check admin role for admin paths
  if (isAdminPath) {
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
    
    if (token.role !== "admin") {
      // Non-admin trying to access admin area - redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // If user is logged in and hits /login, redirect to dashboard
  if (pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login", 
    "/dashboard/:path*", 
    "/servers/:path*", 
    "/create/:path*", 
    "/panel/:path*",
    "/shop/:path*",
    "/earn/:path*",
    "/leaderboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*"
  ],
}

import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions, Session } from "next-auth"
import { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Use NEXTAUTH_URL if set, otherwise use baseUrl
      const redirectBase = process.env.NEXTAUTH_URL || baseUrl
      
      // If the url is relative, prepend the base URL
      if (url.startsWith("/")) {
        return `${redirectBase}${url}`
      }
      
      // If the url is already absolute and matches our domain, use it
      if (url.startsWith(redirectBase)) {
        return url
      }
      
      // Otherwise redirect to dashboard
      return `${redirectBase}/dashboard`
    },
  },
}

export function getAuthSession() {
  return getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getAuthSession()
  return session?.user ?? null
}

import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import { accounts, sessions, users, verificationTokens } from "./db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "test@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Test User", email: "test@example.com", role: "Admin" }
        }
        if (credentials?.email === "vendor@example.com" && credentials?.password === "password") {
          return { id: "2", name: "Vendor User", email: "vendor@example.com", role: "Vendor" }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as "Buyer" | "Vendor" | "Admin"
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
})
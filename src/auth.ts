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
          return { id: "1", name: "Test User", email: "test@example.com" }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  }
})
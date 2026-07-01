import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role: "Buyer" | "Vendor" | "Admin"
  }
  interface Session {
    user: User & {
      id: string
      role: "Buyer" | "Vendor" | "Admin"
    }
  }
}

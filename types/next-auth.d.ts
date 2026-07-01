import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "Buyer" | "Vendor" | "Admin";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "Buyer" | "Vendor" | "Admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "Buyer" | "Vendor" | "Admin";
  }
}

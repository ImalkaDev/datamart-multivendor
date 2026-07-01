import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["Buyer", "Vendor"]),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password, role } = result.data

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role,
    })

    return NextResponse.json({ success: true, message: "User registered successfully." })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

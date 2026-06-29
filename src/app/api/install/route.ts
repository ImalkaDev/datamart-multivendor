import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const installSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: NextRequest) {
  try {
    // Check if any admin user exists
    const adminUsers = await db.select().from(users).where(eq(users.role, "Admin")).limit(1);

    if (adminUsers.length > 0) {
      return NextResponse.json({ error: "Forbidden. Admin user already exists." }, { status: 403 });
    }

    const body = await req.json();
    const result = installSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password } = result.data;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
    });

    return NextResponse.json({ success: true, message: "Admin user created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Install API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

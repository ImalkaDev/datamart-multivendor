import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["Buyer", "Vendor", "Admin"]).default("Buyer"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const [newUser] = await db.insert(users).values({
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
    }).returning();

    return NextResponse.json({ id: newUser.id, name: newUser.name, email: newUser.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}

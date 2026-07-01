import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { users, withdrawalRequests, payoutMethodEnum } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const withdrawSchema = z.object({
  amount: z.number().int().min(1000, "Minimum withdrawal amount is $10.00"),
  payoutMethod: z.enum(payoutMethodEnum.enumValues),
  payoutDetails: z.string().min(1, "Payout details are required"),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Double check user role by fetching from DB to ensure they are a Vendor
    const userResult = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

    if (userResult.length === 0 || userResult[0].role !== "Vendor") {
      return NextResponse.json({ error: "Forbidden. Must be a vendor." }, { status: 403 })
    }

    const vendor = userResult[0]

    const body = await req.json()
    const result = withdrawSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { amount, payoutMethod, payoutDetails } = result.data

    if (vendor.availableBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient available balance" },
        { status: 400 }
      )
    }

    // Execute sequentially (neon-http driver does not support transactions)
    // 1. Deduct amount from vendor's available balance
    await db.update(users)
      .set({ availableBalance: vendor.availableBalance - amount })
      .where(eq(users.id, vendor.id))

    // 2. Create the withdrawal request
    await db.insert(withdrawalRequests).values({
      vendorId: vendor.id,
      amount,
      payoutMethod,
      payoutDetails,
      status: "PENDING",
    })

    return NextResponse.json({ success: true, message: "Withdrawal request submitted successfully." })

  } catch (error) {
    console.error("Withdraw error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

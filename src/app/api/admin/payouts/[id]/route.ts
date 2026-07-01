import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { users, withdrawalRequests } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userResult = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

    if (userResult.length === 0 || userResult[0].role !== "Admin") {
      return NextResponse.json({ error: "Forbidden. Must be an admin." }, { status: 403 })
    }

    const resolvedParams = await params
    const requestId = resolvedParams.id

    const requestResult = await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.id, requestId)).limit(1)

    if (requestResult.length === 0) {
      return NextResponse.json({ error: "Withdrawal request not found." }, { status: 404 })
    }

    if (requestResult[0].status !== "PENDING") {
      return NextResponse.json({ error: "Withdrawal request is not pending." }, { status: 400 })
    }

    await db.update(withdrawalRequests)
      .set({ status: "PAID" })
      .where(eq(withdrawalRequests.id, requestId))

    return NextResponse.json({ success: true, message: "Payout marked as PAID successfully." })

  } catch (error) {
    console.error("Payout update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

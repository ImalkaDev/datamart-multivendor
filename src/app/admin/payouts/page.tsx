import { auth } from "@/auth"
import { db } from "@/db"
import { users, withdrawalRequests } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PayoutTable } from "./payout-table"

export default async function AdminPayoutsPage() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== "Admin") {
    redirect("/")
  }

  const userResult = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

  if (userResult.length === 0 || userResult[0].role !== "Admin") {
    redirect("/")
  }

  const payouts = await db
    .select({
      id: withdrawalRequests.id,
      amount: withdrawalRequests.amount,
      payoutMethod: withdrawalRequests.payoutMethod,
      payoutDetails: withdrawalRequests.payoutDetails,
      status: withdrawalRequests.status,
      vendorName: users.name,
      vendorEmail: users.email,
    })
    .from(withdrawalRequests)
    .innerJoin(users, eq(withdrawalRequests.vendorId, users.id))
    .where(eq(withdrawalRequests.status, "PENDING"))

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Payout Management</h1>

      <PayoutTable payouts={payouts} />
    </div>
  )
}

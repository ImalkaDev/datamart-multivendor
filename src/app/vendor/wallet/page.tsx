import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { WalletForm } from "./wallet-form"

export default async function VendorWalletPage() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== "Vendor") {
    redirect("/")
  }

  const userResult = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

  if (userResult.length === 0) {
    redirect("/")
  }

  const vendor = userResult[0]

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Vendor Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Available Balance</h2>
          <p className="text-3xl font-bold">${(vendor.availableBalance / 100).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Total Earnings</h2>
          <p className="text-3xl font-bold">${(vendor.totalEarnings / 100).toFixed(2)}</p>
        </div>
      </div>

      <WalletForm availableBalance={vendor.availableBalance} />
    </div>
  )
}

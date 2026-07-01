"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"

type Payout = {
  id: string
  amount: number
  payoutMethod: string
  payoutDetails: string
  status: string
  vendorName: string | null
  vendorEmail: string | null
}

export function PayoutTable({ payouts }: { payouts: Payout[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleMarkPaid(id: string) {
    setLoadingId(id)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`/api/admin/payouts/${id}`, {
        method: "PATCH",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to mark as paid")
      } else {
        setSuccess("Successfully marked as PAID")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
      {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 text-sm p-3 rounded-md mb-4">{success}</div>}

      {payouts.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">No pending payouts found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((p) => {
              let parsedDetails = p.payoutDetails
              try {
                const parsed = JSON.parse(p.payoutDetails)
                parsedDetails = parsed.detail || p.payoutDetails
              } catch (e) {
                // Ignore parse errors, fallback to raw string
              }

              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.vendorName || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">{p.vendorEmail || "N/A"}</div>
                  </TableCell>
                  <TableCell>${(p.amount / 100).toFixed(2)}</TableCell>
                  <TableCell>{p.payoutMethod}</TableCell>
                  <TableCell>{parsedDetails}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkPaid(p.id)}
                      disabled={loadingId === p.id}
                    >
                      {loadingId === p.id ? "Processing..." : "Mark PAID"}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

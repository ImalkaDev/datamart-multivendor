"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const payoutMethodEnum = z.enum(["Bank", "PayPal", "Binance Pay"])

const formSchema = z.object({
  amount: z.number().min(10, { message: "Minimum withdrawal is $10.00" }),
  payoutMethod: payoutMethodEnum,
  payoutDetails: z.string().min(1, "Payout details are required"),
})

export function WalletForm({ availableBalance }: { availableBalance: number }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 10,
      payoutMethod: "PayPal",
      payoutDetails: "",
    },
  })

  const selectedMethod = form.watch("payoutMethod")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setError("")
    setSuccess("")

    const amountInCents = Math.round(values.amount * 100)

    if (amountInCents > availableBalance) {
      setError("Insufficient available balance.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/vendor/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInCents,
          payoutMethod: values.payoutMethod,
          payoutDetails: JSON.stringify({ detail: values.payoutDetails }),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "An error occurred")
      } else {
        setSuccess(data.message || "Withdrawal requested successfully")
        form.reset()
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  let detailLabel = "Payout Details"
  if (selectedMethod === "PayPal") detailLabel = "PayPal Email"
  if (selectedMethod === "Bank") detailLabel = "Bank IBAN"
  if (selectedMethod === "Binance Pay") detailLabel = "Binance Pay ID"

  return (
    <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
      <h2 className="text-xl font-bold mb-4">Request Withdrawal</h2>

      {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 text-sm p-3 rounded-md mb-4">{success}</div>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="10"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Minimum withdrawal amount is $10.00.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payoutMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payout Method</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payout method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Binance Pay">Binance Pay</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payoutDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{detailLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={`Enter your ${detailLabel.toLowerCase()}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit Request"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

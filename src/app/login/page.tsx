"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid credentials. Please try again.")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-gray-100">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Login</h1>
          <p className="text-gray-500">
            Enter your email and password to access your account.
          </p>
        </div>

        {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-semibold hover:scale-105 transition-all duration-300" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary underline underline-offset-2">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

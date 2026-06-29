import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "DataMart - Premium Multivendor Dataset Marketplace",
  description: "Discover, buy, and sell high-quality datasets on our premium multivendor marketplace.",
  keywords: ["dataset", "marketplace", "data", "machine learning", "multivendor"],
  openGraph: {
    title: "DataMart - Premium Multivendor Dataset Marketplace",
    description: "Discover, buy, and sell high-quality datasets on our premium multivendor marketplace.",
    url: "https://datamart.com",
    siteName: "DataMart",
  },
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-zinc-950">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-center text-zinc-900 dark:text-zinc-50">
          The Premier Marketplace for High-Quality Datasets
        </h1>

        <p className="text-xl text-center text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Empower your AI models and analytics with curated datasets from top vendors. Buy securely, sell easily, and scale your data needs.
        </p>

        <div className="flex gap-4 items-center justify-center mt-4">
          <Button  size="lg" className="px-8">
            <Link href="/register">Start Selling</Link>
          </Button>
          <Button  variant="outline" size="lg" className="px-8">
            <Link href="/login">Browse Datasets</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

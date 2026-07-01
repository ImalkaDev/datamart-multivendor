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
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="z-10 max-w-5xl w-full items-center justify-center flex flex-col gap-10 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl p-16 rounded-3xl shadow-2xl border border-white/40 dark:border-white/10">

        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-2 shadow-sm">
          ✨ Introducing DataMart V2
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl text-center text-slate-900 dark:text-zinc-50 bg-clip-text">
          The Premier Marketplace for High-Quality Datasets
        </h1>

        <h2 className="text-xl text-center text-slate-600 dark:text-zinc-400 max-w-2xl font-light leading-relaxed">
          Empower your AI models and analytics with curated datasets from top vendors. Buy securely, sell easily, and scale your data needs.
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mt-6">
          <Button asChild size="lg" className="px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300">
            <Link href="/register">Start Selling</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-10 py-6 text-lg rounded-xl bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-slate-50 hover:scale-105 transition-all duration-300">
            <Link href="/explore">Browse Datasets</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

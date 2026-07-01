import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "Admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-50/50">
      <aside className="w-full lg:w-64 bg-white/80 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-slate-200 shadow-sm relative z-10">
        <div className="flex h-16 items-center px-6 border-b border-slate-100 bg-white/50">
          <Link href="/admin" className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">D</span>
            Admin
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            href="/admin"
            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/admin/moderation"
            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            Moderation Queue
          </Link>
          <Link
            href="/admin/payouts"
            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            Payout Management
          </Link>
          <Link
            href="/admin/seo"
            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            SEO Settings
          </Link>
          <Link
            href="/admin/reviews"
            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            Reviews
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-slate-100 lg:absolute lg:bottom-0 lg:w-64 bg-white/50">
           <form action={async () => {
              "use server"
              const { signOut } = await import("@/auth")
              await signOut()
           }}>
             <button type="submit" className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors">
               <LogOut className="w-4 h-4 mr-2" />
               Sign Out
             </button>
           </form>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50 -z-10"></div>
        {children}
      </main>
    </div>
  );
}

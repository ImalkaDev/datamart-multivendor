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
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50/50">
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="font-semibold text-lg tracking-tight">
            DataMart Admin
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            href="/admin"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/admin/moderation"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Moderation Queue
          </Link>
          <Link
            href="/admin/seo"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            SEO Settings
          </Link>
          <Link
            href="/admin/reviews"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Reviews
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-gray-200 lg:absolute lg:bottom-0 lg:w-64">
           <form action={async () => {
              "use server"
              const { signOut } = await import("@/auth")
              await signOut()
           }}>
             <button type="submit" className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
               <LogOut className="w-4 h-4 mr-2" />
               Sign Out
             </button>
           </form>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

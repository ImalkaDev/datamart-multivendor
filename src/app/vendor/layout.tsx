import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Need to ensure type exists for user role
  if (session.user.role !== "Vendor" && session.user.role !== "Admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex gap-4 items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Vendor Dashboard
              </h1>
              <nav className="hidden md:flex space-x-4 ml-6">
                <Link href="/vendor" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Overview
                </Link>
                <Link href="/vendor/upload" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Upload Dataset
                </Link>
              </nav>
            </div>
            <div>
              <Link href="/">
                <Button variant="outline">Back to Marketplace</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

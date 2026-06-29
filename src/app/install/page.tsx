import { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import InstallForm from "./install-form";

export const metadata: Metadata = {
  title: "Setup Wizard - DataMart",
  description: "Configure your admin account.",
};

export default async function InstallPage() {
  // Check if an admin already exists
  const adminUsers = await db.select().from(users).where(eq(users.role, "Admin")).limit(1);

  if (adminUsers.length > 0) {
    redirect("/"); // Or return 403 / Forbidden page
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome to DataMart
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Let&apos;s get your marketplace set up. Create your administrator account below.
          </p>
        </div>
        <InstallForm />
      </div>
    </div>
  );
}

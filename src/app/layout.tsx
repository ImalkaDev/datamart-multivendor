import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { db } from "@/db";
import { users } from "@/db/schema";
import { count } from "drizzle-orm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | DataMart",
    default: "DataMart - Premium Multivendor Dataset Marketplace",
  },
  description: "Discover, buy, and sell high-quality datasets on our premium multivendor marketplace.",
  openGraph: {
    title: {
      template: "%s | DataMart",
      default: "DataMart - Premium Multivendor Dataset Marketplace",
    },
    description: "Discover, buy, and sell high-quality datasets on our premium multivendor marketplace.",
    url: "https://datamart.com",
    siteName: "DataMart",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userCount = 0;
  try {
    const result = await db.select({ count: count() }).from(users);
    userCount = result[0].count;
  } catch (error) {
    console.error("Failed to fetch user count:", error);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 selection:bg-primary/20">
        {userCount === 0 && (
          <div className="bg-blue-600 text-white text-center py-2 px-4 sticky top-0 z-50">
            Welcome to your new site! Please{" "}
            <Link href="/install" className="font-bold underline hover:text-blue-200">
              visit /install
            </Link>{" "}
            to configure the admin account.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}

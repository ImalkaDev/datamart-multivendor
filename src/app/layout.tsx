import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

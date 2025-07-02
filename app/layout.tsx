import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

import { ClerkProvider } from "@clerk/nextjs";

import { Analytics } from "@vercel/analytics/next";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Viewport } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  manifest: "/icons/site.webmanifest",
  generator: "Next.js",
  keywords: ["MBG Cargo", "MBG", "Cargo", "Logistics", "Supply Chain", "Freight Forwarding"],
  icons: [
    { rel: "apple-touch-icon", url: "/icons/android-chrome-192x192.png" },
    { rel: "icon", url: "/icons/android-chrome-192x192.png" },
  ],

    applicationName: siteConfig.name,
  authors: [
    {
      name: "Inky Ganbold",
      url: "https://chat.enk.icu",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

import { Analytics } from "@vercel/analytics/next";

import type { Metadata } from "next";
import React from "react";

import { Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { metaConfig } from "@/config/site";
import "./globals.css";

const openSans = Open_Sans({ weight: ["400", "500", "600", "700"], subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: metaConfig.title,
  description: metaConfig.description,
  manifest: "/icons/site.webmanifest",
  generator: "Next.js",
  openGraph: {
    title: metaConfig.title,
    description: metaConfig.description,
    url: metaConfig.url,
    siteName: metaConfig.applicationName,
    images: [metaConfig.ogImage],
  },
  keywords: metaConfig.keywords,
  icons: [
    { rel: "apple-touch-icon", url: "/icons/android-chrome-192x192.png" },
    { rel: "icon", url: "/icons/android-chrome-192x192.png" },
  ],

    applicationName: metaConfig.applicationName,
  authors: [
    {
      name: "Inky Ganbold",
      url: "https://chat.enk.icu",
    },
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${openSans.className} flex flex-col min-h-screen overflow-x-hidden`}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
          <Analytics />
        </body>
      </html>
  );
}

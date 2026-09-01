import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OkksigenCart — Digital Subscription Store",
    template: "%s — OkksigenCart",
  },
  description:
    "Netflix, Disney+, ChatGPT, dan produk digital lain — dijelaskan transparan, dikirim otomatis, digaransi jelas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${sora.variable} ${plusJakarta.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-paper font-body text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://burnwiki.com";
const SITE_DESCRIPTION =
  "A public, evidence-indexed clinical encyclopedia for anyone in burn care. Written by burn-care domain experts with every claim linked to PubMed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Burn Wiki — Clinical Encyclopedia for Burn Care",
    template: "%s | Burn Wiki",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Burn Wiki",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Burn Wiki",
    title: "Burn Wiki — Clinical Encyclopedia for Burn Care",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burn Wiki — Clinical Encyclopedia for Burn Care",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

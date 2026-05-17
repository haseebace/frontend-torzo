import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "Torzo | Media Search Platform",
    template: "%s | Torzo",
  },
  description: "Search and discover movies, TV shows, and digital content with direct high-speed downloads via Real-Debrid.",
  keywords: ["media search", "movie search", "TV show search", "Real-Debrid", "content discovery", "digital media"],
  authors: [{ name: "Torzo" }],
  creator: "Torzo",
  publisher: "Torzo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://torzo.app",
    title: "Torzo | Media Search Platform",
    description: "Search and discover movies, TV shows, and digital content with direct high-speed downloads via Real-Debrid.",
    siteName: "Torzo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Torzo | Media Search Platform",
    description: "Search and discover movies, TV shows, and digital content with direct high-speed downloads via Real-Debrid.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      className={cn(
        "h-full",
        "antialiased",
        plusJakartaSans.className,
        plusJakartaSans.variable,
        "font-sans",
      )}
    >
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://torzoapi.vercel.app" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://torzoapi.vercel.app" />
      </head>
      <body className="flex min-h-dvh flex-col">
        {children}
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

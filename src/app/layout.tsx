import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://torzo.vercel.app"),
  title: {
    default: "Torzo | Discover Movies & TV Shows",
    template: "%s | Torzo",
  },
  description: "Search and discover movies and TV shows across multiple sources. Find what you are looking for with fast, clean results.",
  keywords: ["media search platform", "search movies and TV shows", "movie discovery tool", "find streaming content", "TV show search engine", "content discovery"],
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
    url: "https://torzo.vercel.app",
    title: "Torzo | Discover Movies & TV Shows",
    description: "Search and discover movies and TV shows across multiple sources. Find what you are looking for with fast, clean results.",
    siteName: "Torzo",
    images: [{
      url: "/preview.png",
      width: 1200,
      height: 630,
      alt: "Torzo — Discover Movies & TV Shows",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Torzo | Discover Movies & TV Shows",
    description: "Search and discover movies and TV shows across multiple sources. Find what you are looking for with fast, clean results.",
    images: ["/preview.png"],
  },
  verification: {
    google: "LzzoVc5jvxgq4tGlzyWKlZEQErcDJhyFPCL7IVO7yUo",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Torzo",
              url: "https://torzo.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://torzo.vercel.app/results?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        {children}
        <SiteFooter />
        <Toaster 
          position="bottom-right" 
          richColors 
          closeButton 
          className="toaster group"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

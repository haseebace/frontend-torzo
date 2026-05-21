import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use Torzo — Media Search & Real-Debrid Guide",
  description:
    "Learn how to search movies and TV shows, connect Real-Debrid for high-speed downloads, and get the most out of Torzo — the media discovery platform.",
  keywords: [
    "how to use Torzo",
    "media search guide",
    "Real-Debrid setup",
    "search movies and TV shows",
    "content discovery tool",
    "streaming search platform",
  ],
};

export default function HowToUsePage() {
  const steps = [
    {
      icon: "🔍",
      title: "Search for a movie or show",
      body: (
        <>
          Type a title into the search bar on the{" "}
          <Link href="/" className="text-link hover:underline">
            home page
          </Link>
          . Pick a suggestion for instant results, or press Enter to search by
          keyword across all your providers.
        </>
      ),
    },
    {
      icon: "📋",
      title: "Compare your results",
      body: 'Each result card shows the title, file size, seeders, and leechers so you can pick the best source. Sort by "Most seeders" or "Recent" to find what you need fast.',
    },
    {
      icon: "📄",
      title: "Open the detail page",
      body: (
        <>
          Click any result to see the full detail page. You&rsquo;ll find the
          info hash, file list, screenshots, health score, and all available
          actions in one place.
        </>
      ),
    },
    {
      icon: "🔑",
      title: "Connect Real-Debrid",
      body: (
        <>
          Head to the{" "}
          <Link href="/manage" className="text-link hover:underline">
            Manage page
          </Link>{" "}
          and paste your Real-Debrid API key. Your key is stored in your
          browser and is never sent to our servers. You can also toggle which
          providers Torzo searches.
        </>
      ),
    },
    {
      icon: "⚡",
      title: "Add to Real-Debrid",
      body: "On any detail page, click \"Add to Real Debrid\". Torzo will add the magnet, select all files, wait for the download to finish on RD's servers, and generate a direct download link — all automatically.",
    },
    {
      icon: "▶️",
      title: "Watch or download",
      body: (
        <>
          Once the link is ready, click <strong>Watch Now</strong> to play on
          iOS (Infuse) or macOS (IINA), or use <strong>Direct Download</strong>{" "}
          to save the file. You can also grab the magnet link or .torrent file
          directly without Real-Debrid.
        </>
      ),
    },
  ];

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />
      <section className="mx-auto max-w-3xl animate-page-fade-in px-4 py-12 md:px-10">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground-strong md:text-5xl">
            How to Use Torzo
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            From your first search to watching — here is everything you need.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-border bg-surface-elevated p-5 md:gap-5 md:p-6"
            >
              <span className="mt-0.5 shrink-0 text-2xl leading-none md:text-3xl">
                {step.icon}
              </span>
              <div className="min-w-0 space-y-1.5">
                <h2 className="text-base font-bold text-foreground-strong md:text-lg">
                  {step.title}
                </h2>
                <p className="text-sm leading-relaxed text-text-subtle">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Ready to find something great?
          </p>
          <Button asChild className="h-[52px] px-8 text-base font-heading">
            <Link href="/">Start searching now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

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
      title: "Search for anything",
      body: "Type a movie, TV show, game, or software name into the search bar. Pick a suggestion from TMDB to search by ID, or press Enter to search by keyword across all your providers.",
    },
    {
      icon: "📋",
      title: "Pick the best result",
      body: 'Each card shows the title, file size, seeders, and leechers so you can choose the best source. Results are sorted by availability by default, or switch to "Recent" to see the newest first.',
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
          and paste your Real-Debrid API key. Your key stays in your browser
          and is never sent to our servers. Once connected you&rsquo;ll see
          live status and can toggle providers on or off.
        </>
      ),
    },
    {
      icon: "🎬",
      title: "Play on any device",
      body: "Real-Debrid streams work with external players like VLC, Kodi, or your web browser. Just pick your result, click download, and your default player will handle the rest.",
    },
    {
      icon: "✅",
      title: "Done — enjoy",
      body: "No ads, no popups, no redirects. Torzo gives you clean, fast results every time. The whole process takes seconds from search to playback.",
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
            From your first search to playback — here is everything you need.
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

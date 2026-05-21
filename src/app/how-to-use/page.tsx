import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
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
      title: "Search for movies and TV shows",
      body: 'Type a movie, TV show, game, or software name into the search bar on the homepage. As you type, suggestions from TMDB will appear — select one to search directly by ID, or press Enter to search by keyword across all your selected providers.',
    },
    {
      title: "Browse your results",
      body: 'Results from your active providers are combined and sorted by availability (or by date if you choose "Recent"). Each result card shows the title, category, file size, seeders, and leechers so you can quickly pick the best source for your needs.',
    },
    {
      title: "Connect Real-Debrid",
      body: <>Go to the <Link href="/manage" className="text-link hover:underline">Manage page</Link> and paste your Real-Debrid API key. Your key is stored locally in your browser and is never sent to our servers. Once connected, you&rsquo;ll see your connection status and can enable or disable individual providers.</>,
    },
    {
      title: "Choose your search sources",
      body: 'On the Manage page, toggle which providers Torzo searches across. Your preferences are saved automatically in your browser so everything is ready for your next visit.',
    },
    {
      title: "Download with one click",
      body: 'Once you find what you\'re looking for, click the result to view details and start a high-speed download via Real-Debrid. No ads, no popups, no redirects — just a clean media search experience from start to finish.',
    },
  ];

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />
      <section className="mx-auto max-w-3xl animate-page-fade-in px-4 py-12 md:px-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground-strong">
          How to Use Torzo
        </h1>
        <p className="mb-10 text-sm text-muted-foreground">
          From your first search to your first download — here is everything you need to know.
        </p>

        <div className="space-y-10">
          {steps.map((step, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h2 className="text-lg font-semibold text-foreground-strong">
                  {step.title}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-text-subtle">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

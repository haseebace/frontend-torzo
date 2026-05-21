import { SiteNavbar } from "@/components/site-navbar";

const steps = [
  {
    title: "Search for content",
    body: 'Type a movie, TV show, game, or software name into the search bar on the homepage. As you type, suggestions from TMDB will appear — select one to search directly by ID, or press Enter to search by keyword across all providers.',
  },
  {
    title: "Browse results",
    body: 'Results from your selected providers are combined and sorted by seeders (or by date if you choose "Recent"). Each result card shows the title, category, file size, seeders, and leechers so you can pick the best source.',
  },
  {
    title: "Connect Real-Debrid",
    body: 'Go to the Manage page and paste your Real-Debrid API key. Your key is stored locally in your browser and is never sent to our servers. Once connected, you\'ll see your connection status and can enable or disable individual providers.',
  },
  {
    title: "Choose your providers",
    body: 'On the Manage page, toggle which sources Torzo searches — RARBG, The Pirate Bay, and YTS are available. Your preferences are saved automatically in your browser.',
  },
  {
    title: "Download with one click",
    body: 'Once you find what you\'re looking for, click the result to view details and start a high-speed download via Real-Debrid. No ads, no popups, no redirects.',
  },
];

export default function HowToUsePage() {
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

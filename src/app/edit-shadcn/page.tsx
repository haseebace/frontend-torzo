import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TorrentResultCard } from "@/components/torrent-result-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const previewResult = {
  id: "preview-id",
  title: "Planet Earth Complete Collection 1080p BluRay x265",
  category: "Series",
  uploaded_at: "2026-04-28T00:00:00Z",
  size_bytes: 45957000000,
  size_human: "42.8 GB",
  seeders: 2418,
  leechers: 184,
  sources: [
    { provider: "rargb", source_url: "https://example.com" }
  ]
};

const badgeVariants = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const;

export default function EditShadcnPage() {
  return (
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground md:px-10 xl:px-page">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-5xl flex-col">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Components
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground-strong">
              Edit shadcn
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-pill border border-border bg-surface px-4 text-sm font-medium text-foreground-strong transition-colors hover:border-input hover:bg-surface-badge hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
          >
            Home
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-4xl space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-ui-sm">
            <div>
              <p className="text-sm font-medium text-foreground">Root input</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Root shadcn input using the same pill styling as the homepage
                search bar.
              </p>
            </div>

            <Input
              type="text"
              placeholder="Search movies, shows, games, software..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />

            <div className="border-t border-border pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground">
                  Torzo pill button
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Circular shadcn button variant copied from the homepage search
                  submit action.
                </p>
              </div>

              <Button variant="torzoPill" size="icon-lg" aria-label="Search">
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground">Badge</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  All shadcn badge variants using the current theme tokens.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {badgeVariants.map((variant) => (
                  <Badge key={variant} variant={variant}>
                    {variant}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground">
                  Result card
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Shadcn card primitive styled to match the current results
                  page row.
                </p>
              </div>

              <TorrentResultCard result={previewResult} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

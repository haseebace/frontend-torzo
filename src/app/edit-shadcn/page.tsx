import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TorrentResultCard } from "@/components/torrent-result-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const previewResult = {
  title: "Planet Earth Complete Collection 1080p BluRay x265",
  type: "Series",
  uploadedDate: "Apr 28, 2026",
  provider: "provider",
  size: "42.8 GB",
  seeders: "2,418",
  leechers: "184",
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
    <main className="min-h-dvh bg-zinc-50 px-4 py-10 text-zinc-950 md:px-10 xl:px-[150px]">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-5xl flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 pb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Components
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              Edit shadcn
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400/20"
          >
            Home
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-4xl space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_8px_30px_rgba(24,24,27,0.06)]">
            <div>
              <p className="text-sm font-medium text-zinc-950">Root input</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
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

            <div className="border-t border-zinc-200 pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-zinc-950">
                  Torzo pill button
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Circular shadcn button variant copied from the homepage search
                  submit action.
                </p>
              </div>

              <Button variant="torzoPill" size="icon-lg" aria-label="Search">
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="border-t border-zinc-200 pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-zinc-950">Badge</p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
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

            <div className="border-t border-zinc-200 pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-zinc-950">
                  Result card
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
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

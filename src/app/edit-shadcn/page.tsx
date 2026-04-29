import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar,
  HardDrive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const previewResult = {
  title: "Planet Earth Complete Collection 1080p BluRay x265",
  type: "Series",
  uploadedDate: "Apr 28, 2026",
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

              <Link href="/detail" className="block">
                <Card className="group grid gap-3 rounded-xl border border-transparent bg-[var(--result-card-background)] py-4 text-sm transition-all hover:border-zinc-200 hover:shadow-[0_4px_18px_rgba(24,24,27,0.04)] focus-visible:border-zinc-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400/20 md:grid-cols-[1fr_auto]">
                  <CardContent className="contents p-0">
                    <div className="min-w-0 space-y-3">
                      <h2 className="truncate text-base font-medium leading-6 text-zinc-700 transition-colors group-hover:text-zinc-950">
                        {previewResult.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                        <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                          {previewResult.type}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="size-3" />
                          Uploaded {previewResult.uploadedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:justify-end">
                      <div className="grid grid-cols-3 gap-3 text-right text-xs">
                        <div className="w-16">
                          <p className="font-semibold text-zinc-800">
                            {previewResult.size}
                          </p>
                          <p className="inline-flex items-center justify-end gap-1 text-zinc-400">
                            <HardDrive className="size-3" />
                            size
                          </p>
                        </div>
                        <div className="w-16">
                          <p className="font-semibold text-zinc-800">
                            {previewResult.seeders}
                          </p>
                          <p className="inline-flex items-center justify-end gap-1 text-zinc-400">
                            <ArrowUp className="size-3" />
                            seed
                          </p>
                        </div>
                        <div className="w-16">
                          <p className="font-semibold text-zinc-800">
                            {previewResult.leechers}
                          </p>
                          <p className="inline-flex items-center justify-end gap-1 text-zinc-400">
                            <ArrowDown className="size-3" />
                            leech
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

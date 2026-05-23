import { SiteNavbar } from "@/components/site-navbar";
import { Skeleton } from "@/components/ui/skeleton";

function ResultCardSkeleton() {
  return (
    <div className="rounded-[var(--torrent-card-radius)] bg-[var(--torrent-card-background-color)] px-0 py-0">
      <div className="flex min-h-[var(--torrent-card-min-height)] flex-col justify-between gap-[var(--torrent-card-mobile-section-gap)] p-[var(--torrent-card-padding)] md:flex-row md:items-center md:gap-[var(--torrent-card-column-gap)]">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[var(--torrent-card-content-gap)] md:max-w-[var(--torrent-card-left-column-max-width)]">
          <Skeleton className="h-7 w-full max-w-[620px] rounded-control bg-[var(--skeleton-strong-background-color)] md:h-[28px]" />
          <div className="flex flex-wrap items-center gap-[var(--torrent-card-content-gap)]">
            <Skeleton className="h-[var(--badge-height)] w-[92px] rounded-pill" />
            <Skeleton className="h-[var(--badge-height)] w-[134px] rounded-pill" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[var(--torrent-card-content-gap)]">
          <Skeleton className="hidden h-16 min-w-[41px] w-11 shrink-0 rounded-xl bg-[var(--skeleton-strong-background-color)] md:block" />
          <div className="flex min-w-[var(--torrent-card-status-column-width)] flex-col gap-[var(--torrent-card-content-gap)]">
            <Skeleton className="h-[var(--badge-height)] w-[125px] rounded-pill bg-[var(--skeleton-strong-background-color)]" />
            <Skeleton className="h-[var(--badge-height)] w-[125px] rounded-pill bg-[var(--skeleton-strong-background-color)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsLoading() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <section className="flex w-full flex-col gap-6 px-4 py-8 md:px-10 xl:px-page">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
          <Skeleton className="h-16 w-full rounded-control bg-[var(--skeleton-strong-background-color)]" />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-2">
          <Skeleton className="h-6 w-full max-w-64 rounded-control bg-[var(--skeleton-strong-background-color)]" />
          <Skeleton className="h-8 w-[130px] rounded-pill bg-[var(--skeleton-strong-background-color)]" />
        </div>

        <div className="flex flex-col gap-5">
          {Array.from({ length: 6 }, (_, index) => (
            <ResultCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

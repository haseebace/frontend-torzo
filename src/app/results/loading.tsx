import { SiteNavbar } from "@/components/site-navbar";
import { Skeleton } from "@/components/ui/skeleton";

function ResultCardSkeleton() {
  return (
    <div className="rounded-3xl bg-bg-surface px-4 py-4 md:px-5 md:py-5">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-full max-w-[620px] rounded-full bg-bg-elevated" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-[92px] rounded-full bg-bg-elevated" />
          <Skeleton className="h-8 w-[110px] rounded-full bg-bg-elevated" />
          <Skeleton className="h-8 w-[72px] rounded-full bg-bg-elevated" />
          <Skeleton className="h-8 w-[64px] rounded-full bg-bg-elevated" />
          <Skeleton className="h-8 w-[64px] rounded-full bg-bg-elevated" />
        </div>
      </div>
    </div>
  );
}

export default function ResultsLoading() {
  return (
    <main className="min-h-dvh bg-bg-canvas text-primary-text">
      <SiteNavbar />

      <section className="flex w-full flex-col gap-6 px-4 py-8 md:px-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
          <Skeleton className="h-[62px] w-full rounded-full bg-bg-surface" />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-light-200 pb-2">
          <Skeleton className="h-6 w-full max-w-64 rounded-full bg-bg-elevated" />
          <Skeleton className="h-8 w-[130px] rounded-full bg-bg-elevated" />
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

import { SiteNavbar } from "@/components/site-navbar";
import { Skeleton } from "@/components/ui/skeleton";

function ResultCardSkeleton() {
  return (
    <div className="grid gap-3 rounded-card bg-result-card px-[5px] pb-4 pt-1 text-sm md:grid-cols-[1fr_auto] md:px-5 md:py-4">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 md:hidden">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        <div className="mb-3 min-w-0">
          <Skeleton className="h-5 w-full md:h-6 md:w-[min(620px,70%)]" />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 md:justify-end">
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
        <Skeleton className="h-4 w-16 md:hidden" />
      </div>
    </div>
  );
}

export default function ResultsLoading() {
  return (
    <main className="min-h-dvh bg-surface text-foreground">
      <SiteNavbar />

      <section className="flex w-full flex-col gap-6 px-4 py-8 md:px-10 xl:px-page">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
          <Skeleton className="h-16 w-full rounded-[2rem]" />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-2">
          <Skeleton className="h-4 w-full max-w-64" />
          <Skeleton className="h-8 w-[130px] rounded-pill" />
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

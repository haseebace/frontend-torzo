import { SiteNavbar } from "@/components/site-navbar";
import { Skeleton } from "@/components/ui/skeleton";

function ResultCardSkeleton() {
  return (
    <div className="rounded-[22px] bg-card px-0 py-0">
      <div className="flex min-h-[114px] flex-col justify-between gap-5 p-6 md:flex-row md:items-center md:gap-8">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 md:max-w-[624px]">
          <Skeleton className="h-7 w-full max-w-[620px] rounded-full bg-secondary md:h-[28px]" />
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-8 w-[92px] rounded-full" />
            <Skeleton className="h-8 w-[134px] rounded-full" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Skeleton className="hidden h-16 min-w-[41px] w-11 shrink-0 rounded-xl bg-secondary md:block" />
          <div className="flex min-w-32 flex-col gap-4">
            <Skeleton className="h-8 w-[125px] rounded-full bg-secondary" />
            <Skeleton className="h-8 w-[125px] rounded-full bg-secondary" />
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

      <section className="flex w-full flex-col gap-6 px-4 py-8 md:px-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
          <Skeleton className="h-16 w-full rounded-full bg-secondary" />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-2">
          <Skeleton className="h-6 w-full max-w-64 rounded-full bg-secondary" />
          <Skeleton className="h-8 w-[130px] rounded-full bg-secondary" />
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

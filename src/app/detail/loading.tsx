import { SiteNavbar } from "@/components/site-navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailLoading() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-surface text-foreground">
      <SiteNavbar />

      <section className="flex w-full min-w-0 flex-col gap-8 px-4 py-8 md:px-10 xl:px-page">
        <div className="min-w-0 space-y-5 border-b border-border pb-7">
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4 md:h-12 md:w-1/2" />
            <Skeleton className="h-8 w-full max-w-lg" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Skeleton className="h-10 w-full sm:w-auto sm:px-6" />
            <Skeleton className="h-10 w-full sm:w-auto sm:px-6" />
            <Skeleton className="h-10 w-full sm:w-auto sm:px-6" />
          </div>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <div className="lg:hidden">
              <Skeleton className="h-40 w-full rounded-card" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-12 w-full rounded-control" />
              <Skeleton className="h-12 w-full rounded-control" />
              <Skeleton className="h-12 w-full rounded-control" />
            </div>

            <Skeleton className="h-48 w-full rounded-card" />
          </div>

          <aside className="hidden min-w-0 space-y-4 lg:block">
            <Skeleton className="h-40 w-full rounded-card" />
            <Skeleton className="h-48 w-full rounded-card" />
          </aside>
        </div>
      </section>
    </main>
  );
}

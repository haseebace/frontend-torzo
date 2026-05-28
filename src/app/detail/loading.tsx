import { SiteNavbar } from "@/components/site-navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailLoading() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <SiteNavbar />

      <section className="flex w-full min-w-0 flex-col gap-8 px-4 py-8 md:px-12">
        <div className="min-w-0 space-y-5 border-b border-border pb-7">
          <div className="space-y-3">
            <Skeleton className="h-9 w-3/4 rounded-full bg-secondary md:h-12 md:w-1/2" />
            <Skeleton className="h-8 w-full max-w-lg rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Skeleton className="h-10 w-full rounded-full bg-secondary sm:w-[165px]" />
            <Skeleton className="h-10 w-full rounded-full bg-secondary sm:w-[165px]" />
            <Skeleton className="h-10 w-full rounded-full bg-secondary sm:w-[180px]" />
          </div>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <div className="lg:hidden">
              <Skeleton className="h-40 w-full rounded-3xl bg-secondary" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-20 rounded-full bg-secondary" />
              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>

            <Skeleton className="h-48 w-full rounded-3xl bg-secondary" />
          </div>

          <aside className="hidden min-w-0 space-y-4 lg:block">
            <Skeleton className="h-40 w-full rounded-3xl bg-secondary" />
            <Skeleton className="h-48 w-full rounded-3xl bg-secondary" />
          </aside>
        </div>
      </section>
    </main>
  );
}

import { SiteNavbar } from "@/components/site-navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailLoading() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-bg-canvas text-primary-text">
      <SiteNavbar />

      <section className="flex w-full min-w-0 flex-col gap-4 px-4 py-4 md:px-12">
        <div className="space-y-4 border-b border-light-200 pb-4">
          <Skeleton className="h-4 w-44 rounded-full bg-bg-elevated" />
          <Skeleton className="h-10 w-full max-w-3xl rounded-full bg-bg-elevated" />
          <Skeleton className="h-8 w-80 rounded-full bg-bg-elevated" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-full bg-bg-elevated" />
            <Skeleton className="h-8 w-16 rounded-full bg-bg-elevated" />
            <Skeleton className="h-8 w-16 rounded-full bg-bg-seeder" />
            <Skeleton className="h-8 w-16 rounded-full bg-bg-leecher" />
          </div>
        </div>

        <Skeleton className="h-72 w-full rounded-3xl bg-bg-elevated" />
        <Skeleton className="h-[78px] w-full rounded-3xl bg-bg-elevated" />
        <Skeleton className="h-80 w-full rounded-3xl bg-bg-surface" />
      </section>
    </main>
  );
}

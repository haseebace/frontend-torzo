import { SearchForm } from "@/components/search-form";

export function HomeContent() {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center px-4 py-6 md:px-12 md:pt-16 md:pb-0">
      <section className="flex w-full max-w-[680px] flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[80px] font-extrabold leading-none text-primary-text md:text-[88px]">
            Torzo
          </h1>
          <p className="text-xs font-normal text-muted-text md:text-sm md:font-medium">
            Serves Multiple Torrent Trackers with out Ads
          </p>
        </div>

        <SearchForm
          id="torrent-search"
          variant="hero"
          className="w-full"
        />
      </section>
    </div>
  );
}

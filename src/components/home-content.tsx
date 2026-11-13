import { SearchForm } from "@/components/search-form";

export function HomeContent() {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center px-4 pt-12 md:px-12 md:pt-16">
      <section className="flex w-full max-w-[680px] flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[72px] font-extrabold leading-none text-primary-text md:text-[88px]">
            Torzo
          </h1>
          <p className="text-sm font-medium text-muted-text">
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

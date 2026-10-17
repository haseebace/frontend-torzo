import { SearchForm } from "@/components/search-form";

export function HomeContent() {
  const marketingCopy = "Discover movies and TV shows across multiple sources. Fast, clean, and straightforward.";

  return (
    <>
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-[300px] md:hidden">
        <section className="flex w-full flex-col items-center gap-7 text-center">
          <div className="flex w-full flex-col items-center gap-0">
            <h1 className="text-[80px] font-[900] leading-[1.1] tracking-[4px] text-text-primary">
              Torzo
            </h1>
            <p className="text-xs font-medium leading-6 text-text-muted">
              {marketingCopy}
            </p>
          </div>

          <SearchForm
            id="torrent-search-mobile"
            variant="hero"
            className="mx-auto"
          />
        </section>
      </div>

      <div className="relative z-10 hidden flex-1 items-center justify-center px-4 pb-[300px] md:flex md:px-10">
        <section className="flex w-full flex-col items-center gap-7 text-center">
          <div className="flex w-full max-w-[620px] flex-col items-center gap-0">
            <h1 className="text-[125px] font-[900] leading-[1.1] tracking-[4px] text-text-primary">
              Torzo
            </h1>
            <p className="w-full text-sm font-medium leading-[1.5] text-text-muted">
              {marketingCopy}
            </p>
          </div>

          <div className="w-full">
            <SearchForm
              id="torrent-search"
              variant="hero"
              className="mx-auto"
            />
          </div>
        </section>
      </div>
    </>
  );
}

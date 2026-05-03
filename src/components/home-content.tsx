import { SearchForm } from "@/components/search-form";

export function HomeContent() {
  const marketingCopy = "Media search without the trash. No ads, no popups—just direct high-speed downloads via Real-Debrid.";

  return (
    <>
      <div className="relative z-10 flex flex-1 -translate-y-20 items-center justify-center px-4 py-10 md:hidden">
        <section className="flex w-full flex-col items-center text-center">
          <div className="mb-8 space-y-3">
            <h1 className="text-[100px] font-[900] leading-[1.1] tracking-[4px] text-zinc-950">
              Torzo
            </h1>
            <p className="text-xs font-medium leading-6 text-zinc-500">
              {marketingCopy}
            </p>
          </div>

          <SearchForm id="torrent-search-mobile" className="mx-auto" />
        </section>
      </div>

      <div className="relative z-10 hidden flex-1 -translate-y-32 items-center justify-center px-4 py-10 md:flex md:px-10 xl:px-[150px]">
        <section className="flex w-full flex-col items-center text-center">
          <div className="mb-8 space-y-3">
            <h1 className="text-[125px] font-[900] leading-[1.1] tracking-[4px] text-zinc-950">
              Torzo
            </h1>
            <p className="text-sm font-medium leading-6 text-zinc-500">
              {marketingCopy}
            </p>
          </div>

          <div className="w-full">
            <SearchForm id="torrent-search" className="mx-auto" />
          </div>
        </section>
      </div>
    </>
  );
}

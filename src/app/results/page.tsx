import { SiteNavbar } from "@/components/site-navbar";
import { SearchForm } from "@/components/search-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TorrentResultCard, type TorrentResult } from "@/components/torrent-result-card";

const results: TorrentResult[] = [
  {
    title: "Planet Earth Complete Collection 1080p BluRay x265",
    type: "Series",
    uploadedDate: "Apr 28, 2026",
    provider: "provider",
    size: "42.8 GB",
    seeders: "2,418",
    leechers: "184",
  },
  {
    title: "Blade Runner 2049 2160p UHD HDR Atmos",
    type: "Movie",
    uploadedDate: "Apr 28, 2026",
    provider: "provider",
    size: "31.4 GB",
    seeders: "1,092",
    leechers: "73",
  },
  {
    title: "Debian 13.0 amd64 netinst ISO verified",
    type: "Software",
    uploadedDate: "Apr 27, 2026",
    provider: "provider",
    size: "762 MB",
    seeders: "684",
    leechers: "21",
  },
  {
    title: "Studio Discography FLAC 24-bit remaster pack",
    type: "Audio",
    uploadedDate: "Apr 26, 2026",
    provider: "provider",
    size: "18.9 GB",
    seeders: "392",
    leechers: "44",
  },
  {
    title: "Open source design toolkit templates archive",
    type: "Archive",
    uploadedDate: "Apr 24, 2026",
    provider: "provider",
    size: "4.6 GB",
    seeders: "211",
    leechers: "12",
  },
];

type ResultsPageProps = {
  searchParams: Promise<{
    q?: string;
    tmdbId?: string;
  }>;
};

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "planet earth";
  const tmdbId = params.tmdbId?.trim();

  return (
    <main className="min-h-dvh bg-white text-zinc-950">
      <SiteNavbar />

      <section className="flex w-full flex-col gap-6 px-4 py-8 md:px-10 xl:px-[150px]">
        <div className="mx-auto flex w-full flex-col items-center gap-3">
          <SearchForm id="results-search" defaultValue={query} />
        </div>

        <div className="flex flex-col-reverse gap-2 border-b border-zinc-200 pb-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center justify-end gap-2 md:order-2">
            <Select defaultValue="all">
              <SelectTrigger size="sm" className="w-[105px] text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="series">Series</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="archive">Archives</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger size="sm" className="w-[112px] text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="seeders">Most seeders</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-zinc-500 md:text-sm">
            Showing 5 mock results for{" "}
            <span className="font-medium text-zinc-800">{query}</span>
            {tmdbId ? (
              <span className="ml-2 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                TMDB {tmdbId}
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {results.map((result) => (
            <TorrentResultCard key={result.title} result={result} />
          ))}
        </div>
      </section>
    </main>
  );
}

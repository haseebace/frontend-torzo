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
    size: "42.8 GB",
    seeders: "2,418",
    leechers: "184",
  },
  {
    title: "Blade Runner 2049 2160p UHD HDR Atmos",
    type: "Movie",
    uploadedDate: "Apr 28, 2026",
    size: "31.4 GB",
    seeders: "1,092",
    leechers: "73",
  },
  {
    title: "Debian 13.0 amd64 netinst ISO verified",
    type: "Software",
    uploadedDate: "Apr 27, 2026",
    size: "762 MB",
    seeders: "684",
    leechers: "21",
  },
  {
    title: "Studio Discography FLAC 24-bit remaster pack",
    type: "Audio",
    uploadedDate: "Apr 26, 2026",
    size: "18.9 GB",
    seeders: "392",
    leechers: "44",
  },
  {
    title: "Open source design toolkit templates archive",
    type: "Archive",
    uploadedDate: "Apr 24, 2026",
    size: "4.6 GB",
    seeders: "211",
    leechers: "12",
  },
];

export default function ResultsPage() {
  return (
    <main className="min-h-dvh bg-white text-zinc-950">
      <SiteNavbar />

      <section className="flex w-full flex-col gap-6 px-4 py-8 md:px-10 xl:px-[150px]">
        <div className="mx-auto flex w-full flex-col items-center gap-3">
          <SearchForm id="results-search" defaultValue="planet earth" />
          <p className="text-center text-sm text-zinc-500">
            Showing 5 mock results for{" "}
            <span className="font-medium text-zinc-800">planet earth</span>
          </p>
        </div>

        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Results
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-[130px]">
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
              <SelectTrigger className="w-[145px]">
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

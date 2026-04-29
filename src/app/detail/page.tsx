import Link from "next/link";
import {
  ChevronDown,
  Download,
  File,
  FileText,
  Files,
  HardDrive,
  Image,
  Magnet,
  Video,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { TorrentActions } from "@/components/torrent/torrent-actions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn, formatBytes, formatDate } from "@/lib/utils";

type DetailPageProps = {
  searchParams: Promise<{
    source?: string;
    source_url?: string;
  }>;
};

function cleanTitle(title: string) {
  return title
    .replace(/^Download\s+/i, "")
    .replaceAll(".", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFileIcon(extension: string) {
  const ext = extension.toLowerCase();
  if ([".mkv", ".mp4", ".avi", ".mov", ".webm"].includes(ext)) return Video;
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) return Image;
  if ([".nfo", ".txt", ".srt", ".md"].includes(ext)) return FileText;
  return File;
}

export default async function DetailPage({ searchParams }: DetailPageProps) {
  const params = await searchParams;
  const source = params.source || "rargb";
  const sourceUrl = params.source_url;

  if (!sourceUrl) {
    return (
      <main className="min-h-dvh bg-white text-zinc-950">
        <SiteNavbar />
        <section className="px-4 py-20 text-center">
          <p className="text-zinc-500">No torrent source provided.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back home</Link>
        </section>
      </main>
    );
  }

  let torrent: any = null;
  let error: string | null = null;

  try {
    if (source === "yts") {
      // YTS Detail call
      const res = await fetch(`https://torzoapi.vercel.app/api/v1/yts/movies/${sourceUrl}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const json = await res.json();
        const movie = json.data.movie;
        if (!movie) throw new Error("YTS Movie not found");
        
        const bestTorrent = movie.torrents[0];
        torrent = {
          title: movie.title_long || movie.title,
          magnetLink: bestTorrent.magnet_link,
          torrentFileUrl: bestTorrent.url,
          infoHash: bestTorrent.hash,
          sizeBytes: bestTorrent.size_bytes,
          uploadedAt: movie.date_uploaded,
          category: "movies",
          uploader: "YTS",
          seeders: bestTorrent.seeds,
          leechers: bestTorrent.peers,
          fileCount: 1,
          files: [{ name: movie.title, size: bestTorrent.size, extension: ".mp4" }],
          source: { provider: "yts", url: movie.url },
          trustedScore: 1.0,
          healthScore: 1.0,
        };
      } else {
        const errJson = await res.json().catch(() => ({}));
        error = errJson.error?.message || `YTS API error: ${res.status}`;
      }
    } else {
      // Generic Detail call
      const res = await fetch(
        `https://torzoapi.vercel.app/api/v1/torrents/detail?source=${source}&source_url=${encodeURIComponent(sourceUrl)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const json = await res.json();
        torrent = {
           ...json.data,
           magnetLink: json.data.magnet_link,
           torrentFileUrl: json.data.torrent_file_url,
           infoHash: json.data.info_hash,
           sizeBytes: json.data.size_bytes,
           uploadedAt: json.data.uploaded_at,
           source: { provider: source, url: sourceUrl }
        };
      } else {
        const errJson = await res.json().catch(() => ({}));
        error = errJson.error?.message || `API error: ${res.status}`;
      }
    }
  } catch (e: any) {
    console.error(e);
    error = e.message || "Could not connect to the Torzo API.";
  }

  if (error || !torrent) {
    return (
      <main className="min-h-dvh bg-white text-zinc-950">
        <SiteNavbar />
        <section className="px-4 py-20 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-zinc-900">Oops!</h1>
            <p className="text-red-600 font-medium">{error || "Torrent details not found."}</p>
            <p className="text-sm text-zinc-500">Source: {source}</p>
            <p className="text-xs text-zinc-400 break-all">URL: {sourceUrl}</p>
            <Link href="/" className="text-blue-600 hover:underline mt-6 inline-block">Go back home</Link>
          </div>
        </section>
      </main>
    );
  }

  const title = cleanTitle(torrent.title);
  const detailStats = [
    { label: "Size", value: formatBytes(torrent.sizeBytes || 0), icon: HardDrive },
    { label: "Files", value: (torrent.fileCount || torrent.files?.length || 0).toString(), icon: Files },
    { label: "Seeders", value: (torrent.seeders || 0).toString(), icon: Magnet },
    { label: "Leechers", value: (torrent.leechers || 0).toString(), icon: Download },
  ];

  return (
    <main className="min-h-dvh bg-white text-zinc-950">
      <SiteNavbar />

      <section className="flex w-full flex-col gap-8 px-4 py-8 md:px-10 xl:px-[150px]">
        <div className="space-y-5 border-b border-zinc-200 pb-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 uppercase tracking-[0.14em] text-zinc-600">
              {torrent.category}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-balance break-words text-3xl font-semibold leading-tight tracking-tight text-zinc-950 md:text-5xl">
              {title}
            </h1>
            <div className="inline-flex max-w-full items-baseline gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="shrink-0 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                Info hash:
              </span>
              <p className="min-w-0 break-all font-mono text-xs leading-5 text-zinc-600 md:text-sm">
                {torrent.infoHash}
              </p>
            </div>
          </div>

          <TorrentActions 
            magnetLink={torrent.magnetLink} 
            torrentFileUrl={torrent.torrentFileUrl} 
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-950">
                Description
              </h2>
              <div className="space-y-3 text-sm leading-6 text-zinc-600">
                <p>
                  This torrent was fetched live from {torrent.source.provider.toUpperCase()}.
                  Always verify the info hash and file list before starting your download.
                </p>
                {torrent.uploader && (
                   <p>Uploader: <span className="font-medium text-zinc-900">{torrent.uploader}</span></p>
                )}
              </div>
            </section>

            <Collapsible defaultOpen>
              <CollapsibleTrigger>
                <div className="flex min-w-0 items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                      Files
                    </h2>
                  </div>
                </div>
                <ChevronDown className="size-4 shrink-0 text-zinc-500 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="divide-y divide-zinc-200/70 pr-2">
                  {torrent.files?.map((file: any, i: number) => {
                    const FileIcon = getFileIcon(file.extension || "");

                    return (
                      <div
                        key={`${file.name}-${i}`}
                        className="grid gap-3 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-zinc-50 md:grid-cols-[1fr_auto]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500">
                            <FileIcon className="size-4" />
                          </span>
                          <p className="min-w-0 truncate font-medium text-zinc-700">
                            {file.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 md:justify-end">
                          <span className="rounded-md bg-zinc-100 px-2 py-1 font-medium uppercase tracking-[0.12em] text-zinc-600">
                            {file.extension}
                          </span>
                          <span className="w-24 text-right font-medium text-zinc-700">
                            {file.size}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">
                Torrent info
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {detailStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                    >
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Icon className="size-3.5" />
                        {stat.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-zinc-950">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">
                Health & Dates
              </h2>
              <div className="divide-y divide-zinc-200/70 text-sm">
                <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <span className="text-zinc-500">Uploaded date</span>
                  <span className="font-semibold text-zinc-950">
                    {formatDate(torrent.uploadedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-zinc-500">Verified</span>
                  <span className={cn("font-semibold", torrent.verified ? "text-emerald-600" : "text-zinc-950")}>
                    {torrent.verified ? "Yes" : "No"}
                  </span>
                </div>
                {torrent.downloaded !== undefined && torrent.downloaded !== null && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-zinc-500">Downloads</span>
                    <span className="font-semibold text-zinc-950">
                      {torrent.downloaded}
                    </span>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">
                Source
              </h2>
              <div className="divide-y divide-zinc-200/70 text-sm">
                <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <span className="text-zinc-500">Provider</span>
                  <span className="font-semibold uppercase tracking-[0.12em] text-zinc-950">
                    {torrent.source.provider}
                  </span>
                </div>
                <div className="py-3 last:pb-0">
                  <Link
                    href={torrent.source.url}
                    target="_blank"
                    className="inline-flex text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline"
                  >
                    View original source
                  </Link>
                </div>
              </div>
            </section>

          </aside>
        </div>
      </section>
    </main>
  );
}

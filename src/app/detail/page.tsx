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

type TorrentFile = {
  name: string;
  size: string;
  extension: string;
};

type TorrentImage = {
  url: string;
  page_url: string | null;
  kind: string;
};

type TorrentSource = {
  provider: string;
  source_url: string;
  seeders: number | null;
  leechers: number | null;
  downloaded: number | null;
  last_seen_at: string | null;
  verified: boolean | null;
};

type TorrentDetailData = {
  id: string;
  title: string;
  magnet_link: string | null;
  torrent_file_url: string | null;
  info_hash: string | null;
  size_bytes: number | null;
  uploaded_at: string | null;
  category: string | null;
  language: string | null;
  uploader: string | null;
  verified: boolean | null;
  seeders: number | null;
  leechers: number | null;
  downloaded: number | null;
  file_count: number | null;
  primary_file_name: string | null;
  primary_file_extension: string | null;
  files: TorrentFile[];
  images: TorrentImage[];
  trusted_score: number | null;
  health_score: number | null;
  source_count: number | null;
  last_seen_at: string | null;
  sources: TorrentSource[];
};

type TorrentDetailMeta = {
  fetched_live?: boolean;
  lookup_source?: string;
  provider?: string;
  source_url?: string;
};

type TorrentDetailResponse = {
  data: TorrentDetailData;
  meta?: TorrentDetailMeta;
};

type YtsTorrent = {
  hash?: string;
  magnet_link?: string;
  url?: string;
  size?: string;
  size_bytes?: number;
  seeds?: number;
  peers?: number;
};

type YtsMovie = {
  title?: string;
  title_long?: string;
  url?: string;
  language?: string;
  date_uploaded?: string;
  torrents?: YtsTorrent[];
};

type YtsDetailResponse = {
  data?: {
    movie?: YtsMovie;
  };
  error?: {
    message?: string;
  };
};

type TorrentDetail = {
  title: string;
  magnetLink: string | null;
  torrentFileUrl: string | null;
  infoHash: string | null;
  sizeBytes: number;
  uploadedAt: string | null;
  category: string;
  language: string | null;
  uploader: string | null;
  verified: boolean;
  seeders: number;
  leechers: number;
  downloaded: number | null;
  fileCount: number;
  primaryFileName: string | null;
  primaryFileExtension: string | null;
  files: TorrentFile[];
  images: TorrentImage[];
  trustedScore: number | null;
  healthScore: number | null;
  sourceCount: number;
  lastSeenAt: string | null;
  sources: TorrentSource[];
  source: {
    provider: string;
    url: string;
  };
  meta: TorrentDetailMeta;
};

function cleanTitle(title: string) {
  return title
    .replace(/^Download\s+/i, "")
    .replaceAll(".", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatNumber(value: number | null | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "Unknown";
}

function formatPercent(value: number | null | undefined) {
  if (typeof value !== "number") return "Unknown";

  return `${Math.round(value * 100)}%`;
}

function formatProvider(value: string | null | undefined) {
  if (!value) return "Unknown";

  return value.replaceAll("-", " ").toUpperCase();
}

function normalizeDetailResponse(
  response: TorrentDetailResponse,
  fallbackSource: string,
  fallbackSourceUrl: string
): TorrentDetail {
  const { data, meta = {} } = response;
  const primarySource = data.sources?.[0];

  return {
    title: data.title,
    magnetLink: data.magnet_link,
    torrentFileUrl: data.torrent_file_url,
    infoHash: data.info_hash,
    sizeBytes: data.size_bytes ?? 0,
    uploadedAt: data.uploaded_at,
    category: data.category ?? "unknown",
    language: data.language,
    uploader: data.uploader,
    verified: Boolean(data.verified ?? primarySource?.verified),
    seeders: data.seeders ?? primarySource?.seeders ?? 0,
    leechers: data.leechers ?? primarySource?.leechers ?? 0,
    downloaded: data.downloaded ?? primarySource?.downloaded ?? null,
    fileCount: data.file_count ?? data.files?.length ?? 0,
    primaryFileName: data.primary_file_name,
    primaryFileExtension: data.primary_file_extension,
    files: data.files ?? [],
    images: data.images ?? [],
    trustedScore: data.trusted_score,
    healthScore: data.health_score,
    sourceCount: data.source_count ?? data.sources?.length ?? 0,
    lastSeenAt: data.last_seen_at ?? primarySource?.last_seen_at ?? null,
    sources: data.sources ?? [],
    source: {
      provider: primarySource?.provider ?? meta.provider ?? fallbackSource,
      url: primarySource?.source_url ?? meta.source_url ?? fallbackSourceUrl,
    },
    meta,
  };
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

  let torrent: TorrentDetail | null = null;
  let error: string | null = null;

  try {
    if (source === "yts") {
      // YTS Detail call
      const res = await fetch(`https://torzoapi.vercel.app/api/v1/yts/movies/${sourceUrl}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const json = (await res.json()) as YtsDetailResponse;
        const movie = json.data?.movie;
        if (!movie) throw new Error("YTS Movie not found");
        
        const bestTorrent = movie.torrents?.[0];
        torrent = {
          title: movie.title_long || movie.title || "YTS torrent",
          magnetLink: bestTorrent?.magnet_link ?? null,
          torrentFileUrl: bestTorrent?.url ?? null,
          infoHash: bestTorrent?.hash ?? null,
          sizeBytes: bestTorrent?.size_bytes ?? 0,
          uploadedAt: movie.date_uploaded ?? null,
          category: "movies",
          uploader: "YTS",
          seeders: bestTorrent?.seeds ?? 0,
          leechers: bestTorrent?.peers ?? 0,
          fileCount: 1,
          files: [{ name: movie.title || "Movie file", size: bestTorrent?.size ?? "Unknown", extension: ".mp4" }],
          source: { provider: "yts", url: movie.url ?? sourceUrl },
          sources: [],
          images: [],
          language: movie.language ?? null,
          primaryFileName: movie.title ?? null,
          primaryFileExtension: ".mp4",
          sourceCount: 1,
          lastSeenAt: movie.date_uploaded ?? null,
          meta: { provider: "yts", source_url: movie.url ?? sourceUrl },
          trustedScore: 1.0,
          healthScore: 1.0,
          downloaded: null,
          verified: true,
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
        const json = (await res.json()) as TorrentDetailResponse;
        torrent = normalizeDetailResponse(json, source, sourceUrl);
      } else {
        const errJson = await res.json().catch(() => ({}));
        error = errJson.error?.message || `API error: ${res.status}`;
      }
    }
  } catch (e) {
    console.error(e);
    error =
      e instanceof Error ? e.message : "Could not connect to the Torzo API.";
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
  const hasFiles = torrent.files.length > 0;
  const detailStats = [
    { label: "Size", value: formatBytes(torrent.sizeBytes || 0), icon: HardDrive },
    { label: "Files", value: (torrent.fileCount || torrent.files?.length || 0).toString(), icon: Files },
    { label: "Seeders", value: formatNumber(torrent.seeders), icon: Magnet },
    { label: "Leechers", value: formatNumber(torrent.leechers), icon: Download },
  ];
  const renderTorrentInfo = () => (
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
  );

  return (
    <main className="min-h-dvh overflow-x-hidden bg-white text-zinc-950">
      <SiteNavbar />

      <section className="flex w-full min-w-0 flex-col gap-8 px-4 py-8 md:px-10 xl:px-[150px]">
        <div className="min-w-0 space-y-5 border-b border-zinc-200 pb-7">
          <div className="space-y-3">
            <h1 className="max-w-full break-words text-2xl font-semibold leading-tight tracking-tight text-zinc-950 md:text-5xl">
              {title}
            </h1>
            <div className="flex w-full min-w-0 items-baseline gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 sm:inline-flex sm:w-auto">
              <span className="shrink-0 font-sans text-xs font-medium uppercase tracking-[0.08em] text-zinc-400">
                Info hash:
              </span>
              <p className="min-w-0 truncate font-mono text-xs leading-5 text-zinc-600 md:text-sm">
                {torrent.infoHash ?? "Unknown"}
              </p>
            </div>
          </div>

          <TorrentActions 
            magnetLink={torrent.magnetLink} 
            torrentFileUrl={torrent.torrentFileUrl} 
          />
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <div className="lg:hidden">
              {renderTorrentInfo()}
            </div>

            <Collapsible>
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
                <div className="min-w-0 divide-y divide-zinc-200/70">
                  {hasFiles ? torrent.files.map((file, i) => {
                    const FileIcon = getFileIcon(file.extension || "");
                    const fileSize =
                      file.size && file.size !== "0 bytes"
                        ? file.size
                        : "Unknown size";

                    return (
                      <div
                        key={`${file.name}-${i}`}
                        className="rounded-lg px-2 py-3 text-xs transition-colors hover:bg-zinc-50 md:text-sm"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 md:size-8">
                            <FileIcon className="size-3.5 md:size-4" />
                          </span>
                          <p className="min-w-0 truncate font-medium text-zinc-700">
                            {file.name}
                          </p>
                          <span className="ml-auto shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600 md:px-2 md:py-1 md:text-xs md:tracking-[0.12em]">
                            {fileSize}
                          </span>
                        </div>
                      </div>
                    );
                  }) : (
                    <p className="px-2 py-3 text-sm text-zinc-500">
                      No file list returned for this torrent yet.
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {torrent.sources.length > 0 && (
              <Collapsible>
                <CollapsibleTrigger>
                  <div className="flex min-w-0 items-center gap-4">
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                      Sources
                    </h2>
                  </div>
                  <ChevronDown className="size-4 shrink-0 text-zinc-500 transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                <div className="min-w-0 divide-y divide-zinc-200/70">
                    {torrent.sources.map((item, i) => (
                      <div
                        key={`${item.provider}-${item.source_url}-${i}`}
                        className="min-w-0 rounded-lg px-2 py-3 text-sm"
                      >
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <Link
                              href={item.source_url}
                              target="_blank"
                              className="min-w-0 flex-1 truncate text-xs text-zinc-500 underline-offset-4 hover:text-zinc-950 hover:underline md:text-sm"
                            >
                              {item.source_url}
                            </Link>
                            <span className="shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600 md:border md:border-zinc-200 md:bg-zinc-50 md:px-2 md:py-1 md:text-[11px] md:tracking-[0.14em]">
                              {formatProvider(item.provider)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {torrent.images.length > 0 && (
              <section className="rounded-xl border border-zinc-200 bg-white p-5">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-950">
                  Screenshots
                </h2>
                <div className="flex flex-wrap gap-2">
                  {torrent.images.map((image, index) => (
                    <Link
                      key={`${image.url}-${index}`}
                      href={image.page_url ?? image.url}
                      target="_blank"
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 md:px-3 md:py-2 md:text-sm"
                    >
                      Screenshot {index + 1}
                      <span className="ml-1.5 text-[10px] uppercase tracking-[0.1em] text-zinc-400 md:ml-2 md:text-xs md:tracking-[0.12em]">
                        {image.kind}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="hidden lg:block">
              {renderTorrentInfo()}
            </div>

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
                      {formatNumber(torrent.downloaded)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-zinc-500">Health score</span>
                  <span className="font-semibold text-zinc-950">
                    {formatPercent(torrent.healthScore)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-zinc-500">Trusted score</span>
                  <span className="font-semibold text-zinc-950">
                    {formatPercent(torrent.trustedScore)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                  <span className="text-zinc-500">Last seen</span>
                  <span className="font-semibold text-zinc-950">
                    {formatDate(torrent.lastSeenAt)}
                  </span>
                </div>
              </div>
            </section>

          </aside>
        </div>
      </section>
    </main>
  );
}

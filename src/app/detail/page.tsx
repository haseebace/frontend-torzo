import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  File,
  FileText,
  Image,
  Video,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { TorrentActions } from "@/components/torrent/torrent-actions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn, formatDate } from "@/lib/utils";

type DetailPageProps = {
  searchParams: Promise<{
    source?: string;
    source_url?: string;
  }>;
};

type TorrentFile = {
  name: string;
  size: string;
  size_bytes?: number;
  size_human?: string;
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
  size_human: string | null;
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
  size_human?: string;
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
  sizeHuman: string;
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

export async function generateMetadata({ searchParams }: DetailPageProps): Promise<Metadata> {
  const params = await searchParams;
  const sourceUrl = params.source_url;
  
  if (!sourceUrl) {
    return {
      title: "Details Not Found",
      description: "No media source provided.",
    };
  }
  
  return {
    title: "Media Details",
    description: `View details, sources, and download information. Compare seeders, file sizes, and more.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

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

function formatBytesFromBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatProviderLinkLabel(value: string | null | undefined) {
  if (!value) return "Unknown";
  const normalized = value.toLowerCase();

  if (normalized === "rargb" || normalized === "rarbg") return "RARBG";
  if (normalized === "yts") return "YTS";
  if (normalized === "thepiratebay" || normalized === "the-pirate-bay") {
    return "The Pirate Bay";
  }

  return normalized
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
    sizeHuman: data.size_human || formatBytesFromBytes(data.size_bytes ?? 0),
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

function getFileSizeDisplay(file: TorrentFile): string {
  if (file.size_human) return file.size_human;
  
  if (file.size && file.size !== "0 bytes") {
    const cleaned = file.size.replace(/[\[\]]/g, "").trim();
    const isHumanReadable = /(\d+(\.\d+)?)\s*(GB|MB|KB|TB|PB)/i.test(cleaned);
    
    if (isHumanReadable) {
      return cleaned;
    }
    
    const bytes = parseInt(cleaned, 10);
    if (!isNaN(bytes) && bytes > 0) {
      return formatBytesFromBytes(bytes);
    }
  }
  
  if (file.size_bytes && file.size_bytes > 0) {
    return formatBytesFromBytes(file.size_bytes);
  }
  
  return "Unknown";
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
          <p className="text-zinc-500">No media source provided.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back home</Link>
        </section>
      </main>
    );
  }

  let torrent: TorrentDetail | null = null;
  let error: string | null = null;

  try {
    if (source === "yts") {
      const res = await fetch(`https://torzoapi.vercel.app/api/v1/yts/movies/${sourceUrl}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const json = (await res.json()) as YtsDetailResponse;
        const movie = json.data?.movie;
        if (!movie) throw new Error("YTS Movie not found");
        
        const bestTorrent = movie.torrents?.[0];
        torrent = {
          title: movie.title_long || movie.title || "YTS media",
          magnetLink: bestTorrent?.magnet_link ?? null,
          torrentFileUrl: bestTorrent?.url ?? null,
          infoHash: bestTorrent?.hash ?? null,
          sizeBytes: bestTorrent?.size_bytes ?? 0,
          sizeHuman: bestTorrent?.size || formatBytesFromBytes(bestTorrent?.size_bytes ?? 0),
          uploadedAt: movie.date_uploaded ?? null,
          category: "movies",
          uploader: "YTS",
          seeders: bestTorrent?.seeds ?? 0,
          leechers: bestTorrent?.peers ?? 0,
          fileCount: 1,
          files: [{ name: movie.title || "Media file", size: bestTorrent?.size || formatBytesFromBytes(bestTorrent?.size_bytes ?? 0), size_bytes: bestTorrent?.size_bytes ?? 0, size_human: bestTorrent?.size || formatBytesFromBytes(bestTorrent?.size_bytes ?? 0), extension: ".mp4" }],
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
            <p className="text-red-600 font-medium">{error || "Media details not found."}</p>
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
    { label: "Files", value: (torrent.fileCount || torrent.files?.length || 0).toString() },
    { label: "Size", value: torrent.sizeHuman || "Unknown" },
    { label: "Seeders", value: formatNumber(torrent.seeders) },
    { label: "Leechers", value: formatNumber(torrent.leechers) },
  ];
  const sourceLink = torrent.sources[0] ?? {
    provider: torrent.source.provider,
    source_url: torrent.source.url,
  };

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
             infoHash={torrent.infoHash}
             className="sm:w-full"
           />
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 border-b border-zinc-200 pb-4 text-[12px] md:gap-x-6 md:gap-y-3 md:pb-5 md:text-sm">
              {detailStats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="text-zinc-500">{stat.label}</span>
                  <span className="font-semibold text-zinc-950">{stat.value}</span>
                </div>
              ))}
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
                    const fileSize = getFileSizeDisplay(file);

                    return (
                      <div
                        key={`${file.name}-${i}`}
                        className="rounded-lg px-2 py-3 text-xs transition-colors hover:bg-zinc-50 md:text-sm"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 md:size-8">
                            <FileIcon className="size-3.5 md:size-4" />
                          </span>
                           <p className="min-w-0 flex-1 truncate font-medium text-zinc-700">
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
                      No file list returned for this media yet.
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

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
                      <span className="ml-1.5 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600 md:ml-2 md:px-2 md:py-1 md:text-xs md:tracking-[0.12em]">
                        {image.kind}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="min-w-0 space-y-4">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">
                Health & Dates
              </h2>
              <div className="divide-y divide-zinc-200/70 text-sm">
                {sourceLink.source_url ? (
                  <div className="flex min-w-0 items-center justify-between gap-4 py-3 first:pt-0">
                    <span className="shrink-0 text-zinc-500">Source</span>
                    <Link
                      href={sourceLink.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="min-w-0 truncate border-b border-zinc-300 pb-0.5 text-right text-xs font-medium text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 md:text-sm"
                    >
                      {formatProviderLinkLabel(sourceLink.provider)}
                    </Link>
                  </div>
                ) : null}
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

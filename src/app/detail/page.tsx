import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { Badge } from "@/components/ui/badge";
import { TorrentActions } from "@/components/torrent/torrent-actions";
import { TorrentFileList } from "@/components/torrent/torrent-file-list";
import { VisitedTorrentsTracker } from "@/components/torrent/visited-torrents-tracker";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  id: string;
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

export async function generateMetadata({
  searchParams,
}: DetailPageProps): Promise<Metadata> {
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
  fallbackSourceUrl: string,
): TorrentDetail {
  const { data, meta = {} } = response;
  const primarySource = data.sources?.[0];

  return {
    id: data.id,
    title: data.title,
    magnetLink: data.magnet_link,
    torrentFileUrl: data.torrent_file_url,
    infoHash: data.info_hash,
    sizeBytes: data.size_bytes ?? 0,
    sizeHuman: data.size_human || formatBytes(data.size_bytes ?? 0),
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



export default async function DetailPage({ searchParams }: DetailPageProps) {
  const params = await searchParams;
  const source = params.source || "rargb";
  const sourceUrl = params.source_url;

  if (!sourceUrl) {
    return (
      <main className="min-h-dvh bg-background text-foreground">
        <SiteNavbar />
        <section className="origin-center animate-page-fade-in px-4 py-20 text-center">
          <p className="text-muted-foreground">No media source provided.</p>
          <Link
            href="/"
            className="text-link hover:underline mt-4 inline-block"
          >
            Go back home
          </Link>
        </section>
      </main>
    );
  }

  let torrent: TorrentDetail | null = null;
  let error: string | null = null;

  try {
    if (source === "yts") {
      const res = await fetch(
        `https://torzoapi.vercel.app/api/v1/yts/movies/${sourceUrl}`,
        {
          cache: "no-store",
        },
      );
      if (res.ok) {
        const json = (await res.json()) as YtsDetailResponse;
        const movie = json.data?.movie;
        if (!movie) throw new Error("YTS Movie not found");

        const bestTorrent = movie.torrents?.[0];
        torrent = {
          id: `yts-${sourceUrl}`,
          title: movie.title_long || movie.title || "YTS media",
          magnetLink: bestTorrent?.magnet_link ?? null,
          torrentFileUrl: bestTorrent?.url ?? null,
          infoHash: bestTorrent?.hash ?? null,
          sizeBytes: bestTorrent?.size_bytes ?? 0,
          sizeHuman:
            bestTorrent?.size ||
            formatBytes(bestTorrent?.size_bytes ?? 0),
          uploadedAt: movie.date_uploaded ?? null,
          category: "movies",
          uploader: "YTS",
          seeders: bestTorrent?.seeds ?? 0,
          leechers: bestTorrent?.peers ?? 0,
          fileCount: 1,
          files: [
            {
              name: movie.title || "Media file",
              size:
                bestTorrent?.size ||
                formatBytes(bestTorrent?.size_bytes ?? 0),
              size_bytes: bestTorrent?.size_bytes ?? 0,
              size_human:
                bestTorrent?.size ||
                formatBytes(bestTorrent?.size_bytes ?? 0),
              extension: ".mp4",
            },
          ],
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
        { cache: "no-store" },
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
      <main className="min-h-dvh bg-background text-foreground">
        <SiteNavbar />
        <section className="origin-center animate-page-fade-in px-4 py-20 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-foreground-strong">Oops!</h1>
            <p className="text-destructive font-medium">
              {error || "Media details not found."}
            </p>
            <p className="text-sm text-muted-foreground">Source: {source}</p>
            <p className="text-xs text-text-soft break-all">URL: {sourceUrl}</p>
            <Link
              href="/"
              className="text-link hover:underline mt-6 inline-block"
            >
              Go back home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const title = cleanTitle(torrent.title);
  const hasFiles = torrent.files.length > 0;
  const detailStats = [
    {
      label: "Files",
      value: (torrent.fileCount || torrent.files?.length || 0).toString(),
    },
    { label: "Size", value: torrent.sizeHuman || "Unknown" },
    { label: "Seeders", value: formatNumber(torrent.seeders) },
    { label: "Leechers", value: formatNumber(torrent.leechers) },
  ];
  const sourceLink = torrent.sources[0] ?? {
    provider: torrent.source.provider,
    source_url: torrent.source.url,
  };

  return (
    <main className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <SiteNavbar />
      <VisitedTorrentsTracker id={torrent.id} />

      <section className="flex w-full min-w-0 origin-center animate-page-fade-in flex-col gap-8 px-4 py-8 md:px-12">
        <div className="min-w-0 space-y-5 border-b border-border pb-7">
          <div className="space-y-3">
            <h1 className="max-w-full break-words text-2xl font-semibold leading-tight tracking-tight text-foreground-strong md:text-5xl">
              {title}
            </h1>
            <Badge className="max-w-full">
              <span className="shrink-0">Info hash:</span>
              <p className="min-w-0 truncate">
                {torrent.infoHash ?? "Unknown"}
              </p>
            </Badge>
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
            <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-4 text-[12px] md:gap-x-6 md:gap-y-3 md:pb-5 md:text-sm">
              {detailStats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-foreground">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            <Collapsible>
              <CollapsibleTrigger>
                <div className="flex w-full items-center justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight text-foreground-strong">
                        Files
                      </h2>
                    </div>
                  </div>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {hasFiles ? (
                  <TorrentFileList files={torrent.files} />
                ) : (
                  <p className="px-2 py-3 text-sm text-muted-foreground">
                    No file list returned for this media yet.
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>

            {torrent.images.length > 0 && (
              <section className="rounded-3xl border border-border bg-surface p-5">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground-strong">
                  Screenshots
                </h2>
                <div className="flex flex-wrap gap-2">
                  {torrent.images.map((image, index) => {
                    const rawHref = image.page_url || image.url;
                    const href =
                      rawHref && !rawHref.startsWith("http")
                        ? `https://${rawHref}`
                        : rawHref;

                    return (
                      <Badge
                        key={`${image.url}-${index}`}
                        asChild
                        variant="outline"
                        className="cursor-pointer hover:bg-surface-hover"
                      >
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Screenshot {index + 1}
                          <span className="ml-1.5 text-[10px] text-muted-foreground md:ml-2">
                            {image.kind}
                          </span>
                        </a>
                      </Badge>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="min-w-0 space-y-4">
            <section className="rounded-3xl bg-surface p-5">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground-strong">
                Health & Dates
              </h2>
              <div className="divide-y divide-border/70 text-sm">
                {sourceLink.source_url ? (
                  <div className="flex min-w-0 items-center justify-between gap-4 py-3 first:pt-0">
                    <span className="shrink-0 text-muted-foreground">
                      Source
                    </span>
                    <Link
                      href={sourceLink.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="min-w-0 truncate border-b border-input pb-0.5 text-right text-xs font-medium text-text-subtle hover:border-foreground hover:text-foreground md:text-sm"
                    >
                      {formatProviderLinkLabel(sourceLink.provider)}
                    </Link>
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <span className="text-muted-foreground">Uploaded date</span>
                  <span className="font-semibold text-foreground">
                    {formatDate(torrent.uploadedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-muted-foreground">Verified</span>
                  <span
                    className={cn(
                      "font-semibold",
                      torrent.verified ? "text-success" : "text-foreground",
                    )}
                  >
                    {torrent.verified ? "Yes" : "No"}
                  </span>
                </div>
                {torrent.downloaded !== undefined &&
                  torrent.downloaded !== null && (
                    <div className="flex items-center justify-between gap-4 py-3">
                      <span className="text-muted-foreground">Downloads</span>
                      <span className="font-semibold text-foreground">
                        {formatNumber(torrent.downloaded)}
                      </span>
                    </div>
                  )}
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-muted-foreground">Health score</span>
                  <span className="font-semibold text-foreground">
                    {formatPercent(torrent.healthScore)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-muted-foreground">Trusted score</span>
                  <span className="font-semibold text-foreground">
                    {formatPercent(torrent.trustedScore)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                  <span className="text-muted-foreground">Last seen</span>
                  <span className="font-semibold text-foreground">
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

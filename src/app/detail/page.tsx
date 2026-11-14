import type { Metadata } from "next";
import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";
import { Badge } from "@/components/ui/badge";
import { TorrentActions } from "@/components/torrent/torrent-actions";
import { TorrentFileList } from "@/components/torrent/torrent-file-list";
import { RelatedTorrentsList } from "@/components/torrent/related-torrents-list";
import { TorrentScreenshotList } from "@/components/torrent/torrent-screenshot-list";
import { VisitedTorrentsTracker } from "@/components/torrent/visited-torrents-tracker";
import type { TorrentResult } from "@/components/torrent-result-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FigmaCorner } from "@/components/figma-corner";
import { formatBytes, formatRawSize, parseRawSize } from "@/lib/utils";
import {
  inferMappleMediaType,
  parseTvEpisodeFromTitle,
  type MappleMediaType,
} from "@/lib/mapple-player";
import { resolveMappleWatchUrl } from "@/lib/server/resolve-mapple-watch";

type DetailPageProps = {
  searchParams: Promise<{
    source?: string;
    source_url?: string;
    tmdbId?: string;
    imdbId?: string;
    mediaType?: MappleMediaType;
  }>;
};

type TorrentFile = {
  name: string;
  size: string | number | null;
  size_bytes?: number;
  size_human?: string;
  extension?: string | null;
};

type TorrentImage = {
  url: string;
  page_url: string | null;
  kind: string;
};

type TorrentSource = {
  provider: string;
  source_url: string;
  seeders: string | number | null;
  leechers: string | number | null;
  downloaded: string | number | null;
  last_seen_at: string | null;
  verified: boolean | null;
};

type TorrentDetailData = {
  id: string;
  title: string;
  magnet_link: string | null;
  torrent_file_url: string | null;
  info_hash: string | null;
  size_bytes: string | number | null;
  uploaded_at: string | null;
  category: string | null;
  language: string | null;
  uploader: string | null;
  verified: boolean | null;
  seeders: string | number | null;
  leechers: string | number | null;
  downloaded: string | number | null;
  file_count: string | number | null;
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

type RelatedTorrent = {
  id: string;
  title: string;
  size: string;
  seeders: number;
  leechers: number;
  href: string;
};

function buildDetailHref(
  provider: string,
  sourceUrl: string,
  media?: { tmdbId?: string; imdbId?: string; mediaType?: string },
) {
  const searchParams = new URLSearchParams({
    source: provider,
    source_url: sourceUrl,
  });
  if (media?.tmdbId) searchParams.set("tmdbId", media.tmdbId);
  if (media?.imdbId) searchParams.set("imdbId", media.imdbId);
  if (media?.mediaType) searchParams.set("mediaType", media.mediaType);
  return `/detail?${searchParams.toString()}`;
}

function relatedSearchQuery(title: string) {
  const normalized = title.replace(/[._]+/g, " ").replace(/\s+/g, " ").trim();
  const yearMatch = normalized.match(/\b(?:19|20)\d{2}\b/);

  if (yearMatch?.index && yearMatch.index > 0) {
    return normalized.slice(0, yearMatch.index + yearMatch[0].length).trim();
  }

  return normalized.split(" ").filter(Boolean).slice(0, 5).join(" ");
}

async function fetchRelatedTorrents(
  title: string,
  infoHash: string | null,
  media?: { tmdbId?: string; imdbId?: string; mediaType?: string },
): Promise<RelatedTorrent[]> {
  const query = relatedSearchQuery(title);
  if (!query) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      source: "rargb,thepiratebay,torrentgalaxy",
      sort: "seeders",
      page: "1",
    });
    const response = await fetch(
      `https://torzoapi.vercel.app/api/v1/search?${params.toString()}`,
      {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!response.ok) return [];

    const json = (await response.json()) as { data?: TorrentResult[] };
    const currentHash = infoHash?.trim().toLowerCase();

    return (json.data ?? [])
      .filter((item) => {
        const hash = item.info_hash?.trim().toLowerCase();
        const sourceUrl = item.sources?.[0]?.source_url;
        if (!sourceUrl) return false;
        if (currentHash && hash === currentHash) return false;
        return true;
      })
      .slice(0, 8)
      .map((item) => {
        const source = item.sources[0];
        return {
          id: item.id,
          title: item.title,
          size: formatRawSize(item.size_bytes),
          seeders: Number(item.seeders ?? 0),
          leechers: Number(item.leechers ?? 0),
          href: buildDetailHref(source.provider, source.source_url, media),
        };
      });
  } catch (error) {
    console.error(error);
    return [];
  }
}

function formatProviderLinkLabel(value: string | null | undefined) {
  if (!value) return "Unknown";
  const normalized = value.toLowerCase();

  if (normalized === "rargb" || normalized === "rarbg") return "RARBG";
  if (normalized === "yts") return "YTS";
  if (normalized === "thepiratebay" || normalized === "the-pirate-bay") {
    return "The Pirate Bay";
  }
  if (normalized === "torrentgalaxy" || normalized === "torrent-galaxy") {
    return "TorrentGalaxy";
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
    sizeBytes: parseRawSize(data.size_bytes),
    sizeHuman: formatRawSize(data.size_bytes),
    uploadedAt: data.uploaded_at,
    category: data.category ?? "unknown",
    language: data.language,
    uploader: data.uploader,
    verified: Boolean(data.verified ?? primarySource?.verified),
    seeders: Number(data.seeders ?? primarySource?.seeders ?? 0),
    leechers: Number(data.leechers ?? primarySource?.leechers ?? 0),
    downloaded:
      data.downloaded === null || data.downloaded === undefined
        ? primarySource?.downloaded === null || primarySource?.downloaded === undefined
          ? null
          : Number(primarySource.downloaded)
        : Number(data.downloaded),
    fileCount: Number(data.file_count ?? data.files?.length ?? 0),
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
  const mappleMediaId = params.tmdbId?.trim() || params.imdbId?.trim() || null;

  if (!sourceUrl) {
    return (
      <main className="min-h-dvh bg-bg-canvas text-primary-text">
        <SiteNavbar />
        <section className="px-4 py-20 text-center">
          <p className="text-muted-text">No media source provided.</p>
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
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(15_000),
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
        {
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(15_000),
        },
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
      <main className="min-h-dvh bg-bg-canvas text-primary-text">
        <SiteNavbar />
        <section className="px-4 py-20 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-primary-text">Oops!</h1>
            <p className="font-medium text-leecher-text">
              {error || "Media details not found."}
            </p>
            <p className="text-sm text-muted-text">Source: {source}</p>
            <p className="break-all text-xs text-muted-text">URL: {sourceUrl}</p>
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
  const tvEpisode = parseTvEpisodeFromTitle(title);
  const mappleMediaType = inferMappleMediaType(
    torrent.category,
    title,
    params.mediaType,
  );
  const hasFiles = torrent.files.length > 0;
  const sourceLink = torrent.sources[0] ?? {
    provider: torrent.source.provider,
    source_url: torrent.source.url,
  };
  const related = await fetchRelatedTorrents(title, torrent.infoHash, {
    tmdbId: params.tmdbId,
    imdbId: params.imdbId,
    mediaType: params.mediaType,
  });
  const mappleWatch = await resolveMappleWatchUrl({
    title,
    category: torrent.category,
    tmdbId: params.tmdbId,
    imdbId: params.imdbId,
    mediaType: mappleMediaType,
    season: tvEpisode?.season,
    episode: tvEpisode?.episode,
  });
  const crumbLabel = relatedSearchQuery(title) || title;

  return (
    <main className="min-h-dvh overflow-x-hidden bg-bg-canvas text-primary-text">
      <SiteNavbar />
      <VisitedTorrentsTracker id={torrent.id} />

      <section className="flex w-full min-w-0 flex-col gap-4 px-4 py-4 md:px-12">
        <header className="flex min-w-0 flex-col gap-2 border-b border-light-200 pb-4">
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center text-xs font-semibold">
            <Link href="/" className="shrink-0 text-primary-text">
              Home
            </Link>
            <span className="text-light-400" aria-hidden="true">
              {" > "}
            </span>
            <Link href="/results" className="shrink-0 text-primary-text">
              Results
            </Link>
            <span className="text-light-400" aria-hidden="true">
              {" > "}
            </span>
            <span className="min-w-0 truncate text-primary-text">{crumbLabel}</span>
          </nav>

          <div className="flex min-w-0 flex-col gap-4">
            <h1 className="w-full min-w-0 break-words text-xl font-bold leading-normal text-primary-text md:text-[28px] md:leading-tight">
              {title}
            </h1>

            <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <Badge className="max-w-full min-w-0 border-0 bg-bg-secondary-badge px-4 py-2 text-[10px] font-medium normal-case text-muted-text md:text-xs md:font-normal">
                  <span className="shrink-0">Info hash:</span>
                  <span className="min-w-0 truncate">{torrent.infoHash ?? "Unknown"}</span>
                </Badge>
                <div className="flex flex-wrap gap-2">
                {sourceLink.source_url ? (
                  <Badge
                    asChild
                    className="border-0 bg-bg-secondary-badge px-4 py-2 text-xs font-semibold text-primary-text underline md:font-bold"
                  >
                    <Link href={sourceLink.source_url} target="_blank" rel="noreferrer">
                      {formatProviderLinkLabel(sourceLink.provider)}
                    </Link>
                  </Badge>
                ) : null}
                <Badge className="border-0 bg-bg-secondary-badge px-4 py-2 text-xs font-semibold normal-case text-primary-text md:font-bold">
                  {torrent.sizeHuman || "Unknown"}
                </Badge>
                <Badge className="border-0 bg-bg-seeder px-4 py-2 text-xs font-semibold normal-case text-seeder-text md:font-bold">
                  {formatNumber(torrent.seeders)}
                </Badge>
                <Badge className="border-0 bg-bg-leecher px-4 py-2 text-xs font-semibold normal-case text-leecher-text md:font-bold">
                  {formatNumber(torrent.leechers)}
                </Badge>
                </div>
              </div>

              <TorrentActions
                magnetLink={torrent.magnetLink}
                torrentFileUrl={torrent.torrentFileUrl}
                infoHash={torrent.infoHash}
                title={title}
                category={torrent.category}
                mappleMediaId={mappleMediaId}
                mappleWatchUrl={mappleWatch.url}
                mappleDebug={mappleWatch.debug}
                mediaType={mappleMediaType}
                season={tvEpisode?.season}
                episode={tvEpisode?.episode}
              />
            </div>
          </div>
        </header>

        {related.length > 0 ? (
          <FigmaCorner radius={24} className="overflow-hidden border-2 border-border-subtle md:border-0">
            <h2 className="bg-bg-elevated p-4 text-base font-semibold leading-normal text-primary-text md:px-4 md:py-3.5 md:text-lg">
              Related Torrents
            </h2>
            <RelatedTorrentsList items={related} />
          </FigmaCorner>
        ) : null}

        <FigmaCorner radius={24} className="overflow-hidden border-2 border-border-subtle md:border-0">
        <Collapsible defaultOpen={hasFiles} className="rounded-none border-0 bg-transparent">
          <CollapsibleTrigger className="group bg-bg-elevated p-4 text-primary-text hover:bg-bg-hover md:px-4 md:py-3.5">
            <h2 className="text-base font-semibold leading-normal md:text-lg">Files</h2>
            <span className="flex size-6 items-center justify-center">
              <img
                src="/detail/arrow-down.svg"
                alt=""
                width={12}
                height={10}
                className="group-aria-expanded:hidden dark:invert"
              />
              <img
                src="/detail/arrow-up.svg"
                alt=""
                width={12}
                height={10}
                className="hidden group-aria-expanded:block dark:invert"
              />
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent flush>
            {hasFiles ? (
              <TorrentFileList files={torrent.files} />
            ) : (
              <p className="bg-bg-surface p-4 text-xs text-muted-text md:px-4 md:py-3 md:text-sm">
                No file list returned for this media yet.
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
        </FigmaCorner>

        {torrent.images.length > 0 ? (
          <FigmaCorner radius={24} className="overflow-hidden border-2 border-border-subtle md:border-0">
          <Collapsible defaultOpen className="rounded-none border-0 bg-transparent">
            <CollapsibleTrigger className="group bg-bg-elevated p-4 text-primary-text hover:bg-bg-hover md:px-4 md:py-3.5">
              <h2 className="text-base font-semibold leading-normal md:text-lg">Images</h2>
              <span className="flex size-6 items-center justify-center">
                <img
                  src="/detail/arrow-down.svg"
                  alt=""
                  width={12}
                  height={10}
                  className="group-aria-expanded:hidden dark:invert"
                />
                <img
                  src="/detail/arrow-up.svg"
                  alt=""
                  width={12}
                  height={10}
                  className="hidden group-aria-expanded:block dark:invert"
                />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent flush>
              <TorrentScreenshotList images={torrent.images} title={title} />
            </CollapsibleContent>
          </Collapsible>
          </FigmaCorner>
        ) : null}
      </section>
    </main>
  );
}

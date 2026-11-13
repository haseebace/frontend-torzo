/** @see https://mappletv.uk/docs/getting-started/endpoints */

export const MAPPLE_PLAYER_ORIGIN = "https://mapple.fun";

export type MappleMediaType = "movie" | "tv";

export type BuildMappleWatchUrlInput = {
  mediaId: string | number;
  mediaType: MappleMediaType;
  season?: number;
  episode?: number;
  autoPlay?: boolean;
};

export function buildMappleWatchUrl({
  mediaId,
  mediaType,
  season = 1,
  episode = 1,
  autoPlay = true,
}: BuildMappleWatchUrlInput): string {
  const params = new URLSearchParams();
  if (autoPlay) params.set("autoPlay", "true");
  const query = params.toString();
  const suffix = query ? `?${query}` : "";

  const id = String(mediaId).trim();
  if (!id) return "";

  if (mediaType === "tv") {
    return `${MAPPLE_PLAYER_ORIGIN}/watch/tv/${id}-${season}-${episode}${suffix}`;
  }

  return `${MAPPLE_PLAYER_ORIGIN}/watch/movie/${id}${suffix}`;
}

export function parseTvEpisodeFromTitle(
  title: string,
): { season: number; episode: number } | null {
  const patterns = [
    /\bS(\d{1,2})E(\d{1,2})\b/i,
    /\b(\d{1,2})x(\d{1,2})\b/i,
    /\bSeason\s*(\d{1,2}).*?\bEpisode\s*(\d{1,2})\b/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (!match) continue;
    const season = Number(match[1]);
    const episode = Number(match[2]);
    if (season > 0 && episode > 0) {
      return { season, episode };
    }
  }

  return null;
}

export function inferMappleMediaType(
  category: string | null | undefined,
  title: string,
  explicit?: MappleMediaType | null,
): MappleMediaType {
  if (explicit === "movie" || explicit === "tv") return explicit;

  const normalizedCategory = category?.trim().toLowerCase();
  if (
    normalizedCategory === "tv" ||
    normalizedCategory === "television" ||
    normalizedCategory === "tv series"
  ) {
    return "tv";
  }

  if (parseTvEpisodeFromTitle(title)) return "tv";
  return "movie";
}

export function cleanTitleForTmdbSearch(title: string): string {
  return title
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bS\d{1,2}E\d{1,2}\b/gi, " ")
    .replace(/\b\d{1,2}x\d{1,2}\b/gi, " ")
    .replace(
      /\b(720p|1080p|2160p|4320p|4k|bluray|blu-?ray|webrip|web-?dl|hdtv|x264|x265|hevc|av1|aac|dts|atmos|5\.1|7\.1)\b/gi,
      " ",
    )
    .replace(/[._]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

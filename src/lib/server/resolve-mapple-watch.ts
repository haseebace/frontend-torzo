import { getTmdbAuth } from "@/lib/tmdb-auth";
import {
  buildMappleWatchUrl,
  cleanTitleForTmdbSearch,
  extractImdbId,
  inferMappleMediaType,
  parseTvEpisodeFromTitle,
  type MappleMediaType,
  type MappleWatchDebug,
} from "@/lib/mapple-player";

type ResolveMappleWatchUrlInput = {
  title: string;
  category?: string | null;
  tmdbId?: string | null;
  imdbId?: string | null;
  mediaType?: MappleMediaType | null;
  season?: number;
  episode?: number;
};

async function searchTmdbId(query: string, mediaType: MappleMediaType) {
  const { headers, apiKey, hasBearerToken } = getTmdbAuth();
  if (!hasBearerToken && !apiKey) {
    return { id: null, failure: "TMDB credentials are not configured." };
  }

  const baseUrl = (
    process.env.APP_TMDB_BASE_URL ?? "https://api.themoviedb.org/3"
  ).replace(/\/$/, "");
  const language = process.env.APP_TMDB_LANGUAGE ?? "en-US";
  const order: MappleMediaType[] =
    mediaType === "tv" ? ["tv", "movie"] : ["movie", "tv"];
  let lastStatus: number | null = null;

  for (const type of order) {
    const url = new URL(`${baseUrl}/search/${type}`);
    url.searchParams.set("query", query);
    url.searchParams.set("include_adult", "false");
    url.searchParams.set("language", language);
    url.searchParams.set("page", "1");
    if (apiKey) url.searchParams.set("api_key", apiKey);

    try {
      const response = await fetch(url, {
        headers,
        next: { revalidate: 3600 },
      });
      if (!response.ok) {
        lastStatus = response.status;
        continue;
      }

      const data = (await response.json()) as { results?: { id?: number }[] };
      const id = data.results?.find((item) => item.id)?.id;
      if (id) return { id, failure: null };
    } catch {
      continue;
    }
  }

  return {
    id: null,
    failure: lastStatus
      ? `TMDB search failed with HTTP ${lastStatus}.`
      : "TMDB search returned no match.",
  };
}

export async function resolveMappleWatchUrl({
  title,
  category,
  tmdbId,
  imdbId,
  mediaType,
  season,
  episode,
}: ResolveMappleWatchUrlInput): Promise<{
  url: string | null;
  debug: MappleWatchDebug;
}> {
  const { hasBearerToken, apiKey } = getTmdbAuth();
  const inferredType = inferMappleMediaType(category, title, mediaType);
  const tvEpisode =
    season && episode
      ? { season, episode }
      : parseTvEpisodeFromTitle(title);
  const trimmedTmdbId = tmdbId?.trim() || null;
  const trimmedImdbId = imdbId?.trim() || null;
  const titleImdbId = extractImdbId(title);
  const searchQuery = cleanTitleForTmdbSearch(title);
  const debug: MappleWatchDebug = {
    title,
    category: category ?? null,
    tmdbId: trimmedTmdbId,
    imdbId: trimmedImdbId,
    titleImdbId,
    mediaType: inferredType,
    season: tvEpisode?.season ?? null,
    episode: tvEpisode?.episode ?? null,
    searchQuery: searchQuery || null,
    mediaId: null,
    source: "none",
    tmdbConfigured: hasBearerToken || Boolean(apiKey),
    watchUrl: null,
    failure: null,
  };

  if (trimmedTmdbId) {
    debug.mediaId = trimmedTmdbId;
    debug.source = "tmdb-id";
  } else if (trimmedImdbId) {
    debug.mediaId = trimmedImdbId;
    debug.source = "imdb-id";
  } else if (titleImdbId) {
    debug.mediaId = titleImdbId;
    debug.source = "title-imdb";
  } else if (!searchQuery) {
    debug.failure = "Could not build a TMDB search query from the title.";
    return { url: null, debug };
  } else {
    const match = await searchTmdbId(searchQuery, inferredType);
    if (!match.id) {
      debug.failure = match.failure;
      return { url: null, debug };
    }
    debug.mediaId = String(match.id);
    debug.source = "tmdb-search";
  }

  const url = buildMappleWatchUrl({
    mediaId: debug.mediaId ?? "",
    mediaType: inferredType,
    season: tvEpisode?.season,
    episode: tvEpisode?.episode,
  });
  debug.watchUrl = url || null;
  if (!url) debug.failure = "Mapple watch URL was empty.";

  return { url: url || null, debug };
}

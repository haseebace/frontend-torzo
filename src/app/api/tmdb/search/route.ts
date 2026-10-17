import type { NextRequest } from "next/server";
import { getTmdbAuth } from "@/lib/tmdb-auth";

type TmdbSearchResult = {
  id: number;
  media_type?: MediaType | "person";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  overview?: string;
  popularity?: number;
  vote_count?: number;
};

type MediaType = "movie" | "tv";

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getTitle(result: TmdbSearchResult) {
  return result.title || result.name || result.original_title || result.original_name || "";
}

function getOriginalTitle(result: TmdbSearchResult) {
  return result.original_title || result.original_name || "";
}

function getReleaseYear(result: TmdbSearchResult) {
  const date = result.release_date || result.first_air_date;
  return date ? date.slice(0, 4) : null;
}

function scoreResult(result: TmdbSearchResult, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  const title = normalizeSearchText(getTitle(result));
  const originalTitle = normalizeSearchText(getOriginalTitle(result));
  const titleWords = title.split(" ").filter(Boolean);
  const queryWords = normalizedQuery.split(" ").filter(Boolean);

  let score = 0;

  if (title === normalizedQuery) {
    score += 55_000;
  } else if (title.startsWith(normalizedQuery)) {
    score += 45_000;
  } else if (titleWords.some((word) => word.startsWith(normalizedQuery))) {
    score += 35_000;
  } else if (title.includes(normalizedQuery)) {
    score += 30_000;
  }

  if (queryWords.length > 1 && queryWords.every((word) => titleWords.includes(word))) {
    score += 18_000;
  }

  if (originalTitle && originalTitle !== title) {
    if (originalTitle === normalizedQuery) {
      score += 20_000;
    } else if (originalTitle.startsWith(normalizedQuery)) {
      score += 12_000;
    }
  }

  score += Math.min(result.popularity ?? 0, 500) * 100;
  score += Math.min(result.vote_count ?? 0, 10_000) / 2;

  return score;
}

function serializeResult(result: TmdbSearchResult, mediaType: MediaType) {
  return {
    id: result.id,
    mediaType,
    title: getTitle(result) || "Untitled title",
    releaseYear: getReleaseYear(result),
    posterUrl: result.poster_path
      ? `https://image.tmdb.org/t/p/w92${result.poster_path}`
      : null,
    overview: result.overview ?? "",
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";

  const { headers, apiKey, hasBearerToken } = getTmdbAuth();
  const baseUrl =
    process.env.APP_TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
  const language = process.env.APP_TMDB_LANGUAGE ?? "en-US";

  if (!hasBearerToken && !apiKey) {
    return Response.json(
      { results: [], error: "TMDB credentials are not configured." },
      { status: 503 }
    );
  }

  const fetchEndpoint = async (endpoint: string) => {
    const url = new URL(`${baseUrl.replace(/\/$/, "")}/${endpoint}`);
    url.searchParams.set("language", language);

    if (apiKey) {
      url.searchParams.set("api_key", apiKey);
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as { results?: TmdbSearchResult[] };
    return data.results ?? [];
  };

  if (query.length < 3) {
    const [trendingResults, popularMovies, popularTv] = await Promise.all([
      fetchEndpoint("trending/all/week"),
      fetchEndpoint("movie/popular"),
      fetchEndpoint("tv/popular"),
    ]);

    const discoveryResults = [
      ...trendingResults
        .filter(
          (result): result is TmdbSearchResult & { media_type: MediaType } =>
            result.media_type === "movie" || result.media_type === "tv",
        )
        .map((result) => ({ result, mediaType: result.media_type })),
      ...popularMovies.map((result) => ({ result, mediaType: "movie" as const })),
      ...popularTv.map((result) => ({ result, mediaType: "tv" as const })),
    ].filter(({ result }) => getTitle(result));

    const uniqueResults = Array.from(
      new Map(
        discoveryResults.map(({ result, mediaType }) => [
          `${mediaType}:${result.id}`,
          { result, mediaType },
        ]),
      ).values(),
    );
    const normalizedQuery = normalizeSearchText(query);
    const matchingResults = normalizedQuery
      ? uniqueResults.filter(({ result }) =>
          normalizeSearchText(getTitle(result)).includes(normalizedQuery),
        )
      : uniqueResults;
    const selectedResults = (matchingResults.length > 0
      ? matchingResults
      : uniqueResults
    ).slice(0, 5);

    return Response.json({
      mode: "discovery",
      results: selectedResults.map(({ result, mediaType }) =>
        serializeResult(result, mediaType),
      ),
    });
  }

  const search = async (mediaType: MediaType) => {
    const searchUrl = new URL(`${baseUrl.replace(/\/$/, "")}/search/${mediaType}`);
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("include_adult", "false");
    searchUrl.searchParams.set("language", language);
    searchUrl.searchParams.set("page", "1");

    if (apiKey) {
      searchUrl.searchParams.set("api_key", apiKey);
    }

    const response = await fetch(searchUrl, {
      headers,
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as { results?: TmdbSearchResult[] };
    return (data.results ?? []).map((result) => ({ result, mediaType }));
  };

  const [movieResults, tvResults] = await Promise.all([
    search("movie"),
    search("tv"),
  ]);

  if (movieResults.length === 0 && tvResults.length === 0) {
    return Response.json(
      { results: [], error: "TMDB search failed." },
      { status: 502 }
    );
  }

  const results = [...movieResults, ...tvResults]
    .filter(({ result }) => getTitle(result))
    .toSorted((a, b) => scoreResult(b.result, query) - scoreResult(a.result, query))
    .slice(0, 5)
    .map(({ result, mediaType }) => serializeResult(result, mediaType));

  return Response.json({ results });
}

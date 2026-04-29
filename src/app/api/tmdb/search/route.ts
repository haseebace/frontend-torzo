import type { NextRequest } from "next/server";

type TmdbMovieResult = {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string;
  poster_path?: string | null;
  overview?: string;
  popularity?: number;
  vote_count?: number;
};

type TmdbAuth = {
  headers: Record<string, string>;
  apiKey: string | null;
  hasBearerToken: boolean;
};

function getTmdbAuth(): TmdbAuth {
  const bearerToken =
    process.env.APP_TMDB_READ_ACCESS_TOKEN ?? process.env.TMDB_ACCESS_TOKEN;

  if (bearerToken) {
    return {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: "application/json",
      },
      apiKey: null,
      hasBearerToken: true,
    };
  }

  return {
    headers: {
      Accept: "application/json",
    },
    apiKey: process.env.APP_TMDB_API_KEY ?? process.env.TMDB_API_KEY ?? null,
    hasBearerToken: false,
  };
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreMovie(movie: TmdbMovieResult, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  const title = normalizeSearchText(movie.title ?? "");
  const originalTitle = normalizeSearchText(movie.original_title ?? "");
  const titleWords = title.split(" ").filter(Boolean);

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

  if (originalTitle && originalTitle !== title) {
    if (originalTitle === normalizedQuery) {
      score += 20_000;
    } else if (originalTitle.startsWith(normalizedQuery)) {
      score += 12_000;
    }
  }

  score += Math.min(movie.popularity ?? 0, 500) * 100;
  score += Math.min(movie.vote_count ?? 0, 10_000) / 2;

  return score;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return Response.json({ results: [] });
  }

  const { headers, apiKey, hasBearerToken } = getTmdbAuth();
  const baseUrl =
    process.env.APP_TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
  const language = process.env.APP_TMDB_LANGUAGE ?? "en-US";
  const searchUrl = new URL(`${baseUrl.replace(/\/$/, "")}/search/movie`);

  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("include_adult", "false");
  searchUrl.searchParams.set("language", language);
  searchUrl.searchParams.set("page", "1");

  if (apiKey) {
    searchUrl.searchParams.set("api_key", apiKey);
  }

  if (!hasBearerToken && !apiKey) {
    return Response.json(
      { results: [], error: "TMDB credentials are not configured." },
      { status: 503 }
    );
  }

  const response = await fetch(searchUrl, {
    headers,
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    return Response.json(
      { results: [], error: "TMDB search failed." },
      { status: response.status }
    );
  }

  const data = (await response.json()) as { results?: TmdbMovieResult[] };
  const results = (data.results ?? [])
    .filter((movie) => movie.title || movie.original_title)
    .toSorted((a, b) => scoreMovie(b, query) - scoreMovie(a, query))
    .slice(0, 5)
    .map((movie) => ({
      id: movie.id,
      title: movie.title || movie.original_title || "Untitled movie",
      releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : null,
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
        : null,
      overview: movie.overview ?? "",
    }));

  return Response.json({ results });
}

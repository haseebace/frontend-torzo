import type { NextRequest } from "next/server";
import { getTmdbAuth } from "@/lib/tmdb-auth";

type TmdbTvResult = {
  id: number;
  name?: string;
  poster_path?: string | null;
};

export async function GET(_request: NextRequest) {
  const { headers, apiKey, hasBearerToken } = getTmdbAuth();
  const baseUrl = (process.env.APP_TMDB_BASE_URL ?? "https://api.themoviedb.org/3").replace(/\/$/, "");
  const language = process.env.APP_TMDB_LANGUAGE ?? "en-US";

  if (!hasBearerToken && !apiKey) {
    return Response.json(
      { results: [], error: "TMDB credentials are not configured." },
      { status: 503 }
    );
  }

  const url = new URL(`${baseUrl}/trending/tv/week`);
  url.searchParams.set("language", language);

  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return Response.json(
      { results: [], error: "TMDB trending TV fetch failed." },
      { status: response.status }
    );
  }

  const data = (await response.json()) as { results?: TmdbTvResult[] };
  const results = (data.results ?? [])
    .filter((show) => show.poster_path)
    .slice(0, 20)
    .map((show) => ({
      id: show.id,
      title: show.name ?? "Untitled",
      posterUrl: show.poster_path
        ? `https://image.tmdb.org/t/p/w342${show.poster_path}`
        : null,
    }));

  return Response.json({ results });
}

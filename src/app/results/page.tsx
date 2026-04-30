import { cookies } from "next/headers";
import { SiteNavbar } from "@/components/site-navbar";
import { SearchForm } from "@/components/search-form";
import { ResultSort } from "@/components/result-sort";
import { TorrentResultCard, type TorrentResult } from "@/components/torrent-result-card";

type ResultsPageProps = {
  searchParams: Promise<{
    q?: string;
    tmdbId?: string;
    imdbId?: string;
    category?: string;
    sort?: string;
  }>;
};

const PROVIDERS_COOKIE_NAME = "torzo_selected_providers";

async function getSelectedProviders() {
  const cookieStore = await cookies();
  const providersCookie = cookieStore.get(PROVIDERS_COOKIE_NAME);
  
  if (providersCookie) {
    try {
      const parsed = JSON.parse(providersCookie.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fallback
    }
  }
  return ["rarbg"];
}

async function getMovieName(tmdbId: string) {
  const bearerToken = process.env.APP_TMDB_READ_ACCESS_TOKEN || process.env.TMDB_ACCESS_TOKEN;
  const baseUrl = (process.env.APP_TMDB_BASE_URL ?? "https://api.themoviedb.org/3").replace(/\/$/, "");
  
  if (!bearerToken) {
    console.warn("TMDB Bearer token missing in environment variables.");
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/movie/${tmdbId}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.title || data.name;
    } else {
      // Try TV if movie fails
      const tvResponse = await fetch(`${baseUrl}/tv/${tmdbId}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          Accept: "application/json",
        },
        next: { revalidate: 3600 }
      });
      if (tvResponse.ok) {
        const data = await tvResponse.json();
        return data.name || data.title;
      }
    }
  } catch (e) {
    console.error("Failed to fetch movie name:", e);
  }
  return null;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim();
  const tmdbId = params.tmdbId?.trim();
  const imdbId = params.imdbId?.trim();
  const category = params.category?.trim();
  const sort = params.sort || "seeders";

  const selectedProviders = await getSelectedProviders();
  
  // Normalize IDs between frontend and API
  // Frontend: rarbg, the-pirate-bay, yts
  // API: rargb, thepiratebay, yts
  const genericSources = selectedProviders
    .filter(s => s !== "yts")
    .map(s => {
      if (s === "rarbg") return "rargb";
      if (s === "the-pirate-bay") return "thepiratebay";
      return s;
    })
    .join(",");

  let allResults: TorrentResult[] = [];
  let error: string | null = null;
  let displayName = query || imdbId || tmdbId || "nothing";

  // Fetch movie name if tmdbId is present
  if (tmdbId) {
    const movieName = await getMovieName(tmdbId);
    if (movieName) {
      displayName = movieName;
    }
  }

  try {
    const apiParams = new URLSearchParams();
    if (query) apiParams.append("q", query);
    if (tmdbId) {
      apiParams.append("tmdb_id", tmdbId);
      apiParams.append("media_type", "movie"); // Defaulting to movie for now
    }
    if (imdbId) apiParams.append("imdb_id", imdbId);
    if (category) apiParams.append("category", category);
    if (genericSources) apiParams.append("source", genericSources);
    apiParams.append("sort", sort);

    // Only call generic search if we have sources or a query/ID
    if (genericSources && (query || tmdbId || imdbId)) {
      const res = await fetch(`https://torzoapi.vercel.app/api/v1/search?${apiParams.toString()}`, {
        cache: "no-store"
      });
      
      if (res.ok) {
        const json = await res.json();
        allResults = [...allResults, ...json.data];
      } else {
        const errJson = await res.json();
        error = errJson.error?.message || "Failed to fetch results from generic search.";
      }
    }

    // Handle YTS separately if selected and we have an ID
    if (selectedProviders.includes("yts") && (tmdbId || imdbId)) {
      const ytsParams = new URLSearchParams();
      if (tmdbId) ytsParams.append("tmdb_id", tmdbId);
      if (imdbId) ytsParams.append("imdb_id", imdbId);
      
      const ytsRes = await fetch(`https://torzoapi.vercel.app/api/v1/yts/search?${ytsParams.toString()}`, {
        cache: "no-store"
      });
      
      if (ytsRes.ok) {
        const ytsJson = await ytsRes.json();
        if (ytsJson.data?.movies) {
          // Normalize YTS movies to TorrentResult shape
          const ytsResults: TorrentResult[] = ytsJson.data.movies.flatMap((movie: any) => 
            movie.torrents.map((t: any) => ({
              id: `yts-${movie.id}-${t.hash}`,
              title: `${movie.title} (${movie.year}) [${t.quality}]`,
              category: "movies",
              uploaded_at: null,
              size_bytes: t.size_bytes,
              seeders: t.seeds,
              leechers: t.peers,
              sources: [{
                provider: "yts",
                source_url: String(movie.id)
              }]
            }))
          );
          allResults = [...allResults, ...ytsResults];
        }
      }
    }

    // Client-side sorting for combined results
    if (sort === "seeders") {
      allResults.sort((a, b) => b.seeders - a.seeders);
    } else if (sort === "recent") {
      allResults.sort((a, b) => {
        const dateA = a.uploaded_at ? new Date(a.uploaded_at).getTime() : 0;
        const dateB = b.uploaded_at ? new Date(b.uploaded_at).getTime() : 0;
        return dateB - dateA;
      });
    }
  } catch (e) {
    console.error(e);
    error = "A connection error occurred while searching.";
  }

  return (
    <main className="min-h-dvh bg-white text-zinc-950">
      <SiteNavbar />

      <section className="flex w-full flex-col gap-6 px-4 py-8 md:px-10 xl:px-[150px]">
        <div className="mx-auto flex w-full flex-col items-center gap-3">
          <SearchForm id="results-search" defaultValue={query} />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-zinc-200 pb-2">
          <p className="min-w-0 truncate text-xs text-zinc-500">
            {error ? (
              <span className="text-red-600 font-medium">{error}</span>
            ) : (
              <>
                Found {allResults.length} results for{" "}
                <span className="font-medium text-zinc-800">{displayName}</span>
              </>
            )}
          </p>
          <div className="flex min-w-0 items-center justify-end">
            <ResultSort defaultValue={sort} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {allResults.length > 0 ? (
            allResults.map((result) => (
              <TorrentResultCard key={result.id} result={result} />
            ))
          ) : (
            !error && (
              <div className="py-20 text-center">
                <p className="text-zinc-500">No results found. Try a different search term or check your provider settings.</p>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}

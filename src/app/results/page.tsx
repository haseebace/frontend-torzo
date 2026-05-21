import type { Metadata } from "next";
import { Fragment } from "react";
import { cookies } from "next/headers";
import { gunzipSync } from "node:zlib";
import { SiteNavbar } from "@/components/site-navbar";
import { SearchForm } from "@/components/search-form";
import { ResultSort } from "@/components/result-sort";
import { TorrentResultCard, type TorrentResult } from "@/components/torrent-result-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

type Props = {
  searchParams: Promise<{
    q?: string;
    tmdbId?: string;
    imdbId?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim();
  const displayName = query || params.imdbId || params.tmdbId || "media";
  
  return {
    title: `Search: ${displayName}`,
    description: `Find ${displayName} with high-speed downloads via Real-Debrid. Compare sources, check seeders, and download instantly.`,
  };
}

type ResultsPageProps = {
  searchParams: Promise<{
    q?: string;
    tmdbId?: string;
    imdbId?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

type YtsTorrent = {
  hash: string;
  quality: string;
  size_bytes: number;
  size_human?: string;
  seeds: number;
  peers: number;
};

type YtsMovie = {
  id: number;
  title: string;
  year: number;
  torrents: YtsTorrent[];
};

const PROVIDERS_COOKIE_NAME = "torzo_selected_providers";
const RESULTS_PAGE_SIZE = 10;

type SearchMeta = {
  total: number;
  total_pages: number;
  has_next_page: boolean;
  page: number;
  page_size: number;
  results_on_page: number;
};

type YtsSearchMeta = {
  total: number;
  total_pages: number;
  has_next_page: boolean;
};

async function readJsonResponse<T>(response: Response): Promise<T> {
  const bytes = new Uint8Array(await response.arrayBuffer());
  const isGzip = bytes[0] === 0x1f && bytes[1] === 0x8b;
  const decoded = isGzip ? gunzipSync(bytes) : bytes;
  const text = new TextDecoder().decode(decoded);

  return JSON.parse(text) as T;
}

function parsePageParam(page?: string) {
  const parsed = Number.parseInt(page || "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

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
      const data = await readJsonResponse<{ title?: string; name?: string }>(response);
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
        const data = await readJsonResponse<{ title?: string; name?: string }>(tvResponse);
        return data.name || data.title;
      }
    }
  } catch (e) {
    console.error("Failed to fetch movie name:", e);
  }
  return null;
}

function buildPageUrl(params: { query?: string; tmdbId?: string; imdbId?: string; category?: string; sort?: string; page: number }) {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.append("q", params.query);
  if (params.tmdbId) searchParams.append("tmdbId", params.tmdbId);
  if (params.imdbId) searchParams.append("imdbId", params.imdbId);
  if (params.category) searchParams.append("category", params.category);
  if (params.sort && params.sort !== "seeders") searchParams.append("sort", params.sort);
  searchParams.append("page", params.page.toString());
  return `/results?${searchParams.toString()}`;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim();
  const tmdbId = params.tmdbId?.trim();
  const imdbId = params.imdbId?.trim();
  const category = params.category?.trim();
  const sort = params.sort || "seeders";
  const currentPage = parsePageParam(params.page);
  const pageSize = RESULTS_PAGE_SIZE;

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
  let paginationMeta: SearchMeta | null = null;
  let ytsPaginationMeta: YtsSearchMeta | null = null;
  let displayName = query || imdbId || tmdbId || "nothing";

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
    apiParams.append("page", currentPage.toString());
    apiParams.append("page_size", pageSize.toString());

    const movieNamePromise = tmdbId ? getMovieName(tmdbId) : Promise.resolve(null);

    const genericResultsPromise = (async (): Promise<{
      results: TorrentResult[];
      meta: SearchMeta | null;
      error: string | null;
    }> => {
      // Only call generic search if we have sources and a query/ID
      if (!genericSources || !(query || tmdbId || imdbId)) {
        return { results: [], meta: null, error: null };
      }

      const res = await fetch(`https://torzoapi.vercel.app/api/v1/search?${apiParams.toString()}`, {
        cache: "no-store"
      });
      
      if (res.ok) {
        const json = await readJsonResponse<{
          data: TorrentResult[];
          meta?: SearchMeta;
        }>(res);
        return { 
          results: json.data, 
          meta: json.meta || null,
          error: null 
        };
      }

      const errJson = await readJsonResponse<{
        error?: { message?: string };
      }>(res).catch(() => ({ error: undefined }));
      return {
        results: [],
        meta: null,
        error: errJson.error?.message || "Failed to fetch results from generic search.",
      };
    })();

    const ytsResultsPromise = (async (): Promise<{
      results: TorrentResult[];
      meta: YtsSearchMeta | null;
    }> => {
      // Handle YTS separately if selected and we have an ID
      if (!selectedProviders.includes("yts") || !(tmdbId || imdbId)) {
        return { results: [], meta: null };
      }

      const ytsParams = new URLSearchParams();
      if (tmdbId) ytsParams.append("tmdb_id", tmdbId);
      if (imdbId) ytsParams.append("imdb_id", imdbId);
      ytsParams.append("page", currentPage.toString());
      ytsParams.append("limit", pageSize.toString());
      
      const ytsRes = await fetch(`https://torzoapi.vercel.app/api/v1/yts/search?${ytsParams.toString()}`, {
        cache: "no-store"
      });
      
      if (ytsRes.ok) {
        const ytsJson = await readJsonResponse<{
          data?: {
            movie_count?: number;
            limit?: number;
            page_number?: number;
            movies?: YtsMovie[];
          };
        }>(ytsRes);
        const movieCount = Number(ytsJson.data?.movie_count ?? 0);
        const limit = Number(ytsJson.data?.limit ?? pageSize);
        const pageNumber = Number(ytsJson.data?.page_number ?? currentPage);
        const totalPages = movieCount > 0 ? Math.ceil(movieCount / limit) : 0;
        const meta = {
          total: movieCount,
          total_pages: totalPages,
          has_next_page: pageNumber < totalPages,
        };

        if (ytsJson.data?.movies) {
          // Normalize YTS movies to TorrentResult shape
          return {
            results: (ytsJson.data.movies as YtsMovie[]).flatMap((movie) =>
              movie.torrents.map((t) => ({
                id: `yts-${movie.id}-${t.hash}`,
                title: `${movie.title} (${movie.year}) [${t.quality}]`,
                category: "movies",
                uploaded_at: null,
                size_bytes: t.size_bytes,
                size_human: t.size_human || formatBytesFromBytes(t.size_bytes),
                seeders: t.seeds,
                leechers: t.peers,
                sources: [{
                  provider: "yts",
                  source_url: String(movie.id)
                }]
              }))
            ),
            meta,
          };
        }

        return { results: [], meta };
      }

      return { results: [], meta: null };
    })();

    const [movieName, genericResults, ytsResults] = await Promise.all([
      movieNamePromise,
      genericResultsPromise,
      ytsResultsPromise,
    ]);

    if (movieName) {
      displayName = movieName;
    }

    allResults = [...genericResults.results, ...ytsResults.results];
    error = genericResults.error;
    paginationMeta = genericResults.meta;
    ytsPaginationMeta = ytsResults.meta;

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

  const searchFormValue = displayName === "nothing" ? "" : displayName;
  const hasGenericSearch = Boolean(genericSources && (query || tmdbId || imdbId));
  const activePaginationMeta = hasGenericSearch ? paginationMeta : ytsPaginationMeta;
  const totalResults = activePaginationMeta?.total ?? allResults.length;
  const totalPages = activePaginationMeta?.total_pages ?? (allResults.length > 0 ? 1 : 0);
  const hasNextPage = activePaginationMeta?.has_next_page ?? false;

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <section className="flex w-full origin-center animate-homepage-enter flex-col gap-6 px-4 py-6 md:gap-8 md:px-10 md:py-8 xl:px-page">
        <SearchForm
          key={searchFormValue}
          id="results-search"
          defaultValue={searchFormValue}
          variant="hero"
          className="mx-auto"
        />

        <div className="flex items-center justify-between gap-3 border-b border-border pb-4 md:items-end md:gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-sm font-extrabold text-foreground-strong text-wrap-balance md:text-[22px]">
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                <>
                  {totalResults} results for <span className="text-primary">{displayName}</span>
                </>
              )}
            </h2>
          </div>
          <div className="flex shrink-0 items-center justify-end">
            <ResultSort defaultValue={sort} />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          {allResults.length > 0 ? (
            allResults.map((result) => (
              <TorrentResultCard key={result.id} result={result} />
            ))
          ) : (
            !error && (
              <div className="py-20 text-center">
                <p className="text-muted-foreground text-sm md:text-base">No results found. Try a different search term or check your provider settings.</p>
              </div>
            )
          )}
        </div>

        {totalPages > 1 && (
          <div className="pt-6">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={buildPageUrl({ query, tmdbId, imdbId, category, sort, page: currentPage - 1 })} />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((pageNum) => {
                    if (totalPages <= 7) return true;
                    if (pageNum === 1) return true;
                    if (pageNum === totalPages) return true;
                    if (Math.abs(pageNum - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((pageNum, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const showEllipsis = prevPage && pageNum - prevPage > 1;

                    return (
                      <Fragment key={pageNum}>
                        {showEllipsis && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href={buildPageUrl({ query, tmdbId, imdbId, category, sort, page: pageNum })}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      </Fragment>
                    );
                  })}

                {hasNextPage && (
                  <PaginationItem>
                    <PaginationNext href={buildPageUrl({ query, tmdbId, imdbId, category, sort, page: currentPage + 1 })} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </main>
  );
}

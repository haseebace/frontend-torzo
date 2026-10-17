export type CachedTmdbSuggestion = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  releaseYear: string | null;
  posterUrl: string | null;
  overview: string;
};

let discoveryResults: CachedTmdbSuggestion[] | null = null;
let discoveryPromise: Promise<CachedTmdbSuggestion[]> | null = null;

export function getCachedTmdbDiscovery() {
  return discoveryResults;
}

export function prefetchTmdbDiscovery() {
  if (discoveryResults) return Promise.resolve(discoveryResults);
  if (discoveryPromise) return discoveryPromise;

  discoveryPromise = fetch("/api/tmdb/search?query=", {
    cache: "force-cache",
  })
    .then(async (response) => {
      if (!response.ok) throw new Error("TMDB discovery prefetch failed");

      const data = (await response.json()) as {
        results?: CachedTmdbSuggestion[];
      };
      discoveryResults = data.results ?? [];
      return discoveryResults;
    })
    .finally(() => {
      discoveryPromise = null;
    });

  return discoveryPromise;
}

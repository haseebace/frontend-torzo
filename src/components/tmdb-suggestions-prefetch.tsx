"use client";

import { useEffect } from "react";
import { prefetchTmdbDiscovery } from "@/lib/tmdb-suggestion-cache";

export function TmdbSuggestionsPrefetch() {
  useEffect(() => {
    void prefetchTmdbDiscovery().catch(() => {
      // The search form will retry when the user focuses it.
    });
  }, []);

  return null;
}

"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "torzo_visited_torrents";
const MAX_VISITS = 20;

type UseVisitedTorrents = {
  isVisited: (id: string) => boolean;
  markVisited: (id: string) => void;
  clearAll: () => void;
};

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === "string");
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Quota exceeded or storage unavailable — silently ignore
  }
}

/**
 * Tracks visited torrent IDs in localStorage.
 *
 * - Most recent visit moves to the front of the list.
 * - Capped at MAX_VISITS entries (oldest fall off).
 * - SSR-safe: returns an empty set until mounted.
 */
export function useVisitedTorrents(): UseVisitedTorrents {
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readFromStorage();
    setVisited(new Set(stored));
    setHydrated(true);

    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setVisited(new Set(readFromStorage()));
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const markVisited = useCallback((id: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      next.delete(id);
      next.add(id);
      const ordered = Array.from(next).slice(-MAX_VISITS);
      writeToStorage(ordered);
      return next;
    });
  }, []);

  const isVisited = useCallback(
    (id: string) => {
      if (!hydrated) return false;
      return visited.has(id);
    },
    [hydrated, visited],
  );

  const clearAll = useCallback(() => {
    setVisited(new Set());
    writeToStorage([]);
  }, []);

  return { isVisited, markVisited, clearAll };
}

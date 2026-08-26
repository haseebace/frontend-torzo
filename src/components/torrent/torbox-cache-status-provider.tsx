"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TorBoxCachedResult, TorBoxResponse } from "@/lib/torbox-types";

const API_KEY_STORAGE_KEY = "torbox_api_key";
const CACHE_STORAGE_KEY = "torbox_cached_hashes_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_CACHE_ENTRIES = 1_000;
const MAX_HASHES_PER_REQUEST = 100;

type CacheEntry = {
  cached: boolean;
  checkedAt: number;
};

type CacheStore = Record<string, CacheEntry>;

const TorboxCachedHashesContext = createContext<ReadonlySet<string>>(
  new Set(),
);

type TorboxCacheStatusProviderProps = {
  hashes: Array<string | null | undefined>;
  children: ReactNode;
};

function chunkHashes(hashes: string[]) {
  const chunks: string[][] = [];
  for (let index = 0; index < hashes.length; index += MAX_HASHES_PER_REQUEST) {
    chunks.push(hashes.slice(index, index + MAX_HASHES_PER_REQUEST));
  }
  return chunks;
}

function readCache(now: number): CacheStore {
  try {
    const rawCache = sessionStorage.getItem(CACHE_STORAGE_KEY);
    if (!rawCache) return {};

    const parsed = JSON.parse(rawCache) as unknown;
    if (!parsed || typeof parsed !== "object") return {};

    const validEntries: CacheStore = {};
    for (const [hash, value] of Object.entries(parsed)) {
      if (!value || typeof value !== "object") continue;
      const entry = value as Partial<CacheEntry>;
      if (
        typeof entry.cached === "boolean" &&
        typeof entry.checkedAt === "number" &&
        now - entry.checkedAt < CACHE_TTL_MS
      ) {
        validEntries[hash.toLowerCase()] = {
          cached: entry.cached,
          checkedAt: entry.checkedAt,
        };
      }
    }
    return validEntries;
  } catch {
    return {};
  }
}

function writeCache(cache: CacheStore) {
  try {
    const limitedCache = Object.fromEntries(
      Object.entries(cache)
        .sort(([, left], [, right]) => right.checkedAt - left.checkedAt)
        .slice(0, MAX_CACHE_ENTRIES),
    );
    sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(limitedCache));
  } catch {
    // Cache storage is an optimization; TorBox checks still work without it.
  }
}

export function TorboxCacheStatusProvider({
  hashes,
  children,
}: TorboxCacheStatusProviderProps) {
  const [cachedHashes, setCachedHashes] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const normalizedHashes = useMemo(
    () =>
      Array.from(
        new Set(
          hashes
            .map((hash) => hash?.trim().toLowerCase())
            .filter((hash): hash is string => Boolean(hash)),
        ),
      ),
    [hashes],
  );
  const hashesKey = normalizedHashes.join(",");

  useEffect(() => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!apiKey || !hashesKey) return;

    const controller = new AbortController();
    let ignore = false;

    async function checkCachedHashes() {
      const requestedHashes = hashesKey.split(",");
      const now = Date.now();
      const cache = readCache(now);
      const knownCachedHashes = new Set(
        requestedHashes.filter((hash) => cache[hash]?.cached),
      );
      const uncheckedHashes = requestedHashes.filter((hash) => !cache[hash]);

      await Promise.resolve();
      if (ignore) return;
      setCachedHashes(knownCachedHashes);

      if (uncheckedHashes.length === 0) {
        writeCache(cache);
        return;
      }

      const responses = await Promise.all(
        chunkHashes(uncheckedHashes).map(async (hashChunk) => {
          const response = await fetch("/api/torbox/proxy", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-torbox-api-key": apiKey!,
            },
            body: JSON.stringify({
              endpoint: "/torrents/checkcached",
              method: "GET",
              params: {
                hash: hashChunk,
                format: "object",
                list_files: false,
              },
            }),
            signal: controller.signal,
          });

          if (!response.ok) return { hashChunk, payload: null };
          const payload = (await response.json()) as TorBoxResponse<
            TorBoxCachedResult | null
          >;
          return { hashChunk, payload };
        }),
      );

      if (ignore) return;

      const nextCache = { ...cache };
      const nextCachedHashes = new Set(knownCachedHashes);
      const checkedAt = Date.now();

      for (const { hashChunk, payload } of responses) {
        if (!payload) continue;

        for (const hash of hashChunk) {
          nextCache[hash] = { cached: false, checkedAt };
        }

        if (!payload.data || typeof payload.data !== "object") continue;
        for (const [hash, torrent] of Object.entries(payload.data)) {
          const normalizedHash = hash.toLowerCase();
          nextCachedHashes.add(normalizedHash);
          nextCache[normalizedHash] = { cached: true, checkedAt };

          if (
            torrent &&
            typeof torrent === "object" &&
            typeof torrent.hash === "string"
          ) {
            const responseHash = torrent.hash.toLowerCase();
            nextCachedHashes.add(responseHash);
            nextCache[responseHash] = { cached: true, checkedAt };
          }
        }
      }

      writeCache(nextCache);
      setCachedHashes(nextCachedHashes);
    }

    checkCachedHashes().catch((error: unknown) => {
      if (!ignore && !(error instanceof DOMException && error.name === "AbortError")) {
        console.warn("Could not check TorBox cache availability.", error);
      }
    });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [hashesKey]);

  return (
    <TorboxCachedHashesContext value={cachedHashes}>
      {children}
    </TorboxCachedHashesContext>
  );
}

export function useTorboxCachedHashes() {
  return useContext(TorboxCachedHashesContext);
}

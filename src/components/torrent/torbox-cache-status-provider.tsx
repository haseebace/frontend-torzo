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
const MAX_HASHES_PER_REQUEST = 100;

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
      const responses = await Promise.all(
        chunkHashes(hashesKey.split(",")).map(async (hashChunk) => {
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

          if (!response.ok) return null;
          return (await response.json()) as TorBoxResponse<TorBoxCachedResult>;
        }),
      );

      if (ignore) return;

      const nextCachedHashes = new Set<string>();
      for (const response of responses) {
        if (!response?.data || typeof response.data !== "object") continue;
        for (const [hash, torrent] of Object.entries(response.data)) {
          nextCachedHashes.add(hash.toLowerCase());
          if (torrent.hash) nextCachedHashes.add(torrent.hash.toLowerCase());
        }
      }
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

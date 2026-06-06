"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCcw, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatBytes } from "@/lib/utils";
import type { TorBoxTorrent } from "@/lib/torbox-types";
import { LibraryTorrentGroup } from "./library-torrent-group";
import {
  LibraryEmpty,
  LibraryError,
  LibraryFilteredEmpty,
  LibraryLoading,
  LibraryNotConnected,
} from "./library-states";

const API_KEY_STORAGE_KEY = "torbox_api_key";

type LoadState =
  | { kind: "checking" }
  | { kind: "not-connected" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; torrents: TorBoxTorrent[] };

export function LibraryView() {
  const [state, setState] = useState<LoadState>({ kind: "checking" });
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTorrents = useCallback(
    async (key: string, opts?: { silent?: boolean }) => {
      if (!opts?.silent) setState({ kind: "loading" });
      try {
        const res = await fetch("/api/torbox/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-torbox-api-key": key,
          },
          body: JSON.stringify({
            endpoint: "/torrents/mylist",
            method: "GET",
            params: { limit: 1000 },
          }),
        });

        const json = (await res.json().catch(() => ({}))) as {
          data?: TorBoxTorrent[] | null;
          detail?: string;
          error?: string;
        };

        if (!res.ok) {
          throw new Error(json.detail || json.error || `HTTP ${res.status}`);
        }

        const list = Array.isArray(json.data) ? json.data : [];
        setState({ kind: "ready", torrents: list });
      } catch (err) {
        setState({
          kind: "error",
          message:
            err instanceof Error
              ? err.message
              : "Could not reach your TorBox account.",
        });
      }
    },
    [],
  );

  useEffect(() => {
    const key = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!key) {
      setState({ kind: "not-connected" });
      return;
    }
    setApiKey(key);
    void fetchTorrents(key);
  }, [fetchTorrents]);

  const handleRefresh = useCallback(async () => {
    if (!apiKey) return;
    setRefreshing(true);
    try {
      await fetchTorrents(apiKey, { silent: true });
    } finally {
      setRefreshing(false);
    }
  }, [apiKey, fetchTorrents]);

  const handleRetry = useCallback(() => {
    if (apiKey) void fetchTorrents(apiKey);
  }, [apiKey, fetchTorrents]);

  const filteredTorrents = useMemo(() => {
    if (state.kind !== "ready") return [];
    if (!filter.trim()) return state.torrents;
    const needle = filter.trim().toLowerCase();
    return state.torrents
      .map((torrent) => {
        const nameMatch = torrent.name?.toLowerCase().includes(needle);
        const fileMatch = (torrent.files ?? []).filter((file) =>
          file.name.toLowerCase().includes(needle),
        );
        if (nameMatch) return torrent;
        if (fileMatch.length > 0) {
          return { ...torrent, files: fileMatch };
        }
        return null;
      })
      .filter((t): t is TorBoxTorrent => t !== null);
  }, [state, filter]);

  const summary = useMemo(() => {
    if (state.kind !== "ready") {
      return { torrents: 0, files: 0, bytes: 0 };
    }
    return state.torrents.reduce(
      (acc, torrent) => {
        acc.torrents += 1;
        acc.files += torrent.files?.length ?? 0;
        acc.bytes += torrent.size ?? 0;
        return acc;
      },
      { torrents: 0, files: 0, bytes: 0 },
    );
  }, [state]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 md:gap-7">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="font-sans text-3xl font-extrabold leading-[1.08] text-foreground-strong md:text-[38px]">
            Library
          </h1>
          <p className="text-sm leading-6 text-foreground-muted md:text-base">
            All files from your TorBox account, grouped by torrent.
          </p>
        </div>
        {state.kind === "ready" ? (
          <div className="flex items-center gap-2">
            <Badge>{summary.files} files</Badge>
            <Badge variant="outline">{summary.torrents} torrents</Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-9 rounded-full"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh library"
            >
              <RefreshCcw
                className={cn(
                  "size-4",
                  refreshing && "animate-spin",
                )}
              />
            </Button>
          </div>
        ) : null}
      </header>

      {state.kind === "ready" && summary.torrents > 0 ? (
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-subtle" />
          <Input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter by file or torrent name"
            className="h-12 rounded-full bg-surface pl-11 pr-11 text-sm placeholder:text-text-subtle"
            type="search"
          />
          {filter ? (
            <button
              type="button"
              onClick={() => setFilter("")}
              aria-label="Clear filter"
              className="absolute right-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-text-subtle transition-colors hover:bg-surface-subtle hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      ) : null}

      <Body state={state} apiKey={apiKey} filteredTorrents={filteredTorrents} onRetry={handleRetry} onClearFilter={() => setFilter("")} />
    </div>
  );
}

type BodyProps = {
  state: LoadState;
  apiKey: string | null;
  filteredTorrents: TorBoxTorrent[];
  onRetry: () => void;
  onClearFilter: () => void;
};

function Body({ state, apiKey, filteredTorrents, onRetry, onClearFilter }: BodyProps) {
  if (state.kind === "checking" || state.kind === "loading") {
    return <LibraryLoading />;
  }
  if (state.kind === "not-connected") {
    return <LibraryNotConnected />;
  }
  if (state.kind === "error") {
    return <LibraryError message={state.message} onRetry={onRetry} />;
  }
  if (state.torrents.length === 0) {
    return <LibraryEmpty />;
  }
  if (filteredTorrents.length === 0) {
    return <LibraryFilteredEmpty onClear={onClearFilter} />;
  }
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <LibraryTotalBytes bytes={state.torrents.reduce((sum, t) => sum + (t.size ?? 0), 0)} />
      {filteredTorrents.map((torrent) => (
        <LibraryTorrentGroup
          key={torrent.id}
          torrent={torrent}
          apiKey={apiKey ?? ""}
        />
      ))}
    </div>
  );
}

function LibraryTotalBytes({ bytes }: { bytes: number }) {
  if (bytes <= 0) return null;
  return (
    <p className="text-xs text-foreground-muted">
      Total size <span className="font-semibold text-foreground">{formatBytes(bytes)}</span>
    </p>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { TorBoxResponse, TorBoxTorrent } from "@/lib/torbox-types";
import {
  buildMappleWatchUrl,
  cleanTitleForTmdbSearch,
  inferMappleMediaType,
  parseTvEpisodeFromTitle,
  type MappleMediaType,
  type MappleWatchDebug,
} from "@/lib/mapple-player";

const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov", ".webm"];
const MIN_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const API_KEY_STORAGE_KEY = "torbox_api_key";

interface TorrentActionsProps {
  magnetLink?: string | null;
  torrentFileUrl?: string | null;
  infoHash?: string | null;
  title?: string;
  category?: string | null;
  mappleMediaId?: string | null;
  mappleWatchUrl?: string | null;
  mappleDebug?: MappleWatchDebug | null;
  mediaType?: MappleMediaType;
  season?: number;
  episode?: number;
  className?: string;
}

type TmdbSearchHit = {
  id: number;
  mediaType: MappleMediaType;
};

export function TorrentActions({
  magnetLink,
  torrentFileUrl,
  infoHash,
  title = "",
  category,
  mappleMediaId,
  mappleWatchUrl: mappleWatchUrlProp,
  mappleDebug,
  mediaType: mediaTypeProp,
  season: seasonProp,
  episode: episodeProp,
  className,
}: TorrentActionsProps) {
  const normalizedHash = infoHash?.trim().toLowerCase();
  const [directLink, setDirectLink] = useState<string | null>(null);
  const [torboxAccountStatus, setTorboxAccountStatus] = useState<string | null>(null);
  const [status, setStatus] = useState<
    | "idle"
    | "checking"
    | "adding"
    | "downloading"
    | "ready"
    | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isZipFallback, setIsZipFallback] = useState(false);
  const [magnetCopied, setMagnetCopied] = useState(false);
  const [isTorboxConnected, setIsTorboxConnected] = useState(false);
  const [mappleWatchUrl, setMappleWatchUrl] = useState<string | null>(() => {
    if (mappleWatchUrlProp) return mappleWatchUrlProp;
    if (!mappleMediaId) return null;

    const inferredType = inferMappleMediaType(category, title, mediaTypeProp);
    const tvEpisode =
      seasonProp && episodeProp
        ? { season: seasonProp, episode: episodeProp }
        : parseTvEpisodeFromTitle(title);
    return (
      buildMappleWatchUrl({
        mediaId: mappleMediaId,
        mediaType: inferredType,
        season: tvEpisode?.season,
        episode: tvEpisode?.episode,
      }) || null
    );
  });
  const [isResolvingMapple, setIsResolvingMapple] = useState(false);

  const handleCopyMagnet = async () => {
    if (!magnetLink) return;

    try {
      await navigator.clipboard.writeText(magnetLink);
      setMagnetCopied(true);
      toast.success("Magnet link copied.");
      window.setTimeout(() => setMagnetCopied(false), 1600);
    } catch {
      toast.error("Could not copy the magnet link.");
    }
  };

  const torboxFetch = useCallback(
    async (
      endpoint: string,
      options: { method?: string; body?: unknown; params?: Record<string, unknown> } = {},
    ) => {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (!apiKey) throw new Error("No API key found");

      const res = await fetch("/api/torbox/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-torbox-api-key": apiKey,
        },
        body: JSON.stringify({
          endpoint,
          method: options.method || "GET",
          body: options.body,
          params: options.params,
        }),
      });

      const responseText = await res.text();
      let data: Record<string, unknown> = {};

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText) as unknown;
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            data = parsed as Record<string, unknown>;
          }
        } catch {
          if (res.ok) {
            throw new Error(
              "TorBox returned an invalid response. Please try again.",
            );
          }
        }
      }

      if (!res.ok) {
        const detail =
          typeof data.detail === "string"
            ? data.detail
            : typeof data.error === "string"
              ? data.error
              : typeof data.message === "string"
                ? data.message
                : res.status === 504
                  ? "TorBox took too long to respond. Please try again."
                  : `TorBox request failed (HTTP ${res.status})`;
        const error = new Error(detail) as Error & {
          code?: string;
          status?: number;
        };
        error.code = typeof data.error === "string" ? data.error : undefined;
        error.status = res.status;
        throw error;
      }
      return data as unknown as TorBoxResponse<unknown>;
    },
    [],
  );

  const findBestVideoFile = useCallback((files: Array<{ id: number; name: string; size: number; mimetype: string }>) => {
    const videoFiles = files.filter((f) => {
      const nameLower = f.name.toLowerCase();
      const isVideoExt = VIDEO_EXTENSIONS.some((ext) => nameLower.endsWith(ext));
      const isVideoMime = f.mimetype?.startsWith("video/");
      const isBigEnough = f.size >= MIN_VIDEO_SIZE_BYTES;
      return (isVideoExt || isVideoMime) && isBigEnough;
    });

    if (videoFiles.length === 0) return null;

    // Pick the largest video file
    return videoFiles.reduce((largest, current) =>
      current.size > largest.size ? current : largest,
    );
  }, []);

  const requestDownloadLink = useCallback(
    async (torrentId: number, files: Array<{ id: number; name: string; size: number; mimetype: string }>) => {
      const bestFile = findBestVideoFile(files);

      if (bestFile) {
        const res = await torboxFetch("/torrents/requestdl", {
          params: {
            torrent_id: torrentId,
            file_id: bestFile.id,
          },
        });
        setIsZipFallback(false);
        return res.data as string;
      }

      // Fallback: zip download
      const res = await torboxFetch("/torrents/requestdl", {
        params: {
          torrent_id: torrentId,
          zip_link: true,
        },
      });
      setIsZipFallback(true);
      return res.data as string;
    },
    [torboxFetch, findBestVideoFile],
  );

  const lookupExistingTorrent = useCallback(
    async (options: { silent?: boolean; hideBadge?: boolean } = {}) => {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);

      if (!normalizedHash || !apiKey) return false;

      try {
        if (!options.silent) setStatus("checking");
        setErrorMessage(null);

        const res = await torboxFetch("/torrents/mylist", {
          params: { limit: 1000 },
        });
        const torrents = res.data as TorBoxTorrent[];

        const match = Array.isArray(torrents)
          ? torrents.find(
              (torrent) => torrent?.hash?.toLowerCase() === normalizedHash,
            )
          : null;

        if (!match) {
          if (!options.silent) setStatus("idle");
          if (!options.hideBadge) setTorboxAccountStatus(null);
          return false;
        }

        if (match.download_finished) {
          if (!options.hideBadge) setTorboxAccountStatus("Ready in TorBox");

          try {
            const downloadLink = await requestDownloadLink(match.id, match.files);
            setDirectLink(downloadLink);
            setStatus("ready");
            return true;
          } catch {
            // Failed to get download link
          }
        }

        setDirectLink(null);
        setStatus("idle");
        if (!options.hideBadge)
          setTorboxAccountStatus(`In TorBox: ${match.download_state ?? "processing"}`);
        return true;
      } catch (err: unknown) {
        const tbError = err as Error & { code?: string };
        if (tbError.code === "AUTH_ERROR") {
          if (!options.silent) setStatus("idle");
          return false;
        }
        throw err;
      }
    },
    [normalizedHash, torboxFetch, requestDownloadLink],
  );

  const handleAddToTorBox = async () => {
    try {
      if (!magnetLink) throw new Error("No magnet link found");
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (!apiKey) throw new Error("No API key found");

      setStatus("checking");
      setErrorMessage(null);
      setDirectLink(null);
      setTorboxAccountStatus(null);
      setIsZipFallback(false);

      setStatus("adding");
      let torrentId: number;
      try {
        const addRes = await torboxFetch("/torrents/createtorrent", {
          method: "POST",
          body: new URLSearchParams({ magnet: magnetLink }).toString(),
        });
        const addData = addRes.data as { torrent_id: number; hash: string };
        torrentId = addData.torrent_id;
      } catch (addErr) {
        const tbError = addErr as Error & { code?: string };
        if (tbError.code === "DUPLICATE_ITEM") {
          // Already in account — look it up and proceed
          const found = await lookupExistingTorrent({ silent: true });
          if (found) return;
        }
        throw addErr;
      }

      setStatus("downloading");
      while (true) {
        const listRes = await torboxFetch("/torrents/mylist", {
          params: { id: torrentId },
        });
        const torrent = listRes.data as TorBoxTorrent;

        if (torrent.download_finished) {
          break;
        }

        // Show raw TorBox state
        setTorboxAccountStatus(`In TorBox: ${torrent.download_state ?? "processing"}`);

        // Error states
        const deadStates = ["error", "dead", "magnet_error"];
        if (deadStates.includes(torrent.download_state?.toLowerCase())) {
          throw new Error(`Torrent error: ${torrent.download_state}`);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const listRes = await torboxFetch("/torrents/mylist", {
        params: { id: torrentId },
      });
      const torrent = listRes.data as TorBoxTorrent;

      const downloadLink = await requestDownloadLink(torrent.id, torrent.files);
      setDirectLink(downloadLink);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setStatus("error");
    }
  };

  const isLoading = ["checking", "adding", "downloading"].includes(status);

  const handleWatchNow = () => {
    if (!directLink) return;
    const linkToPlay = directLink;

    const userAgent = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = isIOS || isAndroid;
    const isMacOS = /Macintosh|Mac OS X/.test(userAgent);

    // Mobile → VLC external player
    if (isMobile) {
      const vlcUrl = `vlc://${encodeURIComponent(linkToPlay)}`;
      window.location.href = vlcUrl;

      // Fallback: if VLC isn't installed, copy link after a short delay
      setTimeout(() => {
        if (document.hasFocus()) {
          alert(
            "VLC player not found. The stream link has been copied to your clipboard.",
          );
          navigator.clipboard.writeText(linkToPlay).catch(() => {});
        }
      }, 2500);
      return;
    }

    if (isMacOS) {
      const iinaUrl = `iina://weblink?url=${linkToPlay}`;
      window.location.href = iinaUrl;

      // Fallback: If IINA isn't installed, show a notification after a delay
      setTimeout(() => {
        if (document.hasFocus()) {
          alert(
            "IINA player not found. The video link has been copied to your clipboard.",
          );
          navigator.clipboard.writeText(linkToPlay).catch(() => {});
        }
      }, 2000);
      return;
    }

    window.open(directLink, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const checkInBackground = async () => {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      setIsTorboxConnected(Boolean(apiKey));
      if (!apiKey || !infoHash) return;

      await lookupExistingTorrent({ silent: true, hideBadge: true });
    };

    checkInBackground();
  }, [infoHash, lookupExistingTorrent]);

  useEffect(() => {
    let cancelled = false;

    const resolveMappleUrl = async () => {
      const inferredType = inferMappleMediaType(category, title, mediaTypeProp);
      const tvEpisode =
        seasonProp && episodeProp
          ? { season: seasonProp, episode: episodeProp }
          : parseTvEpisodeFromTitle(title);

      const buildUrl = (mediaId: string | number) =>
        buildMappleWatchUrl({
          mediaId,
          mediaType: inferredType,
          season: tvEpisode?.season,
          episode: tvEpisode?.episode,
        });

      if (mappleWatchUrlProp) {
        console.info("[Stream Now] using server watch URL", mappleWatchUrlProp);
        if (!cancelled) setMappleWatchUrl(mappleWatchUrlProp);
        return;
      }

      if (mappleMediaId) {
        const url = buildUrl(mappleMediaId);
        console.info("[Stream Now] built watch URL from media id", {
          mappleMediaId,
          mediaType: inferredType,
          season: tvEpisode?.season ?? null,
          episode: tvEpisode?.episode ?? null,
          watchUrl: url || null,
        });
        if (!cancelled) setMappleWatchUrl(url || null);
        return;
      }

      const query = cleanTitleForTmdbSearch(title);
      if (!query) {
        console.info("[Stream Now] no TMDB query could be built", { title });
        if (!cancelled) setMappleWatchUrl(null);
        return;
      }

      setIsResolvingMapple(true);
      console.info("[Stream Now] searching TMDB in the browser", {
        query,
        mediaType: inferredType,
      });
      try {
        const response = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(query)}`,
        );
        if (!response.ok) {
          throw new Error(`TMDB lookup failed with HTTP ${response.status}`);
        }

        const json = (await response.json()) as { results?: TmdbSearchHit[] };
        const results = json.results ?? [];

        const match =
          results.find((item) => item.mediaType === inferredType) ?? results[0];

        if (!match) {
          console.info("[Stream Now] TMDB search returned no match", {
            query,
            resultCount: results.length,
          });
          if (!cancelled) setMappleWatchUrl(null);
          return;
        }

        const url = buildUrl(match.id);
        console.info("[Stream Now] TMDB search matched", {
          query,
          mediaId: match.id,
          mediaType: match.mediaType,
          watchUrl: url || null,
        });
        if (!cancelled) setMappleWatchUrl(url || null);
      } catch (error) {
        console.info("[Stream Now] TMDB search failed", error);
        if (!cancelled) setMappleWatchUrl(null);
      } finally {
        if (!cancelled) setIsResolvingMapple(false);
      }
    };

    void resolveMappleUrl();
    return () => {
      cancelled = true;
    };
  }, [
    category,
    episodeProp,
    mappleMediaId,
    mappleWatchUrlProp,
    mediaTypeProp,
    seasonProp,
    title,
  ]);

  const handleStreamNow = () => {
    if (mappleWatchUrl) {
      console.info("[Stream Now] click opens Mapple", mappleWatchUrl);
      window.open(mappleWatchUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (directLink) {
      console.info("[Stream Now] click plays the TorBox file");
      handleWatchNow();
      return;
    }

    if (isTorboxConnected && magnetLink) {
      console.info("[Stream Now] click adds the torrent to TorBox");
      void handleAddToTorBox();
      return;
    }

    console.info("[Stream Now] click sends the user to /manage");
    window.location.href = "/manage";
  };

  const actionClass =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 font-sans text-sm font-normal leading-normal whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-45";

  const streamLabel = isLoading
    ? status === "checking"
      ? "Checking..."
      : status === "adding"
        ? "Adding..."
        : "Downloading..."
    : "Stream Now";

  const streamDisabled = isResolvingMapple || isLoading;

  useEffect(() => {
    console.info("[Stream Now]", {
      server: mappleDebug ?? null,
      watchUrl: mappleWatchUrl,
      renderedAs: mappleWatchUrl ? "link" : "button",
      disabled: streamDisabled,
      resolving: isResolvingMapple,
      torboxStatus: status,
      torboxConnected: isTorboxConnected,
      hasMagnet: Boolean(magnetLink),
      hasDirectLink: Boolean(directLink),
    });
  }, [
    directLink,
    isResolvingMapple,
    isTorboxConnected,
    magnetLink,
    mappleDebug,
    mappleWatchUrl,
    status,
    streamDisabled,
  ]);

  return (
    <div className={cn("flex flex-col items-stretch gap-2 p-2 sm:items-end", className)}>
      {mappleWatchUrl ? (
        <a
          href={mappleWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(actionClass, "bg-primary-action text-on-primary")}
        >
          Stream Now
        </a>
      ) : (
        <button
          type="button"
          onClick={handleStreamNow}
          disabled={streamDisabled}
          className={cn(actionClass, "bg-primary-action text-on-primary")}
        >
          {isLoading || isResolvingMapple ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : null}
          {isLoading ? streamLabel : "Stream Now"}
        </button>
      )}

      {isTorboxConnected && !directLink && magnetLink ? (
        <button
          type="button"
          onClick={() => void handleAddToTorBox()}
          disabled={isLoading}
          className={cn(
            actionClass,
            "border border-border-subtle bg-bg-canvas text-primary-text hover:bg-bg-hover",
          )}
        >
          {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {isLoading ? streamLabel : "Add to TorBox"}
        </button>
      ) : null}

      {directLink ? (
        <button
          type="button"
          onClick={handleWatchNow}
          className={cn(
            actionClass,
            "border border-border-subtle bg-bg-canvas text-primary-text hover:bg-bg-hover",
          )}
        >
          Play TorBox file
        </button>
      ) : null}

      {magnetLink ? (
        <button
          type="button"
          onClick={handleCopyMagnet}
          className={cn(actionClass, "border border-border-subtle bg-bg-canvas text-primary-text hover:bg-bg-hover")}
        >
          {magnetCopied ? "Copied" : "Copy Magnet Link"}
        </button>
      ) : null}

      {torrentFileUrl ? (
        <a
          href={torrentFileUrl}
          className={cn(actionClass, "bg-secondary-action text-primary-text hover:bg-bg-hover")}
        >
          Download Torrent
        </a>
      ) : null}

      {torboxAccountStatus ? (
        <p className="text-xs font-normal text-muted-text">{torboxAccountStatus}</p>
      ) : null}
      {isZipFallback ? (
        <p className="max-w-56 text-right text-sm font-normal text-muted-text">
          No video file available. This can only be downloaded.
        </p>
      ) : null}
      {errorMessage ? (
        <p className="max-w-56 text-right text-sm font-normal text-leecher-text">{errorMessage}</p>
      ) : null}
    </div>
  );
}

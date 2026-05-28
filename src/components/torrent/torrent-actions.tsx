"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TorBoxResponse, TorBoxTorrent } from "@/lib/torbox-types";

const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov", ".webm"];
const MIN_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const API_KEY_STORAGE_KEY = "torbox_api_key";

interface TorrentActionsProps {
  magnetLink?: string | null;
  torrentFileUrl?: string | null;
  infoHash?: string | null;
  className?: string;
}

export function TorrentActions({
  magnetLink,
  torrentFileUrl,
  infoHash,
  className,
}: TorrentActionsProps) {
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

      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        const detail =
          typeof data.detail === "string"
            ? data.detail
            : typeof data.error === "string"
              ? data.error
              : typeof data.message === "string"
                ? data.message
                : "TorBox error";
        const error = new Error(detail) as Error & {
          code?: string;
          status?: number;
        };
        error.code = typeof data.error === "string" ? data.error : undefined;
        error.status = res.status;
        throw error;
      }
      return data as TorBoxResponse<unknown>;
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
      const normalizedHash = infoHash?.trim().toLowerCase();
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
    [infoHash, torboxFetch, requestDownloadLink],
  );

  const handleAddToTorBox = async () => {
    try {
      if (!magnetLink) throw new Error("No magnet link found");
      const normalizedHash = infoHash?.trim().toLowerCase();
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (!apiKey) throw new Error("No API key found");

      setStatus("checking");
      setErrorMessage(null);
      setDirectLink(null);
      setTorboxAccountStatus(null);
      setIsZipFallback(false);

      // 1. Check if already cached on TorBox servers
      if (normalizedHash) {
        try {
          const cacheRes = await torboxFetch("/torrents/checkcached", {
            params: { hash: normalizedHash, format: "object", list_files: true },
          });
          const cachedData = cacheRes.data as Record<string, unknown>;
          if (cachedData && Object.keys(cachedData).length > 0) {
            // It's cached on TorBox — great, will be fast
          }
        } catch {
          // Cache check failed, continue anyway
        }
      }

      // 2. Add Magnet
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

      // 3. Poll for download completion
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

      // 4. Request download link
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
    const isMacOS = /Macintosh|Mac OS X/.test(userAgent);

    if (isIOS) {
      const infuseUrl = `infuse://x-callback-url/play?url=${encodeURIComponent(linkToPlay)}`;
      window.location.href = infuseUrl;
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
      if (!apiKey || !infoHash) return;

      try {
        await lookupExistingTorrent({ silent: true, hideBadge: true });
      } catch {
        // Silently fail — user still sees "Add to TorBox" button
      }
    };

    checkInBackground();
  }, [infoHash, lookupExistingTorrent]);

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "flex w-full flex-wrap gap-2 sm:w-[800px] sm:gap-3",
          className,
        )}
      >
        {magnetLink && (
          <Button
            asChild
            variant="default"
            size="lg"
            className="h-[35px] w-[90px] min-w-0 rounded-full px-2 text-[10px] sm:h-[45px] sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm"
          >
            <a href={magnetLink}>
              <span className="sm:hidden">Magnet</span>
              <span className="hidden sm:inline">Magnet link</span>
            </a>
          </Button>
        )}
        {torrentFileUrl && (
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="h-[35px] w-[90px] min-w-0 rounded-full px-2 text-[10px] sm:h-[45px] sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm"
          >
            <a href={torrentFileUrl}>
              <span className="sm:hidden">Torrent</span>
              <span className="hidden sm:inline">Download torrent</span>
            </a>
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-[35px] w-[90px] min-w-0 rounded-full px-2 text-[10px] sm:h-[45px] sm:w-[180px] sm:flex-none sm:px-2.5 sm:text-sm"
          onClick={handleAddToTorBox}
          disabled={isLoading || !magnetLink}
        >
          {isLoading && <Loader2 className="size-3.5 animate-spin sm:size-4" />}
          <span className="sm:hidden">
            {status === "ready"
              ? "Added"
              : status === "checking"
                ? "Check"
                : isLoading
                  ? "Adding"
                  : "TorBox"}
          </span>
          <span className="hidden sm:inline">
            {status === "checking" && "Checking TorBox..."}
            {status === "adding" && "Adding..."}
            {status === "downloading" && "Downloading..."}
            {status === "ready" && "Added to TorBox"}
            {(status === "idle" || status === "error") && "Add to TorBox"}
          </span>
        </Button>

        {directLink && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-[35px] w-[90px] min-w-0 rounded-full px-2 text-[10px] sm:h-[45px] sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm"
            onClick={handleWatchNow}
          >
            <span className="sm:hidden">Watch</span>
            <span className="hidden sm:inline">Watch Now</span>
          </Button>
        )}

        {directLink && (
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-[35px] w-[90px] min-w-0 rounded-full px-2 text-[10px] sm:h-[45px] sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm"
          >
            <a href={directLink} target="_blank" rel="noreferrer">
              <span className="sm:hidden">Direct</span>
              <span className="hidden sm:inline">
                {isZipFallback ? "Download Zip" : "Direct Download"}
              </span>
            </a>
          </Button>
        )}
      </div>
      {torboxAccountStatus && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{torboxAccountStatus}</Badge>
        </div>
      )}
      {isZipFallback && (
        <p className="text-sm font-medium text-amber-600">
          No video file available — this can only be downloaded.
        </p>
      )}
      {errorMessage && (
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}

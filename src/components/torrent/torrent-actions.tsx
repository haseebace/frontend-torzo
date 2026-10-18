"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TorBoxResponse, TorBoxTorrent } from "@/lib/torbox-types";

const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov", ".webm"];
const MIN_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const API_KEY_STORAGE_KEY = "torbox_api_key";

const TORRENT_APP_LINKS = [
  {
    name: "qBittorrent",
    platforms: "macOS / Windows",
    href: "https://www.qbittorrent.org/download",
  },
  {
    name: "Transmission",
    platforms: "macOS",
    href: "https://transmissionbt.com/download/",
  },
  {
    name: "Deluge",
    platforms: "macOS / Windows",
    href: "https://deluge-torrent.org/download/",
  },
  {
    name: "Plexo",
    platforms: "macOS / Windows",
    href: "https://github.com/anmolkapil/plexo",
  },
  {
    name: "Folx",
    platforms: "macOS",
    href: "https://www.mac-downloader.com/",
  },
] as const;

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

  return (
    <div className={cn("flex flex-col gap-3 md:ml-auto md:items-end", className)}>
      <div className="flex w-full flex-wrap gap-2 sm:w-[800px] sm:gap-3 md:w-[180px] md:flex-col md:items-end">
        {magnetLink && (
          <div
            role="group"
            aria-label="Magnet link actions"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-10 w-[120px] min-w-0 gap-0 p-0 text-xs sm:h-[45px] sm:w-[165px] sm:flex-none sm:text-sm",
            )}
          >
            <a
              href={magnetLink}
              aria-label="Open magnet link in your installed torrent app"
              title="Open in your installed torrent app"
              className="flex min-w-0 flex-1 items-center justify-center px-2 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 focus-visible:ring-inset sm:px-2.5"
            >
              <span className="sm:hidden">Magnet</span>
              <span className="hidden sm:inline">Magnet link</span>
            </a>
            <button
              type="button"
              aria-label={magnetCopied ? "Magnet link copied" : "Copy magnet link"}
              title="Copy magnet link"
              onClick={handleCopyMagnet}
              className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-full text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 sm:mr-1.5"
            >
              {magnetCopied ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        )}
        {torrentFileUrl && (
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-10 w-[120px] min-w-0 rounded-full px-4 text-xs sm:h-[45px] sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm"
          >
            <a href={torrentFileUrl}>
              <span className="sm:hidden">Torrent</span>
              <span className="hidden sm:inline">Download torrent</span>
            </a>
          </Button>
        )}
        {isTorboxConnected && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={cn(
              "h-10 w-[120px] min-w-0 rounded-full px-4 text-xs sm:h-[45px] sm:w-[180px] sm:flex-none sm:px-2.5 sm:text-sm",
              status === "ready" && "hidden",
            )}
            onClick={handleAddToTorBox}
            disabled={isLoading || !magnetLink}
          >
            {isLoading && <Loader2 className="size-3.5 sm:size-4" />}
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
        )}

        {directLink && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-10 w-[120px] min-w-0 rounded-full px-4 text-xs sm:h-[45px] sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm"
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
            className="h-10 w-[120px] min-w-0 rounded-full px-4 text-xs sm:h-[45px] sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm"
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
      {magnetLink && (
        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground-muted md:justify-end md:text-right">
          <span>Need a torrent app?</span>
          {TORRENT_APP_LINKS.map((app, index) => (
            <span key={app.name} className="inline-flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">·</span>}
              <a
                href={app.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                title={`${app.name} for ${app.platforms}`}
              >
                {app.name}
              </a>
            </span>
          ))}
        </div>
      )}
      {torboxAccountStatus && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{torboxAccountStatus}</Badge>
        </div>
      )}
      {isZipFallback && (
        <p className="text-sm font-medium text-foreground-muted">
          No video file available. This can only be downloaded.
        </p>
      )}
      {errorMessage && (
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}

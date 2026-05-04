"use client";

import { useCallback, useEffect, useState } from "react";
import { Cloud, Download, Magnet, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [rdAccountStatus, setRdAccountStatus] = useState<string | null>(null);
  const [status, setStatus] = useState<
    | "idle"
    | "checking"
    | "adding"
    | "selecting"
    | "downloading"
    | "unrestricting"
    | "ready"
    | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rdFetch = useCallback(async (endpoint: string, options: { method?: string; body?: unknown } = {}) => {
    const apiKey = localStorage.getItem("rd_api_key");
    if (!apiKey) throw new Error("No API key found");

    const res = await fetch("/api/real-debrid/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rd-api-key": apiKey,
      },
      body: JSON.stringify({
        endpoint,
        method: options.method || "GET",
        body: options.body,
      }),
    });

    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.error || "Real-Debrid error") as Error & {
        code?: number;
        status?: number;
      };
      error.code = data.error_code;
      error.status = res.status;
      throw error;
    }
    return data;
  }, []);

  const lookupExistingTorrent = useCallback(async (options: { silent?: boolean; hideBadge?: boolean } = {}) => {
    const normalizedHash = infoHash?.trim().toLowerCase();
    const apiKey = localStorage.getItem("rd_api_key");

    if (!normalizedHash || !apiKey) return false;

    try {
      if (!options.silent) setStatus("checking");
      setErrorMessage(null);

      const torrents = await rdFetch("/torrents?limit=5000");

      const match = Array.isArray(torrents)
        ? torrents.find((torrent) => torrent?.hash?.toLowerCase() === normalizedHash)
        : null;

      if (!match) {
        if (!options.silent) setStatus("idle");
        if (!options.hideBadge) setRdAccountStatus(null);
        return false;
      }

      if (match.status === "downloaded") {
        if (!options.hideBadge) setRdAccountStatus("Ready in Real-Debrid");
        
        // Always fetch torrent info to get proper links
        try {
          const info = await rdFetch(`/torrents/info/${match.id}`);
          const links = info?.links || [];
          
          if (links.length > 0) {
            // Unrestrict the first link to get the download ID
            const unrestrictData = await rdFetch("/unrestrict/link", {
              method: "POST",
              body: { link: links[0] },
            });
            
            if (unrestrictData?.download) {
              // Set direct download link
              setDirectLink(unrestrictData.download);
              setStatus("ready");
              
              // Now use the download ID for streaming links
              if (unrestrictData.id) {
                try {
                  const streamingData = await rdFetch(`/streaming/transcode/${unrestrictData.id}`);
                  if (streamingData) {
                    console.log("[RD Lookup] Streaming links:", streamingData);
                    // TODO: Store streaming links for Watch Now
                  }
                } catch {
                  console.log("[RD Lookup] No streaming links available");
                }
              }
              return true;
            }
          }
        } catch (err) {
          console.error("[RD Lookup] Failed:", err);
        }
      }

      setDirectLink(null);
      setStatus("idle");
      if (!options.hideBadge) setRdAccountStatus(`In Real-Debrid: ${match.status ?? "processing"}`);
      return true;
    } catch (err: unknown) {
      const rdError = err as Error & { code?: number };
      if (rdError.code === 37) {
        // Torrent API disabled, just skip silently
        if (!options.silent) setStatus("idle");
        return false;
      }
      throw err;
    }
  }, [infoHash, rdFetch]);

  const handleAddToRD = async () => {
    try {
      if (!magnetLink) throw new Error("No magnet link found");

      setStatus("adding");
      setErrorMessage(null);
      setDirectLink(null);
      setRdAccountStatus(null);

      // 1. Add Magnet
      const addData = await rdFetch("/torrents/addMagnet", {
        method: "POST",
        body: { magnet: magnetLink },
      });
      const id = addData.id;

      // 2. Poll for info
      let info;
      while (true) {
        info = await rdFetch(`/torrents/info/${id}`);
        if (info.status === "waiting_files_selection" || info.status === "downloaded") break;
        if (["magnet_error", "error", "dead"].includes(info.status)) {
          throw new Error(`Torrent error: ${info.status}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // 3. Select all files
      if (info.status === "waiting_files_selection") {
        setStatus("selecting");
        await rdFetch(`/torrents/selectFiles/${id}`, {
          method: "POST",
          body: { files: "all" },
        });
      }

      // 4. Wait for download
      setStatus("downloading");
      while (true) {
        info = await rdFetch(`/torrents/info/${id}`);
        if (info.status === "downloaded") break;
        if (["error", "dead", "virus"].includes(info.status)) {
          throw new Error(`Torrent error: ${info.status}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // 5. Unrestrict link
      setStatus("unrestricting");
      const unrestrictData = await rdFetch("/unrestrict/link", {
        method: "POST",
        body: { link: info.links[0] },
      });
      
      if (unrestrictData?.download) {
        setDirectLink(unrestrictData.download);
        setStatus("ready");
        
        // Get streaming links using the download ID
        if (unrestrictData.id) {
          try {
            const streamingData = await rdFetch(`/streaming/transcode/${unrestrictData.id}`);
            if (streamingData) {
              console.log("[RD Add] Streaming links:", streamingData);
              // TODO: Store streaming links for Watch Now
            }
            } catch {
              console.log("[RD Add] No streaming links available");
            }
        }
      }
    } catch (err) {
      console.error(err);
      const rdError = err as Error & { code?: number };
      if (rdError.code === 33 || rdError.message.toLowerCase().includes("already active")) {
        try {
          const foundExisting = await lookupExistingTorrent({ silent: true });
          if (foundExisting) return;
        } catch (lookupError) {
          console.error(lookupError);
        }
      }

      setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred");
      setStatus("error");
    }
  };

  const isLoading = ["checking", "adding", "selecting", "downloading", "unrestricting"].includes(status);

  // Normalize URL to prevent double-encoding
  const normalizeUrl = (url: string): string => {
    try {
      // Decode if already encoded, then encode once
      const decoded = url.includes("%") ? decodeURIComponent(url) : url;
      return decoded;
    } catch {
      return url;
    }
  };

  const handleWatchNow = () => {
    if (!directLink) return;

    // Normalize URL to prevent double-encoding
    const linkToPlay = normalizeUrl(directLink);
    const userAgent = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isMacOS = /Macintosh|Mac OS X/.test(userAgent);

    if (isIOS) {
      // Infuse expects a properly encoded URL
      const infuseUrl = `infuse://x-callback-url/play?url=${encodeURIComponent(linkToPlay)}`;
      window.location.href = infuseUrl;
      return;
    }

    if (isMacOS) {
      // IINA expects the raw URL (not double-encoded)
      const iinaUrl = `iina://weblink?url=${linkToPlay}`;
      window.location.href = iinaUrl;
      
      // Fallback: If IINA isn't installed, show a notification after a delay
      setTimeout(() => {
        if (document.hasFocus()) {
          alert("INA player not found. The video link has been copied to your clipboard.");
          navigator.clipboard.writeText(linkToPlay).catch(() => {});
        }
      }, 2000);
      return;
    }

    window.open(directLink, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const checkInBackground = async () => {
      const apiKey = localStorage.getItem("rd_api_key");
      if (!apiKey || !infoHash) return;

      try {
        await lookupExistingTorrent({ silent: true, hideBadge: true });
      } catch {
        // Silently fail — user still sees "Add to Real-Debrid" button
      }
    };

    checkInBackground();
  }, [infoHash, lookupExistingTorrent]);

  return (
    <div className="flex flex-col gap-3">
      <div className={cn("flex w-full flex-wrap gap-2 sm:w-[800px] sm:gap-3", className)}>
        {magnetLink && (
          <Button asChild variant="default" size="lg" className="h-[45px] min-w-0 flex-1 rounded-[50px] px-1 text-xs sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm">
            <a href={magnetLink}>
              <Magnet className="size-3.5 sm:size-4" />
              <span className="sm:hidden">Magnet</span>
              <span className="hidden sm:inline">Magnet link</span>
            </a>
          </Button>
        )}
        {torrentFileUrl && (
          <Button asChild variant="outline" size="lg" className="h-[45px] min-w-0 flex-1 rounded-[50px] px-1 text-xs sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm">
            <a href={torrentFileUrl}>
              <Download className="size-3.5 sm:size-4" />
              <span className="sm:hidden">Torrent</span>
              <span className="hidden sm:inline">Download torrent</span>
            </a>
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-[45px] min-w-0 flex-1 rounded-[50px] px-1 text-xs sm:w-[180px] sm:flex-none sm:px-2.5 sm:text-sm"
          onClick={handleAddToRD}
          disabled={isLoading || !magnetLink}
        >
          {isLoading ? <Loader2 className="size-3.5 animate-spin sm:size-4" /> : <Cloud className="size-3.5 sm:size-4" />}
          <span className="sm:hidden">
            {status === "ready" ? "Added" : status === "checking" ? "Check" : isLoading ? "Adding" : "Debrid"}
          </span>
          <span className="hidden sm:inline">
            {status === "checking" && "Checking Real-Debrid..."}
            {status === "adding" && "Adding..."}
            {status === "selecting" && "Selecting files..."}
            {status === "downloading" && "Downloading..."}
            {status === "unrestricting" && "Unrestricting..."}
            {status === "ready" && "Added to RD"}
            {(status === "idle" || status === "error") && "Add to Real Debrid"}
          </span>
        </Button>

        {directLink && (
          <Button asChild variant="secondary" size="lg" className="h-[45px] min-w-0 flex-1 rounded-[50px] px-1 text-xs sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm">
            <a href={directLink} target="_blank" rel="noreferrer">
              <Download className="size-3.5 sm:size-4" />
              <span className="sm:hidden">Direct</span>
              <span className="hidden sm:inline">Direct Download</span>
            </a>
          </Button>
        )}

        {directLink && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="h-[45px] min-w-0 flex-1 rounded-[50px] px-1 text-xs sm:w-[165px] sm:flex-none sm:px-2.5 sm:text-sm"
            onClick={handleWatchNow}
          >
            <Play className="size-3.5 sm:size-4" />
            <span className="sm:hidden">Watch</span>
            <span className="hidden sm:inline">Watch Now</span>
          </Button>
        )}
      </div>
      {rdAccountStatus && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 sm:text-xs">
            {rdAccountStatus}
          </span>
        </div>
      )}
      {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}
    </div>
  );
}

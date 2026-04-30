"use client";

import { useState } from "react";
import { Cloud, Download, Magnet, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TorrentActionsProps {
  magnetLink?: string | null;
  torrentFileUrl?: string | null;
}

export function TorrentActions({
  magnetLink,
  torrentFileUrl,
}: TorrentActionsProps) {
  const [directLink, setDirectLink] = useState<string | null>(null);
  const [status, setStatus] = useState<
    | "idle"
    | "adding"
    | "selecting"
    | "downloading"
    | "unrestricting"
    | "ready"
    | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rdFetch = async (endpoint: string, options: { method?: string; body?: unknown } = {}) => {
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
    if (!res.ok) throw new Error(data.error || "Real-Debrid error");
    return data;
  };

  const handleAddToRD = async () => {
    try {
      if (!magnetLink) throw new Error("No magnet link found");

      setStatus("adding");
      setErrorMessage(null);
      setDirectLink(null);

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
      if (!info.links || info.links.length === 0) {
        throw new Error("No download links found");
      }

      const unrestrictData = await rdFetch("/unrestrict/link", {
        method: "POST",
        body: { link: info.links[0] },
      });

      setDirectLink(unrestrictData.download);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred");
      setStatus("error");
    }
  };

  const isLoading = ["adding", "selecting", "downloading", "unrestricting"].includes(status);

  const handleWatchNow = () => {
    if (!directLink) return;

    const encodedLink = encodeURIComponent(directLink);
    const userAgent = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isMacOS = /Macintosh|Mac OS X/.test(userAgent);

    if (isIOS) {
      window.location.href = `infuse://x-callback-url/play?url=${encodedLink}`;
      return;
    }

    if (isMacOS) {
      window.location.href = `iina://weblink?url=${encodedLink}`;
      return;
    }

    window.open(directLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {magnetLink && (
          <Button asChild variant="default" size="lg" className="w-full px-1 text-xs sm:w-auto sm:px-2.5 sm:text-sm">
            <a href={magnetLink}>
              <Magnet className="size-3.5 sm:size-4" />
              <span className="sm:hidden">Magnet</span>
              <span className="hidden sm:inline">Magnet link</span>
            </a>
          </Button>
        )}
        {torrentFileUrl && (
          <Button asChild variant="outline" size="lg" className="w-full px-1 text-xs sm:w-auto sm:px-2.5 sm:text-sm">
            <a href={torrentFileUrl}>
              <Download className="size-3.5 sm:size-4" />
              <span className="sm:hidden">Torrent</span>
              <span className="hidden sm:inline">Download torrent</span>
            </a>
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full px-1 text-xs sm:w-auto sm:px-2.5 sm:text-sm"
          onClick={handleAddToRD}
          disabled={isLoading || !magnetLink}
        >
          {isLoading ? <Loader2 className="size-3.5 animate-spin sm:size-4" /> : <Cloud className="size-3.5 sm:size-4" />}
          <span className="sm:hidden">
            {status === "ready" ? "Added" : isLoading ? "Adding" : "Debrid"}
          </span>
          <span className="hidden sm:inline">
            {status === "adding" && "Adding..."}
            {status === "selecting" && "Selecting files..."}
            {status === "downloading" && "Downloading..."}
            {status === "unrestricting" && "Unrestricting..."}
            {status === "ready" && "Added to RD"}
            {(status === "idle" || status === "error") && "Add to Real Debrid"}
          </span>
        </Button>

        {directLink && (
          <Button asChild variant="secondary" size="lg" className="w-full px-1 text-xs sm:w-auto sm:px-2.5 sm:text-sm">
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
            className="w-full px-1 text-xs sm:w-auto sm:px-2.5 sm:text-sm"
            onClick={handleWatchNow}
          >
            <Play className="size-3.5 sm:size-4" />
            <span className="sm:hidden">Watch</span>
            <span className="hidden sm:inline">Watch Now</span>
          </Button>
        )}
      </div>
      {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}
    </div>
  );
}

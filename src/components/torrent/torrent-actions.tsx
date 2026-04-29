"use client";

import { useState } from "react";
import { Cloud, Download, Magnet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TorrentActionsProps {
  magnetLink: string;
  torrentFileUrl: string;
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

  const rdFetch = async (endpoint: string, options: { method?: string; body?: any } = {}) => {
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
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unknown error occurred");
      setStatus("error");
    }
  };

  const isLoading = ["adding", "selecting", "downloading", "unrestricting"].includes(status);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="default" size="lg">
          <a href={magnetLink}>
            <Magnet className="size-4" />
            Magnet link
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={torrentFileUrl}>
            <Download className="size-4" />
            Download torrent
          </a>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={handleAddToRD}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Cloud className="size-4" />}
          {status === "adding" && "Adding..."}
          {status === "selecting" && "Selecting files..."}
          {status === "downloading" && "Downloading..."}
          {status === "unrestricting" && "Unrestricting..."}
          {status === "ready" && "Added to RD"}
          {(status === "idle" || status === "error") && "Add to Real Debrid"}
        </Button>

        {directLink && (
          <Button asChild variant="default" size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
            <a href={directLink} target="_blank" rel="noreferrer">
              <Download className="size-4" />
              Direct Download
            </a>
          </Button>
        )}
      </div>
      {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}
    </div>
  );
}

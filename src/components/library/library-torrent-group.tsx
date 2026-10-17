"use client";

import { useState } from "react";
import {
  ChevronDown,
  Download,
  ExternalLink,
  File,
  FileText,
  Image as ImageIcon,
  Loader2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatBytes } from "@/lib/utils";
import type { TorBoxFile, TorBoxTorrent } from "@/lib/torbox-types";

const VIDEO_EXTS = [".mp4", ".mkv", ".avi", ".mov", ".webm"];
const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const TEXT_EXTS = [".nfo", ".txt", ".srt", ".md", ".ass", ".vtt"];

function getFileIcon(name: string) {
  const lower = name.toLowerCase();
  if (VIDEO_EXTS.some((ext) => lower.endsWith(ext))) return Video;
  if (IMAGE_EXTS.some((ext) => lower.endsWith(ext))) return ImageIcon;
  if (TEXT_EXTS.some((ext) => lower.endsWith(ext))) return FileText;
  return File;
}

function isVideoFile(name: string) {
  const lower = name.toLowerCase();
  return VIDEO_EXTS.some((ext) => lower.endsWith(ext));
}

function getStatusVariant(state: string | null | undefined) {
  const s = (state ?? "").toLowerCase();
  if (s === "completed" || s === "cached" || s === "uploading") return "default" as const;
  if (s === "downloading" || s === "metadl" || s === "checkingresumedata")
    return "secondary" as const;
  if (s === "paused") return "outline" as const;
  if (s === "error" || s === "dead" || s === "magnet_error")
    return "destructive" as const;
  return "outline" as const;
}

function getStatusLabel(state: string | null | undefined) {
  const s = (state ?? "").toLowerCase();
  if (!s) return "Unknown";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type LibraryTorrentGroupProps = {
  torrent: TorBoxTorrent;
  apiKey: string;
  defaultOpen?: boolean;
};

export function LibraryTorrentGroup({
  torrent,
  apiKey,
  defaultOpen = true,
}: LibraryTorrentGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const files = torrent.files ?? [];
  const fileCount = files.length;
  const statusLabel = getStatusLabel(torrent.download_state);
  const statusVariant = getStatusVariant(torrent.download_state);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-surface-subtle md:px-6"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            open && "rotate-0",
            !open && "-rotate-90",
          )}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-sans text-sm font-extrabold text-foreground-strong md:text-base">
            {torrent.name || "Untitled torrent"}
          </h3>
          <p className="mt-0.5 text-xs text-foreground-muted">
            {fileCount} {fileCount === 1 ? "file" : "files"}
            <span className="mx-1.5 text-text-soft" aria-hidden>
              ·
            </span>
            {formatBytes(torrent.size)}
          </p>
        </div>
        <Badge variant={statusVariant} className="hidden sm:inline-flex">
          {statusLabel}
        </Badge>
      </button>

      {open && fileCount > 0 ? (
        <div className="overflow-hidden border-t border-border/70">
          <LibraryFileList files={files} torrentId={torrent.id} apiKey={apiKey} />
        </div>
      ) : null}
    </div>
  );
}

type LibraryFileListProps = {
  files: TorBoxFile[];
  torrentId: number;
  apiKey: string;
};

function LibraryFileList({ files, torrentId, apiKey }: LibraryFileListProps) {
  return (
    <ul className="flex flex-col divide-y divide-border/70">
      {files.map((file) => (
        <LibraryFileRow
          key={file.id}
          file={file}
          torrentId={torrentId}
          apiKey={apiKey}
        />
      ))}
    </ul>
  );
}

type LibraryFileRowProps = {
  file: TorBoxFile;
  torrentId: number;
  apiKey: string;
};

function LibraryFileRow({
  file,
  torrentId,
  apiKey,
}: LibraryFileRowProps) {
  const FileIcon = getFileIcon(file.name);
  const [downloading, setDownloading] = useState(false);
  const video = isVideoFile(file.name);

  async function handleAction(kind: "download" | "watch") {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/torbox/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-torbox-api-key": apiKey,
        },
        body: JSON.stringify({
          endpoint: "/torrents/requestdl",
          method: "GET",
          params: {
            torrent_id: torrentId,
            file_id: file.id,
          },
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        data?: string;
        detail?: string;
        error?: string;
      };

      if (!res.ok || !data.data) {
        throw new Error(data.detail || data.error || "Could not get a link.");
      }

      const url = data.data;
      if (kind === "watch") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.rel = "noopener,noreferrer";
        a.target = "_blank";
        a.download = file.short_name || file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <li className="relative">
      <div className="relative z-10 flex min-w-0 items-center gap-3 px-5 py-3 text-xs md:px-6 md:gap-4 md:text-sm">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <FileIcon className="size-4" />
        </span>
        <p
          className="min-w-0 flex-1 truncate font-medium text-foreground-strong"
          title={file.name}
        >
          {file.short_name || file.name}
        </p>
        <span className="hidden shrink-0 text-xs text-foreground-muted md:inline">
          {formatBytes(file.size)}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {video ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-full"
              onClick={() => handleAction("watch")}
              disabled={downloading}
              aria-label={`Watch ${file.short_name || file.name}`}
            >
              {downloading ? (
                <Loader2 className="size-3.5" />
              ) : (
                <ExternalLink className="size-3.5" />
              )}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8 rounded-full"
            onClick={() => handleAction("download")}
            disabled={downloading}
            aria-label={`Download ${file.short_name || file.name}`}
          >
            {downloading ? (
              <Loader2 className="size-3.5" />
            ) : (
              <Download className="size-3.5" />
            )}
          </Button>
        </div>
        <span className="sr-only md:hidden">{formatBytes(file.size)}</span>
      </div>
    </li>
  );
}

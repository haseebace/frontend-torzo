"use client";

import { File, FileText, Image, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HoverList, HoverItem } from "@/components/ui/shared-hover-background";

type TorrentFile = {
  name: string;
  size: string;
  size_bytes?: number;
  size_human?: string;
  extension: string;
};

function getFileIcon(extension: string) {
  const ext = extension.toLowerCase();
  if ([".mkv", ".mp4", ".avi", ".mov", ".webm"].includes(ext)) return Video;
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) return Image;
  if ([".nfo", ".txt", ".srt", ".md"].includes(ext)) return FileText;
  return File;
}

function formatBytesFromBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function getFileSizeDisplay(file: TorrentFile): string {
  if (file.size_human) return file.size_human;
  if (file.size && file.size !== "0 bytes") {
    const cleaned = file.size.replace(/[\[\]]/g, "").trim();
    const isHumanReadable = /(\d+(\.\d+)?)\s*(GB|MB|KB|TB|PB)/i.test(cleaned);
    if (isHumanReadable) return cleaned;
    const bytes = parseInt(cleaned, 10);
    if (!isNaN(bytes) && bytes > 0) {
      return formatBytesFromBytes(bytes);
    }
  }
  if (file.size_bytes && file.size_bytes > 0) {
    return formatBytesFromBytes(file.size_bytes);
  }
  return "Unknown";
}

export function TorrentFileList({ files }: { files: TorrentFile[] }) {
  return (
    <HoverList
      className="min-w-0 divide-y divide-border/70"
      backgroundClassName="rounded-[18px] bg-surface-subtle"
    >
      {files.map((file, i) => {
        const FileIcon = getFileIcon(file.extension || "");
        const fileSize = getFileSizeDisplay(file);

        return (
          <HoverItem key={`${file.name}-${i}`}>
            <div className="flex min-w-0 items-center gap-3 px-2 py-3 text-xs md:text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary md:size-8">
                <FileIcon className="size-3.5 md:size-4" />
              </span>
              <p className="min-w-0 flex-1 truncate font-medium text-foreground-strong">
                {file.name}
              </p>
              <Badge className="ml-auto">{fileSize}</Badge>
            </div>
          </HoverItem>
        );
      })}
    </HoverList>
  );
}

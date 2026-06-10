"use client";

import { AnimatePresence } from "framer-motion";
import { File, FileText, Image, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMagneticHover, MagneticHoverBackground } from "@/animations";
import { formatBytes } from "@/lib/utils";

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

function getFileSizeDisplay(file: TorrentFile): string {
  if (file.size_human) return file.size_human;
  if (file.size && file.size !== "0 bytes") {
    const cleaned = file.size.replace(/[\[\]]/g, "").trim();
    const isHumanReadable = /(\d+(\.\d+)?)\s*(GB|MB|KB|TB|PB)/i.test(cleaned);
    if (isHumanReadable) return cleaned;
    const bytes = parseInt(cleaned, 10);
    if (!isNaN(bytes) && bytes > 0) {
      return formatBytes(bytes);
    }
  }
  if (file.size_bytes && file.size_bytes > 0) {
    return formatBytes(file.size_bytes);
  }
  return "Unknown";
}

export function TorrentFileList({ files }: { files: TorrentFile[] }) {
  const { containerProps, setHoveredIndex, getBackgroundProps } =
    useMagneticHover({
      layoutId: "torrent-file-hover",
    });

  return (
    <div
      {...containerProps}
      className="min-w-0 divide-y divide-border/70"
    >
      {files.map((file, i) => {
        const FileIcon = getFileIcon(file.extension || "");
        const fileSize = getFileSizeDisplay(file);
        const bgProps = getBackgroundProps(i);

        return (
          <div
            key={`${file.name}-${i}`}
            className="relative"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <AnimatePresence>
              {bgProps.isActive && (
                <MagneticHoverBackground
                  {...bgProps}
                  className="rounded-[18px] bg-surface-subtle"
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex min-w-0 items-center gap-3 px-2 py-3 text-xs md:text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground md:size-8">
                <FileIcon className="size-3.5 md:size-4" />
              </span>
              <p className="min-w-0 flex-1 truncate font-medium text-foreground-strong">
                {file.name}
              </p>
              <Badge className="ml-auto">{fileSize}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}

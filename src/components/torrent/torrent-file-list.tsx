"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { File, FileText, Image, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className="min-w-0 divide-y divide-border/70"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {files.map((file, i) => {
        const FileIcon = getFileIcon(file.extension || "");
        const fileSize = getFileSizeDisplay(file);

        return (
          <div
            key={`${file.name}-${i}`}
            className="relative px-2 py-3 text-xs md:text-sm"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <AnimatePresence>
              {hoveredIndex === i && (
                <motion.div
                  layoutId="file-hover"
                  className="absolute inset-0 rounded-[18px] bg-surface-subtle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex min-w-0 items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary md:size-8">
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

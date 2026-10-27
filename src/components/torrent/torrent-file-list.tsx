"use client";

import { File, FileText, Image, Video } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";

type TorrentFile = {
  name: string;
  size: string | number | null;
  size_bytes?: number;
  size_human?: string;
  extension?: string | null;
};

function getFileIcon(extension: string) {
  const ext = extension.toLowerCase();
  if ([".mkv", ".mp4", ".avi", ".mov", ".webm"].includes(ext)) return Video;
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) return Image;
  if ([".nfo", ".txt", ".srt", ".md"].includes(ext)) return FileText;
  return File;
}

const fileItemSpring = {
  type: "spring" as const,
  duration: 0.9,
  bounce: 0.5,
};

function getFileSizeDisplay(file: TorrentFile): string {
  if (file.size_human) return file.size_human;
  if (typeof file.size === "number") return formatBytes(file.size);
  if (file.size && file.size !== "0 bytes") {
    const cleaned = String(file.size).replace(/[\[\]]/g, "").trim();
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
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-w-0 divide-y divide-border/70">
      {files.map((file, i) => {
        const extension = file.extension || (
          file.name.includes(".") ? `.${file.name.split(".").pop()}` : ""
        );
        const FileIcon = getFileIcon(extension);
        const fileSize = getFileSizeDisplay(file);

        return (
          <motion.div
            key={`${file.name}-${i}`}
            className="relative"
            initial={
              reduceMotion
                ? { opacity: 0, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.94, filter: "blur(12px)" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : {
                    ...fileItemSpring,
                    delay: i * 0.14,
                    opacity: {
                      duration: 1.15,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.14,
                    },
                    filter: {
                      duration: 0.72,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.14,
                    },
                  }
            }
          >
            <div className="relative z-10 flex min-w-0 items-center gap-3 px-2 py-3 text-xs md:text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground md:size-8">
                <FileIcon className="size-3.5 md:size-4" />
              </span>
              <p className="min-w-0 flex-1 truncate font-medium text-foreground-strong">
                {file.name}
              </p>
              <Badge className="ml-auto">{fileSize}</Badge>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

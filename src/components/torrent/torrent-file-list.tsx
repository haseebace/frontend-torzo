"use client";

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
    <div className="min-w-0">
      {files.map((file, i) => {
        const fileSize = getFileSizeDisplay(file);

        return (
          <motion.div
            key={`${file.name}-${i}`}
            className="flex min-w-0 items-center justify-between gap-3 border-b border-light-200 bg-bg-surface px-4 py-3 last:border-b-0"
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
            <div className="flex min-w-0 items-center gap-2">
              <img
                src="/detail/file-video.svg"
                alt=""
                width={36.0375}
                height={34.85}
                className="shrink-0 dark:invert"
              />
              <p className="min-w-0 truncate text-sm font-normal text-primary-text">
                {file.name}
              </p>
            </div>
            <Badge className="bg-bg-primary-badge px-4 py-2 text-xs font-semibold text-on-primary">
              {fileSize}
            </Badge>
          </motion.div>
        );
      })}
    </div>
  );
}

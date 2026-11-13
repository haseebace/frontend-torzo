"use client";

import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { magneticSpring, useMagneticHover } from "@/animations";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RelatedTorrentItem = {
  id: string;
  title: string;
  size: string;
  seeders: number;
  leechers: number;
  href: string;
};

type RelatedTorrentsListProps = {
  items: RelatedTorrentItem[];
};

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

export function RelatedTorrentsList({ items }: RelatedTorrentsListProps) {
  const reduceMotion = useReducedMotion();
  const { containerProps, setHoveredIndex, hoveredIndex } = useMagneticHover({
    layoutId: "related-torrents-hover",
  });

  return (
    <div className="max-h-[300px] overflow-y-auto overscroll-y-contain bg-bg-surface">
      <LayoutGroup id="related-torrents-list-hover">
        <div {...containerProps}>
          {items.map((item, index) => {
            const isActive = hoveredIndex === index;

            return (
              <div
                key={item.id}
                className={cn(
                  "relative",
                  index < items.length - 1 && "border-b border-light-200",
                )}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {isActive && !reduceMotion ? (
                  <motion.div
                    layoutId="related-torrents-hover"
                    className="pointer-events-none absolute inset-0 bg-bg-hover"
                    transition={magneticSpring}
                  />
                ) : null}
                <Link
                  href={item.href}
                  className={cn(
                    "relative z-10 flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-text/15",
                    isActive && reduceMotion
                      ? "bg-bg-hover"
                      : "bg-transparent",
                  )}
                  onFocus={() => setHoveredIndex(index)}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <img
                      src="/detail/file-video.svg"
                      alt=""
                      width={36.0375}
                      height={34.85}
                      className="shrink-0 dark:invert"
                    />
                    <span className="min-w-0 truncate text-sm font-normal text-primary-text">
                      {item.title}
                    </span>
                  </span>
                  <span className="grid shrink-0 grid-cols-[5.5rem_4.75rem_4.75rem] gap-2">
                    <Badge className="w-full justify-center border-0 bg-bg-secondary-badge px-4 py-2 text-xs font-bold normal-case text-primary-text">
                      {item.size}
                    </Badge>
                    <Badge className="w-full justify-center border-0 bg-bg-seeder px-4 py-2 text-xs font-bold normal-case text-seeder-text">
                      {formatCount(item.seeders)}
                    </Badge>
                    <Badge className="w-full justify-center border-0 bg-bg-leecher px-4 py-2 text-xs font-bold normal-case text-leecher-text">
                      {formatCount(item.leechers)}
                    </Badge>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

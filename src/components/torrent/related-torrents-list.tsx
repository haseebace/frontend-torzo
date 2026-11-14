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
                    "relative z-10 flex min-w-0 items-center justify-between gap-2 p-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-text/15 md:flex-wrap md:gap-3 md:px-4 md:py-3",
                    isActive && reduceMotion
                      ? "bg-bg-hover"
                      : "bg-transparent",
                  )}
                  onFocus={() => setHoveredIndex(index)}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <img
                      src="/detail/file-video.svg"
                      alt=""
                      width={24}
                      height={23}
                      className="h-[23px] w-6 shrink-0 dark:invert md:h-[35px] md:w-9"
                    />
                    <span className="min-w-0 truncate text-xs font-normal text-primary-text md:text-sm">
                      {item.title}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 md:grid md:grid-cols-[5.5rem_4.75rem_4.75rem] md:gap-2">
                    <Badge className="justify-center border-0 bg-bg-secondary-badge px-2 py-1 text-[10px] font-bold normal-case text-primary-text md:w-full md:px-4 md:py-2 md:text-xs">
                      {item.size}
                    </Badge>
                    <Badge className="justify-center border-0 bg-bg-seeder px-2 py-1 text-[10px] font-bold normal-case text-seeder-text md:w-full md:px-4 md:py-2 md:text-xs">
                      {formatCount(item.seeders)}
                    </Badge>
                    <Badge className="justify-center border-0 bg-bg-leecher px-2 py-1 text-[10px] font-bold normal-case text-leecher-text md:w-full md:px-4 md:py-2 md:text-xs">
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

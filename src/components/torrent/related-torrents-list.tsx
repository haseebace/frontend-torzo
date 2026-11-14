"use client";

import Link from "next/link";
import {
  MagneticHoverItem,
  MagneticHoverList,
  useMagneticHoverListState,
} from "@/animations/magnetic-hover-list";
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

function RelatedTorrentRow({
  item,
  index,
  isLast,
}: {
  item: RelatedTorrentItem;
  index: number;
  isLast: boolean;
}) {
  const { hoverIndex } = useMagneticHoverListState();

  return (
    <MagneticHoverItem
      index={index}
      className={cn(!isLast && "border-b border-light-200")}
      surfaceClassName="bg-bg-surface"
      activeSurfaceClassName="bg-bg-hover"
    >
      <Link
        href={item.href}
        className="flex min-w-0 items-center gap-2 p-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-text/15 md:justify-between md:gap-3 md:px-4 md:py-3"
        onFocus={() => hoverIndex(index)}
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
        <span className="grid min-w-0 flex-1 grid-cols-3 gap-1 md:w-auto md:shrink-0 md:grid-cols-[5.5rem_4.75rem_4.75rem] md:gap-2">
          <Badge className="w-full min-w-0 justify-center border-0 bg-bg-secondary-badge px-2 py-1 text-[10px] font-bold normal-case text-primary-text md:px-4 md:py-2 md:text-xs">
            {item.size}
          </Badge>
          <Badge className="w-full min-w-0 justify-center border-0 bg-bg-seeder px-2 py-1 text-[10px] font-bold normal-case text-seeder-text md:px-4 md:py-2 md:text-xs">
            {formatCount(item.seeders)}
          </Badge>
          <Badge className="w-full min-w-0 justify-center border-0 bg-bg-leecher px-2 py-1 text-[10px] font-bold normal-case text-leecher-text md:px-4 md:py-2 md:text-xs">
            {formatCount(item.leechers)}
          </Badge>
        </span>
      </Link>
    </MagneticHoverItem>
  );
}

export function RelatedTorrentsList({ items }: RelatedTorrentsListProps) {
  return (
    <div className="max-h-[300px] overflow-y-auto overscroll-y-contain bg-bg-surface">
      <MagneticHoverList
        clip
        className="flex flex-col"
        pillClassName="bg-bg-hover"
        itemSurfaceClassName="bg-bg-surface"
        itemActiveSurfaceClassName="bg-bg-hover"
      >
        {items.map((item, index) => (
          <RelatedTorrentRow
            key={item.id}
            item={item}
            index={index}
            isLast={index === items.length - 1}
          />
        ))}
      </MagneticHoverList>
    </div>
  );
}
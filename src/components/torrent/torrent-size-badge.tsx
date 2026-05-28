import { parseTorrentSizeParts } from "@/lib/torrent-size";
import { cn } from "@/lib/utils";

type TorrentSizeBadgeProps = {
  sizeHuman: string;
  sizeBytes: number;
  className?: string;
};

export function TorrentSizeBadge({
  sizeHuman,
  sizeBytes,
  className,
}: TorrentSizeBadgeProps) {
  const { value, unit } = parseTorrentSizeParts(sizeHuman, sizeBytes);
  const label = sizeHuman.trim() || `${value}${unit ? ` ${unit}` : ""}`;
  const valueLength = value.length;

  return (
    <div
      className={cn(
        "torrent-size-badge flex h-16 min-w-[41px] w-max max-w-[72px] shrink-0 flex-col items-center justify-center rounded-xl bg-surface-badge py-2",
        className,
      )}
      aria-label={label ? `Size ${label}` : "Size unknown"}
    >
      <span
        className={cn(
          "max-w-full truncate text-center font-sans font-extrabold text-foreground-strong",
          valueLength <= 2 && "text-2xl leading-[30px]",
          valueLength === 3 && "text-xl leading-7",
          valueLength >= 4 && "text-base leading-5",
        )}
      >
        {value}
      </span>
      {unit ? (
        <span className="max-w-full truncate text-center font-sans text-sm font-bold leading-[18px] text-foreground-muted">
          {unit}
        </span>
      ) : null}
    </div>
  );
}

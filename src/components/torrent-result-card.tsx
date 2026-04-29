import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  HardDrive,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TorrentResult {
  title: string;
  type: string;
  uploadedDate: string;
  provider: string;
  size: string;
  seeders: string;
  leechers: string;
}

type TorrentResultCardProps = {
  result: TorrentResult;
  href?: string;
  className?: string;
};

type TorrentMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function TorrentMetric({ icon: Icon, label, value }: TorrentMetricProps) {
  return (
    <div className="w-16">
      <p className="font-semibold text-zinc-800">{value}</p>
      <p className="inline-flex items-center justify-start gap-1 text-zinc-400 md:justify-end">
        <Icon className="hidden size-3 md:block" />
        {label}
      </p>
    </div>
  );
}

export function TorrentResultCard({
  result,
  href = "/detail",
  className,
}: TorrentResultCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400/20",
        className
      )}
    >
      <Card className="grid gap-3 rounded-xl border border-transparent bg-[var(--result-card-background)] pb-4 pt-1 text-sm transition-all group-hover:border-zinc-200 group-hover:shadow-[0_4px_18px_rgba(24,24,27,0.04)] group-focus-visible:border-zinc-300 md:grid-cols-[1fr_auto] md:py-4">
        <CardContent className="contents p-0">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 pl-[5px] md:hidden">
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-px text-[10px] font-medium uppercase leading-4 tracking-[0.1em] text-zinc-600">
                {result.type}
              </span>
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-px text-[10px] font-medium uppercase leading-4 tracking-[0.1em] text-zinc-600">
                {result.provider}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-2 pl-[5px] md:mb-3 md:pl-0">
              <h2 className="min-w-0 flex-1 truncate text-[12px] font-medium leading-5 text-zinc-700 transition-colors group-hover:text-zinc-950 md:text-base md:leading-6">
                {result.title}
              </h2>
            </div>
            <div className="hidden flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 md:flex">
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                {result.type}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" />
                Uploaded {result.uploadedDate}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 pl-[5px] pr-[5px] md:justify-end md:pl-0 md:pr-0">
            <div className="grid grid-cols-3 gap-3 text-left text-xs md:text-right">
              <TorrentMetric icon={HardDrive} label="size" value={result.size} />
              <TorrentMetric icon={ArrowUp} label="seed" value={result.seeders} />
              <TorrentMetric icon={ArrowDown} label="leech" value={result.leechers} />
            </div>
            <span className="shrink-0 pb-0.5 text-right text-[10px] leading-4 text-zinc-500 md:hidden">
              {result.uploadedDate}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

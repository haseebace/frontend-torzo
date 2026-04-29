import Link from "next/link";
import {
  ChevronDown,
  Cloud,
  Download,
  File,
  FileText,
  Files,
  HardDrive,
  Image,
  Magnet,
  Video,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const torrent = {
  title:
    "Download Avengers.Endgame.2019.EXTRAS.1080p.BluRay.H264-RMXTRAS. Free Torrent from The RarBg",
  magnetLink:
    "magnet:?xt=urn:btih:DE976B5F5C6B52F81EF648FD3431B0D1A2974876&dn=Avengers.Endgame.2019.EXTRAS.1080p.BluRay.H264-RMXTRAS&tr=udp%3A%2F%2Fopen.demonoid.ch%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker1.myporn.club%3A9337%2Fannounce&tr=udp%3A%2F%2Ftracker.therarbg.to%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.srv00.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fwepzone.net%3A6969%2Fannounce",
  torrentFileUrl:
    "http://itorrents.org/torrent/DE976B5F5C6B52F81EF648FD3431B0D1A2974876.torrent?title=Avengers.Endgame.2019.EXTRAS.1080p.BluRay.H264-RMXTRAS",
  infoHash: "de976b5f5c6b52f81ef648fd3431b0d1a2974876",
  sizeBytes: 12670153523,
  uploadedAt: "2026-04-21T20:50:00Z",
  category: "movies",
  uploader: "TvTeam",
  verified: false,
  seeders: 6,
  leechers: 0,
  downloaded: 10,
  fileCount: 14,
  primaryFileName: "a.man.out.of.time.creating.captain.america-rmxtras.mkv",
  primaryFileExtension: ".mkv",
  trustedScore: 0.5,
  healthScore: 1,
  sourceCount: 1,
  lastSeenAt: "2026-04-29T00:24:13.319723Z",
  source: {
    provider: "rargb",
    url: "https://therarbg.to/post-detail/8b4de5/avengers-endgame-2019-extras-1080p-bluray-h264-rmxtras/",
  },
  files: [
    {
      name: "a.man.out.of.time.creating.captain.america-rmxtras.mkv",
      size: "3.1 GB",
      extension: ".mkv",
    },
    {
      name: "avengers.endgame.2019.extras.1080p.bluray.h264-rmxtras.nfo",
      size: "3.5 KB",
      extension: ".nfo",
    },
    {
      name: "black.widow.whatever.it.takes-rmxtras.mkv",
      size: "1.9 GB",
      extension: ".mkv",
    },
    { name: "bro.thor-rmxtras.mkv", size: "955.6 MB", extension: ".mkv" },
    { name: "deleted.scenes-rmxtras.mkv", size: "1.0 GB", extension: ".mkv" },
    { name: "gag.reel-rmxtras.mkv", size: "515.7 MB", extension: ".mkv" },
    {
      name: "remembering.stan.lee-rmxtras.mkv",
      size: "1.8 GB",
      extension: ".mkv",
    },
    { name: "screen0001.png", size: "1.9 MB", extension: ".png" },
    { name: "screen0002.png", size: "1.7 MB", extension: ".png" },
    { name: "screen0003.png", size: "3.0 MB", extension: ".png" },
    { name: "screen0004.png", size: "2.3 MB", extension: ".png" },
    {
      name: "setting.the.tone.casting.robert.downey.jr-rmxtras.mkv",
      size: "1.3 GB",
      extension: ".mkv",
    },
    { name: "the.women.of.the.mcu-rmxtras.mkv", size: "1.2 GB", extension: ".mkv" },
    {
      name: "Torrent Downloaded From www.SceneTime.com   .txt",
      size: "76 bytes",
      extension: ".txt",
    },
  ],
};

function cleanTitle(title: string) {
  return title
    .replace(/^Download\s+/i, "")
    .replace(/\.\s*Free Torrent from The RarBg$/i, "")
    .replaceAll(".", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function scoreLabel(score: number) {
  return `${Math.round(score * 100)}%`;
}

const detailStats = [
  { label: "Size", value: formatBytes(torrent.sizeBytes), icon: HardDrive },
  { label: "Files", value: torrent.fileCount.toString(), icon: Files },
  { label: "Seeders", value: torrent.seeders.toString(), icon: Magnet },
  { label: "Leechers", value: torrent.leechers.toString(), icon: Download },
];

function getFileIcon(extension: string) {
  const ext = extension.toLowerCase();

  if ([".mkv", ".mp4", ".avi", ".mov", ".webm"].includes(ext)) {
    return Video;
  }

  if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) {
    return Image;
  }

  if ([".nfo", ".txt", ".srt", ".md"].includes(ext)) {
    return FileText;
  }

  return File;
}

export default function DetailPage() {
  const title = cleanTitle(torrent.title);

  return (
    <main className="min-h-dvh bg-white text-zinc-950">
      <SiteNavbar />

      <section className="flex w-full flex-col gap-8 px-4 py-8 md:px-10 xl:px-[150px]">
        <div className="space-y-5 border-b border-zinc-200 pb-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 uppercase tracking-[0.14em] text-zinc-600">
              {torrent.category}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-balance break-words text-3xl font-semibold leading-tight tracking-tight text-zinc-950 md:text-5xl">
              {title}
            </h1>
            <div className="inline-flex max-w-full items-baseline gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="shrink-0 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                Info hash:
              </span>
              <p className="min-w-0 break-all font-mono text-xs leading-5 text-zinc-600 md:text-sm">
                {torrent.infoHash}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="default" size="lg">
              <a href={torrent.magnetLink}>
                <Magnet className="size-4" />
                Magnet link
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={torrent.torrentFileUrl}>
                <Download className="size-4" />
                Download torrent
              </a>
            </Button>
            <Button type="button" variant="secondary" size="lg">
              <Cloud className="size-4" />
              Add to Real Debrid
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-950">
                Description
              </h2>
              <div className="space-y-3 text-sm leading-6 text-zinc-600">
                <p>
                  This torrent contains a collection of 1080p BluRay bonus
                  features and extras for Avengers Endgame, including deleted
                  scenes, behind-the-scenes featurettes, cast-focused segments,
                  screenshots, and release notes.
                </p>
                <p>
                  Review the file list, size, seed count, and source details
                  before downloading. The torrent is currently not verified, so
                  use the hash and provider information to confirm it matches
                  what you expect.
                </p>
              </div>
            </section>

            <Collapsible>
              <CollapsibleTrigger>
                <div className="flex min-w-0 items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                      Files
                    </h2>
                  </div>
                </div>
                <ChevronDown className="size-4 shrink-0 text-zinc-500 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="divide-y divide-zinc-200/70 pr-2">
                  {torrent.files.map((file) => {
                    const FileIcon = getFileIcon(file.extension);

                    return (
                      <div
                        key={file.name}
                        className="grid gap-3 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-[var(--result-card-background)] md:grid-cols-[1fr_auto]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500">
                            <FileIcon className="size-4" />
                          </span>
                          <p className="min-w-0 truncate font-medium text-zinc-700">
                            {file.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 md:justify-end">
                          <span className="rounded-md bg-zinc-100 px-2 py-1 font-medium uppercase tracking-[0.12em] text-zinc-600">
                            {file.extension}
                          </span>
                          <span className="w-20 text-right font-medium text-zinc-700">
                            {file.size}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">
                Torrent info
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {detailStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-zinc-200 bg-[var(--result-card-background)] p-3"
                    >
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Icon className="size-3.5" />
                        {stat.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-zinc-950">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">
                Health
              </h2>
              <div className="divide-y divide-zinc-200/70 text-sm">
                <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <span className="text-zinc-500">Trusted score</span>
                  <span className="font-semibold text-zinc-950">
                    {scoreLabel(torrent.trustedScore)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-zinc-500">Health score</span>
                  <span className="font-semibold text-zinc-950">
                    {scoreLabel(torrent.healthScore)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-zinc-500">Downloads</span>
                  <span className="font-semibold text-zinc-950">
                    {torrent.downloaded}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-zinc-500">Uploaded date</span>
                  <span className="font-semibold text-zinc-950">
                    {formatDate(torrent.uploadedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                  <span className="text-zinc-500">Uploader</span>
                  <span className="font-semibold text-zinc-950">
                    {torrent.uploader}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">
                Source
              </h2>
              <div className="divide-y divide-zinc-200/70 text-sm">
                <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <span className="text-zinc-500">Provider</span>
                  <span className="font-semibold uppercase tracking-[0.12em] text-zinc-950">
                    {torrent.source.provider}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-zinc-500">Sources</span>
                  <span className="font-semibold text-zinc-950">
                    {torrent.sourceCount}
                  </span>
                </div>
                <div className="py-3 last:pb-0">
                  <Link
                    href={torrent.source.url}
                    className="inline-flex text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline"
                  >
                    View original source
                  </Link>
                </div>
              </div>
            </section>

          </aside>
        </div>
      </section>
    </main>
  );
}

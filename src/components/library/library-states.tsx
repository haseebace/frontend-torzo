"use client";

import Link from "next/link";
import { AlertCircle, FolderOpen, Inbox, Plug2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LibraryNotConnected() {
  return (
    <div className="flex flex-col items-start gap-5 rounded-3xl border border-border bg-surface p-6 md:p-8">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
        <Plug2 className="size-5" />
      </span>
      <div className="space-y-2">
        <h2 className="font-sans text-xl font-extrabold leading-tight text-foreground-strong md:text-2xl">
          Connect TorBox to see your library
        </h2>
        <p className="max-w-md text-sm leading-6 text-foreground-muted">
          The library reads from your TorBox account. Add your API key on the
          manage page and your files will appear here.
        </p>
      </div>
      <Button asChild size="lg" className="h-12 px-6">
        <Link href="/manage">Open manage</Link>
      </Button>
    </div>
  );
}

export function LibraryLoading() {
  return (
    <div
      className="flex flex-col gap-3"
      aria-busy="true"
      aria-live="polite"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-5 md:p-6"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-10 w-11/12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LibraryError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-3xl border border-border bg-surface p-6 md:p-8">
      <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-5" />
      </span>
      <div className="space-y-2">
        <h2 className="font-sans text-xl font-extrabold leading-tight text-foreground-strong md:text-2xl">
          Could not load your library
        </h2>
        <p className="max-w-md text-sm leading-6 text-foreground-muted">
          {message}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 px-6"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}

export function LibraryEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-surface px-6 py-14 text-center md:py-16">
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
        <FolderOpen className="size-5" />
      </span>
      <div className="space-y-1.5">
        <h2 className="font-sans text-lg font-extrabold text-foreground-strong md:text-xl">
          Nothing in the library yet
        </h2>
        <p className="max-w-sm text-sm leading-6 text-foreground-muted">
          Add a torrent from a search result, and the files will land here once
          TorBox finishes processing them.
        </p>
      </div>
    </div>
  );
}

export function LibraryFilteredEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface px-6 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
        <Inbox className="size-4" />
      </span>
      <div className="space-y-1">
        <p className="font-sans text-sm font-extrabold text-foreground-strong">
          No files match this filter
        </p>
        <p className="text-xs text-foreground-muted">
          Try a different search term.
        </p>
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        Clear filter
      </Button>
    </div>
  );
}

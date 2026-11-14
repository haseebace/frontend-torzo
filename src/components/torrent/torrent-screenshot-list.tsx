"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useState, type ReactNode } from "react";
import { useHoverShrink } from "@/animations";
import { torzoCornerSmoothing, useFigmaCorner } from "@/figma-radius";
import { cn } from "@/lib/utils";

type TorrentScreenshot = {
  url: string;
  page_url: string | null;
  kind: string;
};

type TorrentScreenshotListProps = {
  images: TorrentScreenshot[];
  title: string;
};

const IGNORED_IMAGE_EXTENSIONS = [".gif"];

function useDesktopScreenshotSize() {
  const [desktop, setDesktop] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return desktop;
}

function isIgnoredImage(url: string) {
  const pathname = url.split(/[?#]/, 1)[0].toLowerCase();
  return IGNORED_IMAGE_EXTENSIONS.some((extension) =>
    pathname.endsWith(extension),
  );
}

function ScreenshotFrame({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const desktop = useDesktopScreenshotSize();
  const hoverShrink = useHoverShrink();
  const [ref, cornerStyle] = useFigmaCorner<HTMLAnchorElement>(
    desktop ? 24 : 16,
    torzoCornerSmoothing,
  );

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      {...hoverShrink}
      style={{ ...cornerStyle, ...hoverShrink.style }}
      className={cn(
        "relative block aspect-video w-full min-w-0 overflow-hidden border-[1.5px] border-[var(--light-0)] leading-none shadow-[2px_4px_8px_1px_rgba(85,85,85,0.25)]",
        "md:max-w-none md:border-0 md:shadow-none",
      )}
    >
      {children}
    </motion.a>
  );
}

export function TorrentScreenshotList({
  images,
  title,
}: TorrentScreenshotListProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const visibleImages = images.filter(
    (image) => !isIgnoredImage(image.url) && !failedImages.has(image.url),
  );

  if (visibleImages.length === 0) {
    return null;
  }

  return (
    <div className="grid min-w-0 grid-cols-3 gap-2 bg-bg-surface p-4 md:grid-cols-4">
      {visibleImages.map((image, index) => {
        const rawHref = image.page_url || image.url;
        const href = rawHref.startsWith("http")
          ? rawHref
          : `https://${rawHref}`;
        const imageSrc = image.url.startsWith("http")
          ? image.url
          : `https://${image.url}`;
        return (
          <ScreenshotFrame
            key={`${image.url}-${index}`}
            href={href}
            label={`Open screenshot ${index + 1}`}
          >
            <img
              src={imageSrc}
              alt={`${title} screenshot ${index + 1}`}
              onError={() => {
                setFailedImages((current) => {
                  const next = new Set(current);
                  next.add(image.url);
                  return next;
                });
              }}
              className="absolute inset-0 size-full object-cover"
            />
          </ScreenshotFrame>
        );
      })}
    </div>
  );
}

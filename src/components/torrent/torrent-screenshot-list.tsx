"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { torzoCornerSmoothing, useFigmaCorner } from "@/figma-radius";

type TorrentScreenshot = {
  url: string;
  page_url: string | null;
  kind: string;
};

type TorrentScreenshotListProps = {
  images: TorrentScreenshot[];
  title: string;
};

const screenshotItemSpring = {
  type: "spring" as const,
  duration: 0.68,
  bounce: 0.45,
};

const IGNORED_IMAGE_EXTENSIONS = [".gif"];

function isIgnoredImage(url: string) {
  const pathname = url.split(/[?#]/, 1)[0].toLowerCase();
  return IGNORED_IMAGE_EXTENSIONS.some((extension) =>
    pathname.endsWith(extension),
  );
}

function getRandomizedDelay(value: string, index: number) {
  let hash = index + 17;

  for (let characterIndex = 0; characterIndex < value.length; characterIndex += 1) {
    hash = (hash * 31 + value.charCodeAt(characterIndex)) % 997;
  }

  return 0.04 + (hash / 997) * 0.34;
}

function ScreenshotFrame({
  href,
  label,
  delay,
  reduceMotion,
  children,
}: {
  href: string;
  label: string;
  delay: number;
  reduceMotion: boolean | null;
  children: ReactNode;
}) {
  const [ref, cornerStyle] = useFigmaCorner<HTMLAnchorElement>(24, torzoCornerSmoothing);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, scale: 0.84, filter: "blur(10px)" }
      }
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : {
              ...screenshotItemSpring,
              delay,
            }
      }
      style={{ ...cornerStyle, transformOrigin: "center center" }}
      className="block h-44 max-w-full shrink-0 overflow-hidden leading-none"
    >
      {children}
    </motion.a>
  );
}

export function TorrentScreenshotList({
  images,
  title,
}: TorrentScreenshotListProps) {
  const reduceMotion = useReducedMotion();
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const visibleImages = images.filter(
    (image) => !isIgnoredImage(image.url) && !failedImages.has(image.url),
  );

  if (visibleImages.length === 0) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-wrap items-start gap-2 bg-bg-surface p-4">
      {visibleImages.map((image, index) => {
        const rawHref = image.page_url || image.url;
        const href = rawHref.startsWith("http")
          ? rawHref
          : `https://${rawHref}`;
        const imageSrc = image.url.startsWith("http")
          ? image.url
          : `https://${image.url}`;
        const delay = getRandomizedDelay(image.url, index);

        return (
          <ScreenshotFrame
            key={`${image.url}-${index}`}
            href={href}
            label={`Open screenshot ${index + 1}`}
            delay={delay}
            reduceMotion={reduceMotion}
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
              className="h-44 w-auto max-w-full object-cover"
            />
          </ScreenshotFrame>
        );
      })}
    </div>
  );
}

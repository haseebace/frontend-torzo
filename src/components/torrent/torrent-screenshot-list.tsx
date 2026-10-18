"use client";

import { motion, useReducedMotion } from "framer-motion";

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

export function TorrentScreenshotList({
  images,
  title,
}: TorrentScreenshotListProps) {
  const reduceMotion = useReducedMotion();
  const visibleImages = images.filter((image) => !isIgnoredImage(image.url));

  return (
    <div className="flex flex-wrap gap-2 px-2 py-3">
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
          <motion.a
            key={`${image.url}-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open screenshot ${index + 1}`}
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
            style={{ transformOrigin: "center center" }}
            className="group block h-[120px] w-fit max-w-full overflow-hidden rounded-2xl border border-border bg-transparent leading-none transition-colors hover:border-foreground/30"
          >
            <img
              src={imageSrc}
              alt={`${title} screenshot ${index + 1}`}
              className="block h-full max-w-full w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </motion.a>
        );
      })}
    </div>
  );
}

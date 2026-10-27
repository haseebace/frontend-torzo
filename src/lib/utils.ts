import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export type RawSize = string | number | null | undefined;

export function parseRawSize(value: RawSize): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;

  const cleaned = value.trim();
  const match = cleaned.match(/^([\d.]+)\s*(B|KB|MB|GB|TB|PB)?$/i);
  if (!match) return 0;

  const amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount)) return 0;

  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    PB: 1024 ** 5,
  };
  return Math.round(amount * (multipliers[(match[2] || "B").toUpperCase()] ?? 1));
}

export function formatRawSize(value: RawSize): string {
  if (typeof value === "string" && /[a-z]/i.test(value)) return value.trim();
  const bytes = parseRawSize(value);
  return bytes > 0 ? formatBytes(bytes) : "Unknown";
}

export function formatDate(value: string | null) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(value));
  } catch {
    return "Invalid date";
  }
}

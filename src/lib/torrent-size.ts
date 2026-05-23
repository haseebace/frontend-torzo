import { formatBytes } from "@/lib/utils";

export type TorrentSizeParts = {
  value: string;
  unit: string;
};

export function parseTorrentSizeParts(
  sizeHuman: string,
  sizeBytes: number,
): TorrentSizeParts {
  const human = sizeHuman.trim() || formatBytes(sizeBytes);
  const match = human.match(/^([\d.,]+)\s*(.*)$/i);

  if (!match) {
    return { value: "—", unit: "" };
  }

  const numeric = Number.parseFloat(match[1].replace(",", ""));
  const unit = match[2].trim() || "B";
  if (!Number.isFinite(numeric)) {
    return { value: "—", unit };
  }

  const value =
    Number.isInteger(numeric) || numeric >= 100
      ? String(Math.round(numeric))
      : String(Math.round(numeric * 10) / 10);

  return { value, unit };
}

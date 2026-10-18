export type TorrentTitleTags = {
  resolution?: string;
  codec?: string;
  source?: string;
  bitDepth?: string;
  audio?: string;
  dolbyVision?: string;
  hdr?: string;
  atmos?: string;
};

function normalizeTitle(title: string) {
  return title.toUpperCase().replace(/[._-]+/g, " ").replace(/\s+/g, " ");
}

export function parseTorrentTitle(title: string): TorrentTitleTags {
  const normalized = normalizeTitle(title);
  const resolutionMatch = normalized.match(
    /\b(4320|2160|1440|1080|720|576|480|360)P\b/,
  );

  const resolution = resolutionMatch?.[1]
    ? `${resolutionMatch[1]}p`
    : /\b4K\b/.test(normalized)
      ? "4K"
      : /\bUHD\b/.test(normalized)
        ? "UHD"
        : undefined;

  const hasHevc = /\b(HEVC|H ?265)\b/.test(normalized);
  const hasX265 = /\bX265\b/.test(normalized);
  const hasAvc = /\b(AVC|H ?264)\b/.test(normalized);
  const hasX264 = /\bX264\b/.test(normalized);
  const codec = hasHevc && hasX265
    ? "HEVC / x265"
    : hasX265
      ? "x265"
      : hasHevc
        ? "HEVC"
        : hasAvc && hasX264
          ? "AVC / x264"
          : hasX264
            ? "x264"
            : hasAvc
              ? "AVC"
              : /\bAV1\b/.test(normalized)
                ? "AV1"
                : /\bVP9\b/.test(normalized)
                  ? "VP9"
                  : undefined;

  const bitDepthMatch = normalized.match(/\b(8|10|12)\s*BIT\b/);
  const bitDepth = bitDepthMatch?.[1]
    ? `${bitDepthMatch[1]}-bit`
    : undefined;

  const audio = /\bDDP\s*5\s*1\b/.test(normalized)
    ? "DDP 5.1"
    : /\bDDP\b/.test(normalized)
      ? "DDP"
      : /\bDD\s*5\s*1\b/.test(normalized)
        ? "DD 5.1"
        : /\bTRUEHD\b/.test(normalized) && /\bATMOS\b/.test(normalized)
          ? "TrueHD Atmos"
          : /\bTRUEHD\b/.test(normalized)
            ? "TrueHD"
            : /\bDTS\s*HD\s*MA\b/.test(normalized)
              ? "DTS-HD MA"
              : /\bDTS\s*X\b/.test(normalized)
                ? "DTS:X"
                : /\bEAC3\b/.test(normalized)
                  ? "E-AC-3"
                  : /\bAAC\b/.test(normalized)
                    ? "AAC"
                    : /\bOPUS\b/.test(normalized)
                      ? "Opus"
                      : /\bATMOS\b/.test(normalized)
                        ? "Atmos"
                        : undefined;

  const dolbyVision = /\bDV\b|\bDOLBY VISION\b/.test(normalized)
    ? "Dolby Vision"
    : undefined;
  const hdr = /\bHDR10\+/.test(normalized)
    ? "HDR10+"
    : /\bHDR10\b/.test(normalized)
      ? "HDR10"
      : /\bHDR\b/.test(normalized)
        ? "HDR"
        : undefined;
  const atmos = /\bATMOS\b/.test(normalized) ? "Atmos" : undefined;

  const hasBluRay = /\bBLU ?RAY\b|\bBLURAY\b|\bBDRIP\b|\bBRRIP\b/.test(
    normalized,
  );
  const source = /\bWEB ?DL\b|\bWEBDL\b/.test(normalized)
    ? "WEB-DL"
    : /\bWEB ?RIP\b|\bWEBRIP\b/.test(normalized)
      ? "WEBRip"
      : /\bWEB\b/.test(normalized)
        ? "WEB"
        : hasBluRay && /\bREMUX\b/.test(normalized)
        ? "Blu-ray Remux"
        : hasBluRay
          ? "Blu-ray"
          : /\bREMUX\b/.test(normalized)
            ? "Remux"
            : /\bHDTV\b/.test(normalized)
              ? "HDTV"
              : /\bCAM(RIP)?\b/.test(normalized)
                ? "CAM"
                : /\bDVD(RIP)?\b/.test(normalized)
                  ? "DVD"
                  : undefined;

  return { resolution, source, codec, bitDepth, audio, dolbyVision, hdr, atmos };
}

export function getTorrentTitleTags(title: string) {
  const { resolution, source, codec, bitDepth, audio, dolbyVision, hdr, atmos } =
    parseTorrentTitle(title);

  return Array.from(
    new Set(
      [resolution, source, codec, bitDepth, dolbyVision, hdr, audio, atmos].filter(
        (tag): tag is string => Boolean(tag),
      ),
    ),
  );
}

export function getTorrentTitleTagDescription(tag: string) {
  const descriptions: Record<string, string> = {
    "4K": "Very sharp Ultra HD video, usually around 3840×2160 pixels.",
    UHD: "Ultra HD video, usually referring to 2160p or 4K quality.",
    "1080p": "Full HD video with 1920×1080 pixels.",
    "720p": "HD video with 1280×720 pixels.",
    "576p": "Standard-definition PAL video.",
    "480p": "Standard-definition NTSC video.",
    "360p": "Low-resolution video, around 360 pixels high.",
    "WEB-DL": "Downloaded directly from an online streaming platform.",
    WEBRip: "Recorded or re-encoded from an online streaming platform.",
    WEB: "Sourced from an online streaming platform; the exact WEB-DL or WEBRip method is not specified.",
    "Blu-ray": "Video copied from a Blu-ray disc.",
    "Blu-ray Remux": "Blu-ray video and audio copied with little or no quality loss.",
    Remux: "Original video and audio packaged again without much re-encoding.",
    HEVC: "A newer video format that keeps good quality in smaller files.",
    x265: "The encoder used to create HEVC/H.265 video.",
    "HEVC / x265": "HEVC is the video format; x265 is the encoder used to create it.",
    AVC: "The widely supported H.264 video format.",
    x264: "The encoder used to create H.264/AVC video.",
    "AVC / x264": "AVC is the video format; x264 is the encoder used to create it.",
    AV1: "A newer video format designed to save space while keeping quality.",
    VP9: "A video format commonly used for online video.",
    "8-bit": "Standard color depth used by most regular SDR video.",
    "10-bit": "More color detail than 8-bit video, with smoother gradients.",
    "12-bit": "Very high color detail for professional or high-end video.",
    DDP: "Dolby Digital Plus audio.",
    "DDP 5.1": "Dolby Digital Plus surround sound with five speakers and a subwoofer.",
    "DD 5.1": "Dolby Digital surround sound with five speakers and a subwoofer.",
    "E-AC-3": "Another name for Dolby Digital Plus audio.",
    AAC: "A common audio format with good quality and small file sizes.",
    "DTS-HD MA": "High-quality DTS surround sound audio.",
    "DTS:X": "Immersive DTS surround sound with height effects.",
    "TrueHD Atmos": "High-quality Dolby audio with Dolby Atmos surround sound.",
    Atmos: "Immersive surround sound with height effects.",
    Opus: "A modern audio format commonly used for online audio.",
    "Dolby Vision": "HDR video with dynamic color and brightness adjustments.",
    HDR10: "HDR video with brighter highlights and a wider color range.",
    "HDR10+": "HDR10 with brightness adjusted scene by scene.",
    HDR: "Video with brighter highlights and a wider contrast range.",
    HDTV: "Recorded from a television broadcast.",
    CAM: "Recorded with a camera inside a cinema; quality can vary.",
    DVD: "Video copied from a DVD release.",
  };

  return descriptions[tag] ?? "Release information extracted from the torrent title.";
}

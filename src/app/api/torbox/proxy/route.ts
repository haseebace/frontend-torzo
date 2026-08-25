import { NextRequest, NextResponse } from "next/server";

const TORBOX_BASE = "https://api.torbox.app/v1/api";

function mapTorBoxErrorToStatus(errorCode: string | null): number {
  if (!errorCode) return 500;
  const code = errorCode.toUpperCase();
  if (code === "NO_AUTH" || code === "BAD_TOKEN" || code === "AUTH_ERROR") {
    return 401;
  }
  if (code === "ITEM_NOT_FOUND") return 404;
  if (code === "MISSING_REQUIRED_OPTION" || code === "INVALID_OPTION" || code === "TOO_MANY_OPTIONS" || code === "TOO_MUCH_DATA" || code === "BOZO_TORRENT" || code === "BOZO_NZB" || code === "BOZO_FILE" || code === "BOZO_RSS_FEED" || code === "BOZO_REGEX" || code === "BAD_CONFIRMATION" || code === "CONFIRMATION_EXPIRED" || code === "DIFF_ISSUE") {
    return 400;
  }
  if (code === "PLAN_RESTRICTED_FEATURE" || code === "DOWNLOAD_TOO_LARGE" || code === "MONTHLY_LIMIT" || code === "COOLDOWN_LIMIT" || code === "ACTIVE_LIMIT") {
    return 403;
  }
  if (code === "DUPLICATE_ITEM") return 409;
  return 500;
}

function safeDetail(data: unknown): string {
  if (typeof data === "object" && data !== null) {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === "string") return d.detail;
    if (typeof d.error === "string") return d.error;
    if (typeof d.message === "string") return d.message;
    try {
      return JSON.stringify(data);
    } catch {
      return "Unknown error";
    }
  }
  if (typeof data === "string") return data;
  return "TorBox error";
}

export async function POST(request: NextRequest) {
  try {
    const { endpoint, method = "GET", body, params } = await request.json();
    const apiKey = request.headers.get("x-torbox-api-key");

    if (!apiKey) {
      return NextResponse.json({ error: "No TorBox API key provided" }, { status: 401 });
    }

    if (!endpoint || typeof endpoint !== "string") {
      return NextResponse.json({ error: "No endpoint provided" }, { status: 400 });
    }

    const url = new URL(`${TORBOX_BASE}${endpoint}`);

    // TorBox requires token as a query param for some endpoints (e.g. /requestdl)
    url.searchParams.set("token", apiKey);

    if (params && typeof params === "object") {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== undefined && item !== null) {
              url.searchParams.append(key, String(item));
            }
          });
        } else if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      if (typeof body === "string") {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        fetchOptions.body = body;
      } else {
        headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url.toString(), fetchOptions);

    // Handle non-JSON responses (e.g., file downloads)
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const arrayBuffer = await response.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        status: response.status,
        headers: {
          "content-type": contentType || "application/octet-stream",
        },
      });
    }

    const data = await response.json().catch(() => ({}));

    // Normalize TorBox's success:false into HTTP error status
    if (data && typeof data === "object" && data.success === false) {
      const status = mapTorBoxErrorToStatus(data.error);
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data, { status: response.status });

  } catch (error: unknown) {
    console.error("TorBox Proxy Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Proxy failed" },
      { status: 500 }
    );
  }
}

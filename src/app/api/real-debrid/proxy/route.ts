import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { endpoint, method = "GET", body } = await request.json();
    const apiKey = request.headers.get("x-rd-api-key");

    if (!apiKey) {
      return NextResponse.json({ error: "No RD API key provided" }, { status: 401 });
    }

    if (!endpoint) {
      return NextResponse.json({ error: "No endpoint provided" }, { status: 400 });
    }

    const rdUrl = `https://api.real-debrid.com/rest/1.0${endpoint}`;
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      fetchOptions.body = new URLSearchParams(body).toString();
    }

    const response = await fetch(rdUrl, fetchOptions);
    
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });

  } catch (error: unknown) {
    console.error("RD Proxy Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Proxy failed" },
      { status: 500 }
    );
  }
}

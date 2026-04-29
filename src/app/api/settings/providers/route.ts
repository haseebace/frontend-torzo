import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { parseProviders } from "@/lib/server/app-settings";

const PROVIDERS_COOKIE_NAME = "torzo_selected_providers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const providersCookie = cookieStore.get(PROVIDERS_COOKIE_NAME);
    
    let providers = ["rarbg"];
    if (providersCookie) {
      try {
        const parsed = JSON.parse(providersCookie.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          providers = parsed;
        }
      } catch {
        // Fallback to default
      }
    }

    return NextResponse.json({
      providers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load providers.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { providers?: unknown };
    const providers = parseProviders(body.providers);

    if (!providers) {
      return NextResponse.json(
        { error: "Choose at least one supported provider." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(PROVIDERS_COOKIE_NAME, JSON.stringify(providers), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return NextResponse.json({
      providers,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save providers.",
      },
      { status: 500 }
    );
  }
}

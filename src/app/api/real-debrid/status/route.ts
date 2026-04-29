import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
        // Fallback
      }
    }

    // Note: real_debrid_connected and username are handled via localStorage on the client
    return NextResponse.json({
      connected: false, 
      username: null,
      providers,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load status.",
      },
      { status: 500 }
    );
  }
}

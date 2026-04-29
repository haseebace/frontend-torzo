import { NextResponse } from "next/server";
import { getAppSettings } from "@/lib/server/app-settings";

export async function GET() {
  try {
    const settings = await getAppSettings();

    return NextResponse.json({
      connected: settings.real_debrid_connected,
      username: settings.real_debrid_username,
      providers: settings.providers,
      updatedAt: settings.updated_at,
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

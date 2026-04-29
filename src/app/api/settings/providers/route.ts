import { NextResponse } from "next/server";
import {
  getAppSettings,
  parseProviders,
  upsertAppSettings,
} from "@/lib/server/app-settings";

export async function GET() {
  try {
    const settings = await getAppSettings();

    return NextResponse.json({
      providers: settings.providers,
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

    const settings = await upsertAppSettings({ providers });

    return NextResponse.json({
      providers: settings.providers,
      updatedAt: settings.updated_at,
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

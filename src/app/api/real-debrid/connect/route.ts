import { NextResponse } from "next/server";
import { encryptSecret } from "@/lib/server/crypto";
import { getAppSettings, upsertAppSettings } from "@/lib/server/app-settings";

type RealDebridUser = {
  username?: string;
  email?: string;
  type?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { apiKey?: unknown };
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Enter a Real-Debrid API key." },
        { status: 400 }
      );
    }

    const realDebridResponse = await fetch(
      "https://api.real-debrid.com/rest/1.0/user",
      {
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
        cache: "no-store",
      }
    );

    if (!realDebridResponse.ok) {
      return NextResponse.json(
        { error: "Real-Debrid rejected that API key." },
        { status: 401 }
      );
    }

    const user = (await realDebridResponse.json()) as RealDebridUser;
    const encryptedApiKey = encryptSecret(apiKey);
    const currentSettings = await getAppSettings();
    const settings = await upsertAppSettings({
      real_debrid_api_key_ciphertext: encryptedApiKey.ciphertext,
      real_debrid_api_key_iv: encryptedApiKey.iv,
      real_debrid_api_key_tag: encryptedApiKey.tag,
      real_debrid_connected: true,
      real_debrid_username: user.username ?? user.email ?? null,
      providers: currentSettings.providers,
    });

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
          error instanceof Error
            ? error.message
            : "Could not connect Real-Debrid.",
      },
      { status: 500 }
    );
  }
}

import "server-only";

export const providerIds = ["rarbg", "the-pirate-bay", "yts"] as const;

export type ProviderId = (typeof providerIds)[number];

export type AppSettings = {
  id: "global";
  real_debrid_api_key_ciphertext: string | null;
  real_debrid_api_key_iv: string | null;
  real_debrid_api_key_tag: string | null;
  real_debrid_connected: boolean;
  real_debrid_username: string | null;
  providers: ProviderId[];
  updated_at: string;
};

type AppSettingsPatch = Partial<
  Pick<
    AppSettings,
    | "real_debrid_api_key_ciphertext"
    | "real_debrid_api_key_iv"
    | "real_debrid_api_key_tag"
    | "real_debrid_connected"
    | "real_debrid_username"
    | "providers"
  >
>;

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server environment variables are not configured.");
  }

  return {
    restUrl: `${supabaseUrl.replace(/\/$/, "")}/rest/v1`,
    serviceRoleKey,
  };
}

function getHeaders(prefer?: string) {
  const { serviceRoleKey } = getSupabaseConfig();

  return {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
    "content-type": "application/json",
    ...(prefer ? { prefer } : {}),
  };
}

export function parseProviders(value: unknown): ProviderId[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const providers = value.filter((item): item is ProviderId =>
    providerIds.includes(item as ProviderId)
  );

  if (providers.length === 0 || providers.length !== value.length) {
    return null;
  }

  return providers;
}

export async function getAppSettings(): Promise<AppSettings> {
  const { restUrl } = getSupabaseConfig();
  const response = await fetch(
    `${restUrl}/app_settings?id=eq.global&select=*`,
    {
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Could not load app settings from Supabase.");
  }

  const rows = (await response.json()) as AppSettings[];
  const settings = rows[0];

  if (!settings) {
    return upsertAppSettings({ providers: ["rarbg"] });
  }

  return settings;
}

export async function upsertAppSettings(
  patch: AppSettingsPatch
): Promise<AppSettings> {
  const { restUrl } = getSupabaseConfig();
  const response = await fetch(
    `${restUrl}/app_settings?on_conflict=id&select=*`,
    {
      method: "POST",
      headers: getHeaders("resolution=merge-duplicates,return=representation"),
      body: JSON.stringify({
        id: "global",
        ...patch,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Could not save app settings to Supabase.");
  }

  const rows = (await response.json()) as AppSettings[];

  return rows[0];
}

type TmdbAuth = {
  headers: Record<string, string>;
  apiKey: string | null;
  hasBearerToken: boolean;
};

export function getTmdbAuth(): TmdbAuth {
  const bearerToken =
    process.env.APP_TMDB_READ_ACCESS_TOKEN ?? process.env.TMDB_ACCESS_TOKEN;

  if (bearerToken) {
    return {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: "application/json",
      },
      apiKey: null,
      hasBearerToken: true,
    };
  }

  return {
    headers: { Accept: "application/json" },
    apiKey: process.env.APP_TMDB_API_KEY ?? process.env.TMDB_API_KEY ?? null,
    hasBearerToken: false,
  };
}

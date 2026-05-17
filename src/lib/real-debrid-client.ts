const REAL_DEBRID_API_BASE_URL = "https://api.real-debrid.com/rest/1.0";

type RealDebridRequestOptions = {
  method?: string;
  body?: Record<string, string | number | boolean | null | undefined>;
};

export type RealDebridError = Error & {
  code?: number;
  status?: number;
};

export async function realDebridFetch<T = unknown>(
  apiKey: string,
  endpoint: string,
  options: RealDebridRequestOptions = {}
): Promise<T | null> {
  if (!apiKey) {
    throw new Error("No API key found");
  }

  if (!endpoint.startsWith("/")) {
    throw new Error("Real-Debrid endpoint must start with /");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
  };

  const requestOptions: RequestInit = {
    method: options.method ?? "GET",
    headers,
  };

  if (options.body) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    requestOptions.body = new URLSearchParams(
      Object.entries(options.body).reduce<Record<string, string>>(
        (params, [key, value]) => {
          if (value !== null && value !== undefined) {
            params[key] = String(value);
          }
          return params;
        },
        {}
      )
    ).toString();
  }

  const response = await fetch(`${REAL_DEBRID_API_BASE_URL}${endpoint}`, requestOptions);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Real-Debrid error";
    const error = new Error(message) as RealDebridError;
    error.code = typeof data.error_code === "number" ? data.error_code : undefined;
    error.status = response.status;
    throw error;
  }

  return data as T;
}

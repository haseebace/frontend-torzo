"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const providers = [
  { id: "rarbg", label: "RARBG" },
  { id: "the-pirate-bay", label: "Pirate Bay" },
  { id: "yts", label: "YTS" },
] as const;

type ProviderId = (typeof providers)[number]["id"];

type ManageStatus = {
  connected: boolean;
  username: string | null;
  providers: ProviderId[];
};

export function ManageAccountForm() {
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedProviders, setSelectedProviders] = useState<ProviderId[]>([
    "rarbg",
  ]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSavingProviders, setIsSavingProviders] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      try {
        // Load provider settings from server
        const response = await fetch("/api/real-debrid/status");
        if (response.ok) {
          const status = (await response.json()) as ManageStatus;
          if (isMounted) setSelectedProviders(status.providers);
        }

        // Load RD Key from localStorage
        const localApiKey = localStorage.getItem("rd_api_key");
        if (localApiKey) {
          const userResponse = await fetch("/api/real-debrid/proxy", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-rd-api-key": localApiKey,
            },
            body: JSON.stringify({ endpoint: "/user" }),
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (isMounted) {
              setIsConnected(true);
              setUsername(userData.username);
            }
          } else {
            if (isMounted) {
              localStorage.removeItem("rd_api_key");
              setIsConnected(false);
              setUsername(null);
            }
          }
        }
      } catch {
        if (isMounted) {
          setError("Could not load saved settings.");
        }
      }
    }

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProviderLabels = useMemo(
    () =>
      providers
        .filter((provider) => selectedProviders.includes(provider.id))
        .map((provider) => provider.label)
        .join(", "),
    [selectedProviders],
  );
  const activeProviderCount = selectedProviders.length;
  const connectionStatus = isConnected ? "Connected" : "Not connected";

  const handleProviderChange = async (
    providerId: ProviderId,
    checked: boolean,
  ) => {
    const nextProviders = checked
      ? selectedProviders.includes(providerId)
        ? selectedProviders
        : [...selectedProviders, providerId]
      : selectedProviders.filter((id) => id !== providerId);

    if (nextProviders.length === 0) {
      setProviderError("Choose at least one provider.");
      return;
    }

    setSelectedProviders(nextProviders);
    setProviderError(null);
    setMessage(null);
    setIsSavingProviders(true);

    try {
      const response = await fetch("/api/settings/providers", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ providers: nextProviders }),
      });

      const data = (await response.json()) as {
        providers?: ProviderId[];
        error?: string;
      };

      if (!response.ok || !data.providers) {
        throw new Error(data.error ?? "Could not save providers.");
      }

      setSelectedProviders(data.providers);
    } catch (providerError) {
      setProviderError(
        providerError instanceof Error
          ? providerError.message
          : "Could not save providers.",
      );
    } finally {
      setIsSavingProviders(false);
    }
  };

  const handleConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiKey.trim()) {
      setError("Enter a Real-Debrid API key.");
      return;
    }

    setError(null);
    setMessage(null);
    setIsConnecting(true);

    try {
      // Verify token via our proxy
      const userResponse = await fetch("/api/real-debrid/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rd-api-key": apiKey.trim(),
        },
        body: JSON.stringify({ endpoint: "/user" }),
      });

      if (!userResponse.ok) {
        throw new Error("Invalid Real-Debrid API key.");
      }

      const userData = await userResponse.json();

      localStorage.setItem("rd_api_key", apiKey.trim());

      setIsConnected(true);
      setUsername(userData.username);
      setApiKey("");
      setMessage("Real-Debrid connected locally.");
    } catch (connectError) {
      setIsConnected(false);
      setError(
        connectError instanceof Error
          ? connectError.message
          : "Could not connect Real-Debrid.",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("rd_api_key");
    setIsConnected(false);
    setUsername(null);
    setMessage("Real-Debrid disconnected.");
  };

  return (
    <div className="flex w-full flex-col gap-6 md:gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-7">
        <Card className="px-0 py-0 shadow-none border-none">
          <CardContent className="flex flex-col gap-6 p-6 md:p-8 border-none">
            <div className="flex flex-col gap-6">
              <div className="max-w-2xl space-y-3">
                <p className="font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                  Manage sources
                </p>
                <h1 className="font-heading text-3xl font-extrabold leading-[1.08] text-foreground-strong md:text-[38px]">
                  Connect Real-Debrid and control where Torzo searches.
                </h1>
                <p className="max-w-xl text-base leading-7 text-foreground-muted">
                  Keep the setup focused: one key, visible connection state, and
                  provider choices that save locally.
                </p>
              </div>
            </div>
            <form
              className="flex max-w-3xl flex-col gap-4"
              onSubmit={handleConnect}
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <label className="sr-only" htmlFor="real-debrid-api-key">
                  Real-Debrid API key
                </label>
                <div className="relative min-w-0 flex-1">
                  <LockKeyhole className="pointer-events-none absolute left-5 top-1/2 size-[18px] -translate-y-1/2 text-text-subtle" />
                  <Input
                    id="real-debrid-api-key"
                    type="password"
                    value={apiKey}
                    onChange={(event) => {
                      setApiKey(event.target.value);
                    }}
                    placeholder="Paste your Real-Debrid API key"
                    className="bg-card pl-12 text-sm hover:bg-card focus-visible:bg-card"
                    disabled={isConnected}
                  />
                </div>
                {isConnected ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    className="h-14 px-6 font-heading xl:w-[148px]"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 px-6 font-heading xl:w-[148px]"
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting" : "Connect"}
                  </Button>
                )}
              </div>
              {error ? (
                <p className="rounded-control bg-brand-surface px-4 py-3 text-sm font-medium text-destructive">
                  {error}
                </p>
              ) : null}
              {message ? (
                <p className="rounded-control  bg-surface-subtle px-4 py-3 text-sm font-medium text-foreground-strong">
                  {message}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <Card className="bg-brand-surface px-0 py-0 text-brand-foreground border-none">
          <CardContent className="flex h-full flex-col gap-5 p-6">
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-brand-foreground">
                Connection status
              </p>
              <p className="font-heading text-2xl font-extrabold text-brand-foreground">
                {connectionStatus}
              </p>
            </div>
            <p className="text-sm leading-6 text-brand-foreground">
              {isConnected
                ? username
                  ? `Connected as ${username}. The key remains in this browser.`
                  : "Torzo is ready to use your Real-Debrid account from this browser."
                : "Add an API key to unlock Debrid actions. The key stays in this browser and is never uploaded to Torzo."}
            </p>
            <div className="h-px w-full " />
            <div className="space-y-2">
              <p className="font-heading text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-foreground">
                Selected providers
              </p>
              <p className="font-heading text-base font-extrabold text-foreground">
                {selectedProviderLabels}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-7">
        <div className="flex flex-col gap-6 md:gap-7">
          <Card className="px-0 py-0 shadow-none border-none">
            <CardHeader className="px-5 pt-6 md:px-7 md:pt-7">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="min-w-0 font-heading text-xl font-extrabold text-foreground md:text-2xl">
                  Provider configuration
                </CardTitle>
                <span className="ui-badge">
                  <span className="ui-badge-dot" />
                  {isSavingProviders ? "Saving" : "Saved"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-5 pb-6 pt-5 md:px-7 md:pb-7 md:pt-6">
              <div className="flex flex-col gap-3 md:flex-row md:gap-3.5">
                {providers.map((provider) => {
                  const isChecked = selectedProviders.includes(provider.id);

                  return (
                    <label
                      key={provider.id}
                      className={cn(
                        "flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-pill border-2 bg-surface px-4 py-3 transition-[background-color,border-color,transform] duration-200 ease-[var(--ui-ease-standard)] hover:border-primary hover:bg-brand-surface active:scale-[0.96] motion-reduce:active:scale-100",
                        isChecked ? "border-primary" : "border-border",
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleProviderChange(provider.id, checked === true)
                        }
                        aria-label={`Use ${provider.label}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex min-w-0 items-center justify-between gap-2">
                          <span className="font-heading text-sm font-extrabold text-foreground">
                            {provider.label}
                          </span>
                          {isChecked ? (
                            <span className="ui-badge">
                              <span className="ui-badge-dot" />
                              Active
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {providerError ? (
                <p className="rounded-control bg-brand-surface px-4 py-3 text-sm font-medium text-destructive">
                  {providerError}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <aside className="grid grid-cols-1 gap-6 self-start sm:grid-cols-2 lg:grid-cols-1">
          <Card className="px-0 py-0 shadow-none border-none">
            <CardContent className="space-y-2.5 p-5 md:p-[18px]">
              <p className="text-sm font-bold text-muted-foreground">
                Setup health
              </p>
              <p className="font-heading text-[28px] font-bold leading-none text-foreground md:text-[34px]">
                {activeProviderCount}/{providers.length}
              </p>
              <p className="text-sm font-semibold text-primary">
                Providers active
              </p>
            </CardContent>
          </Card>
          <Card className="px-0 py-0 shadow-none border-none">
            <CardContent className="space-y-2.5 p-5 md:p-[18px]">
              <p className="text-sm font-bold text-muted-foreground">
                Key status
              </p>
              <p className="font-heading text-[28px] font-bold leading-none text-primary md:text-[34px]">
                {isConnected ? "Ready" : "Missing"}
              </p>
              <p className="text-sm font-semibold text-primary">
                {isConnected
                  ? "Debrid actions unlocked"
                  : "Paste API key to unlock"}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

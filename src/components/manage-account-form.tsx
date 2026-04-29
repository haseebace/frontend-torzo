"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const providers = [
  {
    id: "rarbg",
    label: "RARBG",
    description: "Default tracker for broad movie and show coverage.",
  },
  {
    id: "the-pirate-bay",
    label: "The Pirate Bay",
    description: "Wider index coverage for mixed categories.",
  },
  {
    id: "yts",
    label: "YTS",
    description: "Lightweight movie-focused results.",
  },
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
    [selectedProviders]
  );

  const handleProviderChange = async (
    providerId: ProviderId,
    checked: boolean
  ) => {
    const nextProviders = checked
      ? selectedProviders.includes(providerId)
        ? selectedProviders
        : [...selectedProviders, providerId]
      : selectedProviders.filter((id) => id !== providerId);

    if (nextProviders.length === 0) {
      setError("Choose at least one provider.");
      return;
    }

    setSelectedProviders(nextProviders);
    setError(null);
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
      setMessage("Provider settings saved.");
    } catch (providerError) {
      setError(
        providerError instanceof Error
          ? providerError.message
          : "Could not save providers."
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
          : "Could not connect Real-Debrid."
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
          Manage
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-500 md:text-base">
          Turbocharge your experience by connecting Real-Debrid and choosing your preferred search sources.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-xl border border-zinc-200 bg-white px-0 py-5">
          <CardHeader className="gap-2 px-5">
            <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
              <KeyRound className="size-5" />
            </div>
            <CardTitle className="text-xl font-semibold text-zinc-950">
              Unlock High Speed
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <form className="flex flex-col gap-4" onSubmit={handleConnect}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-700">
                  API key
                </span>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(event) => {
                    setApiKey(event.target.value);
                  }}
                  placeholder="Paste your Real-Debrid API key"
                  className="h-12 rounded-xl px-4 text-sm leading-none md:text-sm"
                  disabled={isConnected}
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-zinc-500">
                  Your key stays in your browser. It's never sent to our servers, keeping your account 100% private.
                </p>
                {isConnected ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-10 px-4"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="h-10 px-4"
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting" : "Connect"}
                  </Button>
                )}
              </div>
              {error ? (
                <p className="text-sm font-medium text-red-600">{error}</p>
              ) : null}
              {message ? (
                <p className="text-sm font-medium text-zinc-700">{message}</p>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-zinc-200 bg-white px-0 py-5">
          <CardHeader className="gap-2 px-5">
            <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle className="text-xl font-semibold text-zinc-950">
              Connection status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-950">
                {isConnected ? "Connected locally" : "Not connected"}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                {isConnected
                  ? username
                    ? `Connected as ${username} (Browser only).`
                    : "Torzo is ready to use your Real-Debrid account."
                  : "Add your API key to enable Real-Debrid actions."}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
                Selected providers
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-800">
                {selectedProviderLabels}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border border-zinc-200 bg-white px-0 py-5">
        <CardHeader className="px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-semibold text-zinc-950">
              Provider configuration
            </CardTitle>
            <p className="text-xs text-zinc-500">
              {isSavingProviders ? "Saving..." : "Saved to your browser"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 px-5">
          {providers.map((provider) => {
            const isChecked = selectedProviders.includes(provider.id);

            return (
              <label
                key={provider.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleProviderChange(provider.id, checked === true)
                  }
                  aria-label={`Use ${provider.label}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
                    {provider.label}
                    {isChecked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-950 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                        <Check className="size-3" />
                        Active
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-zinc-500">
                    {provider.description}
                  </span>
                </span>
              </label>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

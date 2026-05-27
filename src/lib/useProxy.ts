"use client";

import { useCallback } from "react";
import { useSite } from "@/contexts/SiteContext";
import { api } from "@/lib/api";

interface ProxyResult<T> {
  data: T | undefined;
  error: string | undefined;
}

interface ProxyEnvelope<T> {
  ok: boolean;
  data: T;
  error?: string;
}

export function useProxy() {
  const { activeSite } = useSite();

  const proxyGet = useCallback(
    async <T>(path: string): Promise<ProxyResult<T>> => {
      if (!activeSite) return { data: undefined, error: "No site selected" };
      const res = await api.get<ProxyEnvelope<T>>(
        `/api/sites/${activeSite.id}/proxy?path=${encodeURIComponent(path)}`
      );
      if (res.error) return { data: undefined, error: res.error };
      if (!res.data?.ok) return { data: undefined, error: res.data?.error ?? "Proxy error" };
      return { data: res.data.data, error: undefined };
    },
    [activeSite]
  );

  const proxyPost = useCallback(
    async <T>(path: string, body: unknown): Promise<ProxyResult<T>> => {
      if (!activeSite) return { data: undefined, error: "No site selected" };
      const res = await api.post<ProxyEnvelope<T>>(
        `/api/sites/${activeSite.id}/proxy?path=${encodeURIComponent(path)}`,
        body
      );
      if (res.error) return { data: undefined, error: res.error };
      if (!res.data?.ok) return { data: undefined, error: res.data?.error ?? "Proxy error" };
      return { data: res.data.data, error: undefined };
    },
    [activeSite]
  );

  return { proxyGet, proxyPost, activeSite };
}

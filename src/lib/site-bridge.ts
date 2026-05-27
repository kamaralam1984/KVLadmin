import type { Site } from "@/types"

export interface BridgeResult<T = unknown> {
  ok: boolean
  status: number
  data?: T
  error?: string
  latencyMs?: number
}

export async function bridgeFetch<T = unknown>(
  site: Pick<Site, "apiUrl" | "apiKey">,
  path: string,
  options: RequestInit = {}
): Promise<BridgeResult<T>> {
  const base = site.apiUrl.replace(/\/$/, "")
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`
  const start = Date.now()

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": site.apiKey,
        "X-KVL-Source": "kvl-central-admin",
        ...options.headers,
      },
      signal: AbortSignal.timeout(10_000),
    })

    const latencyMs = Date.now() - start

    let data: T | undefined
    const ct = res.headers.get("content-type") ?? ""
    if (ct.includes("application/json")) {
      data = (await res.json()) as T
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: (data as { error?: string })?.error ?? `HTTP ${res.status}`,
        latencyMs,
      }
    }

    return { ok: true, status: res.status, data, latencyMs }
  } catch (err) {
    const latencyMs = Date.now() - start
    if (err instanceof Error && err.name === "TimeoutError") {
      return { ok: false, status: 408, error: "Request timed out (10s)", latencyMs }
    }
    return { ok: false, status: 0, error: "Network error — site unreachable", latencyMs }
  }
}

export async function checkSiteStatus(site: Pick<Site, "apiUrl" | "apiKey">): Promise<{
  online: boolean
  latencyMs: number
  error?: string
}> {
  const healthPaths = ["/health", "/api/health", "/status", "/ping", "/"]

  for (const path of healthPaths) {
    const result = await bridgeFetch(site, path, { method: "GET" })
    if (result.ok || result.status < 500) {
      return { online: true, latencyMs: result.latencyMs ?? 0 }
    }
  }

  return { online: false, latencyMs: 0, error: "All health endpoints failed" }
}

import { redisGet, redisSet, redisDel } from "./redis"

export async function cacheGet<T>(key: string): Promise<T | null> {
  const raw = await redisGet(key)
  if (!raw) return null
  try { return JSON.parse(raw) as T } catch { return null }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
  await redisSet(key, JSON.stringify(value), ttlSeconds)
}

export async function cacheInvalidate(...keys: string[]): Promise<void> {
  await Promise.all(keys.map(redisDel))
}

// Namespaced cache keys
export const CacheKeys = {
  site: (id: string) => `cache:site:${id}`,
  siteBySubdomain: (sub: string) => `cache:site:sub:${sub}`,
  multiSiteStats: () => `cache:stats:multi-site`,
  dashboardStats: () => `cache:stats:dashboard`,
  siteAnalytics: (id: string) => `cache:analytics:${id}`,
}

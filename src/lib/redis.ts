import Redis from "ioredis"

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379"

let redis: Redis | null = null

export function getRedis(): Redis | null {
  if (redis) return redis
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
    })
    redis.on("error", () => { redis = null })
    return redis
  } catch {
    return null
  }
}

export async function redisGet(key: string): Promise<string | null> {
  try {
    return await getRedis()?.get(key) ?? null
  } catch {
    return null
  }
}

export async function redisSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  try {
    const r = getRedis()
    if (!r) return
    if (ttlSeconds) await r.set(key, value, "EX", ttlSeconds)
    else await r.set(key, value)
  } catch { /* Redis offline — skip */ }
}

export async function redisDel(key: string): Promise<void> {
  try { await getRedis()?.del(key) } catch { /* skip */ }
}

export async function redisIncr(key: string, ttlSeconds?: number): Promise<number> {
  try {
    const r = getRedis()
    if (!r) return 0
    const val = await r.incr(key)
    if (ttlSeconds && val === 1) await r.expire(key, ttlSeconds)
    return val
  } catch {
    return 0
  }
}

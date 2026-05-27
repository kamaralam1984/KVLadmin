import { redisIncr } from "./redis"

// Requests per minute per plan
const PLAN_LIMITS: Record<string, number> = {
  free: 100,
  pro: 1000,
  enterprise: 10000,
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
}

export async function checkRateLimit(siteId: string, plan = "free"): Promise<RateLimitResult> {
  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free
  const window = Math.floor(Date.now() / 60_000) // 1-minute window
  const key = `rl:${siteId}:${window}`

  const count = await redisIncr(key, 120) // TTL 2 min

  // If Redis offline (count = 0), allow all requests
  if (count === 0) return { allowed: true, remaining: limit, limit }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    limit,
  }
}

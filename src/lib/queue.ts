import { Queue } from "bullmq"

function parseRedisUrl(url: string) {
  try {
    const u = new URL(url)
    return {
      host: u.hostname || "localhost",
      port: parseInt(u.port || "6379"),
      password: u.password || undefined,
    }
  } catch {
    return { host: "localhost", port: 6379 }
  }
}

const REDIS_OPTS = parseRedisUrl(process.env.REDIS_URL ?? "redis://localhost:6379")

function makeQueue<T>(name: string) {
  try {
    return new Queue<T>(name, { connection: REDIS_OPTS })
  } catch {
    return null
  }
}

export type HealthCheckJob = { siteId: string }
export type WebhookJob = { siteId: string; type: string; payload: unknown; eventId: string }
export type UsageJob = { siteId: string; requestCount: number; bandwidth: number }

let _healthQueue: Queue<HealthCheckJob> | null = null
let _webhookQueue: Queue<WebhookJob> | null = null
let _usageQueue: Queue<UsageJob> | null = null

export function getHealthQueue() {
  if (!_healthQueue) _healthQueue = makeQueue<HealthCheckJob>("health-check")
  return _healthQueue
}

export function getWebhookQueue() {
  if (!_webhookQueue) _webhookQueue = makeQueue<WebhookJob>("webhook-processing")
  return _webhookQueue
}

export function getUsageQueue() {
  if (!_usageQueue) _usageQueue = makeQueue<UsageJob>("usage-tracking")
  return _usageQueue
}

export async function enqueueHealthCheck(siteId: string) {
  try { await getHealthQueue()?.add("check", { siteId }, { attempts: 2, backoff: { type: "fixed", delay: 5000 } }) }
  catch { /* Redis offline — skip */ }
}

export async function enqueueWebhook(data: WebhookJob) {
  try { await getWebhookQueue()?.add("process", data, { attempts: 3, backoff: { type: "exponential", delay: 1000 } }) }
  catch { /* skip */ }
}

export async function enqueueUsage(data: UsageJob) {
  try { await getUsageQueue()?.add("track", data, { attempts: 2 }) }
  catch { /* skip */ }
}

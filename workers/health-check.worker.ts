import { Worker } from "bullmq"
import Redis from "ioredis"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import type { HealthCheckJob } from "../src/lib/queue"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379")

const worker = new Worker<HealthCheckJob>(
  "health-check",
  async (job) => {
    const { siteId } = job.data
    const site = await prisma.site.findUnique({ where: { id: siteId } })
    if (!site) return

    const healthPaths = ["/api/kvl/health", "/health", "/api/health", "/"]
    let online = false

    for (const path of healthPaths) {
      try {
        const res = await fetch(`${site.apiUrl}${path}`, {
          headers: { "X-API-Key": site.apiKey, "X-KVL-Source": "kvl-central-healthcheck" },
          signal: AbortSignal.timeout(8000),
        })
        if (res.ok || res.status < 500) { online = true; break }
      } catch { /* try next path */ }
    }

    await prisma.site.update({
      where: { id: siteId },
      data: {
        status: online ? "connected" : "disconnected",
        lastChecked: new Date(),
      },
    })

    if (!online) {
      await prisma.notification.create({
        data: {
          title: `Site Down: ${site.name}`,
          message: `${site.url} is not responding`,
          type: "warning",
          read: false,
        },
      })
    }

    console.log(`[health] ${site.name} → ${online ? "online" : "OFFLINE"}`)
  },
  { connection: redis, concurrency: 20 }
)

worker.on("failed", (job, err) => console.error(`[health] job ${job?.id} failed:`, err.message))
console.log("✅ Health-check worker running (concurrency: 20)")

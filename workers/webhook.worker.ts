import { Worker } from "bullmq"
import Redis from "ioredis"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import type { WebhookJob } from "../src/lib/queue"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379")

const worker = new Worker<WebhookJob>(
  "webhook-processing",
  async (job) => {
    const { eventId, siteId, type, payload } = job.data

    // Update analytics if it's an order/visitor event
    if (type === "order.created") {
      const data = payload as { amount?: number }
      await prisma.analytics.create({
        data: {
          siteId,
          orders: 1,
          revenue: data.amount ?? 0,
          visitors: 0,
        },
      })
    } else if (type === "visitor.tracked") {
      await prisma.analytics.create({
        data: { siteId, visitors: 1, orders: 0, revenue: 0 },
      })
    }

    await prisma.webhookEvent.update({
      where: { id: eventId },
      data: { processed: true },
    })

    console.log(`[webhook] processed ${type} for site ${siteId}`)
  },
  { connection: redis, concurrency: 50 }
)

worker.on("failed", (job, err) => console.error(`[webhook] job ${job?.id} failed:`, err.message))
console.log("✅ Webhook worker running (concurrency: 50)")

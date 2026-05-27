import { Worker } from "bullmq"
import Redis from "ioredis"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import type { UsageJob } from "../src/lib/queue"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379")

const worker = new Worker<UsageJob>(
  "usage-tracking",
  async (job) => {
    const { siteId, requestCount, bandwidth } = job.data

    await prisma.usageLog.create({
      data: { siteId, requestCount, bandwidth },
    })

    // Check if site is over free plan limits (10K req/day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const usage = await prisma.usageLog.aggregate({
      where: { siteId, createdAt: { gte: today } },
      _sum: { requestCount: true },
    })

    const totalToday = usage._sum.requestCount ?? 0
    if (totalToday > 10_000) {
      const sub = await prisma.subscription.findFirst({ where: { siteId } })
      if (!sub || sub.plan === "free") {
        const site = await prisma.site.findUnique({ where: { id: siteId }, select: { name: true } })
        await prisma.notification.create({
          data: {
            title: `Usage Limit: ${site?.name}`,
            message: `Site exceeded 10K daily requests (${totalToday.toLocaleString()} today). Upgrade to Pro.`,
            type: "warning",
            read: false,
          },
        })
      }
    }

    console.log(`[usage] site ${siteId}: +${requestCount} req, +${bandwidth}KB`)
  },
  { connection: redis, concurrency: 30 }
)

worker.on("failed", (job, err) => console.error(`[usage] job ${job?.id} failed:`, err.message))
console.log("✅ Usage worker running (concurrency: 30)")

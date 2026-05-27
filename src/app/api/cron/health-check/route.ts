import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { enqueueHealthCheck } from "@/lib/queue"
import { checkSiteStatus } from "@/lib/site-bridge"
import { cacheInvalidate, CacheKeys } from "@/lib/cache"

// Called by cron or admin — checks all sites
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret")
  if (secret !== (process.env.CRON_SECRET ?? "kvl-cron-secret")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sites = await prisma.site.findMany({ select: { id: true } })

  // Try queue first; fall back to direct check if Redis offline
  let queued = 0
  let direct = 0

  for (const site of sites) {
    try {
      await enqueueHealthCheck(site.id)
      queued++
    } catch {
      // Queue unavailable — check directly (slower but works)
      const full = await prisma.site.findUnique({ where: { id: site.id } })
      if (full) {
        const result = await checkSiteStatus(full)
        await prisma.site.update({
          where: { id: site.id },
          data: { status: result.online ? "connected" : "disconnected", lastChecked: new Date() },
        })
        direct++
      }
    }
  }

  await cacheInvalidate(CacheKeys.multiSiteStats(), CacheKeys.dashboardStats())

  return NextResponse.json({ ok: true, total: sites.length, queued, direct })
}

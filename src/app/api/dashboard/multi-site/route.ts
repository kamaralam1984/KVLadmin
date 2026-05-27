import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [sites, analytics, subscriptions, usageLogs, webhookEvents] = await Promise.all([
    prisma.site.findMany({ select: { id: true, name: true, status: true, category: true, lastChecked: true } }),
    prisma.analytics.findMany(),
    prisma.subscription.findMany({ select: { siteId: true, plan: true, status: true } }),
    prisma.usageLog.findMany({ select: { siteId: true, requestCount: true, bandwidth: true } }),
    prisma.webhookEvent.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ])

  const totalSites = sites.length
  const onlineSites = sites.filter((s) => s.status === "connected").length
  const offlineSites = sites.filter((s) => s.status === "disconnected" || s.status === "error").length

  const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0)
  const totalVisitors = analytics.reduce((sum, a) => sum + a.visitors, 0)
  const totalOrders = analytics.reduce((sum, a) => sum + a.orders, 0)

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length

  const totalRequests = usageLogs.reduce((sum, u) => sum + u.requestCount, 0)
  const totalBandwidth = usageLogs.reduce((sum, u) => sum + u.bandwidth, 0)

  // Per-site revenue map
  const revenuePerSite = analytics.reduce<Record<string, number>>((acc, a) => {
    acc[a.siteId] = (acc[a.siteId] ?? 0) + a.revenue
    return acc
  }, {})

  const topSites = sites
    .map((s) => ({ ...s, revenue: revenuePerSite[s.id] ?? 0 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const alerts = sites
    .filter((s) => s.status === "disconnected" || s.status === "error")
    .map((s) => ({ id: s.id, name: s.name, status: s.status, lastChecked: s.lastChecked }))

  return NextResponse.json({
    overview: { totalSites, onlineSites, offlineSites, activeSubscriptions },
    revenue: { total: totalRevenue, visitors: totalVisitors, orders: totalOrders },
    usage: { requests: totalRequests, bandwidth: totalBandwidth },
    topSites,
    alerts,
    recentWebhooks: webhookEvents,
  })
}

import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [orders, users, notifications, leads, recentOrders] = await Promise.all([
    prisma.order.findMany(),
    prisma.adminUser.findMany({ select: { status: true } }),
    prisma.notification.findMany({ select: { read: true } }),
    prisma.lead.findMany({ select: { status: true, value: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ])

  const totalRevenue = orders
    .filter((o) => o.status === "delivered" || o.status === "shipped")
    .reduce((sum, o) => sum + o.amount, 0)

  return NextResponse.json({
    kpis: {
      totalRevenue,
      totalOrders: orders.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      activeProducts: 0,
      unreadNotifications: notifications.filter((n) => !n.read).length,
      openLeads: leads.filter((l) => l.status !== "closed").length,
      pipelineValue: leads.filter((l) => l.status !== "closed").reduce((s, l) => s + l.value, 0),
      growthRate: 32.6,
    },
    recentOrders,
  })
}

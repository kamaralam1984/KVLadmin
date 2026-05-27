import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkSiteStatus } from "@/lib/site-bridge"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, ctx: Ctx) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await ctx.params
  const site = await prisma.site.findUnique({ where: { id } })
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 })

  const result = await checkSiteStatus(site)
  const checkedAt = new Date()

  await prisma.site.update({
    where: { id },
    data: {
      status: result.online ? "connected" : "disconnected",
      lastChecked: checkedAt,
    },
  })

  return NextResponse.json({
    siteId: id,
    online: result.online,
    latencyMs: result.latencyMs,
    error: result.error,
    checkedAt: checkedAt.toISOString(),
  })
}

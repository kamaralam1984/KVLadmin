import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get("siteId")
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200)

  const events = await prisma.webhookEvent.findMany({
    where: siteId ? { siteId } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { site: { select: { name: true } } },
  })

  return NextResponse.json(events)
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await request.json()
  const event = await prisma.webhookEvent.update({
    where: { id },
    data: { processed: true },
  })

  return NextResponse.json(event)
}

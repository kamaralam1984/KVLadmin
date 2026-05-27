import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, ctx: Ctx) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  const site = await prisma.site.findUnique({ where: { id } })
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 })
  return NextResponse.json(site)
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const token = request.cookies.get("kvl_session")?.value
  const payload = token ? await verifyToken(token) : null
  if (!payload || !["super_admin", "admin"].includes(payload.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await ctx.params
  const { id: _id, createdAt: _c, ...updates } = await request.json()
  const site = await prisma.site.update({ where: { id }, data: updates })
  return NextResponse.json(site)
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const token = request.cookies.get("kvl_session")?.value
  const payload = token ? await verifyToken(token) : null
  if (!payload || payload.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden — only super_admin can delete sites" }, { status: 403 })
  }
  const { id } = await ctx.params
  await prisma.site.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

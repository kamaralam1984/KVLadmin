import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Ctx = { params: Promise<{ id: string }> }

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const token = request.cookies.get("kvl_session")?.value
  const payload = token ? await verifyToken(token) : null
  if (!payload || payload.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  await prisma.adminUser.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const token = request.cookies.get("kvl_session")?.value
  const payload = token ? await verifyToken(token) : null
  if (!payload || !["super_admin", "admin"].includes(payload.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { name, role, status } = await request.json()
  const user = await prisma.adminUser.update({
    where: { id },
    data: { ...(name && { name }), ...(role && { role }), ...(status && { status }) },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  })
  return NextResponse.json(user)
}

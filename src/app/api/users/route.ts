import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, status: true, lastLogin: true, createdAt: true },
  })

  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  const payload = token ? await verifyToken(token) : null
  if (!payload || payload.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { name, email, role, password } = await request.json()
  if (!name || !email || !role || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 })

  const user = await prisma.adminUser.create({
    data: { name, email, role, passwordHash: password, status: "active" },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  })

  return NextResponse.json(user, { status: 201 })
}

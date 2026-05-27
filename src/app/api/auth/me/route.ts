import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const payload = await verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })

  const user = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true, status: true, lastLogin: true },
  })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  return NextResponse.json(user)
}

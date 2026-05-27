import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { customer, product, amount, status } = await request.json()

  const order = await prisma.order.create({
    data: { customer, product, amount, status: status ?? "pending" },
  })

  return NextResponse.json(order, { status: 201 })
}

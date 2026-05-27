import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"
import type { Product } from "@/types"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const products = category
    ? db.products.filter((p) => p.category === category)
    : db.products

  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  const payload = token ? await verifyToken(token) : null
  if (!payload || !["super_admin", "admin"].includes(payload.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json() as Omit<Product, "id">

  const newProduct: Product = {
    ...body,
    id: crypto.randomUUID(),
  }

  db.products.push(newProduct)
  return NextResponse.json(newProduct, { status: 201 })
}

import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const sites = await prisma.site.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(sites)
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  const payload = token ? await verifyToken(token) : null
  if (!payload || !["super_admin", "admin"].includes(payload.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { name, url, apiUrl, apiKey, category, description } = body

  if (!name || !url || !apiUrl || !apiKey) {
    return NextResponse.json({ error: "name, url, apiUrl, apiKey are required" }, { status: 400 })
  }

  const existing = await prisma.site.findUnique({ where: { url: url.replace(/\/$/, "") } })
  if (existing) {
    return NextResponse.json({ error: "A site with this URL already exists" }, { status: 409 })
  }

  const site = await prisma.site.create({
    data: {
      name,
      url: url.replace(/\/$/, ""),
      apiUrl: apiUrl.replace(/\/$/, ""),
      apiKey,
      status: "pending",
      category: category ?? "General",
      description: description ?? "",
    },
  })

  return NextResponse.json(site, { status: 201 })
}

import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { bridgeFetch } from "@/lib/site-bridge"

type Ctx = { params: Promise<{ id: string }> }

async function handle(request: NextRequest, ctx: Ctx) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await ctx.params
  const site = await prisma.site.findUnique({ where: { id } })
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path") ?? "/"

  let body: string | undefined
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = JSON.stringify(await request.json())
    } catch {
      body = undefined
    }
  }

  const result = await bridgeFetch(site, path, { method: request.method, body })

  return NextResponse.json(
    { ok: result.ok, status: result.status, data: result.data, error: result.error, latencyMs: result.latencyMs },
    { status: result.ok ? 200 : result.status || 502 }
  )
}

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle

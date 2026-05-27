import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { enqueueWebhook, enqueueUsage } from "@/lib/queue"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key") ?? request.headers.get("x-kvl-api-key")
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 })

  const site = await prisma.site.findFirst({ where: { apiKey } })
  if (!site) return NextResponse.json({ error: "Invalid API key" }, { status: 403 })

  // Rate limit check
  const sub = await prisma.subscription.findFirst({ where: { siteId: site.id } })
  const rl = await checkRateLimit(site.id, sub?.plan ?? "free")
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", limit: rl.limit, plan: sub?.plan ?? "free" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": "0",
          "Retry-After": "60",
        },
      }
    )
  }

  const body = await request.json()
  const { type, payload } = body as { type?: string; payload?: unknown }

  if (!type) return NextResponse.json({ error: "Missing event type" }, { status: 400 })

  const event = await prisma.webhookEvent.create({
    data: { siteId: site.id, type, payload: payload ?? {} },
  })

  // Queue async processing
  await enqueueWebhook({ siteId: site.id, type, payload, eventId: event.id })

  // Track usage
  const contentLength = parseInt(request.headers.get("content-length") ?? "0")
  await enqueueUsage({ siteId: site.id, requestCount: 1, bandwidth: contentLength / 1024 })

  return NextResponse.json(
    { ok: true, eventId: event.id },
    {
      headers: {
        "X-RateLimit-Limit": String(rl.limit),
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    }
  )
}

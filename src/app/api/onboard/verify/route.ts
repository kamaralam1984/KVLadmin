import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/email"

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  const segment = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  return `kvl_${segment(8)}_${segment(12)}_${segment(8)}`
}

function generateSubdomain(siteUrl: string): string {
  const host = new URL(siteUrl).hostname.replace(/^www\./, "")
  const base = host.split(".")[0].toLowerCase().replace(/[^a-z0-9]/g, "")
  return base.slice(0, 20) || "site"
}

async function uniqueSubdomain(base: string): Promise<string> {
  let candidate = base
  let i = 1
  while (await prisma.site.findUnique({ where: { subdomain: candidate } })) {
    candidate = `${base}${i++}`
  }
  return candidate
}

export async function POST(request: NextRequest) {
  const { sessionId, otp } = await request.json()

  if (!sessionId || !otp) {
    return NextResponse.json({ error: "Session ID and OTP are required" }, { status: 400 })
  }

  const session = await prisma.otpSession.findUnique({ where: { id: sessionId } })

  if (!session) return NextResponse.json({ error: "Invalid session" }, { status: 400 })
  if (session.verified) return NextResponse.json({ error: "Session already used" }, { status: 400 })
  if (session.otp !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
  if (new Date() > session.expiresAt) return NextResponse.json({ error: "OTP expired" }, { status: 400 })

  await prisma.otpSession.update({ where: { id: sessionId }, data: { verified: true } })

  const siteUrl = session.siteUrl!
  const siteName = new URL(siteUrl).hostname
  const apiKey = generateApiKey()
  const subdomain = await uniqueSubdomain(generateSubdomain(siteUrl))

  const existing = await prisma.site.findUnique({ where: { url: siteUrl } })

  let site
  if (existing) {
    site = await prisma.site.update({
      where: { id: existing.id },
      data: { apiKey, subdomain, ownerEmail: session.email, status: "pending" },
    })
  } else {
    site = await prisma.site.create({
      data: {
        name: siteName,
        url: siteUrl,
        subdomain,
        apiUrl: `${siteUrl}/api`,
        apiKey,
        ownerEmail: session.email,
        status: "pending",
        category: "General",
        description: "",
      },
    })
  }

  await prisma.subscription.create({
    data: { siteId: site.id, plan: "free", status: "active" },
  })

  await sendWelcomeEmail(session.email, siteName, apiKey, subdomain)

  return NextResponse.json({
    success: true,
    site: { id: site.id, name: siteName, subdomain, apiKey },
    dashboardUrl: `https://${subdomain}.kvl-central.com`,
    installInstructions: {
      npm: "npm install @kvl/connect",
      usage: `import { KVLConnect } from '@kvl/connect'\nKVLConnect({ apiKey: '${apiKey}' })`,
    },
  })
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOtpEmail } from "@/lib/email"

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  const { siteUrl, email } = await request.json()

  if (!siteUrl || !email) {
    return NextResponse.json({ error: "Site URL and email are required" }, { status: 400 })
  }

  const urlPattern = /^https?:\/\/.+\..+/
  if (!urlPattern.test(siteUrl)) {
    return NextResponse.json({ error: "Invalid site URL" }, { status: 400 })
  }

  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const session = await prisma.otpSession.create({
    data: { email, otp, siteUrl, expiresAt },
  })

  const siteName = new URL(siteUrl).hostname
  await sendOtpEmail(email, otp, siteName)

  return NextResponse.json({
    sessionId: session.id,
    message: "OTP sent to your email",
    _devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
  })
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOtpEmail } from "@/lib/email"

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }

  const user = await prisma.adminUser.findUnique({ where: { email } })
  if (!user || user.passwordHash !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  if (user.status !== "active") {
    return NextResponse.json({ error: "Account is suspended or inactive" }, { status: 403 })
  }

  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  const session = await prisma.otpSession.create({
    data: { email, otp, expiresAt },
  })

  await sendOtpEmail(email, otp)

  return NextResponse.json({
    sessionId: session.id,
    message: "OTP sent to your email",
    _devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
  })
}

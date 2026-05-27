import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { sessionId, otp } = await request.json()

  if (!sessionId || !otp) {
    return NextResponse.json({ error: "Session ID and OTP are required" }, { status: 400 })
  }

  const session = await prisma.otpSession.findUnique({ where: { id: sessionId } })
  if (!session || session.verified) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
  }

  if (new Date() > session.expiresAt) {
    await prisma.otpSession.delete({ where: { id: sessionId } })
    return NextResponse.json({ error: "OTP has expired" }, { status: 401 })
  }

  if (session.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 })
  }

  await prisma.otpSession.update({ where: { id: sessionId }, data: { verified: true } })

  const user = await prisma.adminUser.findUnique({ where: { email: session.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLogin: new Date() } })

  const token = await signToken({ sub: user.id, email: user.email, role: user.role, name: user.name })

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
  })

  response.cookies.set("kvl_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  })

  return response
}

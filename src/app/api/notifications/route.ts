import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(db.notifications)
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("kvl_session")?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json() as { id?: string; markAllRead?: boolean }

  if (body.markAllRead) {
    db.notifications.forEach((n) => { n.read = true })
  } else if (body.id) {
    const n = db.notifications.find((n) => n.id === body.id)
    if (!n) return NextResponse.json({ error: "Not found" }, { status: 404 })
    n.read = true
  }

  return NextResponse.json({ success: true })
}

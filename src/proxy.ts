import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = [
  "/auth/login",
  "/api/auth/login",
  "/api/auth/verify-otp",
  "/onboard",
  "/api/onboard",
  "/api/tenant",
]

const MAIN_DOMAINS = ["localhost", "kvl-central.com", "www.kvl-central.com"]

function getSubdomain(hostname: string): string | null {
  // localhost:3000 → no subdomain
  if (hostname.startsWith("localhost") || hostname.startsWith("127.0.0.1")) return null

  // subdomain.kvl-central.com → subdomain
  if (hostname.endsWith(".kvl-central.com")) {
    const sub = hostname.replace(".kvl-central.com", "")
    return sub && !MAIN_DOMAINS.includes(sub) ? sub : null
  }

  // Custom domain: shop.com → treat as tenant by customDomain lookup
  if (!MAIN_DOMAINS.includes(hostname)) {
    return `__custom__${hostname}`
  }

  return null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") ?? "localhost"

  const isStatic = pathname.startsWith("/_next") || pathname.startsWith("/favicon")
  if (isStatic) return NextResponse.next()

  // ── Subdomain / tenant detection ──────────────────────────────────
  const subdomain = getSubdomain(hostname.split(":")[0])

  if (subdomain) {
    // Inject tenant info into headers for server components / API routes
    const res = NextResponse.next()
    res.headers.set("x-kvl-tenant", subdomain)
    res.headers.set("x-kvl-host", hostname)

    // Public API routes for tenant panel (health, onboard etc.)
    if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/onboard")) {
      return res
    }

    // Tenant dashboard: redirect unauthenticated to login, pass tenant header
    const token = request.cookies.get("kvl_session")?.value
    if (!token && !pathname.startsWith("/auth/login")) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
    return res
  }

  // ── Main admin panel (no subdomain) ───────────────────────────────
  const isApiRoute = pathname.startsWith("/api/")
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const token = request.cookies.get("kvl_session")?.value

  if (!isPublic && !token) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (isPublic && token && pathname === "/auth/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}

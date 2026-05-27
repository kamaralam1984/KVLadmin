import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Resolves x-kvl-tenant header → site record
// Called by client components to get tenant context
export async function GET(request: NextRequest) {
  const tenantHeader = request.headers.get("x-kvl-tenant")
  if (!tenantHeader) {
    return NextResponse.json({ tenant: null })
  }

  let site = null

  if (tenantHeader.startsWith("__custom__")) {
    const customDomain = tenantHeader.replace("__custom__", "")
    site = await prisma.site.findUnique({ where: { customDomain } })
  } else {
    site = await prisma.site.findUnique({ where: { subdomain: tenantHeader } })
  }

  if (!site) return NextResponse.json({ tenant: null })

  return NextResponse.json({
    tenant: {
      id: site.id,
      name: site.name,
      subdomain: site.subdomain,
      customDomain: site.customDomain,
      apiKey: site.apiKey,
      status: site.status,
      category: site.category,
    },
  })
}

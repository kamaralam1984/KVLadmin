"use client"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link href="/dashboard" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>
        <Home size={14} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: i === items.length - 1 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)" }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}

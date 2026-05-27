"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (page <= 4) return i + 1
    if (page >= totalPages - 3) return totalPages - 6 + i
    return page - 3 + i
  })

  const btn = (content: React.ReactNode, p: number, active = false, disabled = false) => (
    <button
      key={String(content)}
      onClick={() => !disabled && onPageChange(p)}
      disabled={disabled}
      className="w-9 h-9 rounded-xl text-sm font-medium transition-all flex items-center justify-center"
      style={{
        background: active ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
        color: active ? "#818cf8" : disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
        border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {content}
    </button>
  )

  return (
    <div className="flex items-center justify-center gap-1.5">
      {btn(<ChevronLeft size={14} />, page - 1, false, page === 1)}
      {pages.map((p) => btn(p, p, p === page))}
      {btn(<ChevronRight size={14} />, page + 1, false, page === totalPages)}
    </div>
  )
}

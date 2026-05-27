"use client"
import { useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full ${widths[size]} rounded-2xl p-6`}
        style={{ background: "#0f0f14", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: "rgba(255,255,255,0.4)" }}>
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

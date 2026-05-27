"use client"
import Link from "next/link"
import { ShieldOff, ArrowLeft } from "lucide-react"

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#09090b" }}>
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ef4444, transparent)" }}
      />
      <div className="text-center relative z-10">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <ShieldOff size={36} style={{ color: "#ef4444" }} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
          You don&apos;t have permission to view this page.<br />Contact your administrator for access.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

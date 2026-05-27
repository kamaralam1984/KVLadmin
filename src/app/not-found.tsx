import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#09090b" }}
    >
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
      />
      <div className="text-center relative z-10">
        <div className="text-8xl font-black mb-4" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <Home size={16} /> Go to Dashboard
          </Link>
          <Link
            href="javascript:history.back()"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            <ArrowLeft size={16} /> Go Back
          </Link>
        </div>
      </div>
    </div>
  )
}

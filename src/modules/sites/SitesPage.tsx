"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSite } from "@/contexts/SiteContext"
import { api } from "@/lib/api"
import type { Site } from "@/types"
import {
  Globe, Plus, Trash2, RefreshCw, ExternalLink, Settings,
  CheckCircle, XCircle, Clock, AlertCircle, Zap, Copy, Eye, EyeOff, X
} from "lucide-react"

const statusBadge: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  connected: { label: "Connected", color: "#22c55e", icon: <CheckCircle size={13} /> },
  disconnected: { label: "Offline", color: "#ef4444", icon: <XCircle size={13} /> },
  error: { label: "Error", color: "#f59e0b", icon: <AlertCircle size={13} /> },
  pending: { label: "Pending", color: "#6366f1", icon: <Clock size={13} /> },
}

function AddSiteModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ name: "", url: "", apiUrl: "", apiKey: "", category: "General", description: "" })
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    let url = form.url.trim()
    if (!url.startsWith("http")) url = `https://${url}`
    let apiUrl = form.apiUrl.trim()
    if (!apiUrl) apiUrl = `${url}/api`
    else if (!apiUrl.startsWith("http")) apiUrl = `https://${apiUrl}`

    const res = await api.post<Site>("/api/sites", { ...form, url, apiUrl })
    setLoading(false)
    if (res.error) { setError(res.error); return }
    onAdded()
    onClose()
  }

  const field = (key: keyof typeof form, label: string, placeholder: string, type = "text") => (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</label>
      <input
        type={key === "apiKey" ? (showKey ? "text" : "password") : type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white placeholder:text-white/25"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#0f0f14", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <Globe size={16} className="text-white" />
            </div>
            <h2 className="font-semibold text-white text-lg">Connect New Website</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }}><X size={18} /></button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-sm" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {field("name", "Website Name *", "8rupiya.in")}
          {field("url", "Website URL *", "https://8rupiya.in or 8rupiya.in")}
          {field("apiUrl", "Backend API URL", "https://8rupiya.in/api  (auto-filled if empty)")}

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>API Key *</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <input
                type={showKey ? "text" : "password"}
                value={form.apiKey}
                onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                placeholder="Your site's secret API key"
                className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/25"
              />
              <button type="button" onClick={() => setShowKey(!showKey)} style={{ color: "rgba(255,255,255,0.35)" }}>
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {["General", "E-Commerce", "Blog", "SaaS", "Portfolio", "News"].map((c) => (
                  <option key={c} value={c} style={{ background: "#0f0f14" }}>{c}</option>
                ))}
              </select>
            </div>
            {field("description", "Description", "Brief description")}
          </div>

          <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", color: "rgba(255,255,255,0.5)" }}>
            <p className="font-medium mb-1" style={{ color: "#818cf8" }}>Setup Guide</p>
            Install the KVL Connect endpoint on your site&#39;s backend. It accepts requests with the header <code className="px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>X-API-Key</code> for authentication.
          </div>

          <button
            type="submit"
            disabled={loading || !form.name || !form.url || !form.apiKey}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            {loading ? "Connecting..." : "Connect Website"}
          </button>
        </form>
      </div>
    </div>
  )
}

export function SitesPage() {
  const { sites, activeSite, setActiveSite, refreshSites } = useSite()
  const [showAdd, setShowAdd] = useState(false)
  const [checking, setChecking] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const checkStatus = async (site: Site) => {
    setChecking(site.id)
    await api.get(`/api/sites/${site.id}/status`)
    await refreshSites()
    setChecking(null)
  }

  const deleteSite = async (site: Site) => {
    if (!confirm(`Remove "${site.name}" from this admin panel?`)) return
    setDeleting(site.id)
    await api.delete(`/api/sites/${site.id}`)
    await refreshSites()
    if (activeSite?.id === site.id) setActiveSite(null)
    setDeleting(null)
  }

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Connected Websites</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            Manage and control all your websites from one place
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          <Plus size={16} /> Add Website
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Sites", value: sites.length, color: "#6366f1" },
          { label: "Connected", value: sites.filter((s) => s.status === "connected").length, color: "#22c55e" },
          { label: "Offline", value: sites.filter((s) => s.status === "disconnected").length, color: "#ef4444" },
          { label: "Pending", value: sites.filter((s) => s.status === "pending").length, color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Site Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sites.map((site) => {
          const badge = statusBadge[site.status] ?? statusBadge.pending
          const isActive = activeSite?.id === site.id
          return (
            <div
              key={site.id}
              className="glass-card rounded-2xl p-5 flex flex-col gap-4 transition-all"
              style={{
                border: isActive ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.06)",
                boxShadow: isActive ? "0 0 20px rgba(99,102,241,0.15)" : "none",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                  >
                    {site.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{site.name}</p>
                    <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {site.url.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium shrink-0"
                  style={{ background: `${badge.color}18`, color: badge.color }}
                >
                  {badge.icon}
                  {badge.label}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>Category</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
                    {site.category ?? "General"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>API URL</span>
                  <span className="truncate max-w-[160px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {site.apiUrl.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>API Key</span>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>••••••••</span>
                    <button onClick={() => copyApiKey(site.apiKey)} style={{ color: "rgba(255,255,255,0.3)" }}>
                      <Copy size={11} />
                    </button>
                  </div>
                </div>
                {site.lastChecked && (
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>Last Checked</span>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>
                      {new Date(site.lastChecked).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => { setActiveSite(site); router.push(`/sites/${site.id}`) }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: isActive ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)", color: "#818cf8" }}
                >
                  <Zap size={13} />
                  {isActive ? "Active Panel" : "Open Panel"}
                </button>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => checkStatus(site)}
                  disabled={checking === site.id}
                  className="p-2 rounded-xl transition-colors disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
                  title="Check connection"
                >
                  <RefreshCw size={14} className={checking === site.id ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => router.push(`/sites/${site.id}?tab=settings`)}
                  className="p-2 rounded-xl transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
                  title="Settings"
                >
                  <Settings size={14} />
                </button>
                <button
                  onClick={() => deleteSite(site)}
                  disabled={deleting === site.id}
                  className="p-2 rounded-xl transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  style={{ color: "rgba(239,68,68,0.6)" }}
                  title="Remove site"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {/* Add Site Card */}
        <button
          onClick={() => setShowAdd(true)}
          className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all hover:opacity-80"
          style={{ border: "2px dashed rgba(99,102,241,0.25)", color: "rgba(255,255,255,0.3)" }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)" }}>
            <Plus size={22} style={{ color: "#6366f1" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Connect a Website</p>
          <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
            Add any website URL to<br />control it from here
          </p>
        </button>
      </div>

      {showAdd && <AddSiteModal onClose={() => setShowAdd(false)} onAdded={refreshSites} />}
    </div>
  )
}

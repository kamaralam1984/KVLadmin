"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { Site } from "@/types"
import {
  Globe, RefreshCw, ExternalLink, ArrowLeft, Terminal,
  CheckCircle, XCircle, AlertCircle, Clock, Send, Trash2,
  ChevronDown, Zap, Settings, Activity
} from "lucide-react"

const statusBadge: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  connected: { label: "Connected", color: "#22c55e", icon: <CheckCircle size={13} /> },
  disconnected: { label: "Offline", color: "#ef4444", icon: <XCircle size={13} /> },
  error: { label: "Error", color: "#f59e0b", icon: <AlertCircle size={13} /> },
  pending: { label: "Pending", color: "#6366f1", icon: <Clock size={13} /> },
}

interface ProxyLog {
  id: string
  method: string
  path: string
  status: number
  latencyMs?: number
  ok: boolean
  response?: unknown
  timestamp: string
}

function ApiConsole({ siteId }: { siteId: string }) {
  const [method, setMethod] = useState("GET")
  const [path, setPath] = useState("/")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<ProxyLog[]>([])

  const sendRequest = async () => {
    setLoading(true)
    const url = `/api/sites/${siteId}/proxy?path=${encodeURIComponent(path)}`
    const res = await api[method.toLowerCase() as "get" | "post" | "put" | "patch" | "delete"](
      url,
      method !== "GET" ? (body ? JSON.parse(body) : {}) : undefined as unknown as unknown
    )
    setLoading(false)

    const log: ProxyLog = {
      id: crypto.randomUUID(),
      method,
      path,
      status: (res.data as { status?: number })?.status ?? (res.error ? 0 : 200),
      latencyMs: (res.data as { latencyMs?: number })?.latencyMs,
      ok: !res.error && (res.data as { ok?: boolean })?.ok !== false,
      response: res.data,
      timestamp: new Date().toISOString(),
    }
    setLogs((prev) => [log, ...prev.slice(0, 19)])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Terminal size={16} style={{ color: "#6366f1" }} />
        <h3 className="font-semibold text-white">API Console</h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
          Live Proxy
        </span>
      </div>

      <div className="flex gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm font-mono font-semibold outline-none"
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#818cf8",
            minWidth: "80px",
          }}
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
            <option key={m} value={m} style={{ background: "#0f0f14" }}>{m}</option>
          ))}
        </select>
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/api/products"
          className="flex-1 px-3 py-2 rounded-xl text-sm font-mono outline-none text-white placeholder:text-white/25"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          onKeyDown={(e) => e.key === "Enter" && sendRequest()}
        />
        <button
          onClick={sendRequest}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
          Send
        </button>
      </div>

      {method !== "GET" && (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='{"key": "value"}'
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-sm font-mono outline-none text-white placeholder:text-white/25 resize-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      )}

      {/* Request Logs */}
      {logs.length > 0 && (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="rounded-xl p-3 font-mono text-xs" style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${log.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold" style={{ color: log.ok ? "#22c55e" : "#ef4444" }}>
                  {log.method}
                </span>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{log.path}</span>
                <span className="ml-auto" style={{ color: log.ok ? "#22c55e" : "#ef4444" }}>
                  {log.status}
                </span>
                {log.latencyMs !== undefined && (
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{log.latencyMs}ms</span>
                )}
              </div>
              <pre className="overflow-x-auto text-xs" style={{ color: "rgba(255,255,255,0.5)", maxHeight: "120px" }}>
                {JSON.stringify(log.response, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SettingsPanel({ site, siteId, onUpdated }: { site: Site; siteId: string; onUpdated: () => void }) {
  const [form, setForm] = useState({
    name: site.name,
    url: site.url,
    apiUrl: site.apiUrl,
    apiKey: site.apiKey,
    category: site.category ?? "General",
    description: site.description ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    await api.put(`/api/sites/${siteId}`, form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onUpdated()
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <Settings size={16} style={{ color: "#6366f1" }} /> Connection Settings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["name", "url", "apiUrl", "apiKey", "category", "description"] as const).map((key) => (
          <div key={key} className={key === "description" ? "sm:col-span-2" : ""}>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={key === "apiKey" ? "password" : "text"}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: saved ? "rgba(34,197,94,0.2)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: saved ? "#22c55e" : "white" }}
      >
        {saved ? <><CheckCircle size={14} /> Saved!</> : saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  )
}

interface StatusResult {
  online: boolean
  latencyMs: number
  error?: string
  checkedAt?: string
}

export function SiteDetailPage({ siteId, initialTab = "overview" }: { siteId: string; initialTab?: string }) {
  const [site, setSite] = useState<Site | null>(null)
  const [tab, setTab] = useState(initialTab)
  const [checking, setChecking] = useState(false)
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null)
  const router = useRouter()

  const load = useCallback(async () => {
    const res = await api.get<Site>(`/api/sites/${siteId}`)
    if (res.data) setSite(res.data)
  }, [siteId])

  useEffect(() => { load() }, [load])

  const checkStatus = async () => {
    setChecking(true)
    const res = await api.get<StatusResult>(`/api/sites/${siteId}/status`)
    if (res.data) setStatusResult(res.data)
    await load()
    setChecking(false)
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin" style={{ color: "#6366f1" }} />
      </div>
    )
  }

  const badge = statusBadge[site.status] ?? statusBadge.pending

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={14} /> },
    { id: "console", label: "API Console", icon: <Terminal size={14} /> },
    { id: "settings", label: "Settings", icon: <Settings size={14} /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/sites")}
          className="p-2 rounded-xl transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
            style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
          >
            {site.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{site.name}</h1>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{site.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: `${badge.color}18`, color: badge.color }}
          >
            {badge.icon} {badge.label}
          </div>
          <button
            onClick={checkStatus}
            disabled={checking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
          >
            <RefreshCw size={12} className={checking ? "animate-spin" : ""} />
            {checking ? "Checking..." : "Test Connection"}
          </button>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
          >
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Connection result */}
      {statusResult && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: statusResult.online ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${statusResult.online ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          {statusResult.online ? <CheckCircle size={15} style={{ color: "#22c55e" }} /> : <XCircle size={15} style={{ color: "#ef4444" }} />}
          <span style={{ color: statusResult.online ? "#22c55e" : "#f87171" }}>
            {statusResult.online ? `Site is online · ${statusResult.latencyMs}ms response time` : `Site is unreachable · ${statusResult.error ?? "Unknown error"}`}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? "rgba(99,102,241,0.2)" : "transparent",
              color: tab === t.id ? "#818cf8" : "rgba(255,255,255,0.4)",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card rounded-2xl p-5">
        {tab === "overview" && (
          <div className="space-y-5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Globe size={16} style={{ color: "#6366f1" }} /> Site Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Website URL", value: site.url },
                { label: "API Endpoint", value: site.apiUrl },
                { label: "Category", value: site.category ?? "General" },
                { label: "Status", value: badge.label },
                { label: "Connected Since", value: site.createdAt },
                { label: "Last Health Check", value: site.lastChecked ? new Date(site.lastChecked).toLocaleString() : "Never" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}</p>
                  <p className="text-sm text-white font-medium truncate">{item.value}</p>
                </div>
              ))}
            </div>
            {site.description && (
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Description</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{site.description}</p>
              </div>
            )}

            {/* Quick API shortcuts */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>QUICK API CALLS</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["/", "/api/health", "/api/products", "/api/users", "/api/orders", "/api/stats"].map((p) => (
                  <button
                    key={p}
                    onClick={() => { setTab("console") }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-colors text-left"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                  >
                    <Zap size={11} style={{ color: "#6366f1" }} /> {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "console" && <ApiConsole siteId={siteId} />}
        {tab === "settings" && <SettingsPanel site={site} siteId={siteId} onUpdated={load} />}
      </div>
    </div>
  )
}

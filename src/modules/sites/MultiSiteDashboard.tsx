"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Globe, Wifi, WifiOff, DollarSign, Users, ShoppingCart,
  Activity, AlertTriangle, Webhook, TrendingUp, Zap, CheckCircle,
} from "lucide-react";

interface MultiSiteStats {
  overview: { totalSites: number; onlineSites: number; offlineSites: number; activeSubscriptions: number };
  revenue: { total: number; visitors: number; orders: number };
  usage: { requests: number; bandwidth: number };
  topSites: { id: string; name: string; status: string; category: string; revenue: number }[];
  alerts: { id: string; name: string; status: string; lastChecked: string | null }[];
  recentWebhooks: { id: string; type: string; processed: boolean; createdAt: string; site?: { name: string } }[];
}

const STATUS_COLOR: Record<string, string> = {
  connected: "#22c55e",
  pending: "#f59e0b",
  disconnected: "#ef4444",
  error: "#ef4444",
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function MultiSiteDashboard() {
  const [stats, setStats] = useState<MultiSiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<MultiSiteStats>("/api/dashboard/multi-site").then((res) => {
      if (res.data) setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 h-28 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const kpis = [
    { label: "Total Sites", value: stats.overview.totalSites, Icon: Globe, color: "#6366f1" },
    { label: "Online", value: stats.overview.onlineSites, Icon: Wifi, color: "#22c55e" },
    { label: "Offline", value: stats.overview.offlineSites, Icon: WifiOff, color: "#ef4444" },
    { label: "Active Plans", value: stats.overview.activeSubscriptions, Icon: Zap, color: "#f59e0b" },
    { label: "Total Revenue", value: `$${fmt(stats.revenue.total)}`, Icon: DollarSign, color: "#10b981" },
    { label: "Visitors", value: fmt(stats.revenue.visitors), Icon: Users, color: "#06b6d4" },
    { label: "Orders", value: fmt(stats.revenue.orders), Icon: ShoppingCart, color: "#8b5cf6" },
    { label: "API Requests", value: fmt(stats.usage.requests), Icon: Activity, color: "#f97316" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(({ label, value, Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ background: `${color}22` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Top Sites by Revenue */}
        <div className="md:col-span-2 glass-card rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: "#6366f1" }} />
            <h3 className="font-semibold text-white text-sm">Top Sites by Revenue</h3>
          </div>
          {stats.topSites.length === 0 ? (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>No analytics data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.topSites.map((site, i) => (
                <div key={site.id} className="flex items-center gap-3">
                  <span className="text-xs w-4" style={{ color: "rgba(255,255,255,0.3)" }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white truncate">{site.name}</span>
                      <span className="text-xs font-semibold" style={{ color: "#10b981" }}>${fmt(site.revenue)}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${stats.topSites[0].revenue > 0 ? (site.revenue / stats.topSites[0].revenue) * 100 : 0}%`,
                          background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLOR[site.status] ?? "#6b7280" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="glass-card rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
            <h3 className="font-semibold text-white text-sm">Alerts</h3>
            {stats.alerts.length > 0 && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#ef444422", color: "#ef4444" }}>
                {stats.alerts.length}
              </span>
            )}
          </div>
          {stats.alerts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <CheckCircle size={28} style={{ color: "#22c55e" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>All sites online</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.alerts.map((a) => (
                <div key={a.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: "#ef444410" }}>
                  <WifiOff size={13} style={{ color: "#ef4444" }} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{a.name}</p>
                    <p className="text-xs capitalize" style={{ color: "#ef4444" }}>{a.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Webhooks */}
      <div className="glass-card rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Webhook size={16} style={{ color: "#06b6d4" }} />
          <h3 className="font-semibold text-white text-sm">Recent Webhook Events</h3>
        </div>
        {stats.recentWebhooks.length === 0 ? (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>No webhook events yet</p>
        ) : (
          <div className="space-y-2">
            {stats.recentWebhooks.map((w) => (
              <div key={w.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: w.processed ? "#22c55e" : "#f59e0b" }} />
                <span className="text-xs font-medium text-white flex-1">{w.type}</span>
                {w.site && <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{w.site.name}</span>}
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {new Date(w.createdAt).toLocaleTimeString()}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: w.processed ? "#22c55e22" : "#f59e0b22", color: w.processed ? "#22c55e" : "#f59e0b" }}>
                  {w.processed ? "done" : "pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

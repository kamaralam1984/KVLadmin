"use client";

import { RevenueChart } from "@/components/charts/RevenueChart";
import { UserGrowthChart } from "@/components/charts/UserGrowthChart";
import { SalesPieChart } from "@/components/charts/SalesPieChart";
import { BarChart3, TrendingUp, Eye, MousePointer } from "lucide-react";

const topPages = [
  { page: "/dashboard", views: 12450, bounce: "24%", avg: "4m 32s" },
  { page: "/products", views: 8921, bounce: "31%", avg: "3m 18s" },
  { page: "/crm", views: 6234, bounce: "28%", avg: "5m 02s" },
  { page: "/analytics", views: 5102, bounce: "19%", avg: "6m 45s" },
  { page: "/users", views: 4389, bounce: "35%", avg: "2m 55s" },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Deep insights across your entire platform
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Page Views", value: "284K", change: "+18%", icon: Eye, color: "#6366f1" },
          { label: "Unique Visitors", value: "48.2K", change: "+12%", icon: BarChart3, color: "#22d3ee" },
          { label: "Avg. Session", value: "4m 22s", change: "+8%", icon: TrendingUp, color: "#22c55e" },
          { label: "Click-Through", value: "6.8%", change: "+2.1%", icon: MousePointer, color: "#f59e0b" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} style={{ color: item.color }} />
                <span className="text-xs font-medium" style={{ color: "#22c55e" }}>{item.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <SalesPieChart />
      </div>

      <UserGrowthChart />

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="font-semibold text-white">Top Pages</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Page", "Views", "Bounce Rate", "Avg. Time"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topPages.map((row, i) => (
                <tr
                  key={row.page}
                  className="hover:bg-white/2 transition-colors"
                  style={{ borderBottom: i < topPages.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-mono" style={{ color: "#818cf8" }}>{row.page}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <span className="text-sm font-medium text-white">{row.views.toLocaleString()}</span>
                      <div className="w-24 h-1 rounded-full mt-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-1 rounded-full"
                          style={{ width: `${(row.views / 12450) * 100}%`, background: "#6366f1" }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{row.bounce}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{row.avg}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

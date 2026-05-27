"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/common/StatsCard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { UserGrowthChart } from "@/components/charts/UserGrowthChart";
import { SalesPieChart } from "@/components/charts/SalesPieChart";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/types";
import {
  DollarSign, Users, ShoppingCart, TrendingUp,
  Activity, Cpu, Brain, AlertTriangle, CheckCircle, Info
} from "lucide-react";

interface DashboardStats {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    activeUsers: number;
    activeProducts: number;
    unreadNotifications: number;
    openLeads: number;
    pipelineValue: number;
    growthRate: number;
  };
  recentOrders: Order[];
}

const aiInsights = [
  { text: "Revenue is trending 23% above forecast — Q3 target likely to be met 2 weeks early.", type: "success" },
  { text: "User churn risk detected for 142 accounts inactive for 14+ days.", type: "warning" },
  { text: "Top performing channel: Organic Search (41% of new signups this week).", type: "info" },
  { text: "Recommend increasing inventory for KVL ERP Suite — stock velocity up 35%.", type: "info" },
];

const typeIcon = (type: string) => {
  if (type === "success") return <CheckCircle size={15} style={{ color: "#22c55e" }} />;
  if (type === "warning") return <AlertTriangle size={15} style={{ color: "#f59e0b" }} />;
  return <Info size={15} style={{ color: "#6366f1" }} />;
};

const statusColor: Record<string, string> = {
  delivered: "#22c55e", shipped: "#06b6d4", processing: "#f59e0b", pending: "#8b5cf6", cancelled: "#ef4444",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardStats>("/api/dashboard/stats").then((res) => {
      if (res.data) setStats(res.data);
      setLoading(false);
    });
  }, []);

  const kpis = stats
    ? [
        {
          title: "Total Revenue",
          value: `$${(stats.kpis.totalRevenue / 1000).toFixed(1)}K`,
          change: 23.5,
          changeLabel: "vs last month",
          Icon: DollarSign,
          gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          delay: 0,
        },
        {
          title: "Active Users",
          value: stats.kpis.activeUsers.toLocaleString(),
          change: 12.8,
          changeLabel: "vs last month",
          Icon: Users,
          gradient: "linear-gradient(135deg,#06b6d4,#0891b2)",
          delay: 50,
        },
        {
          title: "Total Orders",
          value: stats.kpis.totalOrders.toLocaleString(),
          change: 8.4,
          changeLabel: "vs last month",
          Icon: ShoppingCart,
          gradient: "linear-gradient(135deg,#10b981,#059669)",
          delay: 100,
        },
        {
          title: "Growth Rate",
          value: `${stats.kpis.growthRate}%`,
          change: 4.2,
          changeLabel: "vs last quarter",
          Icon: TrendingUp,
          gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
          delay: 150,
        },
      ]
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting()}, {user?.name?.split(" ")[0] ?? "Admin"} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Here&apos;s what&apos;s happening across your KVL ecosystem today
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))
          : kpis.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2"><RevenueChart /></div>
        <div><SalesPieChart /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><UserGrowthChart /></div>

        {/* System Health */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Cpu size={18} style={{ color: "#6366f1" }} />
            <h3 className="font-semibold text-white">System Health</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "API Response", value: 98, color: "#22c55e" },
              { label: "CPU Usage", value: 42, color: "#6366f1" },
              { label: "Memory", value: 67, color: "#f59e0b" },
              { label: "Uptime", value: 99.9, color: "#22c55e" },
              { label: "DB Queries/s", value: 78, color: "#06b6d4" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>{item.label}</span>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
            <Activity size={14} style={{ color: "#22c55e" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Insights */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              <Brain size={15} className="text-white" />
            </div>
            <h3 className="font-semibold text-white">AI Business Insights</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
              Live
            </span>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="mt-0.5 shrink-0">{typeIcon(insight.type)}</div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders — from API */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Recent Orders</h3>
            <a href="/orders" className="text-xs" style={{ color: "#818cf8" }}>View all →</a>
          </div>
          <div className="space-y-2">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
                ))
              : (stats?.recentOrders ?? []).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                    >
                      {order.customer[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{order.customer}</p>
                      <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{order.product}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-white">${order.amount.toLocaleString()}</p>
                      <span className="text-xs capitalize" style={{ color: statusColor[order.status] ?? "#6366f1" }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* CRM Pipeline */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Lead Pipeline</h3>
          <a href="/crm" className="text-xs" style={{ color: "#818cf8" }}>Open CRM →</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {["New", "Contacted", "Qualified", "Proposal", "Closed"].map((stage, i) => {
            const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#22c55e"];
            const counts = [4, 8, 5, 3, 12];
            const values = [120000, 280000, 195000, 82000, 450000];
            return (
              <div
                key={stage}
                className="p-4 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${colors[i]}25` }}
              >
                <div className="w-2 h-2 rounded-full mx-auto mb-2" style={{ background: colors[i] }} />
                <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>{stage}</p>
                <p className="text-2xl font-bold text-white">{counts[i]}</p>
                <p className="text-xs mt-1" style={{ color: colors[i] }}>${(values[i] / 1000).toFixed(0)}K</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

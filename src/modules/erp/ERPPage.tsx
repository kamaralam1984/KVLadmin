"use client";

import { Package, Users, DollarSign, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

const inventory = [
  { name: "KVL ERP Suite", sku: "ERP-001", stock: 847, reorder: 200, status: "healthy" },
  { name: "KVL CRM Pro", sku: "CRM-001", stock: 612, reorder: 150, status: "healthy" },
  { name: "KVL Analytics", sku: "ANL-001", stock: 189, reorder: 200, status: "low" },
  { name: "KVL AI Module", sku: "AI-001", stock: 334, reorder: 100, status: "healthy" },
  { name: "KVL HR Suite", sku: "HR-001", stock: 45, reorder: 100, status: "critical" },
];

const departments = [
  { name: "Engineering", headcount: 48, budget: 850000, utilization: 92 },
  { name: "Sales", headcount: 32, budget: 420000, utilization: 88 },
  { name: "Marketing", headcount: 18, budget: 280000, utilization: 76 },
  { name: "Support", headcount: 24, budget: 320000, utilization: 84 },
  { name: "Finance", headcount: 12, budget: 180000, utilization: 95 },
];

export function ERPPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">ERP Overview</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Inventory, finance, and HR analytics
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Inventory", value: "2,027", icon: Package, gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
          { label: "HR Headcount", value: "134", icon: Users, gradient: "linear-gradient(135deg,#06b6d4,#0891b2)" },
          { label: "Monthly Revenue", value: "$178K", icon: DollarSign, gradient: "linear-gradient(135deg,#10b981,#059669)" },
          { label: "EBITDA Margin", value: "34.2%", icon: TrendingUp, gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="stat-card flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.gradient }}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Inventory */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Package size={18} style={{ color: "#6366f1" }} />
            <h3 className="font-semibold text-white">Inventory Status</h3>
          </div>
          <div className="divide-y divide-white/5">
            {inventory.map((item) => {
              const pct = Math.min((item.stock / 1000) * 100, 100);
              const color = item.status === "healthy" ? "#22c55e" : item.status === "low" ? "#f59e0b" : "#ef4444";
              return (
                <div key={item.sku} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.sku}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status !== "healthy" && <AlertTriangle size={14} style={{ color }} />}
                      <span className="text-sm font-semibold text-white">{item.stock}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Reorder at {item.reorder}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* HR Analytics */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Users size={18} style={{ color: "#06b6d4" }} />
            <h3 className="font-semibold text-white">Department Overview</h3>
          </div>
          <div className="divide-y divide-white/5">
            {departments.map((dept) => (
              <div key={dept.name} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{dept.name}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {dept.headcount} employees · Budget ${(dept.budget / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: dept.utilization > 90 ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.12)",
                      color: dept.utilization > 90 ? "#f87171" : "#22c55e",
                    }}
                  >
                    {dept.utilization}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${dept.utilization}%`,
                      background: dept.utilization > 90 ? "#ef4444" : "#22c55e",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Finance Summary */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <DollarSign size={18} style={{ color: "#22c55e" }} />
          <h3 className="font-semibold text-white">Finance Summary — Q2 2026</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Gross Revenue", value: "$534K", change: "+18%" },
            { label: "Net Revenue", value: "$421K", change: "+14%" },
            { label: "COGS", value: "$113K", change: "-5%" },
            { label: "Gross Margin", value: "78.8%", change: "+2.1%" },
            { label: "Operating Exp", value: "$142K", change: "+8%" },
            { label: "Net Profit", value: "$279K", change: "+22%" },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-lg font-bold text-white">{item.value}</p>
              <p className="text-xs mt-0.5 mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>{item.label}</p>
              <span
                className="text-xs font-medium"
                style={{ color: item.change.startsWith("+") ? "#22c55e" : "#ef4444" }}
              >
                {item.change} YoY
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

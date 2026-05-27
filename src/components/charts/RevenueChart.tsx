"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { revenueData } from "@/lib/mock-data";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-3 rounded-xl text-sm"
        style={{
          background: "rgba(15,15,20,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: ${(p.value / 1000).toFixed(0)}K
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-white">Revenue Overview</h3>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Monthly revenue vs target</p>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: "#6366f1" }} />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: "#22d3ee" }} />
            Target
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
          <Area type="monotone" dataKey="secondary" name="Target" stroke="#22d3ee" strokeWidth={2} fill="url(#colorTarget)" dot={false} activeDot={{ r: 4, fill: "#22d3ee" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

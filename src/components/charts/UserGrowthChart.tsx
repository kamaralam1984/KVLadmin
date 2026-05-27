"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { userGrowthData } from "@/lib/mock-data";

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
        <p className="font-semibold text-white mb-1">{label}</p>
        <p style={{ color: "#8b5cf6" }}>Users: {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function UserGrowthChart() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-6">
        <h3 className="font-semibold text-white">User Growth</h3>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Cumulative users over time</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

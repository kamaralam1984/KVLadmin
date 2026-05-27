"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { salesByCategory } from "@/lib/mock-data";

const COLORS = ["#6366f1", "#8b5cf6", "#22d3ee", "#f59e0b"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl text-sm"
        style={{
          background: "rgba(15,15,20,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p className="font-semibold text-white">{payload[0].name}: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function SalesPieChart() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-white">Sales by Category</h3>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Revenue distribution</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={salesByCategory}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {salesByCategory.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {salesByCategory.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              {item.name} <strong className="text-white">{item.value}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  Icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export function StatsCard({ title, value, change, changeLabel, Icon, gradient, delay = 0 }: StatsCardProps) {
  const positive = change >= 0;

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: gradient }}
        >
          <Icon size={20} className="text-white" />
        </div>
        <div
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background: positive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            color: positive ? "#22c55e" : "#ef4444",
          }}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positive ? "+" : ""}{change}%
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{changeLabel}</p>
    </motion.div>
  );
}

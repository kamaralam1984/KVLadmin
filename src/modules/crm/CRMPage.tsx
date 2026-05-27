"use client";

import { mockLeads } from "@/lib/mock-data";
import { Phone, Mail, TrendingUp, Users, DollarSign, Target } from "lucide-react";

const stageColors: Record<string, string> = {
  new: "#8b5cf6",
  contacted: "#6366f1",
  qualified: "#06b6d4",
  proposal: "#f59e0b",
  closed: "#22c55e",
};

const stages = ["new", "contacted", "qualified", "proposal", "closed"];

export function CRMPage() {
  const byStage = stages.map((s) => ({
    stage: s,
    leads: mockLeads.filter((l) => l.status === s),
    total: mockLeads.filter((l) => l.status === s).reduce((a, b) => a + b.value, 0),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">CRM Overview</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Lead pipeline and customer relationship management
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: mockLeads.length, icon: Users, color: "#6366f1", gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
          { label: "Pipeline Value", value: `$${(mockLeads.reduce((a,b) => a+b.value,0)/1000).toFixed(0)}K`, icon: DollarSign, color: "#22c55e", gradient: "linear-gradient(135deg,#10b981,#059669)" },
          { label: "Conversion Rate", value: "24%", icon: TrendingUp, color: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
          { label: "Closed Deals", value: mockLeads.filter(l=>l.status==="closed").length, icon: Target, color: "#22d3ee", gradient: "linear-gradient(135deg,#06b6d4,#0891b2)" },
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

      {/* Pipeline board */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>LEAD PIPELINE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {byStage.map(({ stage, leads, total }) => (
            <div
              key={stage}
              className="rounded-2xl p-4 space-y-3"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${stageColors[stage]}20` }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: stageColors[stage] }}
                >
                  {stage}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${stageColors[stage]}20`, color: stageColors[stage] }}
                >
                  {leads.length}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">${(total / 1000).toFixed(0)}K</p>
              {leads.length === 0 ? (
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>No leads</p>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-sm font-medium text-white">{lead.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{lead.company}</p>
                    <p className="text-xs mt-1.5 font-semibold" style={{ color: stageColors[stage] }}>
                      ${lead.value.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leads table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="font-semibold text-white">All Leads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Company", "Contact", "Stage", "Value", "Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLeads.map((lead, i) => (
                <tr key={lead.id} className="hover:bg-white/2 transition-colors" style={{ borderBottom: i < mockLeads.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-white">{lead.company}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm text-white">{lead.name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{lead.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                      style={{ background: `${stageColors[lead.status]}20`, color: stageColors[lead.status] }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-white">${lead.value.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{lead.createdAt}</span>
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

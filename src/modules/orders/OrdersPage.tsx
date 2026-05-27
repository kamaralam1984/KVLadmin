"use client";

import { useState, useEffect } from "react";
import { mockOrders } from "@/lib/mock-data";
import { useProxy } from "@/lib/useProxy";
import { Search, Loader2, Globe } from "lucide-react";
import type { Order } from "@/types";

const statusStyles: Record<string, { bg: string; color: string }> = {
  pending:    { bg: "rgba(139,92,246,0.15)", color: "#a78bfa" },
  processing: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  shipped:    { bg: "rgba(6,182,212,0.15)",  color: "#22d3ee" },
  delivered:  { bg: "rgba(34,197,94,0.15)",  color: "#4ade80" },
  cancelled:  { bg: "rgba(239,68,68,0.15)",  color: "#f87171" },
  CAPTURED:   { bg: "rgba(34,197,94,0.15)",  color: "#4ade80" },
  CREATED:    { bg: "rgba(139,92,246,0.15)", color: "#a78bfa" },
  FAILED:     { bg: "rgba(239,68,68,0.15)",  color: "#f87171" },
  REFUNDED:   { bg: "rgba(6,182,212,0.15)",  color: "#22d3ee" },
};

export function OrdersPage() {
  const { proxyGet, activeSite } = useProxy();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [siteOrders, setSiteOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeSite) return;
    setLoading(true);
    setError("");
    proxyGet<{ orders: Order[] }>("/kvl/orders").then((res) => {
      if (res.data?.orders) setSiteOrders(res.data.orders);
      else setError(res.error ?? "Failed to fetch orders");
      setLoading(false);
    });
  }, [activeSite, proxyGet]);

  const orders = activeSite ? siteOrders : mockOrders;

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchFilter = filter === "all" || o.status === filter || o.status.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const total = orders.reduce((a, b) => a + b.amount, 0);
  const statuses = activeSite
    ? ["all", "CAPTURED", "CREATED", "FAILED", "REFUNDED"]
    : ["all", "pending", "processing", "shipped", "delivered"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          {activeSite && (
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
              <Globe size={11} /> {activeSite.name}
            </span>
          )}
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          {activeSite ? `${activeSite.name} ke live payments` : "Track and manage all customer orders"}
        </p>
      </div>

      {!activeSite && (
        <div className="glass-card rounded-2xl p-4 text-sm" style={{ color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
          Koi site select nahi hai. Upar se site choose karo to real data dekhne ke liye.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {statuses.map((s) => {
          const count = s === "all" ? orders.length : orders.filter(o =>
            o.status === s || o.status.toLowerCase() === s
          ).length;
          return (
            <button key={s} onClick={() => setFilter(s)} className="stat-card text-left transition-all"
              style={{ borderColor: filter === s ? "#6366f1" : undefined, background: filter === s ? "rgba(99,102,241,0.1)" : undefined }}>
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-xs mt-1 capitalize" style={{ color: s === "all" ? "rgba(255,255,255,0.45)" : (statusStyles[s]?.color ?? "#818cf8") }}>
                {s.toLowerCase()}
              </p>
            </button>
          );
        })}
      </div>

      <div className="glass-card rounded-2xl p-4 flex gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input type="text" placeholder="Search by order ID or customer..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/30 text-white" />
        </div>
        <div className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
          Total: ₹{total.toLocaleString()}
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin" style={{ color: "#6366f1" }} />
          </div>
        ) : error ? (
          <div className="py-10 text-center text-sm" style={{ color: "#f87171" }}>{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "rgba(255,255,255,0.35)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-sm"
                    style={{ color: "rgba(255,255,255,0.35)" }}>No orders found.</td></tr>
                ) : filtered.map((order, i) => {
                  const s = statusStyles[order.status] ?? { bg: "rgba(255,255,255,0.08)", color: "#fff" };
                  return (
                    <tr key={order.id} className="hover:bg-white/2 transition-colors"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <td className="px-5 py-3.5"><span className="text-sm font-mono" style={{ color: "#818cf8" }}>{order.id.slice(0, 12)}…</span></td>
                      <td className="px-5 py-3.5"><span className="text-sm font-medium text-white">{order.customer}</span></td>
                      <td className="px-5 py-3.5"><span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{order.product}</span></td>
                      <td className="px-5 py-3.5"><span className="text-sm font-semibold text-white">₹{order.amount.toLocaleString()}</span></td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                          style={{ background: s.bg, color: s.color }}>{order.status.toLowerCase()}</span>
                      </td>
                      <td className="px-5 py-3.5"><span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{order.createdAt}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

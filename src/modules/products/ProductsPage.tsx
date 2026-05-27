"use client";

import { useState, useEffect } from "react";
import { mockProducts } from "@/lib/mock-data";
import { useProxy } from "@/lib/useProxy";
import { Package, Plus, Search, Edit2, Trash2, Loader2, Globe } from "lucide-react";
import type { Product } from "@/types";

interface SiteProduct {
  id: string;
  name: string;
  price: number;
  currency?: string;
  features?: string[];
  status?: string;
}

export function ProductsPage() {
  const { proxyGet, activeSite } = useProxy();
  const [search, setSearch] = useState("");
  const [siteProducts, setSiteProducts] = useState<SiteProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeSite) return;
    setLoading(true);
    setError("");
    proxyGet<{ products: SiteProduct[] }>("/products").then((res) => {
      if (res.data?.products) setSiteProducts(res.data.products);
      else setError(res.error ?? "Failed to fetch products");
      setLoading(false);
    });
  }, [activeSite, proxyGet]);

  if (activeSite) {
    const filtered = siteProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">Products</h1>
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                <Globe size={11} /> {activeSite.name}
              </span>
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {activeSite.name} ke live products
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Products", value: siteProducts.length },
            { label: "Free", value: siteProducts.filter(p => p.price === 0).length },
            { label: "Paid", value: siteProducts.filter(p => p.price > 0).length },
          ].map((item) => (
            <div key={item.label} className="stat-card">
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{item.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 380 }}>
          <Search size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/30 text-white" />
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
                    {["Product", "Price", "Currency", "Features", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "rgba(255,255,255,0.35)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-sm"
                      style={{ color: "rgba(255,255,255,0.35)" }}>No products found.</td></tr>
                  ) : filtered.map((p, i) => (
                    <tr key={p.id} className="hover:bg-white/2 transition-colors"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "rgba(99,102,241,0.15)" }}>
                            <Package size={16} style={{ color: "#818cf8" }} />
                          </div>
                          <span className="text-sm font-medium text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-white">
                          {p.price === 0 ? "Free" : `₹${p.price.toLocaleString()}`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(6,182,212,0.12)", color: "#22d3ee" }}>
                          {p.currency ?? "INR"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {p.features?.length ? `${p.features.length} features` : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                            style={{ color: "rgba(255,255,255,0.4)" }}><Edit2 size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                            style={{ color: "rgba(239,68,68,0.5)" }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // No site selected — show local mock products
  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            Manage your product catalog
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="glass-card rounded-2xl p-4 text-sm" style={{ color: "#f59e0b", borderColor: "rgba(245,158,11,0.2)", border: "1px solid" }}>
        Koi site select nahi hai. Upar se site choose karo to real data dekhne ke liye.
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: mockProducts.length },
          { label: "Active", value: mockProducts.filter(p => p.status === "active").length },
          { label: "Inactive", value: mockProducts.filter(p => p.status === "inactive").length },
          { label: "Avg. Price", value: `$${Math.round(mockProducts.reduce((a, b) => a + b.price, 0) / mockProducts.length).toLocaleString()}` },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 380 }}>
        <Search size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
        <input type="text" placeholder="Search products..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/30 text-white" />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.35)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr key={product.id} className="hover:bg-white/2 transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(99,102,241,0.15)" }}>
                        <Package size={16} style={{ color: "#818cf8" }} />
                      </div>
                      <span className="text-sm font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{product.sku}</span></td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(6,182,212,0.12)", color: "#22d3ee" }}>{product.category}</span>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-sm font-semibold text-white">${product.price.toLocaleString()}</span></td>
                  <td className="px-5 py-3.5"><span className="text-sm text-white">{product.stock.toLocaleString()}</span></td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2.5 py-1 rounded-full capitalize"
                      style={{ background: product.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: product.status === "active" ? "#22c55e" : "#f87171" }}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}><Edit2 size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" style={{ color: "rgba(239,68,68,0.5)" }}><Trash2 size={14} /></button>
                    </div>
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

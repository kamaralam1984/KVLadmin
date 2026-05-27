"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, Phone, Package2, ShoppingCart,
  BarChart3, Bell, Bot, Settings, LogOut, ChevronLeft,
  ChevronRight, Zap, Building2, Menu, X, Globe, Webhook
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Websites", href: "/sites", icon: Globe },
  { label: "Users", href: "/users", icon: Users },
  { label: "CRM", href: "/crm", icon: Phone },
  { label: "ERP", href: "/erp", icon: Building2 },
  { label: "Products", href: "/products", icon: Package2 },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Webhooks", href: "/webhooks", icon: Webhook },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
  { label: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const content = (
    <div
      className="flex flex-col h-full"
      style={{
        background: "rgba(9,9,11,0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">KVL Central</span>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Admin System</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <Zap size={16} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
             style={{ color: "rgba(255,255,255,0.25)" }}>
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`sidebar-item ${active ? "sidebar-item-active" : "sidebar-item-inactive"}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(99,102,241,0.3)", color: "#818cf8" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: "#6366f1" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3 space-y-1">
        {collapsed && (
          <button
            onClick={onToggle}
            className="w-full sidebar-item sidebar-item-inactive justify-center"
          >
            <ChevronRight size={18} />
          </button>
        )}
        <button onClick={() => logout()} className="w-full sidebar-item sidebar-item-inactive">
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 shrink-0"
        style={{ width: collapsed ? "64px" : "240px" }}
      >
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onMobileClose}
          />
          <aside className="relative w-64 h-full">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <X size={18} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

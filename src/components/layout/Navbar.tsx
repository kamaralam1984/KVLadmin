"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, Moon, Sun, ChevronDown, Globe, Plus } from "lucide-react";
import { mockNotifications } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { useSite } from "@/contexts/SiteContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Site } from "@/types";

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

const statusDot: Record<string, string> = {
  connected: "#22c55e",
  disconnected: "#ef4444",
  error: "#f59e0b",
  pending: "#6366f1",
};

function SiteSwitcher() {
  const { sites, activeSite, setActiveSite } = useSite();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const pick = (site: Site | null) => {
    setActiveSite(site);
    setOpen(false);
    if (site) router.push(`/sites/${site.id}`);
  };

  return (
    <div className="relative hidden sm:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors"
        style={{
          background: open ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.05)",
          border: open ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Globe size={14} style={{ color: activeSite ? "#818cf8" : "rgba(255,255,255,0.4)" }} />
        <span className="text-xs font-medium max-w-[110px] truncate" style={{ color: activeSite ? "#c7d2fe" : "rgba(255,255,255,0.5)" }}>
          {activeSite ? activeSite.name : "All Sites"}
        </span>
        {activeSite && (
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: statusDot[activeSite.status] ?? "#6366f1" }}
          />
        )}
        <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-50"
          style={{
            background: "rgba(12,12,18,0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div className="px-3 py-2.5 border-b border-white/5">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
              Switch Website
            </p>
          </div>

          <button
            onClick={() => pick(null)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
            style={{ borderLeft: !activeSite ? "2px solid #6366f1" : "2px solid transparent" }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
              <Globe size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
            </div>
            <span className="text-sm" style={{ color: !activeSite ? "white" : "rgba(255,255,255,0.6)" }}>All Sites</span>
          </button>

          {sites.map((site) => (
            <button
              key={site.id}
              onClick={() => pick(site)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
              style={{ borderLeft: activeSite?.id === site.id ? "2px solid #6366f1" : "2px solid transparent" }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
              >
                {site.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: activeSite?.id === site.id ? "white" : "rgba(255,255,255,0.7)" }}>
                  {site.name}
                </p>
                <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {site.url.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusDot[site.status] ?? "#6366f1" }} />
            </button>
          ))}

          <div className="border-t border-white/5 p-2">
            <button
              onClick={() => { router.push("/sites"); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:bg-white/5"
              style={{ color: "#818cf8" }}
            >
              <Plus size={12} /> Add Website
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const unread = mockNotifications.filter((n) => !n.read).length;

  const typeColor = (type: string) => {
    const map: Record<string, string> = {
      success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#6366f1",
    };
    return map[type] ?? "#6366f1";
  };

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "A";

  return (
    <header
      className="sticky top-0 z-40 h-16 flex items-center px-4 gap-3"
      style={{
        background: "rgba(9,9,11,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button className="lg:hidden p-2 rounded-lg" style={{ color: "rgba(255,255,255,0.5)" }} onClick={onMobileMenuToggle}>
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/30 text-white" />
          <kbd className="text-xs px-1.5 py-0.5 rounded font-mono hidden sm:block" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}>⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Site Switcher */}
        <SiteSwitcher />

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
        >
          {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-xl"
            style={{
              background: showNotifications ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
              border: showNotifications ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)",
              color: showNotifications ? "#818cf8" : "rgba(255,255,255,0.6)",
            }}
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-xs rounded-full flex items-center justify-center font-medium" style={{ background: "#6366f1", color: "white" }}>
                {unread}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50" style={{ background: "rgba(15,15,20,0.98)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="font-semibold text-sm text-white">Notifications</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}>{unread} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors" style={{ borderLeft: `3px solid ${n.read ? "transparent" : typeColor(n.type)}` }}>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: typeColor(n.type) }} />
                      <div>
                        <p className="text-sm font-medium text-white">{n.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{n.message}</p>
                        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{new Date(n.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
            style={{ background: showProfile ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.05)", border: showProfile ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">{user?.name ?? "Admin"}</p>
              <p className="text-xs capitalize" style={{ color: "rgba(255,255,255,0.4)" }}>{user?.role?.replace("_", " ") ?? "Admin"}</p>
            </div>
            <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden z-50" style={{ background: "rgba(15,15,20,0.98)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
              {["Profile", "Account Settings", "Billing", "Help"].map((item) => (
                <button key={item} className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {item}
                </button>
              ))}
              <div className="border-t border-white/5 mt-1">
                <button onClick={() => logout()} className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5" style={{ color: "#ef4444" }}>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { mockNotifications } from "@/lib/mock-data";
import { Bell, CheckCheck, Trash2, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import type { Notification } from "@/types";

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  warning: { icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  error: { icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  info: { icon: Info, color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const remove = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
        >
          <CheckCheck size={16} />
          Mark all read
        </button>
      </div>

      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background: filter === f ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#818cf8" : "rgba(255,255,255,0.5)",
              border: filter === f ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
            }}
          >
            {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Bell size={32} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.2)" }} />
            <p style={{ color: "rgba(255,255,255,0.45)" }}>No notifications</p>
          </div>
        ) : (
          displayed.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            return (
              <div
                key={notification.id}
                className="glass-card rounded-2xl p-4 flex items-start gap-4 transition-all"
                style={{
                  opacity: notification.read ? 0.6 : 1,
                  borderLeft: notification.read ? undefined : `3px solid ${config.color}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: config.bg }}
                >
                  <Icon size={18} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{notification.title}</p>
                    {!notification.read && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: config.color }} />
                    )}
                  </div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{notification.message}</p>
                  <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => remove(notification.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                  style={{ color: "rgba(239,68,68,0.4)" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

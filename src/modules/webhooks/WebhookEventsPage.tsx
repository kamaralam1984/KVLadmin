"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Webhook, CheckCircle, Clock, RefreshCw } from "lucide-react";

interface WebhookEvent {
  id: string;
  type: string;
  payload: unknown;
  processed: boolean;
  createdAt: string;
  site?: { name: string };
}

export function WebhookEventsPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.get<WebhookEvent[]>("/api/webhook-events").then((res) => {
      if (res.data) setEvents(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const markProcessed = async (id: string) => {
    setMarking(id);
    await api.patch("/api/webhook-events", { id });
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, processed: true } : e));
    setMarking(null);
  };

  const pending = events.filter((e) => !e.processed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Webhook Events</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            Real-time events from connected sites
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pending > 0 && (
            <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: "#f59e0b22", color: "#f59e0b" }}>
              {pending} pending
            </span>
          )}
          <button
            onClick={load}
            className="p-2 rounded-xl transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Webhook size={36} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
            <p className="text-white font-medium mb-1">No webhook events yet</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Events will appear here when connected sites send webhooks
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                {["Event Type", "Site", "Status", "Time", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Webhook size={13} style={{ color: "#06b6d4" }} />
                      <span className="text-sm font-medium text-white">{e.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {e.site?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium w-fit px-2 py-1 rounded-full"
                      style={{ background: e.processed ? "#22c55e22" : "#f59e0b22", color: e.processed ? "#22c55e" : "#f59e0b" }}>
                      {e.processed ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {e.processed ? "Processed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {!e.processed && (
                      <button
                        onClick={() => markProcessed(e.id)}
                        disabled={marking === e.id}
                        className="text-xs px-3 py-1 rounded-lg font-medium transition-colors disabled:opacity-50"
                        style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                      >
                        {marking === e.id ? "..." : "Mark done"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

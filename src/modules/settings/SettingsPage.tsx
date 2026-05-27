"use client";

import { useState } from "react";
import { Globe, Key, Palette, Shield, Bell, Save } from "lucide-react";

const tabs = [
  { id: "website", label: "Website", icon: Globe },
  { id: "api", label: "API", icon: Key },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-colors"
      style={{ background: checked ? "#6366f1" : "rgba(255,255,255,0.12)" }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: checked ? "calc(100% - 1.25rem)" : "0.25rem" }}
      />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function InputField({ label, placeholder, type = "text", defaultValue = "" }: { label: string; placeholder: string; type?: string; defaultValue?: string }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white placeholder:text-white/25"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("website");
  const [toggles, setToggles] = useState({
    maintenance: false, darkMode: true, twoFactor: true,
    emailNotif: true, smsNotif: false, slackNotif: true,
    apiRateLimit: true, ipWhitelist: false, auditLog: true,
  });

  const toggle = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Configure your KVL platform settings
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
                color: active ? "#818cf8" : "rgba(255,255,255,0.5)",
                border: active ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="glass-card rounded-2xl p-6 max-w-2xl">
        {activeTab === "website" && (
          <div className="space-y-4">
            <InputField label="Site Name" placeholder="KVL Central Admin" defaultValue="KVL Central Admin" />
            <InputField label="Site URL" placeholder="https://admin.kvl.com" defaultValue="https://admin.kvl.com" />
            <InputField label="Support Email" placeholder="support@kvl.com" defaultValue="support@kvl.com" type="email" />
            <SettingRow label="Maintenance Mode" desc="Show maintenance page to visitors">
              <Toggle checked={toggles.maintenance} onChange={() => toggle("maintenance")} />
            </SettingRow>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  defaultValue="sk_live_kvl_1234567890abcdef"
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none text-white font-mono"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <button
                  className="px-3 py-2 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                >
                  Regenerate
                </button>
              </div>
            </div>
            <InputField label="Webhook URL" placeholder="https://your-app.com/webhook" />
            <SettingRow label="Rate Limiting" desc="Limit API calls to 1000/hour per key">
              <Toggle checked={toggles.apiRateLimit} onChange={() => toggle("apiRateLimit")} />
            </SettingRow>
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>Allowed Origins (CORS)</p>
              <textarea
                rows={3}
                defaultValue={"https://app.kvl.com\nhttps://dashboard.kvl.com"}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white font-mono resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
          </div>
        )}

        {activeTab === "theme" && (
          <div className="space-y-4">
            <SettingRow label="Dark Mode" desc="Use dark theme across the admin panel">
              <Toggle checked={toggles.darkMode} onChange={() => toggle("darkMode")} />
            </SettingRow>
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Primary Color</p>
              <div className="flex gap-3">
                {["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                  <button
                    key={color}
                    className="w-9 h-9 rounded-xl transition-transform hover:scale-110"
                    style={{ background: color, boxShadow: color === "#6366f1" ? `0 0 0 2px white, 0 0 0 4px ${color}` : "none" }}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Sidebar Style</p>
              <div className="flex gap-3">
                {["Solid", "Glass", "Minimal"].map((style) => (
                  <button
                    key={style}
                    className="px-4 py-2 rounded-xl text-sm transition-colors"
                    style={{
                      background: style === "Glass" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
                      border: style === "Glass" ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      color: style === "Glass" ? "#818cf8" : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-0">
            <SettingRow label="Two-Factor Authentication" desc="Require 2FA for all admin accounts">
              <Toggle checked={toggles.twoFactor} onChange={() => toggle("twoFactor")} />
            </SettingRow>
            <SettingRow label="IP Whitelist" desc="Restrict access to specific IP addresses">
              <Toggle checked={toggles.ipWhitelist} onChange={() => toggle("ipWhitelist")} />
            </SettingRow>
            <SettingRow label="Audit Log" desc="Log all admin actions">
              <Toggle checked={toggles.auditLog} onChange={() => toggle("auditLog")} />
            </SettingRow>
            <SettingRow label="Session Timeout" desc="Auto-logout after inactivity">
              <select
                className="px-3 py-1.5 rounded-xl text-xs outline-none"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}
                defaultValue="30"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
              </select>
            </SettingRow>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-0">
            <SettingRow label="Email Notifications" desc="Receive alerts via email">
              <Toggle checked={toggles.emailNotif} onChange={() => toggle("emailNotif")} />
            </SettingRow>
            <SettingRow label="SMS Notifications" desc="Receive critical alerts via SMS">
              <Toggle checked={toggles.smsNotif} onChange={() => toggle("smsNotif")} />
            </SettingRow>
            <SettingRow label="Slack Integration" desc="Send alerts to Slack channels">
              <Toggle checked={toggles.slackNotif} onChange={() => toggle("slackNotif")} />
            </SettingRow>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/5">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

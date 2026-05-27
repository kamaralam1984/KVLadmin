"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { api } from "@/lib/api";
import { useProxy } from "@/lib/useProxy";
import { Search, Plus, Edit2, Trash2, Shield, CheckCircle, XCircle, AlertCircle, Loader2, Globe } from "lucide-react";

const roleColors: Record<string, { bg: string; text: string }> = {
  super_admin: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
  admin: { bg: "rgba(99,102,241,0.15)", text: "#818cf8" },
  manager: { bg: "rgba(6,182,212,0.15)", text: "#22d3ee" },
  staff: { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.55)" },
};

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  active: { icon: CheckCircle, color: "#22c55e", label: "Active" },
  inactive: { icon: AlertCircle, color: "#f59e0b", label: "Inactive" },
  suspended: { icon: XCircle, color: "#ef4444", label: "Suspended" },
};

const emptyForm = { name: "", email: "", password: "", role: "staff" };

export function UsersPage() {
  const { proxyGet, activeSite } = useProxy();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    if (activeSite) {
      const res = await proxyGet<{ users: User[] }>("/kvl/users");
      if (res.data?.users) setUsers(res.data.users);
    } else {
      const result = await api.get<User[]>("/api/users");
      if (result.data) setUsers(result.data);
    }
    setLoading(false);
  }, [activeSite, proxyGet]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      setFormError("All fields are required.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    const result = await api.post<User>("/api/users", form);
    setSubmitting(false);
    if (result.error) {
      setFormError(result.error);
      return;
    }
    setUsers((prev) => [...prev, result.data!]);
    setShowModal(false);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    const result = await api.delete<{ ok: boolean }>(`/api/users/${id}`);
    if (!result.error) setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            {activeSite && (
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                <Globe size={11} /> {activeSite.name}
              </span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            {activeSite ? `${activeSite.name} ke ${users.length} users` : `Manage roles, permissions and access across ${users.length} users`}
          </p>
        </div>
        <button
          onClick={() => { setShowModal(true); setForm(emptyForm); setFormError(""); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "#6366f1" },
          { label: "Active", value: users.filter(u => u.status === "active").length, color: "#22c55e" },
          { label: "Inactive", value: users.filter(u => u.status === "inactive").length, color: "#f59e0b" },
          { label: "Suspended", value: users.filter(u => u.status === "suspended").length, color: "#ef4444" },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <p className="text-3xl font-bold text-white mb-1">{item.value}</p>
            <p className="text-sm" style={{ color: item.color }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/30 text-white"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* Users table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin" style={{ color: "#6366f1" }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["User", "Role", "Status", "Last Login", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                      No users found.
                    </td>
                  </tr>
                ) : filtered.map((user, i) => {
                  const role = roleColors[user.role] ?? roleColors.staff;
                  const status = statusConfig[user.status] ?? statusConfig.inactive;
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-white/2"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white" }}
                          >
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit"
                          style={{ background: role.bg, color: role.text }}
                        >
                          <Shield size={11} />
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: status.color }}>
                          <StatusIcon size={13} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {user.lastLogin ?? "Never"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {user.createdAt}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                            style={{ color: "rgba(239,68,68,0.5)" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 animate-slide-up"
            style={{
              background: "rgba(15,15,20,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <h2 className="text-lg font-bold text-white mb-5">Add New User</h2>
            <div className="space-y-4">
              {([
                { label: "Full Name", key: "name", placeholder: "John Doe", type: "text" },
                { label: "Email Address", key: "email", placeholder: "john@example.com", type: "email" },
                { label: "Password", key: "password", placeholder: "••••••••", type: "password" },
              ] as const).map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white placeholder:text-white/25"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {formError && (
                <p className="text-xs text-red-400">{formError}</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

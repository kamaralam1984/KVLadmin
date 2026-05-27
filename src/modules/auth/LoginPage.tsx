"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Zap, ArrowRight, Shield, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [sessionId, setSessionId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [devOtp, setDevOtp] = useState("");
  const router = useRouter();
  const { refresh } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const emailVal = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const result = await api.post<{ sessionId: string; _devOtp?: string }>(
      "/api/auth/login",
      { email: emailVal, password }
    );

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setEmail(emailVal);
    setSessionId(result.data.sessionId);
    if (result.data._devOtp) setDevOtp(result.data._devOtp);
    setStep("otp");
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await api.post<{ user: object }>("/api/auth/verify-otp", {
      sessionId,
      otp: otp.join(""),
    });

    if (result.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    await refresh();
    router.push("/dashboard");
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#09090b" }}
    >
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
      />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
          >
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">KVL Central</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            {step === "login" ? "Sign in to your admin account" : "Enter verification code"}
          </p>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
        >
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-sm"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
            >
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Email Address
                </label>
                <div
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <Mail size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input
                    name="email"
                    type="email"
                    placeholder="admin@kvl.com"
                    required
                    className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/30"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Password
                </label>
                <div
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <Lock size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight size={16} /></>}
              </button>
              <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                Demo: alex@kvl.com / password123
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="space-y-6">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
                >
                  <Shield size={20} style={{ color: "#818cf8" }} />
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Code sent to <strong className="text-white">{email}</strong>
                </p>
                {devOtp && (
                  <p className="text-xs mt-1 font-mono" style={{ color: "#6366f1" }}>
                    [Dev] OTP: {devOtp}
                  </p>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl outline-none text-white transition-all"
                    style={{
                      background: val ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)",
                      border: val ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={loading || otp.some((v) => !v)}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Didn&apos;t receive it?{" "}
                <button
                  type="button"
                  style={{ color: "#818cf8" }}
                  onClick={() => { setStep("login"); setOtp(["","","","","",""]); setError(""); }}
                >
                  Go back
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.25)" }}>
          Protected by KVL Security · All sessions encrypted
        </p>
      </div>
    </div>
  );
}

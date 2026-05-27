"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Step = "form" | "otp" | "success"

interface SuccessData {
  site: { name: string; subdomain: string; apiKey: string }
  dashboardUrl: string
  installInstructions: { npm: string; usage: string }
}

export default function OnboardPage() {
  const [step, setStep] = useState<Step>("form")
  const [siteUrl, setSiteUrl] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [devOtp, setDevOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<SuccessData | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function handleRequest() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/onboard/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl, email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSessionId(data.sessionId)
      if (data._devOtp) setDevOtp(data._devOtp)
      setStep("otp")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/onboard/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, otp }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess(data)
      setStep("success")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">KVL Central</h1>
          <p className="text-purple-300 mt-1">Connect your website in minutes</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["form", "otp", "success"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s ? "bg-purple-600 text-white" :
                (["form","otp","success"].indexOf(step) > i) ? "bg-purple-800 text-purple-300" :
                "bg-slate-800 text-slate-500"
              }`}>{i + 1}</div>
              {i < 2 && <div className={`w-12 h-0.5 mx-1 transition-all ${(["form","otp","success"].indexOf(step) > i) ? "bg-purple-600" : "bg-slate-800"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-1">Connect your website</h2>
              <p className="text-slate-400 text-sm mb-6">Enter your website URL and email to get started</p>

              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Website URL</label>
                  <input type="url" value={siteUrl} onChange={e => setSiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Your Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
                </div>
                <button onClick={handleRequest} disabled={loading || !siteUrl || !email}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all mt-2">
                  {loading ? "Sending OTP..." : "Send Verification Code →"}
                </button>
              </div>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-1">Check your email</h2>
              <p className="text-slate-400 text-sm mb-6">We sent a 6-digit code to <span className="text-purple-400">{email}</span></p>

              {devOtp && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-3 text-sm mb-4">
                  <span className="text-purple-400">Dev mode — OTP: </span>
                  <span className="text-white font-mono font-bold">{devOtp}</span>
                </div>
              )}

              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">6-Digit Code</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000" maxLength={6}
                    className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
                </div>
                <button onClick={handleVerify} disabled={loading || otp.length !== 6}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all">
                  {loading ? "Verifying..." : "Verify & Connect →"}
                </button>
                <button onClick={() => { setStep("form"); setError("") }} className="w-full text-slate-400 hover:text-slate-300 text-sm py-2 transition-colors">
                  ← Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "success" && success && (
            <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 mb-3">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">🎉 {success.site.name} is connected!</h2>
                <p className="text-slate-400 text-sm mt-1">Your admin panel is ready</p>
              </div>

              {/* API Key */}
              <div className="bg-slate-800/60 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">API Key</span>
                  <button onClick={() => copyText(success.site.apiKey, "apikey")} className="text-purple-400 text-xs hover:text-purple-300">
                    {copied === "apikey" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="text-purple-300 text-sm break-all">{success.site.apiKey}</code>
              </div>

              {/* Subdomain */}
              <div className="bg-slate-800/60 rounded-xl p-4 mb-4">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide block mb-1">Dashboard URL</span>
                <a href={success.dashboardUrl} target="_blank" rel="noopener noreferrer"
                  className="text-purple-300 text-sm hover:text-purple-200 transition-colors">{success.dashboardUrl}</a>
              </div>

              {/* Install instructions */}
              <div className="bg-slate-950/60 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Install on your website</span>
                  <button onClick={() => copyText(`${success.installInstructions.npm}\n\n${success.installInstructions.usage}`, "install")}
                    className="text-purple-400 text-xs hover:text-purple-300">{copied === "install" ? "Copied!" : "Copy all"}</button>
                </div>
                <pre className="text-green-400 text-xs overflow-x-auto whitespace-pre-wrap">{success.installInstructions.npm}</pre>
                <pre className="text-blue-300 text-xs overflow-x-auto whitespace-pre-wrap mt-2">{success.installInstructions.usage}</pre>
              </div>

              <a href="/dashboard" className="block w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-all text-center">
                Go to Dashboard →
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-slate-600 text-xs mt-6">
          Already have an account? <a href="/auth/login" className="text-purple-400 hover:text-purple-300">Sign in</a>
        </p>
      </div>
    </div>
  )
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Send, Mic, Sparkles, TrendingUp, AlertCircle, Lightbulb, BarChart3 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "What's our revenue trend this quarter?",
  "Which products are at risk of going out of stock?",
  "Show me the top performing sales channels",
  "Analyze user churn patterns",
];

const insights = [
  { icon: TrendingUp, title: "Revenue Surge", desc: "Q2 revenue is 23% above forecast. AI recommends increasing marketing budget by 15% to capitalize.", color: "#22c55e" },
  { icon: AlertCircle, title: "Churn Risk", desc: "142 accounts show high churn probability. Recommend proactive outreach within 48 hours.", color: "#f59e0b" },
  { icon: Lightbulb, title: "Cross-sell Opportunity", desc: "CRM Pro users show 68% likelihood to upgrade to ERP Suite based on usage patterns.", color: "#6366f1" },
  { icon: BarChart3, title: "Growth Prediction", desc: "User base projected to reach 25K by Q3 end — 8% above original target.", color: "#22d3ee" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm KVL AI Assistant. I can help you with business insights, data analysis, and intelligent recommendations across your entire KVL ecosystem. What would you like to know?",
    timestamp: new Date(),
  },
];

const mockResponses: Record<string, string> = {
  default: "Based on your KVL ecosystem data, I've analyzed the latest metrics. Revenue is trending upward at 23% MoM, user growth is accelerating, and your top pipeline deals total $450K. Would you like me to dive deeper into any specific area?",
};

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    const response = mockResponses[text.toLowerCase()] ?? mockResponses.default;
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain size={24} style={{ color: "#8b5cf6" }} />
          AI Assistant
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Intelligent business insights powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Chat */}
        <div className="lg:col-span-2 glass-card rounded-2xl flex flex-col" style={{ minHeight: 500 }}>
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">KVL AI</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                  >
                    <Brain size={14} className="text-white" />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user"
                      ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                      : "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.85)",
                    borderRadius: msg.role === "user" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                  }}
                >
                  {msg.content}
                  <p className="text-xs mt-2 opacity-50">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                >
                  <Brain size={14} className="text-white" />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl text-sm"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "#818cf8",
                          animation: `pulse 1.4s ${i * 0.2}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full shrink-0 transition-colors"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "#818cf8",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask KVL AI anything..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/25 text-white"
              />
              <button
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                <Mic size={16} />
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-lg transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white" }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Insights panel */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles size={16} style={{ color: "#8b5cf6" }} />
              Live Insights
            </h3>
            <div className="space-y-3">
              {insights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={insight.title}
                    className="p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon size={14} style={{ color: insight.color }} />
                      <span className="text-sm font-medium text-white">{insight.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {insight.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 text-sm">AI Performance</h3>
            <div className="space-y-3">
              {[
                { label: "Accuracy", value: 94, color: "#22c55e" },
                { label: "Response Speed", value: 98, color: "#6366f1" },
                { label: "Data Coverage", value: 87, color: "#22d3ee" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span>{item.label}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

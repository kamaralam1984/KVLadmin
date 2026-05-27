interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info"
  size?: "sm" | "md"
}

const variants = {
  default: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
  success: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  warning: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  error: { bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
  info: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
}

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const v = variants[variant]
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}`}
      style={{ background: v.bg, color: v.color }}
    >
      {children}
    </span>
  )
}

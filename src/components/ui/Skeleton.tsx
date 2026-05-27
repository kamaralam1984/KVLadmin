interface SkeletonProps {
  className?: string
  rows?: number
  height?: string
}

export function Skeleton({ className = "", height = "h-4" }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg animate-pulse ${height} ${className}`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <Skeleton height="h-5" className="w-1/3" />
      <Skeleton height="h-8" className="w-1/2" />
      <Skeleton height="h-3" className="w-2/3" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton height="h-10" className="w-10 rounded-xl" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton height="h-4" className="w-2/3" />
            <Skeleton height="h-3" className="w-1/3" />
          </div>
          <Skeleton height="h-6" className="w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

interface HealthScoreRingProps {
  score: number
  /** Size in pixels. Default 112 (= w-28). Use smaller values for compact cards. */
  size?: number
}

export function HealthScoreRing({ score, size = 112 }: HealthScoreRingProps) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const bgColor =
    score >= 80
      ? 'stroke-emerald-500/15'
      : score >= 50
        ? 'stroke-amber-500/15'
        : 'stroke-red-500/15'
  const textColor =
    score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'

  const fontSize = size >= 100 ? '1.5rem' : size >= 70 ? '1.125rem' : '0.875rem'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" className={bgColor} strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${textColor}`} style={{ fontSize }}>
          {score}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium leading-none mt-0.5">
          / 100
        </span>
      </div>
    </div>
  )
}

interface AuditingViewProps {
  propertyName: string
  auditPhase: number
}

const AUDIT_STEPS = [
  'Connecting to GA4 API',
  'Reading property settings',
  'Analyzing data streams & events',
  'Checking integrations',
  'Generating report',
] as const

export function AuditingView({ propertyName, auditPhase }: AuditingViewProps) {
  return (
    <div className="px-6 md:px-8 py-16 max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-lg font-bold text-foreground">Auditing Your GA4 Setup</h2>
        <p className="text-sm text-muted-foreground">
          Analyzing <span className="font-medium text-foreground">{propertyName}</span>
        </p>
      </div>

      {/* Progress steps */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 space-y-3.5">
        {AUDIT_STEPS.map((label, phase) => {
          const isDone = auditPhase > phase
          const isCurrent = auditPhase === phase
          return (
            <div key={phase} className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3 text-emerald-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <svg
                    className="w-5 h-5 text-orange-500 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeOpacity="0.15"
                    />
                    <path
                      d="M12 2a10 10 0 019.95 9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-border bg-muted/30" />
                )}
              </div>
              <span
                className={`text-sm ${isCurrent ? 'text-foreground font-medium' : isDone ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Estimated time */}
      <p className="text-center text-[11px] text-muted-foreground">
        This usually takes 15&ndash;30 seconds depending on property size.
      </p>
    </div>
  )
}

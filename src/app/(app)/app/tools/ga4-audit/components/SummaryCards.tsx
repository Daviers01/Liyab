import type { AuditSummary } from '@/types/audit'

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function FailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const cards = [
  {
    key: 'passed' as const,
    label: 'Passed',
    Icon: CheckIcon,
    textClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/5 border-emerald-500/20',
    labelClass: 'text-emerald-600/70 dark:text-emerald-400/70',
  },
  {
    key: 'warnings' as const,
    label: 'Warnings',
    Icon: WarnIcon,
    textClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-500/5 border-amber-500/20',
    labelClass: 'text-amber-600/70 dark:text-amber-400/70',
  },
  {
    key: 'failures' as const,
    label: 'Failed',
    Icon: FailIcon,
    textClass: 'text-red-600 dark:text-red-400',
    bgClass: 'bg-red-500/5 border-red-500/20',
    labelClass: 'text-red-600/70 dark:text-red-400/70',
  },
  {
    key: 'info' as const,
    label: 'Info',
    Icon: InfoIcon,
    textClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-500/5 border-blue-500/20',
    labelClass: 'text-blue-600/70 dark:text-blue-400/70',
  },
]

export function SummaryCards({ summary }: { summary: AuditSummary }) {
  const total = summary.passed + summary.warnings + summary.failures + summary.info

  return (
    <div className="space-y-3">
      {/* Main stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(({ key, label, Icon, textClass, bgClass, labelClass }) => (
          <div
            key={key}
            className={`rounded-xl border ${bgClass} p-3.5 flex items-center gap-3`}
          >
            <div className={`shrink-0 ${textClass}`}>
              <Icon />
            </div>
            <div>
              <p className={`text-xl font-bold leading-none ${textClass}`}>{summary[key]}</p>
              <p className={`text-[11px] font-medium mt-0.5 ${labelClass}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      {total > 0 && (
        <div className="rounded-xl border border-border bg-card/80 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Overall Health</span>
            <span className="text-xs text-muted-foreground">
              {summary.passed + summary.info} of {total} checks OK
            </span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden bg-muted/30">
            {summary.passed > 0 && (
              <div
                className="bg-emerald-500 transition-all"
                style={{ width: `${(summary.passed / total) * 100}%` }}
              />
            )}
            {summary.info > 0 && (
              <div
                className="bg-blue-400 transition-all"
                style={{ width: `${(summary.info / total) * 100}%` }}
              />
            )}
            {summary.warnings > 0 && (
              <div
                className="bg-amber-500 transition-all"
                style={{ width: `${(summary.warnings / total) * 100}%` }}
              />
            )}
            {summary.failures > 0 && (
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${(summary.failures / total) * 100}%` }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

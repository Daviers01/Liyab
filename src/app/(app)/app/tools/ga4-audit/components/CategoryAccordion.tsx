import type { AuditCheckResult } from '@/types/audit'
import { StatusIcon } from './StatusIcon'

interface CategoryAccordionProps {
  category: string
  checks: AuditCheckResult[]
  isExpanded: boolean
  onToggle: () => void
}

export function CategoryAccordion({
  category,
  checks,
  isExpanded,
  onToggle,
}: CategoryAccordionProps) {
  const failCount = checks.filter((c) => c.status === 'fail').length
  const warnCount = checks.filter((c) => c.status === 'warn').length
  const passCount = checks.filter((c) => c.status === 'pass').length
  const infoCount = checks.filter((c) => c.status === 'info').length

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/5 transition-colors cursor-pointer gap-3"
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">{category}</h3>
            <span className="text-[11px] text-muted-foreground">{checks.length} checks</span>
            {failCount > 0 && (
              <span className="text-[10px] font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-full px-1.5 py-0.5">
                {failCount} failed
              </span>
            )}
            {warnCount > 0 && (
              <span className="text-[10px] font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-1.5 py-0.5">
                {warnCount} warning{warnCount > 1 ? 's' : ''}
              </span>
            )}
            {failCount === 0 && warnCount === 0 && passCount === checks.length && (
              <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-1.5 py-0.5">
                All passed
              </span>
            )}
          </div>
          {/* Mini progress bar */}
          <div className="flex h-1 rounded-full overflow-hidden bg-muted/30 max-w-xs">
            {passCount > 0 && (
              <div
                className="bg-emerald-500"
                style={{ width: `${(passCount / checks.length) * 100}%` }}
              />
            )}
            {infoCount > 0 && (
              <div
                className="bg-blue-500"
                style={{ width: `${(infoCount / checks.length) * 100}%` }}
              />
            )}
            {warnCount > 0 && (
              <div
                className="bg-amber-500"
                style={{ width: `${(warnCount / checks.length) * 100}%` }}
              />
            )}
            {failCount > 0 && (
              <div
                className="bg-red-500"
                style={{ width: `${(failCount / checks.length) * 100}%` }}
              />
            )}
          </div>
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="border-t border-border">
          {checks.map((check, idx) => (
            <div
              key={check.id}
              className={`p-4 md:px-5 flex gap-3 ${idx < checks.length - 1 ? 'border-b border-border/50' : ''} ${
                check.status === 'fail'
                  ? 'bg-red-500/[0.02]'
                  : check.status === 'warn'
                    ? 'bg-amber-500/[0.02]'
                    : ''
              }`}
            >
              <StatusIcon status={check.status} />
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-semibold text-foreground text-xs">{check.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{check.message}</p>
                {check.recommendation && (
                  <div className="mt-2 rounded-lg bg-orange-500/5 border border-orange-500/15 p-2.5">
                    <p className="text-[11px] text-orange-700 dark:text-orange-300 leading-relaxed">
                      <span className="font-bold">Recommended fix:</span> {check.recommendation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

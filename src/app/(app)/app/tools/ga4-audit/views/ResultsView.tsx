import Link from 'next/link'
import type { AuditCheckResult, AuditReport } from '@/types/audit'
import { HealthScoreRing, SummaryCards, CategoryAccordion } from '../components'

interface ResultsViewProps {
  report: AuditReport
  expandedCategories: string[]
  onToggleCategory: (category: string) => void
  onExpandCollapseAll: () => void
  saving: boolean
  savedReportId: string | null
  exporting: boolean
  onExportPDF: () => void
  onReset: () => void
}

export function ResultsView({
  report,
  expandedCategories,
  onToggleCategory,
  onExpandCollapseAll,
  saving,
  savedReportId,
  exporting,
  onExportPDF,
  onReset,
}: ResultsViewProps) {
  // Group checks by category
  const groupedChecks = report.checks.reduce(
    (acc, check) => {
      if (!acc[check.category]) acc[check.category] = []
      acc[check.category].push(check)
      return acc
    },
    {} as Record<string, AuditCheckResult[]>,
  )

  const allCategories = Object.keys(groupedChecks)
  const allExpanded = expandedCategories.length === allCategories.length

  return (
    <div className="px-6 md:px-8 py-6 space-y-5 max-w-6xl mx-auto">
      {/* Score + summary */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          <HealthScoreRing score={report.healthScore} />
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {report.healthScore >= 80
                  ? 'Looking Good!'
                  : report.healthScore >= 50
                    ? 'Needs Attention'
                    : 'Critical Issues Found'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {report.propertyName} &middot; {report.propertyId.replace('properties/', '')}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {report.healthScore >= 80
                ? 'Your GA4 setup is solid. A few optimizations could improve data quality further.'
                : report.healthScore >= 50
                  ? 'Your setup has gaps. Addressing the issues below will significantly improve data quality.'
                  : 'Multiple critical issues found. Address these immediately to avoid unreliable reporting.'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary stat cards */}
      <SummaryCards summary={report.summary} />

      {/* Expand / Collapse all */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Detailed Results</p>
        <button
          onClick={onExpandCollapseAll}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {/* Detailed checks */}
      {Object.entries(groupedChecks).map(([category, checks]) => (
        <CategoryAccordion
          key={category}
          category={category}
          checks={checks}
          isExpanded={expandedCategories.includes(category)}
          onToggle={() => onToggleCategory(category)}
        />
      ))}

      {/* Timestamp + Save Status */}
      <div className="text-center space-y-1.5">
        <p className="text-[11px] text-muted-foreground">
          Audit completed on{' '}
          {new Date(report.timestamp).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}{' '}
          at{' '}
          {new Date(report.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        {saving && (
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
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
            Saving report...
          </p>
        )}
        {!saving && savedReportId && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Report saved automatically
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-1">
        <button
          onClick={onExportPDF}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
        >
          {exporting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.2"
                />
                <path
                  d="M12 2a10 10 0 019.95 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
              Export PDF Report
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:border-orange-500/40 text-foreground font-medium rounded-xl transition-colors cursor-pointer text-sm"
        >
          Run Another Audit
        </button>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:border-orange-500/40 text-foreground font-medium rounded-xl transition-colors text-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

import type { SavedReportSummary } from '@/types/audit'
import { FireLoader } from '@/app/(app)/components/FireLoader'
import { auditCategories } from '../constants'

interface ReadyViewProps {
  onConnect: () => void
  savedReports: SavedReportSummary[]
  savedReportsLoading: boolean
  onLoadReport: (id: string) => void
  onDeleteReport: (id: string) => void
}

export function ReadyView({
  onConnect,
  savedReports,
  savedReportsLoading,
  onLoadReport,
  onDeleteReport,
}: ReadyViewProps) {
  return (
    <div className="px-6 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 items-start">
        {/* Left: Getting Started */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Getting Started</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Analyze your GA4 property configuration and identify tracking issues, missing
                  conversions, and optimization opportunities.
                </p>
              </div>
            </div>

            <div className="space-y-3 pl-11">
              {[
                {
                  step: '1',
                  title: 'Connect your Google account',
                  desc: 'If you signed in with Google, your account is already linked. Otherwise a one-time OAuth popup will appear.',
                },
                {
                  step: '2',
                  title: 'Choose a GA4 property',
                  desc: 'Select which property to analyze — all properties you have read access to will appear.',
                },
                {
                  step: '3',
                  title: 'Review your report',
                  desc: 'Get a health score and actionable findings across 6 categories.',
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-start gap-2.5">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 leading-relaxed">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Read-only access.
                </span>{' '}
                We never store, copy, or share your analytics data.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={onConnect}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-600/20 cursor-pointer text-sm"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
              </svg>
              Connect Google &amp; Start Audit
            </button>
          </div>

          {/* What We Check */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              What We Check
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {auditCategories.map((cat) => (
                <div
                  key={cat.title}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="w-6 h-6 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    {cat.icon}
                  </div>
                  <p className="text-[11px] font-semibold text-foreground leading-tight">
                    {cat.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Past Audits */}
        <PastAuditsPanel
          savedReports={savedReports}
          savedReportsLoading={savedReportsLoading}
          onConnect={onConnect}
          onLoadReport={onLoadReport}
          onDeleteReport={onDeleteReport}
        />
      </div>
    </div>
  )
}

// ─── Past Audits Panel (sub-component) ───────────────────────────────────────

function PastAuditsPanel({
  savedReports,
  savedReportsLoading,
  onConnect,
  onLoadReport,
  onDeleteReport,
}: {
  savedReports: SavedReportSummary[]
  savedReportsLoading: boolean
  onConnect: () => void
  onLoadReport: (id: string) => void
  onDeleteReport: (id: string) => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden flex flex-col">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted-foreground">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-sm font-bold text-foreground">Past Audits</h3>
          {!savedReportsLoading && (
            <span className="text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md font-medium">
              {savedReports.length}
            </span>
          )}
        </div>
        {savedReports.length > 0 && (
          <button
            onClick={onConnect}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            New Audit
          </button>
        )}
      </div>

      {/* Panel body */}
      {savedReportsLoading ? (
        <div className="p-10 flex justify-center items-center">
          <FireLoader size={48} label="Loading reports..." />
        </div>
      ) : savedReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted/40 border border-border flex items-center justify-center">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-6 h-6 text-muted-foreground/40"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">No audits yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
              Run your first audit and the report will appear here automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border/50 overflow-y-auto max-h-[600px]">
          {savedReports.map((r) => (
            <SavedReportRow key={r.id} report={r} onLoad={onLoadReport} onDelete={onDeleteReport} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Saved Report Row ────────────────────────────────────────────────────────

function SavedReportRow({
  report: r,
  onLoad,
  onDelete,
}: {
  report: SavedReportSummary
  onLoad: (id: string) => void
  onDelete: (id: string) => void
}) {
  const scoreColor =
    r.healthScore >= 80
      ? 'text-emerald-500'
      : r.healthScore >= 50
        ? 'text-amber-500'
        : 'text-red-500'
  const scoreBg =
    r.healthScore >= 80
      ? 'bg-emerald-500/10 border-emerald-500/20'
      : r.healthScore >= 50
        ? 'bg-amber-500/10 border-amber-500/20'
        : 'bg-red-500/10 border-red-500/20'
  const scoreRing =
    r.healthScore >= 80
      ? 'ring-emerald-500/20'
      : r.healthScore >= 50
        ? 'ring-amber-500/20'
        : 'ring-red-500/20'

  return (
    <div className="px-5 py-4 hover:bg-muted/5 transition-colors flex items-center justify-between gap-4 group">
      <button
        onClick={() => onLoad(r.id)}
        className="flex items-center gap-4 min-w-0 flex-1 text-left cursor-pointer"
      >
        {/* Score badge */}
        <div
          className={`w-12 h-12 rounded-xl ${scoreBg} border ring-2 ${scoreRing} flex flex-col items-center justify-center shrink-0`}
        >
          <span className={`text-base font-bold leading-none ${scoreColor}`}>{r.healthScore}</span>
          <span className="text-[9px] text-muted-foreground mt-0.5 leading-none">/100</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
            {r.propertyName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-mono">
              {r.propertyId.replace('properties/', '')}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-[11px] text-muted-foreground">
              {new Date(r.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            {r.summary.passed > 0 && (
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-md px-1.5 py-0.5">
                {r.summary.passed} passed
              </span>
            )}
            {r.summary.warnings > 0 && (
              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-md px-1.5 py-0.5">
                {r.summary.warnings} warn
              </span>
            )}
            {r.summary.failures > 0 && (
              <span className="text-[10px] font-medium text-red-600 dark:text-red-400 bg-red-500/10 rounded-md px-1.5 py-0.5">
                {r.summary.failures} failed
              </span>
            )}
          </div>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (confirm('Delete this audit report?')) onDelete(r.id)
        }}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all cursor-pointer shrink-0"
        title="Delete report"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.78.72l.5 6a.75.75 0 01-1.5.12l-.5-6a.75.75 0 01.72-.78zm3.62.72a.75.75 0 10-1.5-.06l-.5 6a.75.75 0 101.5.06l.5-6z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

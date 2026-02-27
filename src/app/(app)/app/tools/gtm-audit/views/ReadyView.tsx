'use client'

import { useState } from 'react'
import type { SavedGTMReportSummary } from '@/types/gtm-audit'
import { FireLoader } from '@/app/(app)/components/FireLoader'
import { auditCategories } from '../constants'

interface ReadyViewProps {
  onConnect: () => void
  savedReports: SavedGTMReportSummary[]
  savedReportsLoading: boolean
  onLoadReport: (id: number) => void
  onDeleteReport: (id: number) => void
}

export function ReadyView({
  onConnect,
  savedReports,
  savedReportsLoading,
  onLoadReport,
  onDeleteReport,
}: ReadyViewProps) {
  const [checksOpen, setChecksOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 9

  const filteredReports = savedReports.filter((r) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      r.containerName.toLowerCase().includes(q) ||
      r.publicId.toLowerCase().includes(q) ||
      r.containerId.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE)
  const pagedReports = filteredReports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  return (
    <div className="px-6 md:px-8 py-6 space-y-5">
      {/* ── Hero strip ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h2 className="text-base font-bold text-foreground">GTM Audit</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            50+ automated checks across tags, triggers, variables, consent mode, ecommerce, naming
            conventions, security, and your full MarTech stack.
          </p>
          <div className="flex items-center gap-1.5 pt-0.5">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 text-emerald-500 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[11px] text-muted-foreground">
              Read-only access — your container data is never stored or shared.
            </span>
          </div>
        </div>
        <button
          onClick={onConnect}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-600/20 cursor-pointer text-sm shrink-0"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v11.5A2.25 2.25 0 0115.75 18H4.25A2.25 2.25 0 012 15.75V4.25zm2.25-.75a.75.75 0 00-.75.75v.758l9.25 7.948 4.25-3.653v-5.053a.75.75 0 00-.75-.75H4.25z" />
          </svg>
          Start New Audit
        </button>
      </div>

      {/* ── What We Check (collapsible) ───────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
        <button
          onClick={() => setChecksOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">What We Check</h3>
            <span className="text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md font-medium">
              {auditCategories.length} categories
            </span>
          </div>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${checksOpen ? 'rotate-180' : ''}`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {checksOpen && (
          <div className="px-5 pb-5 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-4">
              {auditCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div className="w-6 h-6 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5 text-orange-500">
                    {cat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-foreground leading-tight">
                      {cat.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Past Audits ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Past Audits</h3>
            {!savedReportsLoading && savedReports.length > 0 && (
              <span className="text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md font-medium">
                {savedReports.length}
              </span>
            )}
          </div>
          {!savedReportsLoading && savedReports.length > 0 && (
            <div className="relative sm:ml-auto">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by container name or ID…"
                className="w-full sm:w-64 pl-8 pr-8 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500/40 transition-colors"
              />
              {search && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {savedReportsLoading ? (
          <div className="rounded-2xl border border-border bg-card/80 p-12 flex justify-center">
            <FireLoader size={40} label="Loading reports…" />
          </div>
        ) : savedReports.length === 0 ? (
          <EmptyState onConnect={onConnect} />
        ) : filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/80 p-8 flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-medium text-foreground">
              No audits match &quot;{search}&quot;
            </p>
            <p className="text-xs text-muted-foreground">Try a different container name or ID.</p>
            <button
              onClick={() => handleSearch('')}
              className="text-xs text-orange-500 hover:underline cursor-pointer mt-1"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {pagedReports.map((r) => (
                <AuditCard key={r.id} report={r} onLoad={onLoadReport} onDelete={onDeleteReport} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-muted-foreground">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredReports.length)}{' '}
                  of {filteredReports.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-border hover:border-orange-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Previous page"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-foreground"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, idx) =>
                      p === '…' ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-1 text-xs text-muted-foreground select-none"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            p === page
                              ? 'bg-orange-600 text-white border border-orange-600'
                              : 'border border-border hover:border-orange-500/40 text-foreground'
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-border hover:border-orange-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Next page"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-foreground"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Audit Card ───────────────────────────────────────────────────────────────

function AuditCard({
  report: r,
  onLoad,
  onDelete,
}: {
  report: SavedGTMReportSummary
  onLoad: (id: number) => void
  onDelete: (id: number) => void
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

  const total = r.summary?.total || 1
  const passW = Math.round(((r.summary?.passed ?? 0) / total) * 100)
  const warnW = Math.round(((r.summary?.warnings ?? 0) / total) * 100)
  const failW = Math.round(((r.summary?.failures ?? 0) / total) * 100)

  return (
    <div className="group rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 flex flex-col gap-3 hover:border-orange-500/30 transition-colors relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (confirm('Delete this audit report?')) onDelete(r.id)
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground/50 hover:text-red-500 transition-all cursor-pointer"
        title="Delete report"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.78.72l.5 6a.75.75 0 01-1.5.12l-.5-6a.75.75 0 01.72-.78zm3.62.72a.75.75 0 10-1.5-.06l-.5 6a.75.75 0 101.5.06l.5-6z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        onClick={() => onLoad(r.id)}
        className="flex items-center gap-3 text-left cursor-pointer min-w-0"
      >
        <div
          className={`w-14 h-14 rounded-xl ${scoreBg} border flex flex-col items-center justify-center shrink-0`}
        >
          <span className={`text-xl font-bold leading-none ${scoreColor}`}>{r.healthScore}</span>
          <span className="text-[9px] text-muted-foreground mt-0.5 leading-none">/100</span>
        </div>
        <div className="min-w-0 flex-1 pr-6">
          <p className="text-sm font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate leading-tight">
            {r.containerName}
          </p>
          <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
            {r.publicId}
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            {new Date(r.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </button>

      {r.summary && (
        <div className="space-y-1.5">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-muted/40 gap-px">
            {passW > 0 && (
              <div className="bg-emerald-500/60 rounded-full" style={{ width: `${passW}%` }} />
            )}
            {warnW > 0 && (
              <div className="bg-amber-500/60 rounded-full" style={{ width: `${warnW}%` }} />
            )}
            {failW > 0 && (
              <div className="bg-red-500/60 rounded-full" style={{ width: `${failW}%` }} />
            )}
          </div>
          <div className="flex items-center gap-3">
            {(r.summary.passed ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 shrink-0" />
                {r.summary.passed} passed
              </span>
            )}
            {(r.summary.warnings ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70 shrink-0" />
                {r.summary.warnings} warn
              </span>
            )}
            {(r.summary.failures ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/60 shrink-0" />
                {r.summary.failures} failed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 md:p-10">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-orange-500">
              <path d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v11.5A2.25 2.25 0 0115.75 18H4.25A2.25 2.25 0 012 15.75V4.25zm2.25-.75a.75.75 0 00-.75.75v.758l9.25 7.948 4.25-3.653v-5.053a.75.75 0 00-.75-.75H4.25z" />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Connect GTM',
              desc: 'Sign in with Google and grant read-only access to your Tag Manager account. A one-time OAuth popup will appear.',
            },
            {
              step: '2',
              title: 'Select a container',
              desc: 'Choose which GTM container to audit — all containers you have read access to will appear.',
            },
            {
              step: '3',
              title: 'Review your report',
              desc: 'Get a health score and actionable findings across 12 categories. Reports are saved automatically.',
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
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onConnect}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-600/20 cursor-pointer text-sm"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v11.5A2.25 2.25 0 0115.75 18H4.25A2.25 2.25 0 012 15.75V4.25zm2.25-.75a.75.75 0 00-.75.75v.758l9.25 7.948 4.25-3.653v-5.053a.75.75 0 00-.75-.75H4.25z" />
          </svg>
          Connect GTM &amp; Start Audit
        </button>
      </div>
    </div>
  )
}

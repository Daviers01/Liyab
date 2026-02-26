'use client'

import { useState } from 'react'
import type { AuditCheckResult, AnalyticsSnapshot } from '@/types/audit'
import { StatusIcon } from './StatusIcon'

interface CategoryAccordionProps {
  category: string
  checks: AuditCheckResult[]
  isExpanded: boolean
  onToggle: () => void
  aiSuggestions?: Record<string, string>
  aiLoading?: string | null
  onAskAI?: (check: AuditCheckResult) => void
  analyticsSnapshot?: AnalyticsSnapshot
}

export function CategoryAccordion({
  category,
  checks,
  isExpanded,
  onToggle,
  aiSuggestions = {},
  aiLoading,
  onAskAI,
}: CategoryAccordionProps) {
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})

  const toggleDetails = (id: string) => setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }))

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
        <div className="border-t border-border divide-y divide-border/50">
          {checks.map((check) => {
            const hasIssues = check.issues && check.issues.length > 0
            const hasConfigured = check.properlyConfigured && check.properlyConfigured.length > 0
            const hasDetails = hasIssues || hasConfigured
            const isDetailsExpanded = expandedDetails[check.id]
            const aiSuggestion = aiSuggestions[check.id]
            const isAiLoading = aiLoading === check.id

            return (
              <div
                key={check.id}
                className={`p-4 md:px-5 space-y-3 ${
                  check.status === 'fail'
                    ? 'bg-red-500/[0.02]'
                    : check.status === 'warn'
                      ? 'bg-amber-500/[0.02]'
                      : ''
                }`}
              >
                {/* ── Header row ── */}
                <div className="flex gap-3">
                  <StatusIcon status={check.status} />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-xs leading-relaxed">
                        {check.name}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Tip button */}
                        {check.tip && (
                          <span
                            title={check.tip}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-semibold cursor-help"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Tip
                          </span>
                        )}
                        {/* Ask AI button */}
                        {onAskAI && (check.status === 'fail' || check.status === 'warn') && (
                          <button
                            onClick={() => onAskAI(check)}
                            disabled={isAiLoading || !!aiSuggestion}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-semibold hover:from-orange-500/20 hover:to-amber-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isAiLoading ? (
                              <>
                                <svg
                                  className="w-3 h-3 animate-spin"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
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
                                Thinking…
                              </>
                            ) : aiSuggestion ? (
                              <>
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
                                AI Ready
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0V11zm1-5a1 1 0 100 2 1 1 0 000-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Ask AI
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{check.message}</p>
                  </div>
                </div>

                {/* ── Tip box ── */}
                {check.tip && (
                  <div className="ml-8 rounded-lg bg-blue-500/5 border border-blue-500/15 p-2.5">
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                      <span className="font-bold">💡 Tip:</span> {check.tip}
                    </p>
                  </div>
                )}

                {/* ── Recommendation ── */}
                {check.recommendation && (
                  <div className="ml-8 rounded-lg bg-orange-500/5 border border-orange-500/15 p-2.5">
                    <p className="text-[11px] text-orange-700 dark:text-orange-300 leading-relaxed">
                      <span className="font-bold">Recommended fix:</span> {check.recommendation}
                    </p>
                  </div>
                )}

                {/* ── AI Suggestion ── */}
                {aiSuggestion && (
                  <div className="ml-8 rounded-lg bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/20 p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3.5 h-3.5 text-orange-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0V11zm1-5a1 1 0 100 2 1 1 0 000-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                        AI Suggestion
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {aiSuggestion}
                    </p>
                  </div>
                )}

                {/* ── Details tables ── */}
                {hasDetails && (
                  <div className="ml-8">
                    <button
                      onClick={() => toggleDetails(check.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-3 h-3 transition-transform ${isDetailsExpanded ? 'rotate-90' : ''}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {isDetailsExpanded ? 'Hide' : 'Show'} details
                      {hasIssues && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-semibold">
                          {check.issues!.length} item{check.issues!.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </button>

                    {isDetailsExpanded && (
                      <div className="mt-2 space-y-3">
                        {/* Issues / detected items table */}
                        {hasIssues &&
                          (() => {
                            const metaKeys = Array.from(
                              new Set(check.issues!.flatMap((it) => Object.keys(it.meta ?? {}))),
                            )
                            const hasDetailCol = check.issues!.some((it) => it.detail)
                            return (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                  Detected Items ({check.issues!.length})
                                </p>
                                <div className="overflow-x-auto rounded-lg border border-border">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="bg-muted/30 border-b border-border">
                                        <th className="text-left px-3 py-2 font-semibold text-muted-foreground">
                                          Item
                                        </th>
                                        <th className="text-left px-3 py-2 font-semibold text-muted-foreground w-20">
                                          Status
                                        </th>
                                        {metaKeys.map((k) => (
                                          <th
                                            key={k}
                                            className="text-left px-3 py-2 font-semibold text-muted-foreground"
                                          >
                                            {k}
                                          </th>
                                        ))}
                                        {hasDetailCol && !metaKeys.length && (
                                          <th className="text-left px-3 py-2 font-semibold text-muted-foreground">
                                            Detail
                                          </th>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                      {check.issues!.map((it, i) => (
                                        <tr key={i} className="hover:bg-muted/10 transition-colors">
                                          <td className="px-3 py-2 font-medium text-foreground">
                                            {it.label}
                                          </td>
                                          <td className="px-3 py-2">
                                            <span
                                              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                it.status === 'fail'
                                                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                  : it.status === 'warn'
                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                    : it.status === 'pass'
                                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                              }`}
                                            >
                                              {it.status}
                                            </span>
                                          </td>
                                          {metaKeys.map((k) => (
                                            <td key={k} className="px-3 py-2 text-muted-foreground">
                                              {it.meta?.[k] ?? '—'}
                                            </td>
                                          ))}
                                          {hasDetailCol && !metaKeys.length && (
                                            <td className="px-3 py-2 text-muted-foreground">
                                              {it.detail || '—'}
                                            </td>
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          })()}

                        {/* Properly configured table */}
                        {hasConfigured &&
                          (() => {
                            const metaKeys = Array.from(
                              new Set(
                                check.properlyConfigured!.flatMap((it) =>
                                  Object.keys(it.meta ?? {}),
                                ),
                              ),
                            )
                            const hasDetailCol = check.properlyConfigured!.some((it) => it.detail)
                            return (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                  Properly Configured ({check.properlyConfigured!.length})
                                </p>
                                <div className="overflow-x-auto rounded-lg border border-border">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="bg-muted/30 border-b border-border">
                                        <th className="text-left px-3 py-2 font-semibold text-muted-foreground">
                                          Item
                                        </th>
                                        {metaKeys.map((k) => (
                                          <th
                                            key={k}
                                            className="text-left px-3 py-2 font-semibold text-muted-foreground"
                                          >
                                            {k}
                                          </th>
                                        ))}
                                        {hasDetailCol && !metaKeys.length && (
                                          <th className="text-left px-3 py-2 font-semibold text-muted-foreground">
                                            Detail
                                          </th>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                      {check.properlyConfigured!.map((it, i) => (
                                        <tr key={i} className="hover:bg-muted/10 transition-colors">
                                          <td className="px-3 py-2 font-medium text-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                              <svg
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-3 h-3 text-emerald-500 shrink-0"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                              {it.label}
                                            </span>
                                          </td>
                                          {metaKeys.map((k) => (
                                            <td key={k} className="px-3 py-2 text-muted-foreground">
                                              {it.meta?.[k] ?? '—'}
                                            </td>
                                          ))}
                                          {hasDetailCol && !metaKeys.length && (
                                            <td className="px-3 py-2 text-muted-foreground">
                                              {it.detail || '—'}
                                            </td>
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

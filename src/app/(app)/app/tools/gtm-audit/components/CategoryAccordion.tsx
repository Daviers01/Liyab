'use client'

import { useState, useCallback } from 'react'
import type { AuditCheckResult } from '@/types/audit'
import { StatusIcon } from './StatusIcon'

interface CategoryAccordionProps {
  category: string
  checks: AuditCheckResult[]
  isExpanded: boolean
  onToggle: () => void
  aiSuggestions?: Record<string, string>
  aiLoading?: string | null
  onAskAI?: (check: AuditCheckResult) => void
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^\d+\. /gm, '• ')
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
      {/* Accordion header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/5 transition-colors cursor-pointer gap-3"
      >
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">{category}</h3>
            <span className="text-[11px] text-muted-foreground">{checks.length} checks</span>
            {failCount > 0 && (
              <span className="text-[10px] font-medium text-muted-foreground bg-red-500/10 border border-red-500/20 rounded-full px-1.5 py-0.5">
                {failCount} failed
              </span>
            )}
            {warnCount > 0 && (
              <span className="text-[10px] font-medium text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-full px-1.5 py-0.5">
                {warnCount} warning{warnCount > 1 ? 's' : ''}
              </span>
            )}
            {failCount === 0 && warnCount === 0 && (
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-1.5 py-0.5">
                All passed
              </span>
            )}
          </div>
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
                className={`p-4 md:px-5 space-y-3 border-l-2 ${
                  check.status === 'fail'
                    ? 'border-l-red-500/40'
                    : check.status === 'warn'
                      ? 'border-l-amber-500/40'
                      : 'border-l-transparent'
                }`}
              >
                <div className="flex gap-3">
                  <StatusIcon status={check.status} />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-xs leading-relaxed">
                        {check.name}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {check.tip && (
                          <span
                            title={check.tip}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 border border-border text-muted-foreground text-[10px] font-medium cursor-help"
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
                        {(check.status === 'fail' || check.status === 'warn') && onAskAI && (
                          <button
                            onClick={() => onAskAI(check)}
                            disabled={isAiLoading || Boolean(aiSuggestion)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-medium cursor-pointer hover:bg-orange-500/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isAiLoading ? (
                              <>
                                <svg
                                  className="w-2.5 h-2.5 animate-spin"
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
                                Thinking...
                              </>
                            ) : aiSuggestion ? (
                              <>
                                <svg
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-2.5 h-2.5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Explained
                              </>
                            ) : (
                              <>
                                <svg
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-2.5 h-2.5"
                                >
                                  <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zm8-5a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zm-13 0a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10z" />
                                </svg>
                                Ask AI
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{check.message}</p>
                    {check.recommendation && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                        → {check.recommendation}
                      </p>
                    )}
                  </div>
                </div>

                {/* AI Suggestion */}
                {aiSuggestion && (
                  <div className="ml-7 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 text-orange-500"
                      >
                        <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2z" />
                      </svg>
                      <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                        AI Explanation
                      </span>
                    </div>
                    <p
                      className="text-xs text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(aiSuggestion)}</p>` }}
                    />
                  </div>
                )}

                {/* Details toggle */}
                {hasDetails && (
                  <div className="ml-7">
                    <button
                      onClick={() => toggleDetails(check.id)}
                      className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-3 h-3 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {isDetailsExpanded ? 'Hide' : 'Show'} details
                      {hasIssues &&
                        ` (${check.issues!.length} issue${check.issues!.length > 1 ? 's' : ''})`}
                    </button>

                    {isDetailsExpanded && (
                      <div className="mt-2 space-y-1">
                        {hasIssues && (
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                              Issues
                            </p>
                            {check.issues!.map((issue, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <StatusIcon status={issue.status} size="sm" />
                                <div className="min-w-0">
                                  <span className="text-foreground font-medium">{issue.label}</span>
                                  {issue.detail && (
                                    <span className="text-muted-foreground ml-1.5">
                                      {issue.detail}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {hasConfigured && (
                          <div className="space-y-1 mt-2">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                              Detected
                            </p>
                            {check.properlyConfigured!.map((cfg, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <StatusIcon status={cfg.status} size="sm" />
                                <div className="min-w-0">
                                  <span className="text-foreground font-medium">{cfg.label}</span>
                                  {cfg.detail && (
                                    <span className="text-muted-foreground ml-1.5">
                                      {cfg.detail}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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

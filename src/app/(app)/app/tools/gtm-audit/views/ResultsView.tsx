'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { AuditCheckResult } from '@/types/audit'
import type { GTMAuditReport } from '@/types/gtm-audit'
import { HealthScoreRing, SummaryCards, CategoryAccordion, MarTechStack } from '../components'
import { auditCategories } from '../constants'

interface ResultsViewProps {
  report: GTMAuditReport
  expandedCategories: string[]
  onToggleCategory: (category: string) => void
  onExpandCollapseAll: () => void
  saving: boolean
  savedReportId: number | null
  onReset: () => void
}

export function ResultsView({
  report,
  expandedCategories,
  onToggleCategory,
  onExpandCollapseAll,
  saving,
  savedReportId,
  onReset,
}: ResultsViewProps) {
  const [showDetailed, setShowDetailed] = useState(false)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({})
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

  const handleAskAI = useCallback(
    async (check: AuditCheckResult) => {
      if (aiSuggestions[check.id]) return
      setAiLoading(check.id)
      try {
        const prompt = `GTM Audit Issue: "${check.name}" — Status: ${check.status}\nMessage: ${check.message}\n${check.recommendation ? `Recommendation: ${check.recommendation}` : ''}\n\nProvide a brief, actionable resolution guide (3-5 steps). Be specific to Google Tag Manager.`
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt, context: 'gtm-audit' }),
        })
        if (res.ok) {
          const data = await res.json()
          setAiSuggestions((prev) => ({
            ...prev,
            [check.id]: data.response || data.message || 'No suggestion available.',
          }))
        } else {
          setAiSuggestions((prev) => ({
            ...prev,
            [check.id]:
              `**How to resolve "${check.name}":**\n\n` +
              (check.recommendation || check.message) +
              '\n\n*AI-powered suggestions require an AI endpoint configuration.*',
          }))
        }
      } catch {
        setAiSuggestions((prev) => ({
          ...prev,
          [check.id]:
            `**How to resolve "${check.name}":**\n\n` +
            (check.recommendation || check.message) +
            '\n\n*AI-powered suggestions require an AI endpoint configuration.*',
        }))
      } finally {
        setAiLoading(null)
      }
    },
    [aiSuggestions],
  )

  const headline =
    report.healthScore >= 80
      ? 'Looking Good!'
      : report.healthScore >= 50
        ? 'Needs Attention'
        : 'Critical Issues Found'

  const subtitle =
    report.healthScore >= 80
      ? 'Your GTM setup is well-structured. A few optimizations could improve it further.'
      : report.healthScore >= 50
        ? 'Your setup has notable issues. Addressing them will improve tag quality and data reliability.'
        : 'Multiple critical issues found. Address these immediately to avoid data loss and compliance risks.'

  return (
    <div className="px-6 md:px-8 py-6 space-y-5">
      {/* ── Score overview panel ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          <HealthScoreRing score={report.healthScore} />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div>
              <h2 className="text-lg font-bold text-foreground">{headline}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {report.containerName} &middot; <span className="font-mono">{report.publicId}</span>
                {report.containerType && report.containerType.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md bg-muted/40 border border-border text-[10px] font-semibold uppercase">
                    {report.containerType.join(' / ')}
                  </span>
                )}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>
        </div>

        <SummaryCards
          summary={report.summary}
          tagCount={report.tagCount}
          triggerCount={report.triggerCount}
          variableCount={report.variableCount}
          publicId={report.publicId}
        />
      </div>

      {/* ── MarTech Stack ─────────────────────────────────────────────── */}
      {report.martech && report.martech.length > 0 && <MarTechStack items={report.martech} />}

      {/* ── Results Toggle ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-foreground">
            {showDetailed ? 'Detailed Results' : 'Results Summary'}
          </p>
          <button
            onClick={() => setShowDetailed(!showDetailed)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-semibold hover:bg-orange-500/15 transition-colors cursor-pointer"
          >
            {showDetailed ? (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 12.87z" />
                  <path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.758 0l7.25-4.25a.75.75 0 000-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 01-2.276 0L3.196 8.87z" />
                  <path d="M10.38 1.103a.75.75 0 00-.76 0l-7.25 4.25a.75.75 0 000 1.294l7.25 4.25a.75.75 0 00.76 0l7.25-4.25a.75.75 0 000-1.294l-7.25-4.25z" />
                </svg>
                Show Summary
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  <path
                    fillRule="evenodd"
                    d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Show Detailed Results
              </>
            )}
          </button>
        </div>
        {showDetailed && (
          <button
            onClick={onExpandCollapseAll}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        )}
      </div>

      {/* ── Summary View (default) ─────────────────────────────────── */}
      {!showDetailed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Object.entries(groupedChecks).map(([category, checks]) => {
            const failCount = checks.filter((c) => c.status === 'fail').length
            const warnCount = checks.filter((c) => c.status === 'warn').length
            const passCount = checks.filter((c) => c.status === 'pass').length
            const infoCount = checks.filter((c) => c.status === 'info').length
            const total = checks.length

            const statusIcon =
              failCount > 0 ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : warnCount > 0 ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500">
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )

            return (
              <div
                key={category}
                className="rounded-xl border border-border bg-card/80 p-4 flex items-center gap-4"
              >
                <div className="shrink-0">{statusIcon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{category}</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {passCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
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
                        {passCount}
                      </span>
                    )}
                    {warnCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 text-amber-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {warnCount}
                      </span>
                    )}
                    {failCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 text-red-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {failCount}
                      </span>
                    )}
                    {infoCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 text-blue-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {infoCount}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground/60">/ {total}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Detailed View ─────────────────────────────────────────────── */}
      {showDetailed && (
        <div className="space-y-3">
          {auditCategories
            .filter((cat) => groupedChecks[cat.title])
            .map((cat) => (
              <CategoryAccordion
                key={cat.id}
                category={cat.title}
                checks={groupedChecks[cat.title] ?? []}
                isExpanded={expandedCategories.includes(cat.title)}
                onToggle={() => onToggleCategory(cat.title)}
                aiSuggestions={aiSuggestions}
                aiLoading={aiLoading}
                onAskAI={handleAskAI}
              />
            ))}

          {/* Fallback: any categories not in auditCategories */}
          {allCategories
            .filter((cat) => !auditCategories.find((ac) => ac.title === cat))
            .map((cat) => (
              <CategoryAccordion
                key={cat}
                category={cat}
                checks={groupedChecks[cat] ?? []}
                isExpanded={expandedCategories.includes(cat)}
                onToggle={() => onToggleCategory(cat)}
                aiSuggestions={aiSuggestions}
                aiLoading={aiLoading}
                onAskAI={handleAskAI}
              />
            ))}
        </div>
      )}

      {/* ── Timestamp + Save Status ───────────────────────────────────── */}
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
          {' · '}
          {report.checks.length} checks across {allCategories.length} categories
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

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 pt-1">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:border-orange-500/40 text-foreground font-medium rounded-xl transition-colors cursor-pointer text-sm"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Back to Audits
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

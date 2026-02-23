'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import type { AuditCheckResult, AuditReport, SavedReportSummary } from '@/types/audit'
import { FireLoader } from '@/app/(app)/components/FireLoader'

// ─── Types ───────────────────────────────────────────────────────────────────

type AuditStatus = 'ready' | 'connecting' | 'selecting' | 'auditing' | 'done' | 'error'

interface GA4Property {
  name: string
  displayName: string
  propertyId: string
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: AuditCheckResult['status'] }) {
  if (status === 'pass')
    return (
      <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-emerald-500">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  if (status === 'warn')
    return (
      <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-amber-500">
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  if (status === 'fail')
    return (
      <div className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-red-500">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  return (
    <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-blue-500">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}

function HealthScoreRing({ score }: { score: number }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  const bgColor =
    score >= 80
      ? 'stroke-emerald-500/15'
      : score >= 50
        ? 'stroke-amber-500/15'
        : 'stroke-red-500/15'

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" className={bgColor} strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          className={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${color}`}>{score}</span>
        <span className="text-[10px] text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  )
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

function Stepper({ currentStep }: { currentStep: number }) {
  const steps = ['Connect Google', 'Select Property', 'View Report']
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isComplete = stepNum < currentStep
        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && <div className={`w-8 h-px ${isComplete ? 'bg-orange-500' : 'bg-border'}`} />}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  isComplete
                    ? 'bg-orange-500 text-white'
                    : isActive
                      ? 'bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400'
                      : 'bg-muted/50 border border-border text-muted-foreground'
                }`}
              >
                {isComplete ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive
                    ? 'text-foreground'
                    : isComplete
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/60'
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GA4AuditApp() {
  const [status, setStatus] = useState<AuditStatus>('ready')
  const [properties, setProperties] = useState<GA4Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<GA4Property | null>(null)
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [exporting, setExporting] = useState(false)
  const [connectPhase, setConnectPhase] = useState<'checking' | 'popup' | 'exchanging'>('checking')
  const [auditPhase, setAuditPhase] = useState(0)
  const [propertySearch, setPropertySearch] = useState('')

  // ── Saved reports state ──────────────────────────────────────────────
  const [savedReports, setSavedReports] = useState<SavedReportSummary[]>([])
  const [savedReportsLoading, setSavedReportsLoading] = useState(true)
  const [savedReportId, setSavedReportId] = useState<string | null>(null) // ID of the currently viewed saved report
  const [saving, setSaving] = useState(false)

  const currentStep =
    status === 'ready' || status === 'connecting' ? 1 : status === 'selecting' ? 2 : 3

  // ── Fetch saved reports on mount ─────────────────────────────────────
  const fetchSavedReports = useCallback(async () => {
    try {
      setSavedReportsLoading(true)
      const res = await fetch('/api/ga4-audit/reports?limit=50')
      if (res.ok) {
        const data = await res.json()
        setSavedReports(data.reports || [])
      }
    } catch {
      // Silent fail — not critical
    } finally {
      setSavedReportsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSavedReports()
  }, [fetchSavedReports])

  // ── Save report ──────────────────────────────────────────────────────
  const handleSaveReport = useCallback(
    async (reportToSave: AuditReport) => {
      setSaving(true)
      try {
        const res = await fetch('/api/ga4-audit/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ report: reportToSave }),
        })
        if (res.ok) {
          const data = await res.json()
          setSavedReportId(data.id)
          // Refresh the list
          fetchSavedReports()
        }
      } catch (err) {
        console.error('Failed to save report:', err)
      } finally {
        setSaving(false)
      }
    },
    [fetchSavedReports],
  )

  // ── Load a saved report ──────────────────────────────────────────────
  const handleLoadReport = useCallback(async (id: string) => {
    setStatus('auditing')
    setAuditPhase(4)
    setError('')
    try {
      const res = await fetch(`/api/ga4-audit/reports/${id}`)
      if (res.ok) {
        const data = await res.json()
        const loaded: AuditReport = {
          propertyName: data.report.propertyName,
          propertyId: data.report.propertyId,
          healthScore: data.report.healthScore,
          timestamp: data.report.createdAt,
          checks: data.report.checks,
          summary: data.report.summary,
        }
        setReport(loaded)
        setSelectedProperty({
          name: `properties/${data.report.propertyId.replace('properties/', '')}`,
          displayName: data.report.propertyName,
          propertyId: data.report.propertyId,
        })
        setSavedReportId(id)
        setStatus('done')
        // Auto-expand categories with failures
        const failedCategories = loaded.checks
          .filter((c) => c.status === 'fail')
          .map((c) => c.category)
        setExpandedCategories([...new Set(failedCategories)])
      } else {
        setError('Failed to load the saved report.')
        setStatus('error')
      }
    } catch {
      setError('Failed to load the saved report.')
      setStatus('error')
    }
  }, [])

  // ── Delete a saved report ────────────────────────────────────────────
  const handleDeleteReport = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/ga4-audit/reports/${id}`, { method: 'DELETE' })
        if (res.ok) {
          setSavedReports((prev) => prev.filter((r) => r.id !== id))
          if (savedReportId === id) setSavedReportId(null)
        }
      } catch {
        // Silent fail
      }
    },
    [savedReportId],
  )

  const handleExportPDF = useCallback(async () => {
    if (!report) return
    setExporting(true)
    try {
      const { generateAuditPDF } = await import('./generateAuditPDF')
      await generateAuditPDF(report)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [report])

  // ── Try stored token, refresh if needed, else OAuth popup ───────────
  const fetchPropertiesWithToken = async (): Promise<GA4Property[] | null> => {
    // Skip API calls entirely if no ga4_access_token cookie exists
    const hasCookie = document.cookie.split('; ').some((c) => c.startsWith('ga4_access_token='))
    if (!hasCookie) {
      // No access token cookie — try refreshing from stored Google refresh token
      const refreshRes = await fetch('/api/auth/google/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      if (!refreshRes.ok) return null // No stored Google tokens at all
    }

    // At this point we either had a cookie or just refreshed one
    const res = await fetch('/api/ga4-audit/properties')
    if (res.ok) {
      const data = await res.json()
      return data.properties?.length > 0 ? data.properties : null
    }

    // Token was invalid/expired — try one refresh
    if (res.status === 401 && hasCookie) {
      const refreshRes = await fetch('/api/auth/google/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      if (refreshRes.ok) {
        const retryRes = await fetch('/api/ga4-audit/properties')
        if (retryRes.ok) {
          const data = await retryRes.json()
          return data.properties?.length > 0 ? data.properties : null
        }
      }
    }

    return null
  }

  const handleConnect = async () => {
    setStatus('connecting')
    setConnectPhase('checking')
    setError('')

    try {
      // Attempt to use stored Google tokens (from Google sign-in)
      const storedProperties = await fetchPropertiesWithToken()
      if (storedProperties) {
        setProperties(storedProperties)
        setStatus('selecting')
        return
      }

      // No stored tokens — open Google OAuth popup to connect
      setConnectPhase('popup')
      const res = await fetch('/api/auth/google/url')
      const data = await res.json()
      if (data.url) {
        const popup = window.open(data.url, 'ga4-auth', 'width=500,height=700')
        const handler = async (e: MessageEvent) => {
          if (e.data?.type === 'google-auth-callback' && e.data.code) {
            window.removeEventListener('message', handler)
            popup?.close()
            setConnectPhase('exchanging')
            const tokenRes = await fetch('/api/ga4-audit/connect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ code: e.data.code }),
            })
            const tokenData = await tokenRes.json()
            if (tokenData.properties?.length > 0) {
              setProperties(tokenData.properties)
              setStatus('selecting')
            } else {
              setError(
                'No GA4 properties found on this account. Make sure you have Editor or Viewer access to at least one GA4 property.',
              )
              setStatus('error')
            }
          }
        }
        window.addEventListener('message', handler)

        // Detect popup close
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            setStatus((s) => (s === 'connecting' ? 'ready' : s))
          }
        }, 1000)
      }
    } catch {
      setError('Failed to connect to Google. Please try again.')
      setStatus('error')
    }
  }

  // ── Run audit ──────────────────────────────────────────────────────────
  const handleRunAudit = async (property: GA4Property) => {
    setSelectedProperty(property)
    setStatus('auditing')
    setAuditPhase(0)
    setError('')

    // Animate through phases for visual feedback
    const phaseTimer = setInterval(() => {
      setAuditPhase((p) => (p < 4 ? p + 1 : p))
    }, 3000)

    try {
      let res = await fetch('/api/ga4-audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.propertyId,
          propertyName: property.displayName,
        }),
      })

      // If token expired, try refreshing and retry once
      if (res.status === 401) {
        const refreshRes = await fetch('/api/auth/google/refresh', {
          method: 'POST',
          credentials: 'include',
        })
        if (refreshRes.ok) {
          res = await fetch('/api/ga4-audit/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              propertyId: property.propertyId,
              propertyName: property.displayName,
            }),
          })
        }
      }

      clearInterval(phaseTimer)
      const data = await res.json()
      if (data.report) {
        setReport(data.report)
        setSavedReportId(null) // Fresh audit, not yet saved
        setStatus('done')
        // Auto-expand categories with failures
        const failedCategories = data.report.checks
          .filter((c: AuditCheckResult) => c.status === 'fail')
          .map((c: AuditCheckResult) => c.category)
        setExpandedCategories([...new Set(failedCategories)] as string[])
        // Auto-save the report
        handleSaveReport(data.report)
      } else {
        setError(data.error || 'Audit failed. Please try again.')
        setStatus('error')
      }
    } catch {
      clearInterval(phaseTimer)
      setError('Audit failed. Please try again.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('ready')
    setProperties([])
    setSelectedProperty(null)
    setReport(null)
    setError('')
    setExpandedCategories([])
    setSavedReportId(null)
  }

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  // Group checks by category
  const groupedChecks = report?.checks.reduce(
    (acc, check) => {
      if (!acc[check.category]) acc[check.category] = []
      acc[check.category].push(check)
      return acc
    },
    {} as Record<string, AuditCheckResult[]>,
  )

  return (
    <div className="h-full flex flex-col">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card/30 px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
                <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
              </svg>
            </div>
            GA4 Audit Tool
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Automated GA4 configuration audit with 18+ checks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Stepper currentStep={currentStep} />
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* ── Ready State: Onboarding ─────────────────────────────────── */}
        {status === 'ready' && (
          <div className="px-6 md:px-8 py-8 max-w-7xl mx-auto space-y-6">
            {/* ── Top two-column layout ─────────────────────────────── */}
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 items-start">
              {/* Left: Getting Started */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
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
                        Analyze your GA4 property configuration and identify tracking issues,
                        missing conversions, and optimization opportunities.
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
                    onClick={handleConnect}
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

              {/* Right: Past Audits — always visible */}
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden flex flex-col">
                {/* Panel header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-muted-foreground"
                    >
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
                      onClick={handleConnect}
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
                    {savedReports.map((r) => {
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
                        <div
                          key={r.id}
                          className="px-5 py-4 hover:bg-muted/5 transition-colors flex items-center justify-between gap-4 group"
                        >
                          <button
                            onClick={() => handleLoadReport(r.id)}
                            className="flex items-center gap-4 min-w-0 flex-1 text-left cursor-pointer"
                          >
                            {/* Score badge */}
                            <div
                              className={`w-12 h-12 rounded-xl ${scoreBg} border ring-2 ${scoreRing} flex flex-col items-center justify-center shrink-0`}
                            >
                              <span className={`text-base font-bold leading-none ${scoreColor}`}>
                                {r.healthScore}
                              </span>
                              <span className="text-[9px] text-muted-foreground mt-0.5 leading-none">
                                /100
                              </span>
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
                              if (confirm('Delete this audit report?')) handleDeleteReport(r.id)
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
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Connecting ──────────────────────────────────────────────── */}
        {status === 'connecting' && (
          <div className="px-6 md:px-8 py-16 max-w-lg mx-auto text-center space-y-6">
            <FireLoader size={80} label="" />

            {/* Phase-aware text */}
            {connectPhase === 'checking' && (
              <div>
                <h2 className="text-lg font-bold text-foreground">Checking access...</h2>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                  Looking for an existing Google connection on your account.
                </p>
              </div>
            )}

            {connectPhase === 'popup' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Connect your Google account</h2>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                    A pop-up window has opened. Sign in with Google and grant read-only analytics
                    access to continue.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left space-y-2">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pop-up not showing?
                  </p>
                  <ul className="text-[11px] text-amber-600/80 dark:text-amber-400/70 space-y-1 list-disc pl-4 leading-relaxed">
                    <li>Check for a blocked-popup icon in your address bar</li>
                    <li>Allow pop-ups for this site, then click below to retry</li>
                  </ul>
                </div>
              </div>
            )}

            {connectPhase === 'exchanging' && (
              <div>
                <h2 className="text-lg font-bold text-foreground">Fetching your properties...</h2>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                  Connected! Loading your GA4 properties now.
                </p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── Property Selection ───────────────────────────────────────── */}
        {status === 'selecting' && (
          <div className="px-6 md:px-8 py-8 max-w-6xl mx-auto space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Select a GA4 Property</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found on your
                  account.
                </p>
              </div>
              {properties.length > 4 && (
                <div className="relative w-full sm:w-56">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    placeholder="Filter properties..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {properties
                .filter(
                  (p) =>
                    !propertySearch ||
                    p.displayName.toLowerCase().includes(propertySearch.toLowerCase()) ||
                    p.propertyId.toLowerCase().includes(propertySearch.toLowerCase()),
                )
                .map((prop) => (
                  <button
                    key={prop.name}
                    onClick={() => handleRunAudit(prop)}
                    className="w-full text-left p-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/40 hover:bg-orange-500/[0.03] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 text-orange-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                            {prop.displayName}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono truncate">
                            {prop.propertyId.replace('properties/', '')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-orange-500 transition-colors shrink-0">
                        <span className="hidden sm:block">Run Audit</span>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path
                            fillRule="evenodd"
                            d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              {propertySearch &&
                properties.filter(
                  (p) =>
                    p.displayName.toLowerCase().includes(propertySearch.toLowerCase()) ||
                    p.propertyId.toLowerCase().includes(propertySearch.toLowerCase()),
                ).length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No properties match &ldquo;{propertySearch}&rdquo;
                  </div>
                )}
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              &larr; Start over
            </button>
          </div>
        )}

        {/* ── Auditing ────────────────────────────────────────────────── */}
        {status === 'auditing' && (
          <div className="px-6 md:px-8 py-16 max-w-md mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-foreground">Auditing Your GA4 Setup</h2>
              <p className="text-sm text-muted-foreground">
                Analyzing{' '}
                <span className="font-medium text-foreground">{selectedProperty?.displayName}</span>
              </p>
            </div>

            {/* Progress steps */}
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 space-y-3.5">
              {[
                { label: 'Connecting to GA4 API', phase: 0 },
                { label: 'Reading property settings', phase: 1 },
                { label: 'Analyzing data streams & events', phase: 2 },
                { label: 'Checking integrations', phase: 3 },
                { label: 'Generating report', phase: 4 },
              ].map(({ label, phase }) => {
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
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {status === 'error' && (
          <div className="px-6 md:px-8 py-16 max-w-lg mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-red-500">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Something Went Wrong</h2>
              <p className="text-sm text-muted-foreground mt-1.5">{error}</p>
            </div>
            <div className="rounded-xl border border-border bg-card/80 p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-foreground">Troubleshooting tips:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>Make sure you have at least Viewer access to a GA4 property</li>
                <li>Try connecting with a different Google account</li>
                <li>Check that popups are not blocked for this site</li>
                <li>If the issue persists, try refreshing the page</li>
              </ul>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────── */}
        {status === 'done' && report && (
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {report.summary.passed}
                </p>
                <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 font-medium mt-0.5">
                  Passed
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {report.summary.warnings}
                </p>
                <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70 font-medium mt-0.5">
                  Warnings
                </p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {report.summary.failures}
                </p>
                <p className="text-[11px] text-red-600/70 dark:text-red-400/70 font-medium mt-0.5">
                  Failed
                </p>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {report.summary.info}
                </p>
                <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70 font-medium mt-0.5">
                  Info
                </p>
              </div>
            </div>

            {/* Expand / Collapse all */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">Detailed Results</p>
              <button
                onClick={() => {
                  if (!groupedChecks) return
                  const allCats = Object.keys(groupedChecks)
                  setExpandedCategories(expandedCategories.length === allCats.length ? [] : allCats)
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {groupedChecks && expandedCategories.length === Object.keys(groupedChecks).length
                  ? 'Collapse all'
                  : 'Expand all'}
              </button>
            </div>

            {/* Detailed checks */}
            {groupedChecks &&
              Object.entries(groupedChecks).map(([category, checks]) => {
                const isExpanded = expandedCategories.includes(category)
                const failCount = checks.filter((c) => c.status === 'fail').length
                const warnCount = checks.filter((c) => c.status === 'warn').length
                const passCount = checks.filter((c) => c.status === 'pass').length
                const infoCount = checks.filter((c) => c.status === 'info').length

                return (
                  <div
                    key={category}
                    className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/5 transition-colors cursor-pointer gap-3"
                    >
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-sm font-bold text-foreground">{category}</h3>
                          <span className="text-[11px] text-muted-foreground">
                            {checks.length} checks
                          </span>
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
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {check.message}
                              </p>
                              {check.recommendation && (
                                <div className="mt-2 rounded-lg bg-orange-500/5 border border-orange-500/15 p-2.5">
                                  <p className="text-[11px] text-orange-700 dark:text-orange-300 leading-relaxed">
                                    <span className="font-bold">Recommended fix:</span>{' '}
                                    {check.recommendation}
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
              })}

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
                onClick={handleExportPDF}
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
                onClick={handleReset}
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
        )}
      </div>
    </div>
  )
}

// ─── Static data ─────────────────────────────────────────────────────────────

const auditCategories = [
  {
    title: 'Data Streams',
    desc: 'Verifies web/app data streams are active and properly configured.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path
          fillRule="evenodd"
          d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Conversion Tracking',
    desc: 'Checks if key events are marked as conversions with proper schemas.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
      </svg>
    ),
  },
  {
    title: 'Custom Definitions',
    desc: 'Reviews custom events, parameters, and user properties.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path
          fillRule="evenodd"
          d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Property Settings',
    desc: 'Checks time zone, currency, data retention, and attribution settings.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path
          fillRule="evenodd"
          d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Integrations',
    desc: 'Verifies Google Ads, Search Console, and BigQuery links.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path d="M4.464 3.162A2 2 0 016.28 2h7.44a2 2 0 011.816 1.162l1.154 2.5c.067.145.1.301.1.461V7a3 3 0 11-6 0 3 3 0 11-6 0v-.875c0-.16.033-.316.1-.461l1.154-2.5z" />
        <path
          fillRule="evenodd"
          d="M2 12V8.236c.256.15.532.272.824.363A3.992 3.992 0 006 10a3.99 3.99 0 004-1.401A3.99 3.99 0 0014 10c1.16 0 2.2-.494 2.928-1.283.39.16.752.372 1.072.627V12a1 1 0 01-1 1H3a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Data Quality',
    desc: 'Detects duplicate events, missing filters, and retention issues.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path
          fillRule="evenodd"
          d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { generateAuditPDF } from './generateAuditPDF'

// ─── Types ───────────────────────────────────────────────────────────────────

type AuditStatus = 'ready' | 'connecting' | 'selecting' | 'auditing' | 'done' | 'error'

interface GA4Property {
  name: string
  displayName: string
  propertyId: string
}

interface AuditCheckResult {
  id: string
  category: string
  name: string
  status: 'pass' | 'warn' | 'fail' | 'info'
  message: string
  recommendation?: string
}

interface AuditReport {
  propertyName: string
  propertyId: string
  healthScore: number
  timestamp: string
  checks: AuditCheckResult[]
  summary: {
    total: number
    passed: number
    warnings: number
    failures: number
    info: number
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: AuditCheckResult['status'] }) {
  if (status === 'pass')
    return (
      <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-emerald-500">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
      </div>
    )
  if (status === 'warn')
    return (
      <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-amber-500">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
    )
  if (status === 'fail')
    return (
      <div className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-red-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      </div>
    )
  return (
    <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-blue-500">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    </div>
  )
}

function HealthScoreRing({ score }: { score: number }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  const bgColor = score >= 80 ? 'stroke-emerald-500/15' : score >= 50 ? 'stroke-amber-500/15' : 'stroke-red-500/15'

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" className={bgColor} strokeWidth="7" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" className={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
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
            {i > 0 && (
              <div className={`w-8 h-px ${isComplete ? 'bg-orange-500' : 'bg-border'}`} />
            )}
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
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive ? 'text-foreground' : isComplete ? 'text-muted-foreground' : 'text-muted-foreground/60'
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

  const currentStep = status === 'ready' || status === 'connecting' ? 1 : status === 'selecting' ? 2 : 3

  const handleExportPDF = useCallback(async () => {
    if (!report) return
    setExporting(true)
    try {
      await generateAuditPDF(report)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [report])

  // ── OAuth connect ──────────────────────────────────────────────────────
  const handleConnect = async () => {
    setStatus('connecting')
    setError('')
    try {
      const res = await fetch('/api/ga4-audit/auth')
      const data = await res.json()
      if (data.url) {
        const popup = window.open(data.url, 'ga4-auth', 'width=500,height=700')
        const handler = async (e: MessageEvent) => {
          if (e.data?.type === 'ga4-auth-callback' && e.data.code) {
            window.removeEventListener('message', handler)
            popup?.close()
            const tokenRes = await fetch('/api/ga4-audit/callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: e.data.code }),
            })
            const tokenData = await tokenRes.json()
            if (tokenData.properties?.length > 0) {
              setProperties(tokenData.properties)
              setStatus('selecting')
            } else {
              setError('No GA4 properties found on this account. Make sure you have Editor or Viewer access to at least one GA4 property.')
              setStatus('error')
            }
          }
        }
        window.addEventListener('message', handler)
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
    setError('')
    try {
      const res = await fetch('/api/ga4-audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.propertyId, propertyName: property.displayName }),
      })
      const data = await res.json()
      if (data.report) {
        setReport(data.report)
        setStatus('done')
        // Auto-expand categories with failures
        const failedCategories = data.report.checks
          .filter((c: AuditCheckResult) => c.status === 'fail')
          .map((c: AuditCheckResult) => c.category)
        setExpandedCategories([...new Set(failedCategories)] as string[])
      } else {
        setError(data.error || 'Audit failed. Please try again.')
        setStatus('error')
      }
    } catch {
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
        <Stepper currentStep={currentStep} />
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* ── Ready State: Onboarding ─────────────────────────────────── */}
        {status === 'ready' && (
          <div className="px-6 md:px-8 py-8 max-w-3xl space-y-6">
            {/* Getting Started Card */}
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Getting Started</h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    This tool analyzes your GA4 property configuration and identifies tracking issues, missing conversions,
                    and optimization opportunities. Here&apos;s how it works:
                  </p>
                </div>
              </div>

              <div className="space-y-3 pl-11">
                {[
                  {
                    step: '1',
                    title: 'Connect your Google account',
                    desc: 'A popup will open asking you to sign in with Google. We request read-only access to your GA4 properties — no changes are ever made.',
                  },
                  {
                    step: '2',
                    title: 'Choose a GA4 property to audit',
                    desc: 'Select which property you want to analyze. All properties you have access to will appear.',
                  },
                  {
                    step: '3',
                    title: 'Review your audit report',
                    desc: 'Get a health score and detailed results across 6 categories with actionable fix recommendations.',
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
            </div>

            {/* What We Check */}
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground">What We Check</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {auditCategories.map((cat) => (
                  <div key={cat.title} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/50">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{cat.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security note */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Your data is safe</p>
                <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 mt-0.5 leading-relaxed">
                  We use read-only access and never store, copy, or share your analytics data. The audit runs entirely in real-time.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleConnect}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-600/20 cursor-pointer text-sm"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
              </svg>
              Connect Google Account &amp; Start Audit
            </button>
          </div>
        )}

        {/* ── Connecting ──────────────────────────────────────────────── */}
        {status === 'connecting' && (
          <div className="px-6 md:px-8 py-16 max-w-lg mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto animate-pulse">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-orange-500">
                <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Connecting to Google...</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                A popup window should have opened. Complete the sign-in to continue.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/80 p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-foreground">Don&apos;t see the popup?</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>Check if your browser blocked the popup</li>
                <li>Look for a blocked popup notification in the address bar</li>
                <li>Allow popups for this site and try again</li>
              </ul>
            </div>
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
          <div className="px-6 md:px-8 py-8 max-w-2xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Select a GA4 Property</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found. Choose the one you&apos;d like to audit.
              </p>
            </div>

            <div className="space-y-2">
              {properties.map((prop) => (
                <button
                  key={prop.name}
                  onClick={() => handleRunAudit(prop)}
                  className="w-full text-left p-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/40 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {prop.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{prop.propertyId}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-orange-500 transition-colors">
                      <span className="hidden sm:block">Run Audit</span>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              &larr; Use a different account
            </button>
          </div>
        )}

        {/* ── Auditing ────────────────────────────────────────────────── */}
        {status === 'auditing' && (
          <div className="px-6 md:px-8 py-16 max-w-lg mx-auto text-center space-y-5">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-2xl bg-orange-500/10 border border-orange-500/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-500 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                  <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Auditing Your GA4 Setup</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Analyzing <span className="font-medium text-foreground">{selectedProperty?.displayName}</span>.
                This takes about 15–30 seconds.
              </p>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground max-w-xs mx-auto">
              <p className="animate-pulse">Checking data streams...</p>
              <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>Reviewing conversion events...</p>
              <p className="animate-pulse" style={{ animationDelay: '1s' }}>Analyzing property settings...</p>
            </div>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {status === 'error' && (
          <div className="px-6 md:px-8 py-16 max-w-lg mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-red-500">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
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
          <div className="px-6 md:px-8 py-6 space-y-5 max-w-4xl">
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
                      {report.propertyName} &middot; {report.propertyId}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {report.healthScore >= 80
                      ? 'Your GA4 setup is solid. A few optimizations could improve data quality further.'
                      : report.healthScore >= 50
                        ? 'Your setup has gaps. Addressing the issues below will significantly improve data quality.'
                        : 'Multiple critical issues found. Address these immediately to avoid unreliable reporting.'}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">{report.summary.passed} Passed</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">{report.summary.warnings} Warnings</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">{report.summary.failures} Failures</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">{report.summary.info} Info</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed checks */}
            {groupedChecks &&
              Object.entries(groupedChecks).map(([category, checks]) => {
                const isExpanded = expandedCategories.includes(category)
                const failCount = checks.filter((c) => c.status === 'fail').length
                const warnCount = checks.filter((c) => c.status === 'warn').length
                const passCount = checks.filter((c) => c.status === 'pass').length

                return (
                  <div
                    key={category}
                    className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/5 transition-colors cursor-pointer"
                    >
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
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-border divide-y divide-border">
                        {checks.map((check) => (
                          <div key={check.id} className="p-4 flex gap-3">
                            <StatusIcon status={check.status} />
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-semibold text-foreground text-xs">{check.name}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{check.message}</p>
                              {check.recommendation && (
                                <p className="text-[11px] text-orange-600 dark:text-orange-400 mt-1">
                                  <span className="font-semibold">Fix:</span> {check.recommendation}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
              >
                {exporting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                      <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
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
        <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
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
        <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Property Settings',
    desc: 'Checks time zone, currency, data retention, and attribution settings.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Integrations',
    desc: 'Verifies Google Ads, Search Console, and BigQuery links.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path d="M4.464 3.162A2 2 0 016.28 2h7.44a2 2 0 011.816 1.162l1.154 2.5c.067.145.1.301.1.461V7a3 3 0 11-6 0 3 3 0 11-6 0v-.875c0-.16.033-.316.1-.461l1.154-2.5z" />
        <path fillRule="evenodd" d="M2 12V8.236c.256.15.532.272.824.363A3.992 3.992 0 006 10a3.99 3.99 0 004-1.401A3.99 3.99 0 0014 10c1.16 0 2.2-.494 2.928-1.283.39.16.752.372 1.072.627V12a1 1 0 01-1 1H3a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Data Quality',
    desc: 'Detects duplicate events, missing filters, and retention issues.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
  },
]

'use client'

import { useState, useCallback } from 'react'
import { generateAuditPDF } from '@/app/(app)/app/tools/ga4-audit/generateAuditPDF'

// ─── Types ───────────────────────────────────────────────────────────────────

type AuditStatus = 'idle' | 'connecting' | 'selecting' | 'auditing' | 'done' | 'error'

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
      <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500">
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
      <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-500">
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
      <div className="w-6 h-6 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-red-500">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  return (
    <div className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-blue-500">
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
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color =
    score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  const bgColor =
    score >= 80
      ? 'stroke-emerald-500/15'
      : score >= 50
        ? 'stroke-amber-500/15'
        : 'stroke-red-500/15'

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" className={bgColor} strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          className={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
        <span className="text-xs text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AuditTool() {
  const [status, setStatus] = useState<AuditStatus>('idle')
  const [properties, setProperties] = useState<GA4Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<GA4Property | null>(null)
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState<string>('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showSample, setShowSample] = useState(false)
  const [exporting, setExporting] = useState(false)

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

  // ── OAuth connect ────────────────────────────────────────────────────────
  const handleConnect = async () => {
    setStatus('connecting')
    setError('')
    try {
      const res = await fetch('/api/ga4-audit/auth')
      const data = await res.json()
      if (data.url) {
        // Open Google consent screen
        const popup = window.open(data.url, 'ga4-auth', 'width=500,height=700')
        // Listen for the callback
        const handler = async (e: MessageEvent) => {
          if (e.data?.type === 'ga4-auth-callback' && e.data.code) {
            window.removeEventListener('message', handler)
            popup?.close()
            // Exchange code for token and list properties
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
              setError('No GA4 properties found. Make sure you have access to at least one GA4 property.')
              setStatus('error')
            }
          }
        }
        window.addEventListener('message', handler)
      }
    } catch {
      setError('Failed to connect. Please try again.')
      setStatus('error')
    }
  }

  // ── Run audit ────────────────────────────────────────────────────────────
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
      } else {
        setError(data.error || 'Audit failed. Please try again.')
        setStatus('error')
      }
    } catch {
      setError('Audit failed. Please try again.')
      setStatus('error')
    }
  }

  // ── Sample report ────────────────────────────────────────────────────────
  const handleViewSample = () => {
    setShowSample(true)
    setReport(sampleReport)
    setStatus('done')
  }

  const handleReset = () => {
    setStatus('idle')
    setProperties([])
    setSelectedProperty(null)
    setReport(null)
    setError('')
    setExpandedCategory(null)
    setShowSample(false)
  }

  // ── Group checks by category ────────────────────────────────────────────
  const groupedChecks = report?.checks.reduce(
    (acc, check) => {
      if (!acc[check.category]) acc[check.category] = []
      acc[check.category].push(check)
      return acc
    },
    {} as Record<string, AuditCheckResult[]>,
  )

  return (
    <div className="relative">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* ── Hero / Landing ─────────────────────────────────────────────── */}
      {status === 'idle' && (
        <>
          <section className="relative py-20 md:py-32">
            <div className="container max-w-5xl mx-auto text-center space-y-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                Free GA4 Audit Tool
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Run a GA4 Audit in{' '}
                <span className="text-orange-600 dark:text-orange-400">Under 2 Minutes</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                8 out of 10 businesses have GA4 tracking gaps they don&apos;t know about.
                Check your GA4 Health Score and get actionable fixes—no data stored, no
                privacy risk.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <button
                  onClick={handleConnect}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-orange-600/20 cursor-pointer"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
                  </svg>
                  Get My GA4 Health Score
                </button>
                <button
                  onClick={handleViewSample}
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-border hover:border-orange-500/40 text-foreground hover:text-orange-600 dark:hover:text-orange-400 font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  View Sample Audit
                </button>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5 text-emerald-500">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Liyab Digital does not store, access, or retain your analytics data.
              </p>
            </div>
          </section>

          {/* What the audit covers */}
          <section className="relative py-16 md:py-24">
            <div className="container max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                  Comprehensive Analysis
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  What the Audit Covers
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {auditCategories.map((cat) => (
                  <div
                    key={cat.title}
                    className="group p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/15 transition-colors">
                      {cat.icon}
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3 Steps */}
          <section className="relative py-16 md:py-24 bg-gradient-to-b from-card/30 to-background">
            <div className="container max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                  How It Works
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  3 Simple Steps
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, i) => (
                  <div key={step.title} className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center mx-auto">
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="relative py-16 md:py-24">
            <div className="container max-w-4xl mx-auto">
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 md:p-12 space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-emerald-500">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Your Data Security Is Our Priority
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    We never store or access your analytics data. Read-only permissions are
                    used solely to analyze your configuration—nothing is saved, copied, or
                    reused.
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  {securityPoints.map((point) => (
                    <div key={point.title} className="text-center space-y-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                        {point.icon}
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{point.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{point.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Connecting state ───────────────────────────────────────────── */}
      {status === 'connecting' && (
        <section className="py-32">
          <div className="container max-w-lg mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto animate-pulse">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-orange-500">
                <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Connecting to Google...</h2>
            <p className="text-muted-foreground">
              Complete the sign-in in the popup window to continue.
            </p>
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* ── Property selection ─────────────────────────────────────────── */}
      {status === 'selecting' && (
        <section className="py-20 md:py-32">
          <div className="container max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                Step 2 of 3
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Select a GA4 Property
              </h2>
              <p className="text-muted-foreground">
                Choose the property you&apos;d like to audit.
              </p>
            </div>
            <div className="space-y-3">
              {properties.map((prop) => (
                <button
                  key={prop.name}
                  onClick={() => handleRunAudit(prop)}
                  className="w-full text-left p-5 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/40 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {prop.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">{prop.propertyId}</p>
                    </div>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 transition-colors">
                      <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Start over
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Auditing state ─────────────────────────────────────────────── */}
      {status === 'auditing' && (
        <section className="py-32">
          <div className="container max-w-lg mx-auto text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-2xl bg-orange-500/10 border border-orange-500/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                  <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Auditing Your GA4 Setup...</h2>
            <p className="text-muted-foreground">
              Analyzing <span className="font-medium text-foreground">{selectedProperty?.displayName}</span>.
              This usually takes under 30 seconds.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground max-w-xs mx-auto">
              <p className="animate-pulse">Checking event configuration...</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Error state ────────────────────────────────────────────────── */}
      {status === 'error' && (
        <section className="py-32">
          <div className="container max-w-lg mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-red-500">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Something Went Wrong</h2>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      {/* ── Results ────────────────────────────────────────────────────── */}
      {status === 'done' && report && (
        <section className="py-16 md:py-24">
          <div className="container max-w-5xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              {showSample && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
                  Sample Report
                </div>
              )}
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                Audit Complete
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                GA4 Health Report
              </h2>
              <p className="text-muted-foreground">
                {report.propertyName} &middot; {report.propertyId}
              </p>
            </div>

            {/* Score + summary */}
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <HealthScoreRing score={report.healthScore} />
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground">
                    {report.healthScore >= 80
                      ? 'Looking Good!'
                      : report.healthScore >= 50
                        ? 'Needs Attention'
                        : 'Critical Issues Found'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {report.healthScore >= 80
                      ? 'Your GA4 setup is solid. A few optimizations could improve data quality further.'
                      : report.healthScore >= 50
                        ? 'Your setup has notable gaps. Addressing the warnings and failures below will significantly improve your data quality.'
                        : 'Multiple critical issues were found. These should be addressed immediately to avoid unreliable reporting.'}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">{report.summary.passed} Passed</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">{report.summary.warnings} Warnings</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">{report.summary.failures} Failures</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">{report.summary.info} Info</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed checks by category */}
            {groupedChecks &&
              Object.entries(groupedChecks).map(([category, checks]) => {
                const isExpanded = expandedCategory === category
                const failCount = checks.filter((c) => c.status === 'fail').length
                const warnCount = checks.filter((c) => c.status === 'warn').length

                return (
                  <div
                    key={category}
                    className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-foreground">{category}</h3>
                        <span className="text-xs text-muted-foreground">{checks.length} checks</span>
                        {failCount > 0 && (
                          <span className="text-xs font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5">
                            {failCount} failed
                          </span>
                        )}
                        {warnCount > 0 && (
                          <span className="text-xs font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                            {warnCount} warnings
                          </span>
                        )}
                      </div>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-border divide-y divide-border">
                        {checks.map((check) => (
                          <div key={check.id} className="p-5 flex gap-4">
                            <StatusIcon status={check.status} />
                            <div className="space-y-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm">{check.name}</p>
                              <p className="text-sm text-muted-foreground">{check.message}</p>
                              {check.recommendation && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1.5">
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
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-600/20 cursor-pointer"
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
              {showSample && (
                <button
                  onClick={() => {
                    handleReset()
                    setTimeout(() => handleConnect(), 100)
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-border hover:border-orange-500/40 text-foreground font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Audit My Own GA4
                </button>
              )}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-border hover:border-orange-500/40 text-foreground font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {showSample ? 'Back to Home' : 'Run Another Audit'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// ─── Static data ─────────────────────────────────────────────────────────────

const auditCategories = [
  {
    title: 'Event & Data Setup',
    description: 'Reviews if events, parameters, and user properties are properly configured.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Conversion Tracking',
    description: 'Checks if conversion events are properly defined and aligned with your goals.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
      </svg>
    ),
  },
  {
    title: 'Tracking Issues',
    description: 'Identifies missing events, duplicate tracking, and broken configurations.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Attribution & Settings',
    description: 'Checks attribution settings and configurations for accurate reporting.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-500">
        <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
  },
]

const steps = [
  {
    title: 'Connect GA Account',
    description: 'Securely link your GA4 account with read-only access. No changes are ever made.',
  },
  {
    title: 'Generate Audit Report',
    description: 'Our engine runs 18+ automated checks on your GA4 configuration in under 2 minutes.',
  },
  {
    title: 'View Action Items',
    description: 'Get a prioritized list of issues with clear, actionable fixes for each one.',
  },
]

const securityPoints = [
  {
    title: 'No Data Storage',
    description: 'Your analytics data always stays private. We never store, sell, or share it.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Read-Only Access',
    description: 'We never change your GA4 data or settings. Access is limited to view permissions.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Privacy First',
    description: 'Best practices applied at all times to keep your data safe and fully compliant.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
  },
]

// ─── Sample Report ───────────────────────────────────────────────────────────

const sampleReport: AuditReport = {
  propertyName: 'Demo Store',
  propertyId: 'properties/123456789',
  healthScore: 62,
  timestamp: new Date().toISOString(),
  checks: [
    // Event & Data Setup
    { id: 'ev-1', category: 'Event & Data Setup', name: 'Data Streams Configured', status: 'pass', message: 'At least one web data stream is active and receiving data.' },
    { id: 'ev-2', category: 'Event & Data Setup', name: 'Enhanced Measurement', status: 'warn', message: 'Enhanced measurement is only partially enabled. Scroll tracking and outbound click tracking are disabled.', recommendation: 'Enable all enhanced measurement events in Admin → Data Streams → Enhanced Measurement.' },
    { id: 'ev-3', category: 'Event & Data Setup', name: 'Custom Events Defined', status: 'pass', message: '12 custom events found, all with valid naming conventions.' },
    { id: 'ev-4', category: 'Event & Data Setup', name: 'Event Parameter Limits', status: 'pass', message: 'Custom event parameters are within the 25-parameter limit per event.' },
    { id: 'ev-5', category: 'Event & Data Setup', name: 'User Properties', status: 'warn', message: 'Only 2 of 25 available user property slots are in use. Consider tracking user segments or membership tiers.', recommendation: 'Define user properties for key audience segments in Admin → Custom Definitions → User Properties.' },
    // Conversion Tracking
    { id: 'cv-1', category: 'Conversion Tracking', name: 'Conversion Events Marked', status: 'fail', message: 'No events are marked as conversions. Key business actions like purchases and sign-ups should be flagged.', recommendation: 'Go to Admin → Events and toggle the "Mark as conversion" switch for your key business events (e.g., purchase, sign_up, generate_lead).' },
    { id: 'cv-2', category: 'Conversion Tracking', name: 'Purchase Event Schema', status: 'fail', message: 'The purchase event is missing required ecommerce parameters: transaction_id, value, and currency.', recommendation: 'Update your purchase event to include transaction_id, value, currency, and items array per the GA4 ecommerce spec.' },
    { id: 'cv-3', category: 'Conversion Tracking', name: 'Conversion Counting', status: 'info', message: 'Conversion counting is set to "Once per session" for all events. Verify this aligns with your measurement goals.' },
    // Data Quality
    { id: 'dq-1', category: 'Data Quality', name: 'Duplicate Events', status: 'warn', message: 'Potential duplicate page_view events detected—GTM and enhanced measurement may both be sending page views.', recommendation: 'Disable the page_view toggle in Enhanced Measurement if GTM handles page view tracking.' },
    { id: 'dq-2', category: 'Data Quality', name: 'Internal Traffic Filtering', status: 'fail', message: 'No internal traffic filter is defined. Your own team\'s visits may be inflating metrics.', recommendation: 'Create a data filter in Admin → Data Settings → Data Filters to exclude internal IP addresses.' },
    { id: 'dq-3', category: 'Data Quality', name: 'Cross-Domain Tracking', status: 'info', message: 'No cross-domain tracking configured. If you operate multiple domains in one funnel, this should be set up.' },
    { id: 'dq-4', category: 'Data Quality', name: 'Data Retention', status: 'warn', message: 'Data retention is set to 2 months. This limits historical exploration reports.', recommendation: 'Increase data retention to 14 months in Admin → Data Settings → Data Retention.' },
    // Attribution & Settings
    { id: 'at-1', category: 'Attribution & Settings', name: 'Attribution Model', status: 'pass', message: 'Attribution model is set to data-driven attribution (recommended default).' },
    { id: 'at-2', category: 'Attribution & Settings', name: 'Google Ads Linking', status: 'fail', message: 'Google Ads is not linked to this GA4 property. Conversion data cannot be shared for bidding optimization.', recommendation: 'Link your Google Ads account in Admin → Product Links → Google Ads Links.' },
    { id: 'at-3', category: 'Attribution & Settings', name: 'Search Console Integration', status: 'warn', message: 'Google Search Console is not linked. Organic search query data is unavailable in GA4.', recommendation: 'Link Search Console in Admin → Product Links → Search Console Links.' },
    { id: 'at-4', category: 'Attribution & Settings', name: 'Referral Exclusion List', status: 'pass', message: 'Payment gateway domains (stripe.com, paypal.com) are excluded from referral sources.' },
    { id: 'at-5', category: 'Attribution & Settings', name: 'Reporting Time Zone', status: 'pass', message: 'Reporting time zone is set consistent with your primary business location.' },
    { id: 'at-6', category: 'Attribution & Settings', name: 'Currency Setting', status: 'pass', message: 'Reporting currency is configured correctly.' },
  ],
  summary: {
    total: 18,
    passed: 8,
    warnings: 5,
    failures: 4,
    info: 1,
  },
}

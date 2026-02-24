'use client'

import { useState, useCallback, useEffect } from 'react'
import type { AuditCheckResult, AuditReport, SavedReportSummary } from '@/types/audit'
import type { AuditStatus, ConnectPhase, GA4Property } from './types'
import { Stepper } from './components'
import {
  ReadyView,
  ConnectingView,
  SelectPropertyView,
  AuditingView,
  ErrorView,
  ResultsView,
} from './views'

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GA4AuditApp() {
  const [status, setStatus] = useState<AuditStatus>('ready')
  const [properties, setProperties] = useState<GA4Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<GA4Property | null>(null)
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [exporting, setExporting] = useState(false)
  const [connectPhase, setConnectPhase] = useState<ConnectPhase>('checking')
  const [auditPhase, setAuditPhase] = useState(0)
  const [propertySearch, setPropertySearch] = useState('')

  // ── Saved reports state ──────────────────────────────────────────────
  const [savedReports, setSavedReports] = useState<SavedReportSummary[]>([])
  const [savedReportsLoading, setSavedReportsLoading] = useState(true)
  const [savedReportId, setSavedReportId] = useState<number | null>(null)
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
  const handleLoadReport = useCallback(async (id: number) => {
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
        setSavedReportId(Number(id))
        setStatus('done')
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
    async (id: number) => {
      try {
        const res = await fetch(`/api/ga4-audit/reports/${id}`, { method: 'DELETE' })
        if (!res.ok) {
          console.error('Delete failed:', res.status, await res.text())
          return
        }
        setSavedReports((prev) => prev.filter((r) => r.id !== id))
        if (savedReportId === id) setSavedReportId(null)
      } catch (err) {
        console.error('Delete request failed:', err)
      }
    },
    [savedReportId],
  )

  // ── PDF export ───────────────────────────────────────────────────────
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

  // ── Token-based property fetch ───────────────────────────────────────
  const fetchPropertiesWithToken = async (): Promise<GA4Property[] | null> => {
    const hasCookie = document.cookie.split('; ').some((c) => c.startsWith('ga4_access_token='))
    if (!hasCookie) {
      const refreshRes = await fetch('/api/auth/google/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      if (!refreshRes.ok) return null
    }

    const res = await fetch('/api/ga4-audit/properties')
    if (res.ok) {
      const data = await res.json()
      return data.properties?.length > 0 ? data.properties : null
    }

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

  // ── Connect to Google ────────────────────────────────────────────────
  const handleConnect = async () => {
    setStatus('connecting')
    setConnectPhase('checking')
    setError('')

    try {
      const storedProperties = await fetchPropertiesWithToken()
      if (storedProperties) {
        setProperties(storedProperties)
        setStatus('selecting')
        return
      }

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

  // ── Run audit ────────────────────────────────────────────────────────
  const handleRunAudit = async (property: GA4Property) => {
    setSelectedProperty(property)
    setStatus('auditing')
    setAuditPhase(0)
    setError('')

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
        setSavedReportId(null)
        setStatus('done')
        const failedCategories = data.report.checks
          .filter((c: AuditCheckResult) => c.status === 'fail')
          .map((c: AuditCheckResult) => c.category)
        setExpandedCategories([...new Set(failedCategories)] as string[])
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

  // ── Reset ────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStatus('ready')
    setProperties([])
    setSelectedProperty(null)
    setReport(null)
    setError('')
    setExpandedCategories([])
    setSavedReportId(null)
  }

  // ── Category toggle ──────────────────────────────────────────────────
  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  const handleExpandCollapseAll = useCallback(() => {
    if (!report) return
    const grouped = report.checks.reduce(
      (acc, check) => {
        if (!acc[check.category]) acc[check.category] = []
        acc[check.category].push(check)
        return acc
      },
      {} as Record<string, AuditCheckResult[]>,
    )
    const allCats = Object.keys(grouped)
    setExpandedCategories(expandedCategories.length === allCats.length ? [] : allCats)
  }, [report, expandedCategories])

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
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
            Comprehensive GA4 audit across 12 categories &amp; 60+ checks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Stepper currentStep={currentStep} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {status === 'ready' && (
          <ReadyView
            onConnect={handleConnect}
            savedReports={savedReports}
            savedReportsLoading={savedReportsLoading}
            onLoadReport={handleLoadReport}
            onDeleteReport={handleDeleteReport}
          />
        )}

        {status === 'connecting' && (
          <ConnectingView connectPhase={connectPhase} onCancel={handleReset} />
        )}

        {status === 'selecting' && (
          <SelectPropertyView
            properties={properties}
            propertySearch={propertySearch}
            onPropertySearchChange={setPropertySearch}
            onRunAudit={handleRunAudit}
            onReset={handleReset}
          />
        )}

        {status === 'auditing' && (
          <AuditingView
            propertyName={selectedProperty?.displayName ?? ''}
            auditPhase={auditPhase}
          />
        )}

        {status === 'error' && <ErrorView error={error} onReset={handleReset} />}

        {status === 'done' && report && (
          <ResultsView
            report={report}
            expandedCategories={expandedCategories}
            onToggleCategory={toggleCategory}
            onExpandCollapseAll={handleExpandCollapseAll}
            saving={saving}
            savedReportId={savedReportId}
            exporting={exporting}
            onExportPDF={handleExportPDF}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}

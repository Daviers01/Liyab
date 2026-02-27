'use client'

import { useState, useCallback, useEffect } from 'react'
import type { AuditCheckResult } from '@/types/audit'
import type { GTMAuditReport, SavedGTMReportSummary } from '@/types/gtm-audit'
import type { GTMAuditStatus, ConnectPhase, GTMAccountOption, ContainerOption } from './types'
import { Stepper } from './components'
import {
  ReadyView,
  ConnectingView,
  SelectContainerView,
  AuditingView,
  ErrorView,
  ResultsView,
} from './views'

export default function GTMAuditApp() {
  const [status, setStatus] = useState<GTMAuditStatus>('ready')
  const [accounts, setAccounts] = useState<GTMAccountOption[]>([])
  const [selectedContainer, setSelectedContainer] = useState<ContainerOption | null>(null)
  const [report, setReport] = useState<GTMAuditReport | null>(null)
  const [error, setError] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [connectPhase, setConnectPhase] = useState<ConnectPhase>('checking')
  const [auditPhase, setAuditPhase] = useState(0)

  // ── Saved reports state ──────────────────────────────────────────────
  const [savedReports, setSavedReports] = useState<SavedGTMReportSummary[]>([])
  const [savedReportsLoading, setSavedReportsLoading] = useState(true)
  const [savedReportId, setSavedReportId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const currentStep =
    status === 'ready' || status === 'connecting' ? 1 : status === 'selecting' ? 2 : 3

  // ── Fetch saved reports on mount ─────────────────────────────────────
  const fetchSavedReports = useCallback(async () => {
    try {
      setSavedReportsLoading(true)
      const res = await fetch('/api/gtm-audit/reports?limit=50')
      if (res.ok) {
        const data = await res.json()
        setSavedReports(data.reports || [])
      }
    } catch {
      // Silent fail
    } finally {
      setSavedReportsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSavedReports()
  }, [fetchSavedReports])

  // ── Save report ──────────────────────────────────────────────────────
  const handleSaveReport = useCallback(
    async (reportToSave: GTMAuditReport) => {
      setSaving(true)
      try {
        const res = await fetch('/api/gtm-audit/reports', {
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
        console.error('Failed to save GTM report:', err)
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
      const res = await fetch(`/api/gtm-audit/reports/${id}`)
      if (res.ok) {
        const data = await res.json()
        const loaded: GTMAuditReport = {
          containerId: data.report.containerId,
          containerName: data.report.containerName,
          publicId: data.report.publicId,
          containerType: data.report.containerType ?? [],
          healthScore: data.report.healthScore,
          timestamp: data.report.timestamp,
          liveVersionId: data.report.liveVersionId ?? '',
          tagCount: data.report.tagCount ?? 0,
          triggerCount: data.report.triggerCount ?? 0,
          variableCount: data.report.variableCount ?? 0,
          folderCount: data.report.folderCount ?? 0,
          checks: data.report.checks,
          summary: data.report.summary,
          martech: data.report.martech ?? [],
        }
        setReport(loaded)
        setSelectedContainer({
          path: '',
          name: data.report.containerName,
          publicId: data.report.publicId,
          containerId: data.report.containerId,
          accountId: '',
          accountName: '',
          usageContext: data.report.containerType ?? [],
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
        const res = await fetch(`/api/gtm-audit/reports/${id}`, { method: 'DELETE' })
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

  // ── Fetch containers from stored token ───────────────────────────────
  // Note: the token cookie is httpOnly and cannot be checked via document.cookie.
  // We simply call the API and treat any non-ok response as "no stored token".
  const fetchContainersWithToken = async (): Promise<GTMAccountOption[] | null> => {
    const res = await fetch('/api/gtm-audit/containers')
    if (res.ok) {
      const data = await res.json()
      return data.accounts?.length > 0 ? data.accounts : null
    }
    return null
  }

  // ── Connect to Google ────────────────────────────────────────────────
  const handleConnect = async () => {
    setStatus('connecting')
    setConnectPhase('checking')
    setError('')

    try {
      const storedAccounts = await fetchContainersWithToken()
      if (storedAccounts) {
        setAccounts(storedAccounts)
        setStatus('selecting')
        return
      }

      setConnectPhase('popup')
      const authRes = await fetch('/api/gtm-audit/auth')
      const authData = await authRes.json()

      if (authData.url) {
        const popup = window.open(authData.url, 'gtm-auth', 'width=500,height=700')
        const handler = async (e: MessageEvent) => {
          if (e.data?.type === 'gtm-auth-callback' && e.data.code) {
            window.removeEventListener('message', handler)
            popup?.close()
            setConnectPhase('exchanging')

            const tokenRes = await fetch('/api/gtm-audit/callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ code: e.data.code }),
            })
            const tokenData = await tokenRes.json()

            if (tokenData.accounts?.length > 0) {
              setAccounts(tokenData.accounts)
              setStatus('selecting')
            } else {
              setError(
                'No GTM containers found on this Google account. Make sure you have Read access to at least one GTM container.',
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
      setError('Failed to connect to Google Tag Manager. Please try again.')
      setStatus('error')
    }
  }

  // ── Run audit ────────────────────────────────────────────────────────
  const handleRunAudit = async (container: ContainerOption) => {
    setSelectedContainer(container)
    setStatus('auditing')
    setAuditPhase(0)
    setError('')
    setSavedReportId(null)

    const phaseTimer = setInterval(() => {
      setAuditPhase((p) => (p < 4 ? p + 1 : p))
    }, 3000)

    try {
      const res = await fetch('/api/gtm-audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerPath: container.path,
          containerName: container.name,
          publicId: container.publicId,
          usageContext: container.usageContext,
        }),
      })

      clearInterval(phaseTimer)
      const data = await res.json()

      if (data.report) {
        setReport(data.report)
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
    setAccounts([])
    setSelectedContainer(null)
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
                <path d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v11.5A2.25 2.25 0 0115.75 18H4.25A2.25 2.25 0 012 15.75V4.25zm2.25-.75a.75.75 0 00-.75.75v.758l9.25 7.948 4.25-3.653v-5.053a.75.75 0 00-.75-.75H4.25z" />
              </svg>
            </div>
            GTM Audit Tool
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            50+ automated checks across 12 categories
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
          <SelectContainerView
            accounts={accounts}
            onRunAudit={handleRunAudit}
            onReset={handleReset}
          />
        )}

        {status === 'auditing' && (
          <AuditingView containerName={selectedContainer?.name ?? ''} auditPhase={auditPhase} />
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
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}

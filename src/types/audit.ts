// ─── Shared GA4 Audit Types ───────────────────────────────────────────────────
// Single source of truth used by GA4AuditApp, generateAuditPDF, and the API.

export interface AuditCheckResult {
  id: string
  category: string
  name: string
  status: 'pass' | 'warn' | 'fail' | 'info'
  message: string
  recommendation?: string
}

export interface AuditSummary {
  total: number
  passed: number
  warnings: number
  failures: number
  info: number
}

export interface AuditReport {
  propertyName: string
  propertyId: string
  healthScore: number
  timestamp: string
  checks: AuditCheckResult[]
  summary: AuditSummary
}

export interface SavedReportSummary {
  id: string
  propertyName: string
  propertyId: string
  healthScore: number
  summary: AuditSummary
  createdAt: string
}

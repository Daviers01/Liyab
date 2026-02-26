// ─── Shared GA4 Audit Types ───────────────────────────────────────────────────
// Single source of truth used by GA4AuditApp, generateAuditPDF, and the API.

export type AuditCheckStatus = 'pass' | 'warn' | 'fail' | 'info'

/** A single detected issue or properly-configured item */
export interface AuditDetailItem {
  label: string
  status: AuditCheckStatus
  detail?: string
  /** Extra key→value pairs rendered as additional table columns (e.g. scope, displayName, type) */
  meta?: Record<string, string>
}

export interface AuditCheckResult {
  id: string
  category: string
  name: string
  status: AuditCheckStatus
  message: string
  recommendation?: string
  /** Actionable tip shown on the UI */
  tip?: string
  /** Detected issues (fail/warn items) */
  issues?: AuditDetailItem[]
  /** Properly configured items (pass items) */
  properlyConfigured?: AuditDetailItem[]
  /** AI-generated resolution guidance (populated client-side) */
  aiSuggestion?: string
}

export interface AuditSummary {
  total: number
  passed: number
  warnings: number
  failures: number
  info: number
}

/** Data stream metadata surfaced in the overview */
export interface DataStreamInfo {
  name: string
  type: 'WEB' | 'IOS' | 'ANDROID' | string
  measurementId?: string
  streamId?: string
  defaultUri?: string
}

/** Account-level info for the overview */
export interface AuditAccountInfo {
  accountId?: string
  accountName?: string
  propertyName: string
  propertyId: string
  /** Industry category from GA4 property */
  industryCategory?: string
  timeZone?: string
  currencyCode?: string
  serviceLevel?: string
  createTime?: string
}

/** Enhanced Measurement settings fetched via GA4 Admin API v1alpha */
export interface EnhancedMeasurementSettings {
  /** Which stream this belongs to */
  streamName?: string
  /** Master toggle — whether EM settings are respected */
  streamEnabled: boolean
  scrollsEnabled: boolean
  outboundClicksEnabled: boolean
  siteSearchEnabled: boolean
  searchQueryParameter?: string
  videoEngagementEnabled: boolean
  fileDownloadsEnabled: boolean
  pageChangesEnabled: boolean
  formInteractionsEnabled: boolean
}

/** Last-30-day analytics snapshot fetched via GA4 Data API */
export interface AnalyticsSnapshot {
  totalUsers: number
  totalSessions: number
  totalPageviews: number
  bounceRate: number
  avgSessionDuration: number
  /** Top traffic sources */
  topSources: Array<{ source: string; medium: string; sessions: number }>
  /** Top landing pages */
  topLandingPages: Array<{ page: string; sessions: number; bounceRate: number }>
  /** Device breakdown */
  deviceBreakdown: Array<{ category: string; sessions: number; percentage: number }>
  /** (not set) dimension counts for quality assessment */
  notSetCounts: {
    source: number
    medium: number
    campaign: number
    landingPage: number
  }
  /** Key event (conversion) performance */
  keyEventCounts: Array<{ eventName: string; count: number }>
  /** Anomaly flags for session / user drops */
  anomalies: AuditDetailItem[]
}

/** Top-level audit report */
export interface AuditReport {
  propertyName: string
  propertyId: string
  healthScore: number
  timestamp: string
  checks: AuditCheckResult[]
  summary: AuditSummary
  /** Account & property overview info */
  accountInfo?: AuditAccountInfo
  /** Data streams table */
  dataStreams?: DataStreamInfo[]
  /** Last-30-day analytics data */
  analyticsSnapshot?: AnalyticsSnapshot
}

export interface SavedReportSummary {
  id: number
  propertyName: string
  propertyId: string
  healthScore: number
  summary: AuditSummary
  createdAt: string
}

// ─── Audit Categories ────────────────────────────────────────────────────────

export const AUDIT_CATEGORIES = {
  DATA_COLLECTION: 'Data Collection & Streams',
  EVENT_TRACKING: 'Event & Data Setup',
  KEY_EVENTS: 'Key Events & Conversions',
  ECOMMERCE: 'Enhanced Ecommerce',
  USER_TRACKING: 'User ID & Identity',
  ATTRIBUTION: 'Attribution & Settings',
  DATA_QUALITY: 'Data Quality & Filters',
  TRAFFIC_SOURCES: 'Traffic Sources & UTM',
  PRIVACY_COMPLIANCE: 'Privacy & Compliance',
  INTEGRATIONS: 'Integrations & Links',
  AUDIENCE_DEVICE: 'Audience & Device Performance',
  PROPERTY_SETTINGS: 'Property Configuration',
} as const

export type AuditCategoryKey = keyof typeof AUDIT_CATEGORIES

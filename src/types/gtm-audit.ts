// ─── GTM Audit Types ─────────────────────────────────────────────────────────
// Shared types used by GTMAuditApp, API routes, and PDF generation.

import type { AuditCheckResult, AuditSummary } from './audit'

// ─── GTM API Resource Types ───────────────────────────────────────────────────

export interface GTMAccount {
  accountId: string
  name: string
  path: string
}

export interface GTMContainer {
  accountId: string
  accountName: string
  containerId: string
  name: string
  publicId: string // GTM-XXXXXX
  usageContext: string[] // 'web' | 'amp' | 'android' | 'ios' | 'server'
  path: string
  notes?: string
  domainName?: string[]
}

export interface GTMParameter {
  type:
    | 'template'
    | 'integer'
    | 'boolean'
    | 'list'
    | 'map'
    | 'tagReference'
    | 'triggerReference'
    | 'typeConversion'
    | string
  key?: string
  value?: string
  list?: GTMParameter[]
  map?: GTMParameter[]
}

export interface GTMConsentSettings {
  consentStatus?: 'notSet' | 'notRequired' | 'required'
  consentType?: GTMParameter[]
}

export interface GTMTag {
  tagId: string
  name: string
  type: string
  parameter?: GTMParameter[]
  firingTriggerId?: string[]
  blockingTriggerId?: string[]
  tagFiringOption?: 'oncePerEvent' | 'oncePerLoad' | 'unlimited'
  notes?: string
  paused?: boolean
  path?: string
  folderId?: string
  consentSettings?: GTMConsentSettings
  scheduleStartMs?: string
  scheduleEndMs?: string
  monitoringMetadata?: Record<string, unknown>
}

export interface GTMTrigger {
  triggerId: string
  name: string
  type: string
  filter?: GTMParameter[]
  autoEventFilter?: GTMParameter[]
  customEventFilter?: GTMParameter[]
  parameter?: GTMParameter[]
  notes?: string
  path?: string
  folderId?: string
}

export interface GTMVariable {
  variableId: string
  name: string
  type: string
  parameter?: GTMParameter[]
  notes?: string
  path?: string
  folderId?: string
  scheduleStartMs?: string
  scheduleEndMs?: string
  enablingTriggerId?: string[]
  disablingTriggerId?: string[]
}

export interface GTMFolder {
  folderId: string
  name: string
  path?: string
  notes?: string
}

export interface GTMBuiltInVariable {
  type: string
  name: string
}

export interface GTMLiveVersion {
  containerVersionId: string
  name?: string
  description?: string
  deleted?: boolean
  container?: GTMContainer
  tag?: GTMTag[]
  trigger?: GTMTrigger[]
  variable?: GTMVariable[]
  folder?: GTMFolder[]
  builtInVariable?: GTMBuiltInVariable[]
  path?: string
  fingerprint?: string
}

// ─── Audit Result Types ───────────────────────────────────────────────────────

export type MarTechCategory =
  | 'analytics'
  | 'advertising'
  | 'consent'
  | 'heatmap'
  | 'chat'
  | 'social'
  | 'video'
  | 'ab-testing'
  | 'error-tracking'
  | 'security'
  | 'customer-data'
  | 'other'

export interface MarTechItem {
  name: string
  category: MarTechCategory
  tagType: string
  count: number
  tagNames: string[]
  notes?: string
}

export interface NamingConventionIssue {
  name: string
  type: 'tag' | 'trigger' | 'variable'
  issue: string
}

/** The full GTM audit report returned from /api/gtm-audit/run */
export interface GTMAuditReport {
  containerId: string
  containerName: string
  publicId: string
  containerType: string[]
  healthScore: number
  timestamp: string
  liveVersionId: string
  tagCount: number
  triggerCount: number
  variableCount: number
  folderCount: number
  checks: AuditCheckResult[]
  summary: AuditSummary
  martech: MarTechItem[]
}

/** Summary row for the saved reports list */
export interface SavedGTMReportSummary {
  id: number
  containerName: string
  containerId: string
  publicId: string
  healthScore: number
  summary: AuditSummary
  createdAt: string
}

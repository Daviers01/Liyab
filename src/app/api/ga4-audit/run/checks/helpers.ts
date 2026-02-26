import type { AuditCheckResult, AuditDetailItem } from '@/types/audit'

export type AuditCheck = AuditCheckResult
export type R = Record<string, unknown>

/** Create a detail item for issues / properlyConfigured arrays */
export function item(
  label: string,
  status: AuditCheckResult['status'],
  detail?: string,
  meta?: Record<string, string>,
): AuditDetailItem {
  return { label, status, detail, meta }
}

import type { AuditDetailItem } from '@/types/audit'
import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 2. Event & Data Setup ───────────────────────────────────────────────────

export function runEventDataChecks(
  checks: AuditCheck[],
  customDimensions: R[],
  customMetrics: R[],
  serviceLevel?: string,
) {
  const cat = AUDIT_CATEGORIES.EVENT_TRACKING
  const is360 = serviceLevel === 'GOOGLE_ANALYTICS_360'

  // GA4 360 limits vs Standard limits
  const eventDimLimit = is360 ? 125 : 50
  const userDimLimit = is360 ? 100 : 25
  const itemDimLimit = is360 ? 25 : 10
  const metricLimit = is360 ? 125 : 50
  const eventDimWarnThreshold = Math.round(eventDimLimit * 0.8)
  const userDimWarnThreshold = Math.round(userDimLimit * 0.8)

  const eventScopeDims = customDimensions.filter((d) => (d.scope as string) === 'EVENT')
  const userScopeDims = customDimensions.filter((d) => (d.scope as string) === 'USER')
  const itemScopeDims = customDimensions.filter((d) => (d.scope as string) === 'ITEM')

  // Helper to build param list items
  const dimToItem = (d: R): AuditDetailItem =>
    item((d.parameterName as string) || (d.displayName as string) || 'unnamed', 'pass', undefined, {
      'Display Name': (d.displayName as string) || '—',
      Scope: (d.scope as string) || '—',
    })
  const metricToItem = (m: R): AuditDetailItem =>
    item((m.parameterName as string) || (m.displayName as string) || 'unnamed', 'pass', undefined, {
      'Display Name': (m.displayName as string) || '—',
      Unit: (m.measurementUnit as string) || '—',
    })

  // CD-1: Custom Dimensions
  const dimConfigured: AuditDetailItem[] = []
  if (eventScopeDims.length > 0)
    dimConfigured.push(item(`${eventScopeDims.length} event-scoped`, 'pass'))
  if (userScopeDims.length > 0)
    dimConfigured.push(item(`${userScopeDims.length} user-scoped`, 'pass'))
  if (itemScopeDims.length > 0)
    dimConfigured.push(item(`${itemScopeDims.length} item-scoped`, 'pass'))
  // Add individual dimensions as properly configured items
  const allDimItems = customDimensions.map(dimToItem)

  checks.push({
    id: 'cd-1',
    category: cat,
    name: 'Custom Dimensions',
    status: customDimensions.length > 0 ? 'pass' : 'info',
    message:
      customDimensions.length > 0
        ? `${customDimensions.length} custom dimension(s) configured across ${dimConfigured.length} scope(s).`
        : 'No custom dimensions defined. Consider adding dimensions for business-specific data.',
    tip: 'Custom dimensions let you track business-specific attributes like content_category, user_type, or membership_level.',
    properlyConfigured: allDimItems.length > 0 ? allDimItems : undefined,
  })

  // CD-2: Event Dimension Limit
  if (eventScopeDims.length > 0) {
    const percentage = Math.round((eventScopeDims.length / eventDimLimit) * 100)
    const tierLabel = is360 ? 'GA4 360' : 'Standard'
    checks.push({
      id: 'cd-2',
      category: cat,
      name: 'Event Dimension Limit',
      status: eventScopeDims.length > eventDimWarnThreshold ? 'warn' : 'pass',
      message: `${eventScopeDims.length}/${eventDimLimit} event-scoped custom dimensions used (${percentage}%). [${tierLabel}]`,
      recommendation:
        eventScopeDims.length > eventDimWarnThreshold
          ? 'Audit existing custom dimensions and archive any that are no longer in use.'
          : undefined,
      tip: is360
        ? 'GA4 360 allows up to 125 event-scoped, 100 user-scoped, and 10 item-scoped custom dimensions.'
        : 'Standard GA4 allows up to 50 event-scoped, 25 user-scoped, and 10 item-scoped custom dimensions. GA4 360 properties get higher limits (125/100/10).',
      properlyConfigured:
        eventScopeDims.length <= eventDimWarnThreshold
          ? [
              item(
                `${eventScopeDims.length}/${eventDimLimit} used`,
                'pass',
                `Within safe limit (${tierLabel})`,
              ),
            ]
          : undefined,
      issues:
        eventScopeDims.length > eventDimWarnThreshold
          ? [
              item(
                `${eventScopeDims.length}/${eventDimLimit} used`,
                'warn',
                `Only ${eventDimLimit - eventScopeDims.length} slots remaining (${tierLabel})`,
              ),
            ]
          : undefined,
    })
  }

  // CD-3: User Scope Dimensions
  if (userScopeDims.length > 0) {
    const percentage = Math.round((userScopeDims.length / userDimLimit) * 100)
    const tierLabel = is360 ? 'GA4 360' : 'Standard'
    checks.push({
      id: 'cd-2b',
      category: cat,
      name: 'User Dimension Limit',
      status: userScopeDims.length > userDimWarnThreshold ? 'warn' : 'pass',
      message: `${userScopeDims.length}/${userDimLimit} user-scoped custom dimensions used (${percentage}%). [${tierLabel}]`,
      tip: is360
        ? 'GA4 360 allows up to 100 user-scoped dimensions.'
        : 'Standard GA4 allows up to 25 user-scoped dimensions. GA4 360 properties get up to 100.',
      properlyConfigured:
        userScopeDims.length <= userDimWarnThreshold
          ? [
              item(
                `${userScopeDims.length}/${userDimLimit} used`,
                'pass',
                `Within safe limit (${tierLabel})`,
              ),
            ]
          : undefined,
    })
  }

  // CD-4: Custom Metrics
  void itemDimLimit // item-scoped dim limit checked via CD-1 totals
  const metricWarnThreshold = Math.round(metricLimit * 0.8)
  const allMetricItems = customMetrics.map(metricToItem)

  checks.push({
    id: 'cd-3',
    category: cat,
    name: 'Custom Metrics',
    status: customMetrics.length > 0 ? 'pass' : 'info',
    message:
      customMetrics.length > 0
        ? `${customMetrics.length}/${metricLimit} custom metric(s) configured.${is360 ? ' [GA4 360]' : ''}`
        : 'No custom metrics defined. This is fine unless you need to track numeric business-specific values.',
    tip: is360
      ? 'GA4 360 allows up to 75 custom metrics.'
      : 'Standard GA4 allows up to 50 custom metrics. GA4 360 properties get up to 75.',
    properlyConfigured: allMetricItems.length > 0 ? allMetricItems : undefined,
    issues:
      customMetrics.length > metricWarnThreshold
        ? [
            item(
              `${customMetrics.length}/${metricLimit} used`,
              'warn',
              `Only ${metricLimit - customMetrics.length} slots remaining`,
            ),
          ]
        : undefined,
  })
}

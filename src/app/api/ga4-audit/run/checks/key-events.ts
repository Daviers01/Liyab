import type { AuditDetailItem, AnalyticsSnapshot } from '@/types/audit'
import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 3. Key Events & Conversions ─────────────────────────────────────────────

export function runKeyEventChecks(
  checks: AuditCheck[],
  conversionEvents: R[],
  serviceLevel?: string,
  analyticsData?: AnalyticsSnapshot,
) {
  const cat = AUDIT_CATEGORIES.KEY_EVENTS
  const is360 = serviceLevel === 'GOOGLE_ANALYTICS_360'
  const keLimit = is360 ? 50 : 30
  const keWarnThreshold = Math.floor(keLimit * 0.67) // warn at ~67% usage

  // Build a map of actual event performance data
  const eventPerformance = new Map<string, number>()
  if (analyticsData?.keyEventCounts) {
    for (const k of analyticsData.keyEventCounts) {
      eventPerformance.set(k.eventName.toLowerCase(), k.count)
    }
  }
  const totalSessions = analyticsData?.totalSessions || 0

  // KE-1: Key events exist — include performance data if available
  const keConfigured: AuditDetailItem[] = conversionEvents.map((c) => {
    const name = (c.eventName as string) || 'unnamed'
    const count = eventPerformance.get(name.toLowerCase())
    if (count !== undefined && totalSessions > 0) {
      const rate = ((count / totalSessions) * 100).toFixed(2)
      return item(name, 'pass', `${count.toLocaleString()} conversions (${rate}% rate)`)
    }
    if (count !== undefined) {
      return item(name, 'pass', `${count.toLocaleString()} conversions in 30 days`)
    }
    return item(name, 'pass', 'Marked as key event')
  })

  checks.push({
    id: 'ke-1',
    category: cat,
    name: 'Key Events Defined',
    status: conversionEvents.length === 0 ? 'fail' : 'pass',
    message:
      conversionEvents.length === 0
        ? 'No key events (conversions) are defined. Business-critical actions are not being tracked.'
        : analyticsData?.keyEventCounts && analyticsData.keyEventCounts.length > 0
          ? `${conversionEvents.length} key event(s) configured. ${analyticsData.keyEventCounts.reduce((sum, k) => sum + k.count, 0).toLocaleString()} total conversions in the last 30 days.`
          : `${conversionEvents.length} key event(s) configured.`,
    recommendation:
      conversionEvents.length === 0
        ? 'Mark important events as key events in Admin → Events → toggle "Mark as key event".'
        : undefined,
    tip: 'In GA4, "conversions" have been renamed to "key events." They measure your most important user interactions like purchases, sign-ups, and form submissions.',
    properlyConfigured: keConfigured.length > 0 ? keConfigured : undefined,
  })

  // KE-2: Recommended key events
  const convNames = conversionEvents.map((c) => ((c.eventName as string) || '').toLowerCase())
  const recommendedEvents = [
    { name: 'purchase', desc: 'Transaction completed' },
    { name: 'sign_up', desc: 'User registration' },
    { name: 'generate_lead', desc: 'Lead form submission' },
    { name: 'begin_checkout', desc: 'Checkout initiated' },
    { name: 'add_to_cart', desc: 'Item added to cart' },
    { name: 'view_item', desc: 'Product/item viewed' },
  ]
  const missing = recommendedEvents.filter((e) => !convNames.includes(e.name))
  const present = recommendedEvents.filter((e) => convNames.includes(e.name))

  if (conversionEvents.length > 0) {
    checks.push({
      id: 'ke-2',
      category: cat,
      name: 'Recommended Key Events',
      status: missing.length >= 4 ? 'warn' : missing.length > 0 ? 'info' : 'pass',
      message:
        missing.length === 0
          ? 'All recommended key events are configured.'
          : `${missing.length} commonly recommended key events not configured.`,
      recommendation:
        missing.length > 0
          ? 'Review if any of these standard events apply to your business model.'
          : undefined,
      tip: 'Not all recommended events apply to every business. Focus on the ones that reflect your actual conversion actions.',
      issues: missing.map((e) =>
        item(e.name, missing.length >= 4 ? 'warn' : 'info', `${e.desc} — not configured`),
      ),
      properlyConfigured: present.map((e) =>
        item(e.name, 'pass', `${e.desc} — configured as key event`),
      ),
    })
  }

  // KE-3: Key event limit
  if (conversionEvents.length > keWarnThreshold) {
    checks.push({
      id: 'ke-3',
      category: cat,
      name: 'Key Event Limit',
      status: conversionEvents.length >= keLimit ? 'fail' : 'warn',
      message: `${conversionEvents.length}/${keLimit} key events defined${is360 ? ' [GA4 360]' : ' [Standard]'}. ${conversionEvents.length >= keLimit ? 'Limit reached!' : 'Approaching the limit.'}`,
      recommendation: 'Review and consolidate key events. Remove any that are no longer relevant.',
      tip: `GA4 ${is360 ? '360' : 'standard'} allows a maximum of ${keLimit} key events per property. Exceeding this prevents adding new ones.`,
      issues: [
        item(
          `${conversionEvents.length}/${keLimit} key events`,
          conversionEvents.length >= keLimit ? 'fail' : 'warn',
          conversionEvents.length >= keLimit
            ? 'No slots remaining — remove unused key events'
            : `Only ${keLimit - conversionEvents.length} slots remaining`,
        ),
      ],
    })
  }

  // KE-4: Zero-activity key events (configured but no conversions)
  if (analyticsData?.keyEventCounts && conversionEvents.length > 0) {
    const activeEventNames = new Set(
      analyticsData.keyEventCounts.filter((k) => k.count > 0).map((k) => k.eventName.toLowerCase()),
    )
    const zeroActivity = conversionEvents.filter((c) => {
      const name = ((c.eventName as string) || '').toLowerCase()
      return name && !activeEventNames.has(name)
    })

    if (zeroActivity.length > 0) {
      checks.push({
        id: 'ke-4',
        category: cat,
        name: 'Inactive Key Events',
        status: 'warn',
        message: `${zeroActivity.length} key event(s) configured but recorded zero conversions in the last 30 days. This may indicate broken tracking or obsolete events.`,
        recommendation:
          'Verify that these events are still being triggered on your site. Check GTM tags, event parameters, and page deployment. Remove unused key events to free up slots.',
        tip: "An inactive key event can mean the tracking code was removed, the trigger conditions changed, or the user action simply didn't occur. Investigate to confirm.",
        issues: zeroActivity.map((c) => {
          const name = (c.eventName as string) || 'unnamed'
          return item(name, 'warn', '0 conversions in 30 days — verify tracking is active')
        }),
      })
    }
  }
}

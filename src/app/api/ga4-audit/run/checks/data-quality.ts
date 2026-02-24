import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 7. Data Quality & Filters ───────────────────────────────────────────────

export function runDataQualityChecks(checks: AuditCheck[], dataStreams: R[], property: R) {
  const cat = AUDIT_CATEGORIES.DATA_QUALITY
  const webStreams = dataStreams.filter((s) => (s.type as string) === 'WEB_DATA_STREAM')

  // DQ-1: Internal traffic filter
  checks.push({
    id: 'dq-1',
    category: cat,
    name: 'Internal Traffic Filter',
    status: 'info',
    message:
      "Verify that an internal traffic filter is active in Admin → Data Settings → Data Filters to exclude your team's visits from reports.",
    tip: 'Create a data filter using IP addresses or a custom traffic_type parameter. Set it to "Testing" first to verify it works, then switch to "Active."',
  })

  // DQ-2: Bot traffic
  checks.push({
    id: 'dq-2',
    category: cat,
    name: 'Bot Traffic Filtering',
    status: 'info',
    message:
      'GA4 automatically filters known bots and spiders. For additional protection, verify unusual traffic patterns in your real-time reports.',
    tip: 'Unlike UA, GA4 handles bot filtering automatically. However, referral spam can still appear. Use data filters to exclude suspicious hostnames or sources.',
  })

  // DQ-3: Data retention
  const retentionSettings = property.dataRetentionSettings as R | undefined
  if (retentionSettings) {
    const retention = retentionSettings.eventDataRetention as string
    const isShort = retention === 'TWO_MONTHS' || retention === 'RETENTION_PERIOD_2_MONTHS'
    const resetOnNewActivity = retentionSettings.resetUserDataOnNewActivity as boolean

    const configured = []
    const issues = []

    if (isShort)
      issues.push(item('2-month retention', 'warn', 'Limits historical data in Explorations'))
    else
      configured.push(
        item(
          retention?.replace(/_/g, ' ').toLowerCase() || 'Extended period',
          'pass',
          'Good retention period',
        ),
      )

    if (resetOnNewActivity === true)
      configured.push(item('Reset on new activity', 'pass', 'User data refreshed with activity'))
    else if (resetOnNewActivity === false)
      issues.push(
        item('Reset on new activity off', 'info', 'User data may expire for returning visitors'),
      )

    checks.push({
      id: 'dq-3',
      category: cat,
      name: 'Data Retention Period',
      status: isShort ? 'warn' : 'pass',
      message: isShort
        ? 'Data retention is set to 2 months, limiting historical exploration reports.'
        : `Data retention: ${retention?.replace(/_/g, ' ').toLowerCase() || 'extended period'}.`,
      recommendation: isShort
        ? 'Set data retention to 14 months in Admin → Data Settings → Data Retention.'
        : undefined,
      tip: 'Data retention only affects Exploration reports. Standard reports use aggregated data that is not affected by this setting.',
      properlyConfigured: configured.length > 0 ? configured : undefined,
      issues: issues.length > 0 ? issues : undefined,
    })
  }

  // DQ-4: Cross-domain tracking
  if (webStreams.length >= 1) {
    checks.push({
      id: 'dq-4',
      category: cat,
      name: 'Cross-Domain Tracking',
      status: 'info',
      message:
        webStreams.length === 1
          ? 'Single web stream detected. If your user journey spans multiple domains, configure cross-domain tracking.'
          : `${webStreams.length} web streams found. Verify cross-domain tracking is configured if users navigate between domains.`,
      tip: 'Configure cross-domain tracking in Admin → Data Streams → Configure Tag Settings → Configure your domains. This prevents self-referrals and preserves user sessions across domains.',
    })
  }

  // DQ-5: Referral exclusions
  checks.push({
    id: 'dq-5',
    category: cat,
    name: 'Referral Exclusions',
    status: 'info',
    message:
      'Verify that payment gateways (PayPal, Stripe) and third-party auth providers are excluded from referral sources.',
    tip: 'Go to Admin → Data Streams → Configure Tag Settings → List Unwanted Referrals. Add domains like paypal.com, stripe.com, and any OAuth providers.',
  })

  // DQ-6: Data filters
  checks.push({
    id: 'dq-6',
    category: cat,
    name: 'Data Filters Configuration',
    status: 'info',
    message:
      'Verify data filters in Admin → Data Settings → Data Filters. Ensure developer and internal traffic are excluded.',
    tip: 'GA4 data filters can exclude or include traffic based on event parameter values. The most common use is filtering internal traffic using the traffic_type parameter.',
  })

  // DQ-7: Annotations
  checks.push({
    id: 'dq-7',
    category: cat,
    name: 'Annotations',
    status: 'info',
    message:
      'GA4 now supports annotations for marking important changes. Use them to document website updates, marketing campaigns, or configuration changes.',
    tip: 'Add annotations when you make significant changes to your site, start/stop campaigns, or modify GA4 settings. This helps explain data fluctuations in the future.',
  })
}

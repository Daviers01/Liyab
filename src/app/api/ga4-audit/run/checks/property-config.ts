import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 12. Property Configuration ──────────────────────────────────────────────

export function runPropertyConfigChecks(checks: AuditCheck[], property: R) {
  const cat = AUDIT_CATEGORIES.PROPERTY_SETTINGS

  // PC-1: Timezone
  const timeZone = property.timeZone as string | undefined
  checks.push({
    id: 'pc-tz-1',
    category: cat,
    name: 'Reporting Time Zone',
    status: timeZone ? 'pass' : 'warn',
    message: timeZone ? `Time zone: ${timeZone}.` : 'Time zone could not be determined.',
    recommendation: !timeZone
      ? 'Set your reporting time zone in Admin → Property Settings.'
      : undefined,
    tip: 'The time zone affects how dates appear in reports and when daily data processing occurs. Set it to your primary business location.',
    properlyConfigured: timeZone
      ? [item(timeZone, 'pass', 'Matches business location')]
      : undefined,
  })

  // PC-2: Currency
  const currencyCode = property.currencyCode as string | undefined
  checks.push({
    id: 'pc-cur-2',
    category: cat,
    name: 'Reporting Currency',
    status: currencyCode ? 'pass' : 'warn',
    message: currencyCode
      ? `Currency: ${currencyCode}.`
      : 'Currency setting could not be verified.',
    recommendation: !currencyCode
      ? 'Set your reporting currency in Admin → Property Settings.'
      : undefined,
    tip: 'Set the currency to match your primary revenue currency. GA4 will convert multi-currency revenue data to this currency in reports.',
    properlyConfigured: currencyCode
      ? [item(currencyCode, 'pass', 'Revenue currency set')]
      : undefined,
  })

  // PC-3: Industry
  const industryCategory = property.industryCategory as string | undefined
  checks.push({
    id: 'pc-ind-3',
    category: cat,
    name: 'Industry Category',
    status: industryCategory ? 'pass' : 'info',
    message: industryCategory
      ? `Industry: ${industryCategory.replace(/_/g, ' ')}.`
      : 'No industry category set. Setting one enables benchmarking data.',
    tip: 'Setting an industry category enables benchmarking reports that compare your performance against similar businesses in your industry.',
    properlyConfigured: industryCategory
      ? [item(industryCategory.replace(/_/g, ' '), 'pass', 'Benchmarking enabled')]
      : undefined,
  })

  // PC-4: Service level
  const serviceLevel = property.serviceLevel as string | undefined
  if (serviceLevel) {
    checks.push({
      id: 'pc-sl-4',
      category: cat,
      name: 'Service Level',
      status: 'pass',
      message: `Service level: ${serviceLevel === 'GOOGLE_ANALYTICS_360' ? 'GA4 360' : 'Standard'}.`,
      tip:
        serviceLevel === 'GOOGLE_ANALYTICS_360'
          ? 'GA4 360 provides higher data limits, SLA guarantees, and advanced features like roll-up properties and sub-properties.'
          : 'Standard GA4 is suitable for most businesses. Consider GA360 only if you exceed standard data limits.',
      properlyConfigured: [
        item(serviceLevel === 'GOOGLE_ANALYTICS_360' ? 'GA4 360' : 'Standard', 'pass'),
      ],
    })
  }

  // PC-5: Property creation time
  const createTime = property.createTime as string | undefined
  if (createTime) {
    const created = new Date(createTime)
    const now = new Date()
    const daysSinceCreation = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    )

    checks.push({
      id: 'pc-ct-5',
      category: cat,
      name: 'Property Age',
      status: daysSinceCreation < 30 ? 'info' : 'pass',
      message: `Property created ${daysSinceCreation} days ago (${created.toLocaleDateString()}).`,
      tip:
        daysSinceCreation < 30
          ? 'New properties need at least 30 days of data before reports become meaningful. Machine learning features like anomaly detection and predictive audiences require even more data.'
          : 'Property has sufficient data history for meaningful analysis.',
      properlyConfigured: [
        item(`${daysSinceCreation} days old`, daysSinceCreation < 30 ? 'info' : 'pass'),
      ],
    })
  }
}

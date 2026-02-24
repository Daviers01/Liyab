import type { AnalyticsSnapshot } from '@/types/audit'
import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, item } from './helpers'

// ─── 11. Audience & Device Performance ───────────────────────────────────────

export function runAudienceDeviceChecks(checks: AuditCheck[], analyticsData?: AnalyticsSnapshot) {
  const cat = AUDIT_CATEGORIES.AUDIENCE_DEVICE

  if (analyticsData) {
    // AD-1: Device breakdown with bounce rate context
    if (analyticsData.deviceBreakdown.length > 0) {
      const totalDeviceSessions = analyticsData.deviceBreakdown.reduce(
        (sum, d) => sum + d.sessions,
        0,
      )
      const deviceItems = analyticsData.deviceBreakdown.map((d) => {
        const pct =
          totalDeviceSessions > 0
            ? ((d.sessions / totalDeviceSessions) * 100).toFixed(1)
            : d.percentage
        return item(d.category, 'pass', `${d.sessions.toLocaleString()} sessions (${pct}%)`)
      })
      const mobileData = analyticsData.deviceBreakdown.find(
        (d) => d.category.toLowerCase() === 'mobile',
      )
      const desktopData = analyticsData.deviceBreakdown.find(
        (d) => d.category.toLowerCase() === 'desktop',
      )

      const deviceIssues = []
      if (mobileData && mobileData.percentage < 20 && desktopData && desktopData.percentage > 70) {
        deviceIssues.push(
          item(
            'Low mobile traffic',
            'info',
            `Only ${mobileData.percentage}% mobile — verify mobile UX and tracking`,
          ),
        )
      }

      checks.push({
        id: 'ad-1',
        category: cat,
        name: 'Device Distribution',
        status: deviceIssues.length > 0 ? 'info' : 'pass',
        message: `Traffic distributed across ${analyticsData.deviceBreakdown.length} device types. ${mobileData ? `Mobile: ${mobileData.percentage}%` : ''} ${desktopData ? `Desktop: ${desktopData.percentage}%` : ''}.`,
        tip: 'Monitor device distribution to ensure your site performs well across all device types. Mobile-first indexing makes mobile performance critical for SEO.',
        issues: deviceIssues.length > 0 ? deviceIssues : undefined,
        properlyConfigured: deviceItems,
      })
    }

    // AD-2: Landing page performance with session share
    if (analyticsData.topLandingPages.length > 0) {
      const totalLP = analyticsData.totalSessions || 1
      const highBounce = analyticsData.topLandingPages.filter((p) => p.bounceRate > 70)
      const goodPages = analyticsData.topLandingPages.filter((p) => p.bounceRate <= 70)

      checks.push({
        id: 'ad-2',
        category: cat,
        name: 'Landing Page Performance',
        status: highBounce.length > analyticsData.topLandingPages.length / 2 ? 'warn' : 'pass',
        message:
          highBounce.length > 0
            ? `${highBounce.length} of ${analyticsData.topLandingPages.length} top landing pages have bounce rates above 70%.`
            : 'Top landing pages have healthy bounce rates (under 70%).',
        tip: 'High bounce rates on landing pages may indicate poor content relevance, slow load times, or bad mobile experience. Investigate pages with bounce rates above 70%.',
        issues: highBounce.slice(0, 5).map((p) => {
          const sessionPct = ((p.sessions / totalLP) * 100).toFixed(1)
          return item(
            p.page,
            'warn',
            `Bounce: ${p.bounceRate.toFixed(1)}% · ${p.sessions.toLocaleString()} sessions (${sessionPct}%)`,
          )
        }),
        properlyConfigured: goodPages.slice(0, 5).map((p) => {
          const sessionPct = ((p.sessions / totalLP) * 100).toFixed(1)
          return item(
            p.page,
            'pass',
            `Bounce: ${p.bounceRate.toFixed(1)}% · ${p.sessions.toLocaleString()} sessions (${sessionPct}%)`,
          )
        }),
      })
    }

    // AD-3: Key event performance with conversion rates
    if (analyticsData.keyEventCounts.length > 0) {
      const totalSess = analyticsData.totalSessions || 1
      const totalConversions = analyticsData.keyEventCounts.reduce((sum, k) => sum + k.count, 0)
      const overallRate = ((totalConversions / totalSess) * 100).toFixed(2)

      checks.push({
        id: 'ad-3',
        category: cat,
        name: 'Key Event Performance (30 days)',
        status: 'pass',
        message: `${analyticsData.keyEventCounts.length} key event type(s) with ${totalConversions.toLocaleString()} total conversions. Overall conversion rate: ${overallRate}%.`,
        tip: 'Monitor key event volumes for sudden drops which could indicate tracking issues. Set up alerts in GA4 > Custom Insights.',
        properlyConfigured: analyticsData.keyEventCounts.slice(0, 10).map((k) => {
          const rate = ((k.count / totalSess) * 100).toFixed(2)
          return item(
            k.eventName,
            'pass',
            `${k.count.toLocaleString()} conversions (${rate}% rate)`,
          )
        }),
      })
    }

    // AD-4: Anomaly detection
    if (analyticsData.anomalies.length > 0) {
      checks.push({
        id: 'ad-4',
        category: cat,
        name: 'Data Anomalies',
        status: 'warn',
        message: `${analyticsData.anomalies.length} potential data anomaly(s) detected in the last 30 days.`,
        tip: 'Anomalies can indicate tracking code changes, website issues, bot traffic, or genuine traffic shifts. Investigate sudden drops or spikes promptly.',
        issues: analyticsData.anomalies,
      })
    }
  } else {
    checks.push({
      id: 'ad-1',
      category: cat,
      name: 'Audience & Device Analysis',
      status: 'info',
      message:
        'Audience and device performance data requires GA4 Data API access. Connect analytics data to see device breakdown, landing page performance, and anomaly detection.',
      tip: 'The GA4 Data API provides detailed metrics for the last 30 days including user counts, session data, device breakdown, and landing page performance.',
    })
  }
}

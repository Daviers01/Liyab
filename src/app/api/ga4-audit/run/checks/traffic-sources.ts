import type { AuditDetailItem, AnalyticsSnapshot } from '@/types/audit'
import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, item } from './helpers'

// ─── 8. Traffic Sources & UTM ────────────────────────────────────────────────

export function runTrafficSourceChecks(checks: AuditCheck[], analyticsData?: AnalyticsSnapshot) {
  const cat = AUDIT_CATEGORIES.TRAFFIC_SOURCES

  // TS-1: UTM tracking integrity
  if (analyticsData) {
    const { notSetCounts, topSources } = analyticsData
    const totalSessions = analyticsData.totalSessions || 1
    const sourceNotSetPct = Math.round((notSetCounts.source / totalSessions) * 100)
    const mediumNotSetPct = Math.round((notSetCounts.medium / totalSessions) * 100)
    const campaignNotSetPct = Math.round((notSetCounts.campaign / totalSessions) * 100)

    const issues: AuditDetailItem[] = []
    const configured: AuditDetailItem[] = []

    if (sourceNotSetPct > 10)
      issues.push(
        item(`source (not set): ${sourceNotSetPct}%`, 'warn', 'High unattributed traffic'),
      )
    else configured.push(item(`source: ${100 - sourceNotSetPct}% attributed`, 'pass'))

    if (mediumNotSetPct > 10)
      issues.push(item(`medium (not set): ${mediumNotSetPct}%`, 'warn', 'Missing medium values'))
    else configured.push(item(`medium: ${100 - mediumNotSetPct}% attributed`, 'pass'))

    if (campaignNotSetPct > 30)
      issues.push(
        item(
          `campaign (not set): ${campaignNotSetPct}%`,
          'info',
          'Many sessions without campaign name',
        ),
      )

    checks.push({
      id: 'ts-1',
      category: cat,
      name: 'UTM Attribution Coverage',
      status: issues.some((i) => i.status === 'warn') ? 'warn' : 'pass',
      message:
        issues.length > 0
          ? `${issues.length} UTM attribution gap(s) detected in the last 30 days.`
          : 'Traffic source attribution looks healthy. Most sessions have proper source/medium.',
      recommendation:
        issues.length > 0
          ? 'Ensure all marketing links use proper UTM parameters (utm_source, utm_medium, utm_campaign). Use a UTM builder tool for consistency.'
          : undefined,
      tip: 'Consistent UTM tagging is essential for accurate campaign attribution. Use lowercase, no spaces, and standardized naming conventions.',
      issues: issues.length > 0 ? issues : undefined,
      properlyConfigured: configured.length > 0 ? configured : undefined,
    })

    // TS-2: (not set) prevalence with fix guidance
    const landingNotSetPct = Math.round((notSetCounts.landingPage / totalSessions) * 100)
    const notSetIssues: AuditDetailItem[] = []
    const notSetConfigured: AuditDetailItem[] = []

    // Source
    if (sourceNotSetPct > 5)
      notSetIssues.push(
        item(
          `Source: ${sourceNotSetPct}% (not set)`,
          sourceNotSetPct > 15 ? 'warn' : 'info',
          `${notSetCounts.source.toLocaleString()} sessions — Fix: add utm_source to campaign URLs. Direct/organic traffic is expected to be (not set).`,
        ),
      )
    else notSetConfigured.push(item(`Source: ${100 - sourceNotSetPct}% attributed`, 'pass'))

    // Medium
    if (mediumNotSetPct > 5)
      notSetIssues.push(
        item(
          `Medium: ${mediumNotSetPct}% (not set)`,
          mediumNotSetPct > 15 ? 'warn' : 'info',
          `${notSetCounts.medium.toLocaleString()} sessions — Fix: add utm_medium (e.g., cpc, email, social) to campaign URLs.`,
        ),
      )
    else notSetConfigured.push(item(`Medium: ${100 - mediumNotSetPct}% attributed`, 'pass'))

    // Campaign
    if (campaignNotSetPct > 30)
      notSetIssues.push(
        item(
          `Campaign: ${campaignNotSetPct}% (not set)`,
          'info',
          `${notSetCounts.campaign.toLocaleString()} sessions — campaigns are only set for paid/tagged traffic. This is often expected.`,
        ),
      )
    else notSetConfigured.push(item(`Campaign: ${100 - campaignNotSetPct}% attributed`, 'pass'))

    // Landing page
    if (landingNotSetPct > 5)
      notSetIssues.push(
        item(
          `Landing Page: ${landingNotSetPct}% (not set)`,
          landingNotSetPct > 15 ? 'warn' : 'info',
          `${notSetCounts.landingPage.toLocaleString()} sessions — Fix: ensure page_view event fires before other events. Check gtag config for send_page_view: true.`,
        ),
      )
    else notSetConfigured.push(item(`Landing Page: ${100 - landingNotSetPct}% attributed`, 'pass'))

    checks.push({
      id: 'ts-2',
      category: cat,
      name: '(not set) Data Quality',
      status: notSetIssues.some((i) => i.status === 'warn')
        ? 'warn'
        : notSetIssues.length > 0
          ? 'info'
          : 'pass',
      message:
        notSetIssues.length > 0
          ? `(not set) values detected across ${notSetIssues.length} dimension(s). High rates indicate unattributed traffic or data collection issues.`
          : 'Minimal (not set) values across key dimensions. Data quality is excellent.',
      recommendation:
        notSetIssues.length > 0
          ? "Common causes of (not set): missing UTM parameters on campaign links, improper page_view event firing, referral exclusion list gaps. See each dimension's fix below."
          : undefined,
      tip: '"(not set)" means GA4 couldn\'t determine the value. For source/medium, direct traffic is naturally (not set). For landing pages, it usually means the session started with an event other than page_view.',
      issues: notSetIssues.length > 0 ? notSetIssues : undefined,
      properlyConfigured: notSetConfigured.length > 0 ? notSetConfigured : undefined,
    })

    // TS-3: Traffic source effectiveness with session percentages & concentration warning
    if (topSources.length > 0) {
      const topSourceItems = topSources.slice(0, 8).map((s) => {
        const pct = totalSessions > 0 ? ((s.sessions / totalSessions) * 100).toFixed(1) : '0'
        return item(
          `${s.source} / ${s.medium}`,
          'pass',
          `${s.sessions.toLocaleString()} sessions (${pct}%)`,
        )
      })

      const topSourcePct = totalSessions > 0 ? (topSources[0].sessions / totalSessions) * 100 : 0
      const isConcentrated = topSourcePct > 60
      const sourceIssues: AuditDetailItem[] = []

      if (isConcentrated) {
        sourceIssues.push(
          item(
            `${topSources[0].source} / ${topSources[0].medium}`,
            'warn',
            `Accounts for ${topSourcePct.toFixed(1)}% of all traffic — high dependency risk`,
          ),
        )
      }

      checks.push({
        id: 'ts-3',
        category: cat,
        name: 'Traffic Source Diversity',
        status: isConcentrated ? 'warn' : 'pass',
        message: isConcentrated
          ? `${topSources.length} traffic source(s) active, but ${topSources[0]?.source}/${topSources[0]?.medium} accounts for ${topSourcePct.toFixed(1)}% of sessions. Over-reliance on a single source creates risk.`
          : `${topSources.length} traffic source(s) active in the last 30 days. Well-diversified traffic with top source at ${topSourcePct.toFixed(1)}%.`,
        recommendation: isConcentrated
          ? 'Diversify traffic acquisition. Invest in additional channels (content marketing, social, email, partnerships) to reduce dependency on a single source.'
          : undefined,
        tip: 'Review traffic source diversity regularly. Over-reliance on a single source (>60%) creates business risk if that channel changes its algorithm or policies.',
        issues: sourceIssues.length > 0 ? sourceIssues : undefined,
        properlyConfigured: topSourceItems,
      })
    }
  } else {
    // No analytics data — provide guidance checks
    checks.push({
      id: 'ts-1',
      category: cat,
      name: 'UTM Tracking Integrity',
      status: 'info',
      message:
        'UTM tracking analysis requires analytics data. Ensure all marketing campaigns use consistent UTM parameters.',
      tip: 'Use a UTM builder tool and maintain a shared naming convention document. Standard parameters: utm_source, utm_medium, utm_campaign, utm_term, utm_content.',
    })
  }
}

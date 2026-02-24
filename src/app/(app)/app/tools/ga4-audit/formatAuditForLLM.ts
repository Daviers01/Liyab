import type { AuditReport, AuditCheckResult, AuditDetailItem } from '@/types/audit'

/**
 * Formats an AuditReport into a Markdown string optimized for LLM context.
 * Includes property info, summary, analytics snapshot, and all checks grouped by category.
 */
export function formatAuditForLLM(report: AuditReport): string {
  const lines: string[] = []

  // Header
  lines.push(`# GA4 Audit Report`)
  lines.push(
    `**Property:** ${report.propertyName} (${report.propertyId.replace('properties/', '')})`,
  )
  lines.push(`**Health Score:** ${report.healthScore}/100`)
  lines.push(`**Audit Date:** ${new Date(report.timestamp).toLocaleString()}`)
  lines.push('')

  // Account Info
  if (report.accountInfo) {
    lines.push('## Property Overview')
    const info = report.accountInfo
    lines.push(`- **Time Zone:** ${info.timeZone || '—'}`)
    lines.push(`- **Currency:** ${info.currencyCode || '—'}`)
    lines.push(`- **Industry:** ${info.industryCategory?.replace(/_/g, ' ') || '—'}`)
    lines.push(
      `- **Service Level:** ${info.serviceLevel === 'GOOGLE_ANALYTICS_360' ? 'GA4 360' : 'Standard'}`,
    )
    lines.push(
      `- **Created:** ${info.createTime ? new Date(info.createTime).toLocaleDateString() : '—'}`,
    )
    lines.push('')
  }

  // Data Streams
  if (report.dataStreams && report.dataStreams.length > 0) {
    lines.push('## Data Streams')
    lines.push('| Name | Type | Measurement ID | URL |')
    lines.push('|------|------|---------------|-----|')
    for (const ds of report.dataStreams) {
      lines.push(
        `| ${ds.name} | ${ds.type} | ${ds.measurementId || '—'} | ${ds.defaultUri || '—'} |`,
      )
    }
    lines.push('')
  }

  // Analytics Snapshot
  if (report.analyticsSnapshot) {
    const a = report.analyticsSnapshot
    lines.push('## Last 30 Days Overview')
    lines.push(`- **Users:** ${a.totalUsers.toLocaleString()}`)
    lines.push(`- **Sessions:** ${a.totalSessions.toLocaleString()}`)
    lines.push(`- **Pageviews:** ${a.totalPageviews.toLocaleString()}`)
    lines.push(`- **Bounce Rate:** ${a.bounceRate.toFixed(1)}%`)
    lines.push(
      `- **Avg Session Duration:** ${Math.floor(a.avgSessionDuration / 60)}m ${a.avgSessionDuration % 60}s`,
    )
    lines.push('')
    if (a.topSources?.length) {
      lines.push('**Top Traffic Sources:**')
      for (const s of a.topSources) {
        lines.push(`- ${s.source} / ${s.medium}: ${s.sessions} sessions`)
      }
      lines.push('')
    }
    if (a.topLandingPages?.length) {
      lines.push('**Top Landing Pages:**')
      for (const p of a.topLandingPages) {
        lines.push(`- ${p.page}: ${p.sessions} sessions, ${p.bounceRate.toFixed(1)}% bounce`)
      }
      lines.push('')
    }
    if (a.deviceBreakdown?.length) {
      lines.push('**Device Breakdown:**')
      for (const d of a.deviceBreakdown) {
        lines.push(`- ${d.category}: ${d.sessions} sessions (${d.percentage.toFixed(1)}%)`)
      }
      lines.push('')
    }
    if (a.keyEventCounts?.length) {
      lines.push('**Key Event Performance:**')
      for (const e of a.keyEventCounts) {
        lines.push(`- ${e.eventName}: ${e.count}`)
      }
      lines.push('')
    }
    if (a.anomalies?.length) {
      lines.push('**Anomalies:**')
      for (const an of a.anomalies) {
        lines.push(`- ${an.label}: ${an.detail || ''}`)
      }
      lines.push('')
    }
  }

  // Summary
  lines.push('## Audit Summary')
  lines.push(`- **Total Checks:** ${report.summary.total}`)
  lines.push(`- **Passed:** ${report.summary.passed}`)
  lines.push(`- **Warnings:** ${report.summary.warnings}`)
  lines.push(`- **Failures:** ${report.summary.failures}`)
  lines.push(`- **Info:** ${report.summary.info}`)
  lines.push('')

  // Checks by Category
  const grouped: Record<string, AuditCheckResult[]> = {}
  for (const check of report.checks) {
    if (!grouped[check.category]) grouped[check.category] = []
    grouped[check.category].push(check)
  }
  for (const [category, checks] of Object.entries(grouped)) {
    lines.push(`### ${category}`)
    for (const check of checks) {
      lines.push(`- **${check.name}** [${check.status.toUpperCase()}]`)
      lines.push(`  - ${check.message}`)
      if (check.recommendation) lines.push(`  - _Recommendation:_ ${check.recommendation}`)
      if (check.issues?.length) {
        lines.push('  - _Issues:_')
        for (const issue of check.issues) {
          lines.push(
            `    - ${issue.label} [${issue.status.toUpperCase()}]${issue.detail ? ': ' + issue.detail : ''}`,
          )
        }
      }
      if (check.properlyConfigured?.length) {
        lines.push('  - _Properly Configured:_')
        for (const ok of check.properlyConfigured) {
          lines.push(`    - ${ok.label}${ok.detail ? ': ' + ok.detail : ''}`)
        }
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

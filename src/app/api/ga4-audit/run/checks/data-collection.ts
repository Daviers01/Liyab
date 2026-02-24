import type { AuditDetailItem, EnhancedMeasurementSettings } from '@/types/audit'
import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 1. Data Collection & Streams ────────────────────────────────────────────

export function runDataCollectionChecks(
  checks: AuditCheck[],
  dataStreams: R[],
  enhancedMeasurement?: EnhancedMeasurementSettings[],
) {
  const cat = AUDIT_CATEGORIES.DATA_COLLECTION
  const webStreams = dataStreams.filter((s) => (s.type as string) === 'WEB_DATA_STREAM')
  const appStreams = dataStreams.filter(
    (s) =>
      (s.type as string) === 'IOS_APP_DATA_STREAM' ||
      (s.type as string) === 'ANDROID_APP_DATA_STREAM',
  )

  // DS-1: Data Streams Exist
  const dsConfigured: AuditDetailItem[] = []
  const dsIssues: AuditDetailItem[] = []
  if (dataStreams.length === 0) {
    dsIssues.push(item('No data streams found', 'fail', 'Property is not collecting any data'))
  } else {
    if (webStreams.length > 0)
      dsConfigured.push(
        item(`${webStreams.length} web stream(s)`, 'pass', 'Web data collection active'),
      )
    if (appStreams.length > 0)
      dsConfigured.push(
        item(`${appStreams.length} app stream(s)`, 'pass', 'App data collection active'),
      )
  }

  checks.push({
    id: 'ds-1',
    category: cat,
    name: 'Data Streams Configured',
    status: dataStreams.length === 0 ? 'fail' : 'pass',
    message:
      dataStreams.length === 0
        ? 'No data streams found. Your property is not collecting any data.'
        : `${dataStreams.length} data stream(s) found and configured.`,
    recommendation:
      dataStreams.length === 0
        ? 'Add a web or app data stream in Admin → Data Streams → Add Stream.'
        : undefined,
    tip: 'Every GA4 property needs at least one data stream (web, iOS, or Android) to collect data.',
    issues: dsIssues.length > 0 ? dsIssues : undefined,
    properlyConfigured: dsConfigured.length > 0 ? dsConfigured : undefined,
  })

  // DS-2: Measurement ID
  if (webStreams.length > 0) {
    const streamsWithId = webStreams.filter(
      (s) => s.webStreamData && (s.webStreamData as R).measurementId,
    )
    const streamsWithoutId = webStreams.filter(
      (s) => !s.webStreamData || !(s.webStreamData as R).measurementId,
    )

    const midConfigured: AuditDetailItem[] = streamsWithId.map((s) =>
      item(
        `${(s.webStreamData as R).measurementId as string}`,
        'pass',
        (s.displayName as string) || 'Web Stream',
      ),
    )
    const midIssues: AuditDetailItem[] = streamsWithoutId.map((s) =>
      item((s.displayName as string) || 'Web Stream', 'warn', 'Missing measurement ID (G-XXXXXXX)'),
    )

    checks.push({
      id: 'ds-2',
      category: cat,
      name: 'Web Stream Measurement ID',
      status: streamsWithId.length === webStreams.length ? 'pass' : 'warn',
      message:
        streamsWithId.length === webStreams.length
          ? 'All web data streams have valid measurement IDs.'
          : `${streamsWithoutId.length} web stream(s) missing measurement IDs.`,
      recommendation:
        streamsWithId.length < webStreams.length
          ? 'Verify your measurement ID (G-XXXXXXX) in Admin → Data Streams.'
          : undefined,
      tip: 'The measurement ID (G-XXXXXXX) is required for the gtag.js snippet to send data.',
      issues: midIssues.length > 0 ? midIssues : undefined,
      properlyConfigured: midConfigured.length > 0 ? midConfigured : undefined,
    })

    // DS-3: Enhanced Measurement — use real API data when available
    if (enhancedMeasurement && enhancedMeasurement.length > 0) {
      const emFeatures = [
        {
          key: 'scrollsEnabled' as const,
          label: 'Scroll tracking',
          desc: 'Tracks when users reach the bottom of a page',
        },
        {
          key: 'outboundClicksEnabled' as const,
          label: 'Outbound clicks',
          desc: 'Tracks clicks to external domains',
        },
        {
          key: 'siteSearchEnabled' as const,
          label: 'Site search',
          desc: 'Tracks internal search queries',
        },
        {
          key: 'videoEngagementEnabled' as const,
          label: 'Video engagement',
          desc: 'Tracks embedded video play/progress/complete',
        },
        {
          key: 'fileDownloadsEnabled' as const,
          label: 'File downloads',
          desc: 'Tracks clicks on file download links',
        },
        {
          key: 'pageChangesEnabled' as const,
          label: 'Page changes (SPA)',
          desc: 'Tracks virtual pageviews via browser history changes',
        },
        {
          key: 'formInteractionsEnabled' as const,
          label: 'Form interactions',
          desc: 'Tracks form start and submit events',
        },
      ]

      // Aggregate results across all web streams
      const emConfigured: AuditDetailItem[] = []
      const emIssues: AuditDetailItem[] = []
      let masterDisabled = false

      for (const em of enhancedMeasurement) {
        const streamLabel = em.streamName || 'Web Stream'

        if (!em.streamEnabled) {
          masterDisabled = true
          emIssues.push(
            item(
              streamLabel,
              'fail',
              'Enhanced measurement master toggle is OFF — no automatic events are collected',
            ),
          )
          continue
        }

        for (const feat of emFeatures) {
          const enabled = em[feat.key]
          if (enabled) {
            emConfigured.push(item(feat.label, 'pass', `${feat.desc} · ${streamLabel}`))
          } else {
            emIssues.push(item(feat.label, 'warn', `Disabled · ${feat.desc} · ${streamLabel}`))
          }
        }

        // Search query parameter check
        if (em.siteSearchEnabled && !em.searchQueryParameter) {
          emIssues.push(
            item(
              'Search query parameter',
              'warn',
              `Site search enabled but no query parameter configured · ${streamLabel}`,
            ),
          )
        }
      }

      const allEnabled = emIssues.length === 0
      checks.push({
        id: 'ds-3',
        category: cat,
        name: 'Enhanced Measurement',
        status: masterDisabled ? 'fail' : allEnabled ? 'pass' : 'warn',
        message: masterDisabled
          ? 'Enhanced measurement is disabled on one or more web streams. Automatic event tracking (scrolls, clicks, etc.) is not active.'
          : allEnabled
            ? `All ${emFeatures.length} enhanced measurement features are enabled across ${enhancedMeasurement.length} web stream(s).`
            : `${emConfigured.length} of ${emFeatures.length * enhancedMeasurement.length} enhanced measurement features are enabled. ${emIssues.length} feature(s) disabled.`,
        recommendation: !allEnabled
          ? 'Enable all enhanced measurement features in Admin → Data Streams → select stream → Enhanced Measurement. Form interactions are disabled by default — consider enabling it.'
          : undefined,
        tip: 'Enhanced measurement automatically tracks common interactions without extra code: page views, scrolls, outbound clicks, site search, video engagement, file downloads, and form interactions.',
        issues: emIssues.length > 0 ? emIssues : undefined,
        properlyConfigured: emConfigured.length > 0 ? emConfigured : undefined,
      })
    } else {
      // Fallback — no API data available for enhanced measurement
      checks.push({
        id: 'ds-3',
        category: cat,
        name: 'Enhanced Measurement',
        status: 'info',
        message:
          'Enhanced measurement settings could not be retrieved via the API. Verify in the GA4 UI that scrolls, outbound clicks, site search, video engagement, and file downloads are toggled on.',
        tip: 'Enhanced measurement automatically tracks common interactions without extra code. Go to Admin → Data Streams → select stream → toggle Enhanced Measurement.',
        properlyConfigured:
          streamsWithId.length > 0
            ? [item('Web stream(s) detected', 'pass', 'Enhanced measurement likely available')]
            : undefined,
      })
    }
  }

  // DS-4: Duplicate Streams
  if (webStreams.length > 1) {
    checks.push({
      id: 'ds-4',
      category: cat,
      name: 'Duplicate Web Streams',
      status: 'warn',
      message: `${webStreams.length} web data streams found. This can cause duplicate event tracking.`,
      recommendation:
        'Unless intentional (e.g., staging vs. production), consolidate to a single web stream.',
      tip: 'Multiple web streams on the same domain can inflate your event counts and distort reports.',
      issues: webStreams.map((s) =>
        item(
          (s.displayName as string) || 'Unnamed',
          'warn',
          `Measurement ID: ${(s.webStreamData as R)?.measurementId || 'unknown'}`,
        ),
      ),
    })
  }
}

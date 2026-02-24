import { google } from 'googleapis'
import type { AnalyticsSnapshot, AuditDetailItem } from '@/types/audit'

/**
 * Fetches last-30-day analytics data from the GA4 Data API (v1beta).
 * Returns a structured snapshot for the audit report.
 */
export async function fetchAnalyticsSnapshot(
  oauth2Client: InstanceType<typeof google.auth.OAuth2>,
  propertyId: string,
): Promise<AnalyticsSnapshot | undefined> {
  try {
    const analyticsData = google.analyticsdata({
      version: 'v1beta',
      auth: oauth2Client,
    })

    const numericPropertyId = propertyId.replace('properties/', '')

    // Calculate date range: last 30 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    // Previous period for anomaly detection
    const prevEndDate = new Date(startDate)
    prevEndDate.setDate(prevEndDate.getDate() - 1)
    const prevStartDate = new Date(prevEndDate)
    prevStartDate.setDate(prevStartDate.getDate() - 30)

    // Run all Data API requests in parallel
    const [overviewResult, sourcesResult, landingResult, deviceResult, keyEventsResult, prevPeriodResult] =
      await Promise.allSettled([
        // 1. Overview metrics
        analyticsData.properties.runReport({
          property: `properties/${numericPropertyId}`,
          requestBody: {
            dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
            metrics: [
              { name: 'totalUsers' },
              { name: 'sessions' },
              { name: 'screenPageViews' },
              { name: 'bounceRate' },
              { name: 'averageSessionDuration' },
            ],
          },
        }),

        // 2. Traffic sources
        analyticsData.properties.runReport({
          property: `properties/${numericPropertyId}`,
          requestBody: {
            dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
            dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: '15',
          },
        }),

        // 3. Landing pages
        analyticsData.properties.runReport({
          property: `properties/${numericPropertyId}`,
          requestBody: {
            dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
            dimensions: [{ name: 'landingPage' }],
            metrics: [{ name: 'sessions' }, { name: 'bounceRate' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: '10',
          },
        }),

        // 4. Device breakdown
        analyticsData.properties.runReport({
          property: `properties/${numericPropertyId}`,
          requestBody: {
            dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          },
        }),

        // 5. Key events (conversions)
        analyticsData.properties.runReport({
          property: `properties/${numericPropertyId}`,
          requestBody: {
            dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
            dimensions: [{ name: 'eventName' }],
            metrics: [{ name: 'keyEvents' }],
            orderBys: [{ metric: { metricName: 'keyEvents' }, desc: true }],
            limit: '20',
          },
        }),

        // 6. Previous period (for anomaly detection)
        analyticsData.properties.runReport({
          property: `properties/${numericPropertyId}`,
          requestBody: {
            dateRanges: [
              { startDate: formatDate(prevStartDate), endDate: formatDate(prevEndDate) },
            ],
            metrics: [
              { name: 'totalUsers' },
              { name: 'sessions' },
              { name: 'screenPageViews' },
            ],
          },
        }),
      ])

    // Parse overview
    let totalUsers = 0,
      totalSessions = 0,
      totalPageviews = 0,
      bounceRate = 0,
      avgSessionDuration = 0

    if (overviewResult.status === 'fulfilled') {
      const rows = overviewResult.value.data.rows
      if (rows && rows.length > 0) {
        const values = rows[0].metricValues || []
        totalUsers = parseInt(values[0]?.value || '0', 10)
        totalSessions = parseInt(values[1]?.value || '0', 10)
        totalPageviews = parseInt(values[2]?.value || '0', 10)
        bounceRate = parseFloat(values[3]?.value || '0') * 100
        avgSessionDuration = parseFloat(values[4]?.value || '0')
      }
    }

    // Parse traffic sources + compute (not set) counts
    const topSources: AnalyticsSnapshot['topSources'] = []
    let sourceNotSet = 0,
      mediumNotSet = 0

    if (sourcesResult.status === 'fulfilled') {
      const rows = sourcesResult.value.data.rows || []
      for (const row of rows) {
        const dims = row.dimensionValues || []
        const source = dims[0]?.value || '(not set)'
        const medium = dims[1]?.value || '(not set)'
        const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10)

        if (source === '(not set)') sourceNotSet += sessions
        if (medium === '(not set)') mediumNotSet += sessions

        if (source !== '(not set)' || medium !== '(not set)') {
          topSources.push({ source, medium, sessions })
        }
      }
    }

    // Parse landing pages
    const topLandingPages: AnalyticsSnapshot['topLandingPages'] = []
    let landingNotSet = 0

    if (landingResult.status === 'fulfilled') {
      const rows = landingResult.value.data.rows || []
      for (const row of rows) {
        const page = row.dimensionValues?.[0]?.value || '(not set)'
        const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10)
        const br = parseFloat(row.metricValues?.[1]?.value || '0') * 100

        if (page === '(not set)') {
          landingNotSet += sessions
        }
        topLandingPages.push({ page, sessions, bounceRate: br })
      }
    }

    // Parse device breakdown
    const deviceBreakdown: AnalyticsSnapshot['deviceBreakdown'] = []
    if (deviceResult.status === 'fulfilled') {
      const rows = deviceResult.value.data.rows || []
      const totalDeviceSessions = rows.reduce(
        (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
        0,
      )
      for (const row of rows) {
        const category = row.dimensionValues?.[0]?.value || 'unknown'
        const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10)
        deviceBreakdown.push({
          category,
          sessions,
          percentage: totalDeviceSessions > 0 ? Math.round((sessions / totalDeviceSessions) * 100) : 0,
        })
      }
    }

    // Parse key event counts
    const keyEventCounts: AnalyticsSnapshot['keyEventCounts'] = []
    if (keyEventsResult.status === 'fulfilled') {
      const rows = keyEventsResult.value.data.rows || []
      for (const row of rows) {
        const eventName = row.dimensionValues?.[0]?.value || ''
        const count = parseInt(row.metricValues?.[0]?.value || '0', 10)
        if (count > 0) {
          keyEventCounts.push({ eventName, count })
        }
      }
    }

    // Campaign (not set) — approximate from source data
    const campaignNotSet = 0 // Would need a separate query

    // Anomaly detection: compare current vs previous period
    const anomalies: AuditDetailItem[] = []
    if (prevPeriodResult.status === 'fulfilled') {
      const prevRows = prevPeriodResult.value.data.rows
      if (prevRows && prevRows.length > 0) {
        const prevValues = prevRows[0].metricValues || []
        const prevUsers = parseInt(prevValues[0]?.value || '0', 10)
        const prevSessions = parseInt(prevValues[1]?.value || '0', 10)
        const prevPageviews = parseInt(prevValues[2]?.value || '0', 10)

        // Check for significant drops (>30%)
        if (prevUsers > 100 && totalUsers < prevUsers * 0.7) {
          const dropPct = Math.round((1 - totalUsers / prevUsers) * 100)
          anomalies.push({
            label: `User drop: -${dropPct}%`,
            status: 'warn',
            detail: `Users dropped from ${prevUsers.toLocaleString()} to ${totalUsers.toLocaleString()} vs previous period`,
          })
        }

        if (prevSessions > 100 && totalSessions < prevSessions * 0.7) {
          const dropPct = Math.round((1 - totalSessions / prevSessions) * 100)
          anomalies.push({
            label: `Session drop: -${dropPct}%`,
            status: 'warn',
            detail: `Sessions dropped from ${prevSessions.toLocaleString()} to ${totalSessions.toLocaleString()} vs previous period`,
          })
        }

        if (prevPageviews > 100 && totalPageviews < prevPageviews * 0.7) {
          const dropPct = Math.round((1 - totalPageviews / prevPageviews) * 100)
          anomalies.push({
            label: `Pageview drop: -${dropPct}%`,
            status: 'warn',
            detail: `Pageviews dropped from ${prevPageviews.toLocaleString()} to ${totalPageviews.toLocaleString()} vs previous period`,
          })
        }

        // Check for significant spikes (>100%)
        if (prevUsers > 50 && totalUsers > prevUsers * 2) {
          const spikePct = Math.round((totalUsers / prevUsers - 1) * 100)
          anomalies.push({
            label: `User spike: +${spikePct}%`,
            status: 'info',
            detail: `Users spiked from ${prevUsers.toLocaleString()} to ${totalUsers.toLocaleString()} — verify this is genuine traffic`,
          })
        }

        // Zero data anomaly
        if (totalSessions === 0 && prevSessions > 0) {
          anomalies.push({
            label: 'No data in current period',
            status: 'fail',
            detail: `Property had ${prevSessions.toLocaleString()} sessions previously but 0 in the last 30 days — tracking may be broken`,
          })
        }
      }
    }

    return {
      totalUsers,
      totalSessions,
      totalPageviews,
      bounceRate: Math.round(bounceRate * 10) / 10,
      avgSessionDuration: Math.round(avgSessionDuration),
      topSources,
      topLandingPages,
      deviceBreakdown,
      notSetCounts: {
        source: sourceNotSet,
        medium: mediumNotSet,
        campaign: campaignNotSet,
        landingPage: landingNotSet,
      },
      keyEventCounts,
      anomalies,
    }
  } catch (err) {
    console.error('Failed to fetch analytics snapshot:', err)
    return undefined
  }
}

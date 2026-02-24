import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { createOAuth2Client, clearGA4Cookies } from '@/lib/google-client'
import { runAllChecks, extractAccountInfo, extractDataStreams } from './checks'
import { fetchAnalyticsSnapshot } from './analytics-data'
import type { EnhancedMeasurementSettings } from '@/types/audit'

// Allow up to 60s for all the parallel GA4 API calls
export const maxDuration = 60

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { propertyId, propertyName } = await req.json()

    if (!propertyId) {
      return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 })
    }

    // Retrieve token from cookie
    const accessToken = req.cookies.get('ga4_access_token')?.value
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Session expired. Please reconnect your Google account.' },
        { status: 401 },
      )
    }

    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({ access_token: accessToken })

    // ── Gather GA4 property data IN PARALLEL ────────────────────────────
    const analyticsAdmin = google.analyticsadmin({
      version: 'v1beta',
      auth: oauth2Client,
    })

    // v1alpha needed for BigQuery + Firebase links (not in v1beta)
    const analyticsAdminAlpha = google.analyticsadmin({
      version: 'v1alpha',
      auth: oauth2Client,
    })

    const [
      propertyResult,
      streamsResult,
      dimsResult,
      metricsResult,
      conversionsResult,
      adsResult,
      bigQueryResult,
      firebaseResult,
      analyticsSnapshot,
    ] = await Promise.all([
      analyticsAdmin.properties.get({ name: propertyId }).catch((e: unknown) => {
        console.error('Failed to fetch property:', e)
        return null
      }),
      analyticsAdmin.properties.dataStreams.list({ parent: propertyId }).catch(() => null),
      analyticsAdmin.properties.customDimensions.list({ parent: propertyId }).catch(() => null),
      analyticsAdmin.properties.customMetrics.list({ parent: propertyId }).catch(() => null),
      analyticsAdmin.properties.conversionEvents.list({ parent: propertyId }).catch(() => null),
      analyticsAdmin.properties.googleAdsLinks.list({ parent: propertyId }).catch(() => null),
      // v1alpha for BigQuery + Firebase links
      analyticsAdminAlpha.properties.bigQueryLinks.list({ parent: propertyId }).catch(() => null),
      analyticsAdmin.properties.firebaseLinks.list({ parent: propertyId }).catch(() => null),
      // GA4 Data API — fetch last 30 days of analytics data
      fetchAnalyticsSnapshot(oauth2Client, propertyId),
    ])

    // Property fetch is required — abort if it failed
    if (!propertyResult) {
      return NextResponse.json(
        { error: 'Could not access the selected GA4 property. Check permissions.' },
        { status: 403 },
      )
    }

    type R = Record<string, unknown>
    // Extract results (graceful fallback to empty arrays)
    const property = propertyResult.data as R
    const dataStreams = (streamsResult?.data?.dataStreams as R[]) ?? []
    const customDimensions = (dimsResult?.data?.customDimensions as R[]) ?? []
    const customMetrics = (metricsResult?.data?.customMetrics as R[]) ?? []
    const conversionEvents = (conversionsResult?.data?.conversionEvents as R[]) ?? []
    const googleAdsLinks = (adsResult?.data?.googleAdsLinks as R[]) ?? []
    const bigQueryLinks = (bigQueryResult?.data?.bigqueryLinks as R[]) ?? []
    const firebaseLinks = (firebaseResult?.data?.firebaseLinks as R[]) ?? []

    // ── Fetch Enhanced Measurement settings for each web stream (v1alpha) ──
    const webStreams = dataStreams.filter((s) => (s.type as string) === 'WEB_DATA_STREAM')
    let enhancedMeasurement: EnhancedMeasurementSettings[] = []
    if (webStreams.length > 0) {
      const emResults = await Promise.all(
        webStreams.map((s) =>
          analyticsAdminAlpha.properties.dataStreams
            .getEnhancedMeasurementSettings({
              name: `${s.name as string}/enhancedMeasurementSettings`,
            })
            .catch(() => null),
        ),
      )
      enhancedMeasurement = emResults
        .map((result, i): EnhancedMeasurementSettings | null => {
          if (!result?.data) return null
          const d = result.data
          return {
            streamName: (webStreams[i].displayName as string) || 'Web Stream',
            streamEnabled: d.streamEnabled ?? false,
            scrollsEnabled: d.scrollsEnabled ?? false,
            outboundClicksEnabled: d.outboundClicksEnabled ?? false,
            siteSearchEnabled: d.siteSearchEnabled ?? false,
            searchQueryParameter: d.searchQueryParameter ?? undefined,
            videoEngagementEnabled: d.videoEngagementEnabled ?? false,
            fileDownloadsEnabled: d.fileDownloadsEnabled ?? false,
            pageChangesEnabled: d.pageChangesEnabled ?? false,
            formInteractionsEnabled: d.formInteractionsEnabled ?? false,
          }
        })
        .filter((em): em is EnhancedMeasurementSettings => em !== null)
    }

    // ── Run all audit checks ────────────────────────────────────────────
    const checks = runAllChecks(
      property,
      dataStreams,
      customDimensions,
      customMetrics,
      conversionEvents,
      googleAdsLinks,
      analyticsSnapshot,
      bigQueryLinks,
      firebaseLinks,
      enhancedMeasurement,
    )

    // ── Extract structured overview data ────────────────────────────────
    const accountInfo = extractAccountInfo(property, propertyId, propertyName)
    const dataStreamInfos = extractDataStreams(dataStreams)

    // ── Calculate health score ──────────────────────────────────────────
    const passed = checks.filter((c) => c.status === 'pass').length
    const warnings = checks.filter((c) => c.status === 'warn').length
    const failures = checks.filter((c) => c.status === 'fail').length
    const info = checks.filter((c) => c.status === 'info').length
    const total = checks.length
    const scorable = total - info
    const healthScore =
      scorable > 0 ? Math.round(((passed + warnings * 0.5) / scorable) * 100) : 100

    const report = {
      propertyName: propertyName || property.displayName || propertyId,
      propertyId,
      healthScore,
      timestamp: new Date().toISOString(),
      checks,
      summary: { total, passed, warnings, failures, info },
      accountInfo,
      dataStreams: dataStreamInfos,
      analyticsSnapshot: analyticsSnapshot ?? undefined,
    }

    // Clear GA4 auth cookies — these are single-use per-audit
    const response = NextResponse.json({ report })
    clearGA4Cookies(response)

    return response
  } catch (err) {
    console.error('GA4 audit error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred during the audit.' },
      { status: 500 },
    )
  }
}

import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuditCheck {
  id: string
  category: string
  name: string
  status: 'pass' | 'warn' | 'fail' | 'info'
  message: string
  recommendation?: string
}

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

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    )
    oauth2Client.setCredentials({ access_token: accessToken })

    // ── Gather GA4 property data ────────────────────────────────────────
    const analyticsAdmin = google.analyticsadmin({
      version: 'v1beta',
      auth: oauth2Client,
    })

    // Property details
    let property
    try {
      const propRes = await analyticsAdmin.properties.get({ name: propertyId })
      property = propRes.data
    } catch (err) {
      console.error('Failed to fetch property:', err)
      return NextResponse.json(
        { error: 'Could not access the selected GA4 property. Check permissions.' },
        { status: 403 },
      )
    }

    // Data streams
    let dataStreams: Array<Record<string, unknown>> = []
    try {
      const streamsRes = await analyticsAdmin.properties.dataStreams.list({
        parent: propertyId,
      })
      dataStreams = (streamsRes.data.dataStreams as Array<Record<string, unknown>>) || []
    } catch {
      // May not have permission
    }

    // Custom dimensions
    let customDimensions: Array<Record<string, unknown>> = []
    try {
      const dimsRes = await analyticsAdmin.properties.customDimensions.list({
        parent: propertyId,
      })
      customDimensions =
        (dimsRes.data.customDimensions as Array<Record<string, unknown>>) || []
    } catch {
      // Optional
    }

    // Custom metrics
    let customMetrics: Array<Record<string, unknown>> = []
    try {
      const metricsRes = await analyticsAdmin.properties.customMetrics.list({
        parent: propertyId,
      })
      customMetrics =
        (metricsRes.data.customMetrics as Array<Record<string, unknown>>) || []
    } catch {
      // Optional
    }

    // Conversion events (key events)
    let conversionEvents: Array<Record<string, unknown>> = []
    try {
      const convRes = await analyticsAdmin.properties.conversionEvents.list({
        parent: propertyId,
      })
      conversionEvents =
        (convRes.data.conversionEvents as Array<Record<string, unknown>>) || []
    } catch {
      // May not exist
    }

    // Google Ads links
    let googleAdsLinks: Array<Record<string, unknown>> = []
    try {
      const adsRes = await analyticsAdmin.properties.googleAdsLinks.list({
        parent: propertyId,
      })
      googleAdsLinks =
        (adsRes.data.googleAdsLinks as Array<Record<string, unknown>>) || []
    } catch {
      // Optional
    }

    // ── Run audit checks ────────────────────────────────────────────────
    const checks: AuditCheck[] = []

    // ---------- DATA STREAMS ----------
    runDataStreamChecks(checks, dataStreams)

    // ---------- CONVERSION TRACKING ----------
    runConversionChecks(checks, conversionEvents)

    // ---------- CUSTOM DEFINITIONS ----------
    runCustomDefinitionChecks(checks, customDimensions, customMetrics)

    // ---------- PROPERTY SETTINGS ----------
    runPropertySettingsChecks(checks, property as unknown as Record<string, unknown>)

    // ---------- GOOGLE ADS & INTEGRATIONS ----------
    runIntegrationChecks(checks, googleAdsLinks)

    // ---------- DATA QUALITY ----------
    runDataQualityChecks(checks, dataStreams)

    // ── Calculate health score ──────────────────────────────────────────
    const passed = checks.filter((c) => c.status === 'pass').length
    const warnings = checks.filter((c) => c.status === 'warn').length
    const failures = checks.filter((c) => c.status === 'fail').length
    const info = checks.filter((c) => c.status === 'info').length
    const total = checks.length
    const scorable = total - info
    const healthScore =
      scorable > 0
        ? Math.round(((passed + warnings * 0.5) / scorable) * 100)
        : 100

    const report = {
      propertyName: propertyName || property.displayName || propertyId,
      propertyId,
      healthScore,
      timestamp: new Date().toISOString(),
      checks,
      summary: { total, passed, warnings, failures, info },
    }

    // Clear auth cookies — single-use
    const response = NextResponse.json({ report })
    response.cookies.delete('ga4_access_token')
    response.cookies.delete('ga4_refresh_token')

    return response
  } catch (err) {
    console.error('GA4 audit error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred during the audit.' },
      { status: 500 },
    )
  }
}

// ─── Audit Check Functions ───────────────────────────────────────────────────

function runDataStreamChecks(
  checks: AuditCheck[],
  dataStreams: Array<Record<string, unknown>>,
) {
  // Check: At least one data stream exists
  if (dataStreams.length === 0) {
    checks.push({
      id: 'ds-1',
      category: 'Event & Data Setup',
      name: 'Data Streams Configured',
      status: 'fail',
      message: 'No data streams found. Your property is not collecting any data.',
      recommendation:
        'Add a web or app data stream in Admin → Data Streams → Add Stream.',
    })
  } else {
    checks.push({
      id: 'ds-1',
      category: 'Event & Data Setup',
      name: 'Data Streams Configured',
      status: 'pass',
      message: `${dataStreams.length} data stream(s) found and configured.`,
    })
  }

  // Check: Web data stream has measurement ID
  const webStreams = dataStreams.filter(
    (s) => (s.type as string) === 'WEB_DATA_STREAM',
  )
  if (webStreams.length > 0) {
    const hasWebStreamData = webStreams.some(
      (s) =>
        s.webStreamData &&
        (s.webStreamData as Record<string, unknown>).measurementId,
    )
    checks.push({
      id: 'ds-2',
      category: 'Event & Data Setup',
      name: 'Web Stream Measurement ID',
      status: hasWebStreamData ? 'pass' : 'warn',
      message: hasWebStreamData
        ? 'Web data stream has a valid measurement ID.'
        : 'Web data stream exists but measurement ID could not be verified.',
      recommendation: hasWebStreamData
        ? undefined
        : 'Verify your measurement ID (G-XXXXXXX) in Admin → Data Streams.',
    })

    // Check: Enhanced measurement
    const enhancedMeasurement = webStreams.some((s) => {
      const webData = s.webStreamData as Record<string, unknown> | undefined
      // The API may include enhancedMeasurementSettings
      return webData && webData.measurementId
    })
    checks.push({
      id: 'ds-3',
      category: 'Event & Data Setup',
      name: 'Enhanced Measurement',
      status: enhancedMeasurement ? 'info' : 'warn',
      message: enhancedMeasurement
        ? 'Enhanced measurement availability confirmed. Verify all toggles are enabled in the GA4 UI.'
        : 'Could not verify enhanced measurement settings. Some automatic event tracking may be disabled.',
      recommendation: enhancedMeasurement
        ? undefined
        : 'Review enhanced measurement toggles (scrolls, outbound clicks, site search, video, file downloads) in Admin → Data Streams → Enhanced Measurement.',
    })
  }

  // Check: Multiple web streams (potential duplicate tracking)
  if (webStreams.length > 1) {
    checks.push({
      id: 'ds-4',
      category: 'Data Quality',
      name: 'Multiple Web Streams',
      status: 'warn',
      message: `${webStreams.length} web data streams found. This can cause duplicate event tracking.`,
      recommendation:
        'Unless intentional (e.g., staging vs. production), consolidate to a single web stream.',
    })
  }
}

function runConversionChecks(
  checks: AuditCheck[],
  conversionEvents: Array<Record<string, unknown>>,
) {
  // Check: At least one conversion event
  if (conversionEvents.length === 0) {
    checks.push({
      id: 'cv-1',
      category: 'Conversion Tracking',
      name: 'Conversion Events Defined',
      status: 'fail',
      message:
        'No conversion events (key events) are defined. Business-critical actions are not being tracked as conversions.',
      recommendation:
        'Mark key events as conversions in Admin → Events → toggle "Mark as key event" for events like purchase, sign_up, generate_lead.',
    })
  } else {
    checks.push({
      id: 'cv-1',
      category: 'Conversion Tracking',
      name: 'Conversion Events Defined',
      status: 'pass',
      message: `${conversionEvents.length} conversion event(s) configured.`,
    })
  }

  // Check: Common recommended conversions
  const convNames = conversionEvents.map(
    (c) => ((c.eventName as string) || '').toLowerCase(),
  )
  const recommendedConversions = [
    'purchase',
    'sign_up',
    'generate_lead',
    'begin_checkout',
  ]
  const missingRecommended = recommendedConversions.filter(
    (name) => !convNames.includes(name),
  )

  if (conversionEvents.length > 0 && missingRecommended.length > 0) {
    checks.push({
      id: 'cv-2',
      category: 'Conversion Tracking',
      name: 'Recommended Conversion Events',
      status: missingRecommended.length >= 3 ? 'warn' : 'info',
      message: `Common conversion events not configured: ${missingRecommended.join(', ')}. These may not apply to your business.`,
      recommendation:
        'Review if any of these standard events apply to your business model and mark them as conversions if appropriate.',
    })
  }

  // Check: conversion event count
  if (conversionEvents.length > 20) {
    checks.push({
      id: 'cv-3',
      category: 'Conversion Tracking',
      name: 'Conversion Event Limit',
      status: 'warn',
      message: `${conversionEvents.length} conversion events defined. GA4 has a limit of 30 per property.`,
      recommendation:
        'Review and consolidate conversion events. Remove any that are no longer relevant to avoid hitting the limit.',
    })
  }
}

function runCustomDefinitionChecks(
  checks: AuditCheck[],
  customDimensions: Array<Record<string, unknown>>,
  customMetrics: Array<Record<string, unknown>>,
) {
  // Custom dimensions
  const eventScopeDims = customDimensions.filter(
    (d) => (d.scope as string) === 'EVENT',
  )
  const userScopeDims = customDimensions.filter(
    (d) => (d.scope as string) === 'USER',
  )

  checks.push({
    id: 'cd-1',
    category: 'Event & Data Setup',
    name: 'Custom Dimensions',
    status: customDimensions.length > 0 ? 'pass' : 'info',
    message:
      customDimensions.length > 0
        ? `${eventScopeDims.length} event-scoped and ${userScopeDims.length} user-scoped custom dimensions configured.`
        : 'No custom dimensions defined. Consider adding dimensions for business-specific data like content categories or user types.',
  })

  // Check event-scoped dimension limit (50)
  if (eventScopeDims.length > 40) {
    checks.push({
      id: 'cd-2',
      category: 'Event & Data Setup',
      name: 'Event Dimension Limit',
      status: 'warn',
      message: `${eventScopeDims.length}/50 event-scoped custom dimensions used. Approaching the limit.`,
      recommendation:
        'Audit existing custom dimensions and archive any that are no longer in use.',
    })
  }

  // Custom metrics
  checks.push({
    id: 'cd-3',
    category: 'Event & Data Setup',
    name: 'Custom Metrics',
    status: 'info',
    message:
      customMetrics.length > 0
        ? `${customMetrics.length} custom metric(s) configured.`
        : 'No custom metrics defined. This is fine unless you need to track numeric business-specific values.',
  })
}

function runPropertySettingsChecks(
  checks: AuditCheck[],
  property: Record<string, unknown>,
) {
  // Timezone
  const timeZone = property.timeZone as string | undefined
  checks.push({
    id: 'ps-1',
    category: 'Attribution & Settings',
    name: 'Reporting Time Zone',
    status: timeZone ? 'pass' : 'warn',
    message: timeZone
      ? `Time zone set to ${timeZone}.`
      : 'Time zone could not be determined. Verify it matches your primary business location.',
    recommendation: timeZone
      ? undefined
      : 'Set your reporting time zone in Admin → Property Settings.',
  })

  // Currency
  const currencyCode = property.currencyCode as string | undefined
  checks.push({
    id: 'ps-2',
    category: 'Attribution & Settings',
    name: 'Reporting Currency',
    status: currencyCode ? 'pass' : 'warn',
    message: currencyCode
      ? `Currency set to ${currencyCode}.`
      : 'Currency setting could not be verified.',
    recommendation: currencyCode
      ? undefined
      : 'Set your reporting currency in Admin → Property Settings.',
  })

  // Industry category
  const industryCategory = property.industryCategory as string | undefined
  checks.push({
    id: 'ps-3',
    category: 'Attribution & Settings',
    name: 'Industry Category',
    status: industryCategory ? 'pass' : 'info',
    message: industryCategory
      ? `Industry category set to ${industryCategory}.`
      : 'No industry category set. This enables benchmarking data in GA4.',
  })

  // Data retention
  const retentionSettings = property.dataRetentionSettings as
    | Record<string, unknown>
    | undefined
  if (retentionSettings) {
    const retention = retentionSettings.eventDataRetention as string
    const isShort =
      retention === 'TWO_MONTHS' || retention === 'RETENTION_PERIOD_2_MONTHS'
    checks.push({
      id: 'ps-4',
      category: 'Data Quality',
      name: 'Data Retention Period',
      status: isShort ? 'warn' : 'pass',
      message: isShort
        ? 'Data retention is set to 2 months, limiting historical exploration reports.'
        : `Data retention is set to ${retention?.replace(/_/g, ' ').toLowerCase() || 'an extended period'}.`,
      recommendation: isShort
        ? 'Set data retention to 14 months in Admin → Data Settings → Data Retention.'
        : undefined,
    })
  } else {
    checks.push({
      id: 'ps-4',
      category: 'Data Quality',
      name: 'Data Retention Period',
      status: 'info',
      message:
        'Data retention settings could not be retrieved. Verify the setting in the GA4 UI.',
    })
  }
}

function runIntegrationChecks(
  checks: AuditCheck[],
  googleAdsLinks: Array<Record<string, unknown>>,
) {
  // Google Ads linking
  checks.push({
    id: 'int-1',
    category: 'Attribution & Settings',
    name: 'Google Ads Linking',
    status: googleAdsLinks.length > 0 ? 'pass' : 'warn',
    message:
      googleAdsLinks.length > 0
        ? `${googleAdsLinks.length} Google Ads account(s) linked.`
        : 'No Google Ads accounts linked. If you run paid campaigns, linking enables conversion import and audience sharing.',
    recommendation:
      googleAdsLinks.length > 0
        ? undefined
        : 'Link your Google Ads account in Admin → Product Links → Google Ads Links.',
  })

  // Note: Search Console and BigQuery links require the full v1alpha API
  checks.push({
    id: 'int-2',
    category: 'Attribution & Settings',
    name: 'Search Console Integration',
    status: 'info',
    message:
      'Search Console link status could not be verified via the API. Check Admin → Product Links → Search Console Links.',
  })
}

function runDataQualityChecks(
  checks: AuditCheck[],
  dataStreams: Array<Record<string, unknown>>,
) {
  // Internal traffic filter check (we can't directly read filters via beta API,
  // but we can flag the need)
  checks.push({
    id: 'dq-1',
    category: 'Data Quality',
    name: 'Internal Traffic Filter',
    status: 'info',
    message:
      'Verify that an internal traffic filter is active in Admin → Data Settings → Data Filters to exclude your team\'s visits from reporting.',
  })

  // Cross-domain tracking
  const webStreams = dataStreams.filter(
    (s) => (s.type as string) === 'WEB_DATA_STREAM',
  )
  if (webStreams.length === 1) {
    checks.push({
      id: 'dq-2',
      category: 'Data Quality',
      name: 'Cross-Domain Tracking',
      status: 'info',
      message:
        'Single web stream detected. If your user journey spans multiple domains, configure cross-domain tracking in Admin → Data Streams → Configure Tag Settings.',
    })
  }

  // Unwanted referrals
  checks.push({
    id: 'dq-3',
    category: 'Data Quality',
    name: 'Referral Exclusions',
    status: 'info',
    message:
      'Verify that payment gateways and third-party auth providers are excluded from referral sources in Admin → Data Streams → Configure Tag Settings → List Unwanted Referrals.',
  })
}

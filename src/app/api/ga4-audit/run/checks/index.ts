import type {
  AuditCheckResult,
  DataStreamInfo,
  AuditAccountInfo,
  AnalyticsSnapshot,
  EnhancedMeasurementSettings,
} from '@/types/audit'
import type { R } from './helpers'

import { runDataCollectionChecks } from './data-collection'
import { runEventDataChecks } from './event-data'
import { runKeyEventChecks } from './key-events'
import { runEcommerceChecks } from './ecommerce'
import { runUserTrackingChecks } from './user-tracking'
import { runAttributionChecks } from './attribution'
import { runDataQualityChecks } from './data-quality'
import { runTrafficSourceChecks } from './traffic-sources'
import { runPrivacyChecks } from './privacy'
import { runIntegrationChecks } from './integrations'
import { runAudienceDeviceChecks } from './audience-device'
import { runPropertyConfigChecks } from './property-config'

// Re-export individual check functions for standalone use
export {
  runDataCollectionChecks,
  runEventDataChecks,
  runKeyEventChecks,
  runEcommerceChecks,
  runUserTrackingChecks,
  runAttributionChecks,
  runDataQualityChecks,
  runTrafficSourceChecks,
  runPrivacyChecks,
  runIntegrationChecks,
  runAudienceDeviceChecks,
  runPropertyConfigChecks,
}

// ─── Extract structured data ─────────────────────────────────────────────────

export function extractAccountInfo(
  property: R,
  propertyId: string,
  propertyName?: string,
): AuditAccountInfo {
  return {
    accountId: (property.parent as string)?.replace('accounts/', '') ?? undefined,
    accountName: undefined,
    propertyName: propertyName || (property.displayName as string) || propertyId,
    propertyId,
    industryCategory: (property.industryCategory as string) ?? undefined,
    timeZone: (property.timeZone as string) ?? undefined,
    currencyCode: (property.currencyCode as string) ?? undefined,
    serviceLevel: (property.serviceLevel as string) ?? undefined,
    createTime: (property.createTime as string) ?? undefined,
  }
}

export function extractDataStreams(dataStreams: R[]): DataStreamInfo[] {
  return dataStreams.map((s) => {
    const type = s.type as string
    const webData = s.webStreamData as R | undefined
    const iosData = s.iosAppStreamData as R | undefined
    const androidData = s.androidAppStreamData as R | undefined

    let streamType: DataStreamInfo['type'] = type
    if (type === 'WEB_DATA_STREAM') streamType = 'WEB'
    else if (type === 'IOS_APP_DATA_STREAM') streamType = 'IOS'
    else if (type === 'ANDROID_APP_DATA_STREAM') streamType = 'ANDROID'

    void iosData
    void androidData

    return {
      name: (s.displayName as string) || 'Unnamed Stream',
      type: streamType,
      measurementId: webData?.measurementId as string | undefined,
      streamId: ((s.name as string) || '').split('/').pop(),
      defaultUri: webData?.defaultUri as string | undefined,
    } satisfies DataStreamInfo
  })
}

// ─── Master Runner ───────────────────────────────────────────────────────────

export function runAllChecks(
  property: R,
  dataStreams: R[],
  customDimensions: R[],
  customMetrics: R[],
  conversionEvents: R[],
  googleAdsLinks: R[],
  analyticsData?: AnalyticsSnapshot,
  bigQueryLinks?: R[],
  firebaseLinks?: R[],
  enhancedMeasurement?: EnhancedMeasurementSettings[],
): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []
  const serviceLevel = property.serviceLevel as string | undefined

  runDataCollectionChecks(checks, dataStreams, enhancedMeasurement)
  runEventDataChecks(checks, customDimensions, customMetrics, serviceLevel)
  runKeyEventChecks(checks, conversionEvents, serviceLevel, analyticsData)
  runEcommerceChecks(checks, conversionEvents, customDimensions)
  runUserTrackingChecks(checks, customDimensions, property)
  runAttributionChecks(checks, property)
  runDataQualityChecks(checks, dataStreams, property)
  runTrafficSourceChecks(checks, analyticsData)
  runPrivacyChecks(checks, customDimensions, property)
  runIntegrationChecks(checks, googleAdsLinks, bigQueryLinks ?? [], firebaseLinks ?? [])
  runAudienceDeviceChecks(checks, analyticsData)
  runPropertyConfigChecks(checks, property)

  return checks
}

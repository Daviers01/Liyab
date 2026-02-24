import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 5. User ID & Identity ───────────────────────────────────────────────────

export function runUserTrackingChecks(checks: AuditCheck[], customDims: R[], property: R) {
  const cat = AUDIT_CATEGORIES.USER_TRACKING
  const dimNames = customDims.map((d) => ((d.parameterName as string) || '').toLowerCase())
  const userDims = customDims.filter((d) => (d.scope as string) === 'USER')
  const userDimNames = userDims.map((d) => ((d.parameterName as string) || '').toLowerCase())

  // UID-1: User ID tracking
  const hasUserIdDim =
    dimNames.includes('user_id') ||
    userDimNames.includes('user_id') ||
    dimNames.includes('uid') ||
    dimNames.includes('userid')

  checks.push({
    id: 'uid-1',
    category: cat,
    name: 'User ID Tracking',
    status: hasUserIdDim ? 'pass' : 'info',
    message: hasUserIdDim
      ? 'User ID parameter detected in custom dimensions. Cross-device tracking is likely enabled.'
      : 'No User ID parameter detected. If you have logged-in users, implement User ID for cross-device tracking.',
    tip: 'Set the user_id via gtag("set", { user_id: "USER_ID" }) when users log in. This enables cross-device reporting in the User Explorer and improves audience accuracy.',
    properlyConfigured: hasUserIdDim
      ? [item('User ID dimension', 'pass', 'Cross-device tracking enabled')]
      : undefined,
  })

  // UID-2: Google Signals
  checks.push({
    id: 'uid-2',
    category: cat,
    name: 'Google Signals',
    status: 'info',
    message:
      'Google Signals status cannot be verified via the API. When enabled, it provides cross-device reporting for signed-in Google users and enables demographics data.',
    tip: 'Enable Google Signals in Admin → Data Settings → Data Collection. Note: very low traffic sites may see data thresholding applied.',
  })

  // UID-3: Reporting Identity
  const reportingIdentity = property.reportingIdentity as string | undefined
  checks.push({
    id: 'uid-3',
    category: cat,
    name: 'Reporting Identity',
    status: reportingIdentity ? 'pass' : 'info',
    message: reportingIdentity
      ? `Reporting identity set to: ${reportingIdentity.replace(/_/g, ' ')}.`
      : 'Reporting identity setting could not be determined. Default is "Blended" which uses User ID → Google Signals → Device ID → Modeled.',
    tip: 'Choose "Blended" for the most complete view of your users across devices. This is the default and recommended setting.',
    properlyConfigured: reportingIdentity
      ? [item(reportingIdentity, 'pass', 'Identity method configured')]
      : undefined,
  })
}

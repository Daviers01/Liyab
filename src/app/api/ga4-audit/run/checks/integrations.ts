import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 10. Integrations & Links ────────────────────────────────────────────────

export function runIntegrationChecks(
  checks: AuditCheck[],
  googleAdsLinks: R[],
  bigQueryLinks: R[],
  firebaseLinks: R[],
) {
  const cat = AUDIT_CATEGORIES.INTEGRATIONS

  // INT-1: Google Ads
  checks.push({
    id: 'int-1',
    category: cat,
    name: 'Google Ads Linking',
    status: googleAdsLinks.length > 0 ? 'pass' : 'warn',
    message:
      googleAdsLinks.length > 0
        ? `${googleAdsLinks.length} Google Ads account(s) linked.`
        : 'No Google Ads accounts linked. Linking enables conversion import and audience sharing.',
    recommendation:
      googleAdsLinks.length === 0
        ? 'Link your Google Ads account in Admin → Product Links → Google Ads Links.'
        : undefined,
    tip: 'Linking Google Ads enables importing GA4 conversions as Google Ads goals, remarketing audiences, and seeing ad cost data in GA4 reports.',
    properlyConfigured:
      googleAdsLinks.length > 0
        ? googleAdsLinks.map((l, i) =>
            item(`Ads Account #${i + 1}`, 'pass', (l.customerId as string) || 'Linked'),
          )
        : undefined,
  })

  // INT-2: Search Console
  checks.push({
    id: 'int-2',
    category: cat,
    name: 'Search Console Integration',
    status: 'info',
    message:
      'Search Console link status cannot be verified via the API. Check Admin → Product Links → Search Console Links.',
    tip: 'Linking Search Console lets you see organic search queries, landing pages, and countries directly in GA4 reports.',
  })

  // INT-3: BigQuery
  const bqConfigured = bigQueryLinks.map((l, i) => {
    const project = (l.project as string) || 'unknown'
    const dataset = (l.dataset as string) || ''
    const streaming = (l.streamingExportEnabled as boolean) ? 'Streaming enabled' : 'Daily export'
    return item(
      `BigQuery Link #${i + 1}`,
      'pass',
      `Project: ${project}${dataset ? ` · Dataset: ${dataset}` : ''} · ${streaming}`,
    )
  })

  checks.push({
    id: 'int-3',
    category: cat,
    name: 'BigQuery Export',
    status: bigQueryLinks.length > 0 ? 'pass' : 'warn',
    message:
      bigQueryLinks.length > 0
        ? `${bigQueryLinks.length} BigQuery link(s) configured.`
        : 'No BigQuery export configured. BigQuery provides raw, unsampled event-level data for advanced analysis.',
    recommendation:
      bigQueryLinks.length === 0
        ? 'Set up BigQuery export in Admin → Product Links → BigQuery Links. Daily export is free — you only pay for BigQuery storage/queries.'
        : undefined,
    tip: 'BigQuery export provides raw, unsampled event-level data. Daily export is free for all GA4 properties. Streaming export is available for GA4 360 properties.',
    properlyConfigured: bqConfigured.length > 0 ? bqConfigured : undefined,
  })

  // INT-4: Firebase
  const fbConfigured = firebaseLinks.map((l, i) => {
    const project = (l.project as string) || (l.name as string) || 'unknown'
    return item(`Firebase Link #${i + 1}`, 'pass', `Project: ${project}`)
  })

  checks.push({
    id: 'int-4',
    category: cat,
    name: 'Firebase Integration',
    status: firebaseLinks.length > 0 ? 'pass' : 'info',
    message:
      firebaseLinks.length > 0
        ? `${firebaseLinks.length} Firebase project(s) linked.`
        : 'No Firebase projects linked. If you have mobile apps, Firebase linking provides crash analytics, A/B testing, and remote config integration.',
    tip: 'For app-based properties, Firebase integration unlocks crash analytics, remote config, and in-app messaging capabilities alongside GA4 analytics.',
    properlyConfigured: fbConfigured.length > 0 ? fbConfigured : undefined,
  })
}

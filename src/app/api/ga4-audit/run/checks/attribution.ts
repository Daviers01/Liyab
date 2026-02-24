import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 6. Attribution & Settings ───────────────────────────────────────────────

export function runAttributionChecks(checks: AuditCheck[], property: R) {
  const cat = AUDIT_CATEGORIES.ATTRIBUTION

  // ATT-1: Attribution model
  const attributionSettings = property.attributionSettings as R | undefined
  const model = attributionSettings?.reportingAttributionModel as string | undefined
  const lookbackWindow = attributionSettings?.acquisitionConversionEventLookbackWindow as
    | string
    | undefined
  const otherLookback = attributionSettings?.otherConversionEventLookbackWindow as
    | string
    | undefined

  checks.push({
    id: 'att-1',
    category: cat,
    name: 'Attribution Model',
    status: model ? 'pass' : 'info',
    message: model
      ? `Attribution model: ${model.replace(/_/g, ' ')}.`
      : 'Attribution model could not be determined. GA4 defaults to data-driven attribution.',
    tip: 'Data-driven attribution (DDA) is recommended for most properties. It uses machine learning to assign credit across touchpoints based on actual conversion paths.',
    properlyConfigured: model
      ? [item(model.replace(/_/g, ' '), 'pass', 'Attribution model set')]
      : undefined,
  })

  // ATT-2: Lookback windows
  if (lookbackWindow || otherLookback) {
    const configured = []
    if (lookbackWindow)
      configured.push(
        item('Acquisition lookback', 'pass', lookbackWindow.replace(/_/g, ' ').toLowerCase()),
      )
    if (otherLookback)
      configured.push(
        item('Other conversion lookback', 'pass', otherLookback.replace(/_/g, ' ').toLowerCase()),
      )
    checks.push({
      id: 'att-2',
      category: cat,
      name: 'Conversion Lookback Windows',
      status: 'pass',
      message: 'Conversion lookback windows are configured.',
      tip: 'Default lookback is 30 days for acquisition and 90 days for other conversions. Adjust based on your typical customer journey length.',
      properlyConfigured: configured,
    })
  }

  // ATT-3: Custom channel grouping
  checks.push({
    id: 'att-3',
    category: cat,
    name: 'Custom Channel Grouping',
    status: 'info',
    message:
      'Custom channel groups cannot be verified via the API. Check Admin → Data Display → Channel Groups.',
    tip: 'Custom channel groupings let you define rules for how traffic is categorized (e.g., separating branded vs. non-branded paid search). Review the default channel definitions to ensure they match your marketing strategy.',
  })
}

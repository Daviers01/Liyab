// ─── GTM Audit Checks Engine ──────────────────────────────────────────────────
// Runs 50+ checks across 12 categories on a GTM live container version.

import type {
  GTMTag,
  GTMTrigger,
  GTMVariable,
  GTMFolder,
  GTMLiveVersion,
  GTMParameter,
  MarTechItem,
} from '@/types/gtm-audit'
import type { AuditCheckResult, AuditCheckStatus, AuditDetailItem } from '@/types/audit'
import { MARTECH_VENDORS, GA4_ECOMMERCE_EVENTS, CONSENT_MODE_V2_TYPES } from '@/lib/gtm-data'

type R = GTMParameter

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getParamValue(params: R[] | undefined, key: string): string | undefined {
  if (!params) return undefined
  const p = params.find((x) => x.key === key)
  return p?.value as string | undefined
}

function tagContainsText(tag: GTMTag, text: string): boolean {
  const params = (tag.parameter || []) as R[]
  return params.some((p) => {
    const val = String(p.value || '')
    return val.toLowerCase().includes(text.toLowerCase())
  })
}

function getAllTagText(tag: GTMTag): string {
  return JSON.stringify(tag).toLowerCase()
}

function getUsedVariableNames(tags: GTMTag[], triggers: GTMTrigger[]): Set<string> {
  const json = JSON.stringify([...tags, ...triggers])
  const matches = json.match(/\{\{([^}]+)\}\}/g) || []
  return new Set(matches.map((m) => m.slice(2, -2)))
}

function getUsedTriggerIds(tags: GTMTag[]): Set<string> {
  const ids = new Set<string>()
  tags.forEach((tag) => {
    ;(tag.firingTriggerId || []).forEach((id) => ids.add(id))
    ;(tag.blockingTriggerId || []).forEach((id) => ids.add(id))
  })
  return ids
}

function grade(pass: number, warn: number, fail: number): AuditCheckStatus {
  if (fail > 0) return 'fail'
  if (warn > 0) return 'warn'
  if (pass > 0) return 'pass'
  return 'info'
}

function item(label: string, status: AuditCheckStatus, detail?: string): AuditDetailItem {
  return { label, status, detail }
}

// ─── Category 1: Container Overview ──────────────────────────────────────────

function checkContainerOverview(
  version: GTMLiveVersion,
  containerType: string[],
): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  const tags = version.tag || []
  const triggers = version.trigger || []
  const variables = version.variable || []
  const folders = version.folder || []

  // 1.1 Container type
  const isServer = containerType.includes('server')
  const isWeb =
    containerType.includes('web') ||
    containerType.includes('amp') ||
    (!isServer && containerType.length === 0)
  checks.push({
    id: 'co-1',
    category: 'Container Overview',
    name: 'Container Type',
    status: 'info',
    message: isServer
      ? `Server-side container detected (${containerType.join(', ')}).`
      : `Web container (${containerType.join(', ') || 'web'}).`,
    tip: 'Server-side GTM offers better performance and data control than client-side.',
  })

  // 1.2 Live version published
  const hasLiveVersion = Boolean(version.containerVersionId && version.containerVersionId !== '0')
  checks.push({
    id: 'co-2',
    category: 'Container Overview',
    name: 'Live Version Published',
    status: hasLiveVersion ? 'pass' : 'warn',
    message: hasLiveVersion
      ? `Container version ${version.containerVersionId} is live.`
      : 'No live version detected. The container may not be published yet.',
    recommendation: !hasLiveVersion
      ? 'Publish your container to activate tags and start collecting data.'
      : undefined,
  })

  // 1.3 Tag count overview
  const tagCount = tags.length
  checks.push({
    id: 'co-3',
    category: 'Container Overview',
    name: 'Container Size',
    status: tagCount > 100 ? 'warn' : tagCount > 200 ? 'fail' : 'info',
    message: `Container has ${tagCount} tags, ${triggers.length} triggers, ${variables.length} variables, and ${folders.length} folders.`,
    tip:
      tagCount > 100 ? 'Large containers (100+ tags) can impact page load performance.' : undefined,
    recommendation:
      tagCount > 100
        ? 'Audit and remove unused or redundant tags to keep the container lean.'
        : undefined,
  })

  // 1.4 Annotations / description
  const hasDescription = Boolean(version.description)
  checks.push({
    id: 'co-4',
    category: 'Container Overview',
    name: 'Version Description',
    status: hasDescription ? 'pass' : 'warn',
    message: hasDescription
      ? `Version description set: "${version.description}".`
      : 'Live version has no description.',
    recommendation: !hasDescription
      ? 'Add a description when publishing container versions for change tracking.'
      : undefined,
    tip: 'Version descriptions help team members understand what changed and why.',
  })

  return checks
}

// ─── Category 2: Tag Configuration ───────────────────────────────────────────

function checkTagConfiguration(tags: GTMTag[], triggers: GTMTrigger[]): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  // 2.1 Paused tags
  const pausedTags = tags.filter((t) => t.paused)
  checks.push({
    id: 'tc-1',
    category: 'Tag Configuration',
    name: 'Paused Tags',
    status: pausedTags.length > 0 ? 'warn' : 'pass',
    message:
      pausedTags.length > 0 ? `${pausedTags.length} paused tag(s) found.` : 'No paused tags found.',
    recommendation:
      pausedTags.length > 0
        ? 'Review paused tags — either unpause if needed, or delete if obsolete.'
        : undefined,
    tip: 'Paused tags contribute to container bloat. Remove them if they are no longer needed.',
    issues: pausedTags.map((t) => item(t.name, 'warn', `Type: ${t.type}`)),
  })

  // 2.2 Tags with no triggers
  const tagsNoTriggers = tags.filter(
    (t) => !t.paused && (!t.firingTriggerId || t.firingTriggerId.length === 0),
  )
  checks.push({
    id: 'tc-2',
    category: 'Tag Configuration',
    name: 'Tags Without Firing Triggers',
    status: tagsNoTriggers.length > 0 ? 'fail' : 'pass',
    message:
      tagsNoTriggers.length > 0
        ? `${tagsNoTriggers.length} active tag(s) have no firing triggers and will never fire.`
        : 'All active tags have at least one firing trigger.',
    recommendation:
      tagsNoTriggers.length > 0
        ? 'Add appropriate firing triggers or delete tags that are no longer needed.'
        : undefined,
    issues: tagsNoTriggers.map((t) => item(t.name, 'fail', `Type: ${t.type}`)),
  })

  // 2.3 Tags without notes
  const tagsNoNotes = tags.filter((t) => !t.notes || t.notes.trim() === '')
  const notesPct = Math.round(((tags.length - tagsNoNotes.length) / Math.max(tags.length, 1)) * 100)
  checks.push({
    id: 'tc-3',
    category: 'Tag Configuration',
    name: 'Tags Without Notes',
    status: notesPct >= 70 ? 'pass' : notesPct >= 40 ? 'warn' : 'fail',
    message: `${notesPct}% of tags have notes (${tags.length - tagsNoNotes.length}/${tags.length}).`,
    recommendation:
      notesPct < 70
        ? 'Add notes to tags explaining their purpose, owner, and date added.'
        : undefined,
    tip: 'Notes improve maintainability and help new team members understand the setup.',
    issues:
      notesPct < 70
        ? tagsNoNotes.slice(0, 20).map((t) => item(t.name, 'warn', `Type: ${t.type}`))
        : undefined,
  })

  // 2.4 Deprecated UA tags
  const uaTags = tags.filter((t) => t.type === 'ua')
  checks.push({
    id: 'tc-4',
    category: 'Tag Configuration',
    name: 'Deprecated Universal Analytics Tags',
    status: uaTags.length > 0 ? 'fail' : 'pass',
    message:
      uaTags.length > 0
        ? `${uaTags.length} Universal Analytics (UA) tag(s) found. UA was sunset in July 2023.`
        : 'No deprecated Universal Analytics tags found.',
    recommendation:
      uaTags.length > 0
        ? 'Remove all UA tags and migrate to GA4 using the Google Tag (googtag) or GA4 Event tag (gaawc).'
        : undefined,
    tip: 'UA tags no longer send data to Google Analytics since July 2023.',
    issues: uaTags.map((t) => item(t.name, 'fail', 'Universal Analytics — deprecated')),
  })

  // 2.5 Redundant tags (same type used more than once — possible duplicate)
  const tagsByType: Record<string, GTMTag[]> = {}
  tags.forEach((t) => {
    if (!tagsByType[t.type]) tagsByType[t.type] = []
    tagsByType[t.type].push(t)
  })
  const redundantTypes = Object.entries(tagsByType).filter(
    ([type, ts]) => ts.length > 2 && !['html', 'img', 'gaawc'].includes(type),
  )
  checks.push({
    id: 'tc-5',
    category: 'Tag Configuration',
    name: 'Potentially Redundant Tags',
    status: redundantTypes.length > 0 ? 'warn' : 'pass',
    message:
      redundantTypes.length > 0
        ? `${redundantTypes.length} tag type(s) have 3+ instances which may indicate duplication.`
        : 'No obviously redundant tags detected.',
    recommendation:
      redundantTypes.length > 0
        ? 'Review multiple instances of the same tag type to ensure they are intentional.'
        : undefined,
    issues: redundantTypes.map(([type, ts]) =>
      item(`${type} (${ts.length} instances)`, 'warn', ts.map((t) => t.name).join(', ')),
    ),
  })

  // 2.6 Tags firing on All Pages
  const allPagesTrigger = triggers.find(
    (t) => t.name.toLowerCase().includes('all pages') || t.type === 'PAGEVIEW',
  )
  const tagsOnAllPages = allPagesTrigger
    ? tags.filter((t) => (t.firingTriggerId || []).includes(allPagesTrigger.triggerId))
    : []
  checks.push({
    id: 'tc-6',
    category: 'Tag Configuration',
    name: 'Tags Firing on All Pages',
    status: tagsOnAllPages.length > 10 ? 'warn' : 'info',
    message:
      tagsOnAllPages.length > 0
        ? `${tagsOnAllPages.length} tag(s) fire on every page load.`
        : 'No All Pages trigger found (or no tags attached to it).',
    recommendation:
      tagsOnAllPages.length > 10
        ? 'Review tags firing on all pages. Consider narrowing triggers for advertising tags to relevant pages only.'
        : undefined,
    tip: 'Firing many tags on every page increases load time. Use page-specific triggers where possible.',
    issues:
      tagsOnAllPages.length > 10
        ? tagsOnAllPages.map((t) => item(t.name, 'warn', `Type: ${t.type}`))
        : undefined,
    properlyConfigured:
      tagsOnAllPages.length <= 10 && tagsOnAllPages.length > 0
        ? tagsOnAllPages.map((t) => item(t.name, 'info', `Type: ${t.type}`))
        : undefined,
  })

  // 2.7 Scheduled tags (past schedule)
  const now = Date.now()
  const expiredTags = tags.filter((t) => {
    if (!t.scheduleEndMs) return false
    return parseInt(t.scheduleEndMs) < now
  })
  checks.push({
    id: 'tc-7',
    category: 'Tag Configuration',
    name: 'Expired Scheduled Tags',
    status: expiredTags.length > 0 ? 'warn' : 'pass',
    message:
      expiredTags.length > 0
        ? `${expiredTags.length} tag(s) have an expired schedule and will not fire.`
        : 'No expired scheduled tags found.',
    recommendation: expiredTags.length > 0 ? 'Remove or update expired scheduled tags.' : undefined,
    issues: expiredTags.map((t) =>
      item(t.name, 'warn', `Expired: ${new Date(parseInt(t.scheduleEndMs!)).toLocaleDateString()}`),
    ),
  })

  return checks
}

// ─── Category 3: Trigger Configuration ───────────────────────────────────────

function checkTriggerConfiguration(tags: GTMTag[], triggers: GTMTrigger[]): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []
  const usedTriggerIds = getUsedTriggerIds(tags)

  // 3.1 Unused triggers
  const unusedTriggers = triggers.filter((t) => !usedTriggerIds.has(t.triggerId))
  checks.push({
    id: 'tr-1',
    category: 'Trigger Configuration',
    name: 'Unused Triggers',
    status: unusedTriggers.length > 3 ? 'warn' : unusedTriggers.length > 0 ? 'info' : 'pass',
    message:
      unusedTriggers.length > 0
        ? `${unusedTriggers.length} trigger(s) are not attached to any tag.`
        : 'All triggers are used by at least one tag.',
    recommendation:
      unusedTriggers.length > 3 ? 'Remove unused triggers to keep the container clean.' : undefined,
    tip: 'Unused triggers add clutter but do not fire, so they only affect maintainability.',
    issues: unusedTriggers.map((t) => item(t.name, 'warn', `Type: ${t.type}`)),
  })

  // 3.2 Triggers without notes
  const triggersNoNotes = triggers.filter((t) => !t.notes || t.notes.trim() === '')
  const pct = Math.round(
    ((triggers.length - triggersNoNotes.length) / Math.max(triggers.length, 1)) * 100,
  )
  checks.push({
    id: 'tr-2',
    category: 'Trigger Configuration',
    name: 'Triggers Without Notes',
    status: pct >= 50 ? 'pass' : 'warn',
    message: `${pct}% of triggers have notes (${triggers.length - triggersNoNotes.length}/${triggers.length}).`,
    recommendation:
      pct < 50 ? 'Add notes to triggers describing when and why they fire.' : undefined,
    issues:
      pct < 50
        ? triggersNoNotes.slice(0, 15).map((t) => item(t.name, 'warn', `Type: ${t.type}`))
        : undefined,
  })

  // 3.3 Custom event triggers with no event name (catch-all)
  const catchAllCustom = triggers.filter(
    (t) =>
      t.type === 'CUSTOM_EVENT' &&
      (!t.parameter || !getParamValue(t.parameter as R[], 'customEventFilter')),
  )
  checks.push({
    id: 'tr-3',
    category: 'Trigger Configuration',
    name: 'Custom Event Triggers Without Filters',
    status: catchAllCustom.length > 0 ? 'warn' : 'pass',
    message:
      catchAllCustom.length > 0
        ? `${catchAllCustom.length} custom event trigger(s) may be catching all events (no filter).`
        : 'All custom event triggers appear to have filters.',
    recommendation:
      catchAllCustom.length > 0
        ? 'Add specific event name conditions to custom event triggers to avoid unintended firing.'
        : undefined,
    issues: catchAllCustom.map((t) => item(t.name, 'warn', 'No event name filter detected')),
  })

  return checks
}

// ─── Category 4: Variable Configuration ──────────────────────────────────────

function checkVariableConfiguration(
  tags: GTMTag[],
  triggers: GTMTrigger[],
  variables: GTMVariable[],
): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []
  const usedVarNames = getUsedVariableNames(tags, triggers)

  // 4.1 Unused variables
  const unusedVars = variables.filter((v) => !usedVarNames.has(v.name))
  checks.push({
    id: 'va-1',
    category: 'Variable Configuration',
    name: 'Unused Variables',
    status: unusedVars.length > 5 ? 'warn' : unusedVars.length > 0 ? 'info' : 'pass',
    message:
      unusedVars.length > 0
        ? `${unusedVars.length} variable(s) are not referenced in any tag or trigger.`
        : 'All variables appear to be in use.',
    recommendation:
      unusedVars.length > 5 ? 'Remove unused variables to reduce container complexity.' : undefined,
    issues: unusedVars.map((v) => item(v.name, 'warn', `Type: ${v.type}`)),
  })

  // 4.2 Variables without notes
  const varsNoNotes = variables.filter((v) => !v.notes || v.notes.trim() === '')
  const pct = Math.round(
    ((variables.length - varsNoNotes.length) / Math.max(variables.length, 1)) * 100,
  )
  checks.push({
    id: 'va-2',
    category: 'Variable Configuration',
    name: 'Variables Without Notes',
    status: pct >= 50 ? 'pass' : 'warn',
    message: `${pct}% of user-defined variables have notes (${variables.length - varsNoNotes.length}/${variables.length}).`,
    recommendation:
      pct < 50 ? 'Add notes to variables describing their purpose and data source.' : undefined,
    issues:
      pct < 50
        ? varsNoNotes.slice(0, 15).map((v) => item(v.name, 'warn', `Type: ${v.type}`))
        : undefined,
  })

  // 4.3 Data Layer variables
  const dlVars = variables.filter((v) => v.type === 'v' /* dataLayer */)
  const simpleDLVars = variables.filter((v) => v.type === 'jsm' /* jsm = JS variable */)
  checks.push({
    id: 'va-3',
    category: 'Variable Configuration',
    name: 'Data Layer Variables',
    status: dlVars.length > 0 ? 'pass' : 'info',
    message:
      dlVars.length > 0
        ? `${dlVars.length} data layer variable(s) configured (recommended approach for structured data).`
        : 'No data layer variables found. Consider using the data layer for structured event data.',
    tip: 'Data layer variables are more reliable than JavaScript variables or DOM scraping.',
    properlyConfigured: dlVars
      .slice(0, 10)
      .map((v) => item(v.name, 'pass', getParamValue(v.parameter as R[], 'name') || '')),
  })

  // 4.4 Constant variables (duplicate potential)
  const constVars = variables.filter((v) => v.type === 'c')
  const constValues = constVars.map((v) => getParamValue(v.parameter as R[], 'value') || '')
  const duplicateConsts = constValues.filter((val, idx) => constValues.indexOf(val) !== idx)
  checks.push({
    id: 'va-4',
    category: 'Variable Configuration',
    name: 'Duplicate Constant Values',
    status: duplicateConsts.length > 0 ? 'warn' : 'pass',
    message:
      duplicateConsts.length > 0
        ? `${duplicateConsts.length} duplicate constant variable value(s) detected.`
        : 'No duplicate constant variable values found.',
    recommendation:
      duplicateConsts.length > 0 ? 'Consolidate duplicate constant variables.' : undefined,
    issues: duplicateConsts.map((val) => item(`Duplicate value: "${val}"`, 'warn')),
  })

  return checks
}

// ─── Category 5: Consent Mode ─────────────────────────────────────────────────

function checkConsentMode(tags: GTMTag[], triggers: GTMTrigger[]): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  // 5.1 Consent Initialization tag
  const consentInitTag = tags.find((t) => t.type === 'consent_init_var' || t.type === 'gconsent')
  const consentInitTrigger = triggers.find(
    (t) => t.type === 'CONSENT_INIT' || t.name.toLowerCase().includes('consent init'),
  )
  checks.push({
    id: 'cm-1',
    category: 'Consent Mode',
    name: 'Consent Initialization Tag',
    status: consentInitTag ? 'pass' : 'fail',
    message: consentInitTag
      ? `Consent initialization tag "${consentInitTag.name}" found.`
      : 'No Consent Initialization tag detected. Consent Mode may not be initialized.',
    recommendation: !consentInitTag
      ? 'Add a Consent Initialization tag that fires on the Consent Initialization trigger to set default consent state before any other tags fire.'
      : undefined,
    tip: 'Consent must be initialized before any other tags fire to comply with GDPR/privacy requirements.',
  })

  // 5.2 Consent Mode v2 (ad_user_data + ad_personalization)
  const allTagJson = JSON.stringify(tags)
  const hasV2Types = CONSENT_MODE_V2_TYPES.slice(2, 4).every((type) => allTagJson.includes(type))
  const hasV1Types = CONSENT_MODE_V2_TYPES.slice(0, 2).every((type) => allTagJson.includes(type))
  checks.push({
    id: 'cm-2',
    category: 'Consent Mode',
    name: 'Consent Mode v2 (ad_user_data & ad_personalization)',
    status: hasV2Types ? 'pass' : hasV1Types ? 'warn' : 'fail',
    message: hasV2Types
      ? 'Consent Mode v2 signals (ad_user_data and ad_personalization) detected.'
      : hasV1Types
        ? 'Only Consent Mode v1 signals detected. Consent Mode v2 is now required for Google Ads.'
        : 'No Consent Mode signals detected. Google Ads conversion modeling may be impacted.',
    recommendation: !hasV2Types
      ? 'Implement Consent Mode v2 with ad_user_data and ad_personalization consent types. Required by Google for EU/EEA users since March 2024.'
      : undefined,
    tip: 'Consent Mode v2 was required for Google Ads in the EU/EEA from March 2024.',
  })

  // 5.3 Tags missing consent settings
  const advertisingTagTypes = ['awct', 'awrd', 'floodl', 'fxads', 'linkedInInsight', 'sp']
  const adTags = tags.filter((t) => advertisingTagTypes.includes(t.type))
  const adTagsNoConsent = adTags.filter(
    (t) => !t.consentSettings || t.consentSettings.consentStatus === 'notSet',
  )
  checks.push({
    id: 'cm-3',
    category: 'Consent Mode',
    name: 'Advertising Tags Missing Consent Settings',
    status: adTagsNoConsent.length > 0 ? 'fail' : adTags.length === 0 ? 'info' : 'pass',
    message:
      adTags.length === 0
        ? 'No advertising tags found to check.'
        : adTagsNoConsent.length > 0
          ? `${adTagsNoConsent.length} advertising tag(s) have no consent type configured.`
          : `All ${adTags.length} advertising tag(s) have consent settings configured.`,
    recommendation:
      adTagsNoConsent.length > 0
        ? 'Configure consent types on all advertising tags (typically requires ad_storage, ad_user_data, and ad_personalization).'
        : undefined,
    issues: adTagsNoConsent.map((t) =>
      item(t.name, 'fail', `Type: ${t.type} — no consent settings`),
    ),
    properlyConfigured:
      adTagsNoConsent.length === 0 && adTags.length > 0
        ? adTags.map((t) => item(t.name, 'pass', `Type: ${t.type}`))
        : undefined,
  })

  // 5.4 CMP detection
  const cmpKeywords = [
    'onetrust',
    'cookiebot',
    'consentmanager',
    'didomi',
    'usercentrics',
    'cookieinformation',
    'cookiehub',
    'trustarc',
    'iubenda',
  ]
  const tagJson = JSON.stringify(tags).toLowerCase()
  const detectedCMPs = cmpKeywords.filter((cmp) => tagJson.includes(cmp))
  checks.push({
    id: 'cm-4',
    category: 'Consent Mode',
    name: 'CMP (Consent Management Platform) Integration',
    status: detectedCMPs.length > 0 ? 'pass' : 'warn',
    message:
      detectedCMPs.length > 0
        ? `CMP integration detected: ${detectedCMPs.join(', ')}.`
        : 'No known CMP (Consent Management Platform) detected in the container.',
    recommendation:
      detectedCMPs.length === 0
        ? 'Use a CMP integrated with GTM Consent Mode to automatically manage user consent signals.'
        : undefined,
    tip: 'CMPs with GTM templates (OneTrust, Cookiebot, etc.) can automatically update Consent Mode signals.',
    properlyConfigured: detectedCMPs.map((cmp) => item(cmp, 'pass')),
  })

  // 5.5 Consent trigger for initialization
  checks.push({
    id: 'cm-5',
    category: 'Consent Mode',
    name: 'Consent Initialization Trigger',
    status: consentInitTrigger ? 'pass' : consentInitTag ? 'warn' : 'fail',
    message: consentInitTrigger
      ? `Consent Initialization trigger "${consentInitTrigger.name}" found.`
      : 'No Consent Initialization trigger (type: CONSENT_INIT) detected.',
    recommendation: !consentInitTrigger
      ? 'Create a trigger of type "Consent Initialization" and attach it to your consent initialization tag so it fires before other tags.'
      : undefined,
  })

  return checks
}

// ─── Category 6: Ecommerce Tracking ──────────────────────────────────────────

function checkEcommerceTracking(tags: GTMTag[], variables: GTMVariable[]): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  const allTagJson = JSON.stringify(tags).toLowerCase()
  const detectedEvents = GA4_ECOMMERCE_EVENTS.filter((evt) => allTagJson.includes(evt))
  const hasPurchase = detectedEvents.includes('purchase')
  const hasAddToCart = detectedEvents.includes('add_to_cart')
  const hasViewItem = detectedEvents.includes('view_item')
  const hasBeginCheckout = detectedEvents.includes('begin_checkout')

  // 6.1 Ecommerce events presence
  checks.push({
    id: 'ec-1',
    category: 'Ecommerce Tracking',
    name: 'GA4 Ecommerce Events Coverage',
    status:
      detectedEvents.length === 0
        ? 'info'
        : hasPurchase && hasAddToCart && hasBeginCheckout && hasViewItem
          ? 'pass'
          : hasPurchase
            ? 'warn'
            : 'warn',
    message:
      detectedEvents.length === 0
        ? 'No GA4 ecommerce events detected in this container.'
        : `${detectedEvents.length}/${GA4_ECOMMERCE_EVENTS.length} GA4 ecommerce events detected: ${detectedEvents.join(', ')}.`,
    recommendation:
      detectedEvents.length > 0 && !hasPurchase
        ? 'Add a purchase event tag to track revenue. This is critical for ecommerce measurement.'
        : detectedEvents.length === 0
          ? 'If this is an ecommerce site, implement GA4 ecommerce events for purchase funnel tracking.'
          : undefined,
    tip: 'The full GA4 ecommerce funnel: view_item → add_to_cart → begin_checkout → add_payment_info → purchase.',
    properlyConfigured: detectedEvents.map((evt) => item(evt, 'pass')),
    issues: GA4_ECOMMERCE_EVENTS.filter(
      (e) => !detectedEvents.includes(e) && detectedEvents.length > 0,
    )
      .slice(0, 5)
      .map((e) => item(e, 'warn', 'Not detected')),
  })

  // 6.2 Data layer ecommerce variable
  const ecommerceVar = variables.find(
    (v) =>
      getParamValue(v.parameter as R[], 'name')
        ?.toLowerCase()
        .includes('ecommerce') || v.name.toLowerCase().includes('ecommerce'),
  )
  checks.push({
    id: 'ec-2',
    category: 'Ecommerce Tracking',
    name: 'Ecommerce Data Layer Variable',
    status: hasPurchase && !ecommerceVar ? 'warn' : ecommerceVar ? 'pass' : 'info',
    message: ecommerceVar
      ? `Ecommerce data layer variable "${ecommerceVar.name}" found.`
      : detectedEvents.length > 0
        ? 'No dedicated ecommerce data layer variable found. Ensure item parameters are passed correctly.'
        : 'No ecommerce tracking detected.',
    recommendation:
      detectedEvents.length > 0 && !ecommerceVar
        ? 'Create a data layer variable for "ecommerce" to capture GA4 item arrays and revenue data.'
        : undefined,
  })

  // 6.3 Clear ecommerce object pattern
  const hasEcommerceClear =
    allTagJson.includes('"ecommerce": null') ||
    allTagJson.includes('"ecommerce":null') ||
    allTagJson.includes('ecommerce: undefined')
  checks.push({
    id: 'ec-3',
    category: 'Ecommerce Tracking',
    name: 'Ecommerce Object Clearing',
    status: detectedEvents.length === 0 ? 'info' : hasEcommerceClear ? 'pass' : 'warn',
    message:
      detectedEvents.length === 0
        ? 'N/A — no ecommerce tracking detected.'
        : hasEcommerceClear
          ? 'Ecommerce object clearing pattern detected.'
          : 'No ecommerce object clearing detected. Previous event data may bleed into subsequent events.',
    recommendation:
      detectedEvents.length > 0 && !hasEcommerceClear
        ? 'Push { ecommerce: null } to the data layer before each ecommerce event to prevent data bleeding between events.'
        : undefined,
    tip: 'Always clear the ecommerce object before pushing new ecommerce data: dataLayer.push({ ecommerce: null });',
  })

  return checks
}

// ─── Category 7: Naming Conventions ──────────────────────────────────────────

function checkNamingConventions(
  tags: GTMTag[],
  triggers: GTMTrigger[],
  variables: GTMVariable[],
): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  // Pattern: TYPE - Description (e.g., "GA4 - Page View", "GAds - Purchase")
  const tagSeparator = / [-–] /
  const tagsNoConvention = tags.filter((t) => !tagSeparator.test(t.name))
  const tagPct = Math.round(
    ((tags.length - tagsNoConvention.length) / Math.max(tags.length, 1)) * 100,
  )

  checks.push({
    id: 'nc-1',
    category: 'Naming Conventions',
    name: 'Tag Naming Convention',
    status: tagPct >= 80 ? 'pass' : tagPct >= 50 ? 'warn' : 'fail',
    message: `${tagPct}% of tags follow a "TYPE - Description" naming convention.`,
    recommendation:
      tagPct < 80
        ? 'Rename tags using a consistent pattern like "GA4 - Event Name" or "GAds - Conversion Name".'
        : undefined,
    tip: 'Consistent naming: [Vendor/Type] - [Specific Action] e.g., "FB - Purchase", "GA4 - Add to Cart".',
    issues: tagsNoConvention
      .slice(0, 15)
      .map((t) => item(t.name, 'warn', 'No vendor prefix or separator')),
  })

  // Triggers: "Event - Description" or title case
  const triggersNoConvention = triggers.filter(
    (t) => t.name === t.name.toLowerCase() && t.name.length > 3,
  )
  const trigPct = Math.round(
    ((triggers.length - triggersNoConvention.length) / Math.max(triggers.length, 1)) * 100,
  )

  checks.push({
    id: 'nc-2',
    category: 'Naming Conventions',
    name: 'Trigger Naming Convention',
    status: trigPct >= 80 ? 'pass' : trigPct >= 50 ? 'warn' : 'fail',
    message: `${trigPct}% of triggers use proper capitalization in naming.`,
    recommendation:
      trigPct < 80
        ? 'Use descriptive, properly capitalized trigger names like "Click - CTA Button" or "Form Submit - Contact".'
        : undefined,
    issues: triggersNoConvention.slice(0, 10).map((t) => item(t.name, 'warn', 'All lowercase')),
  })

  // Variables: type prefix
  const varsNoConvention = variables.filter(
    (v) => !tagSeparator.test(v.name) && !v.name.match(/^[A-Z]{1,4}[- ]/),
  )
  const varPct = Math.round(
    ((variables.length - varsNoConvention.length) / Math.max(variables.length, 1)) * 100,
  )

  checks.push({
    id: 'nc-3',
    category: 'Naming Conventions',
    name: 'Variable Naming Convention',
    status: varPct >= 70 ? 'pass' : varPct >= 40 ? 'warn' : 'fail',
    message: `${varPct}% of variables use a type prefix convention.`,
    recommendation:
      varPct < 70
        ? 'Use type prefixes for variables: "DL - Product Name", "JS - User ID", "CJS - Cookie Value", "URL - Path".'
        : undefined,
    tip: 'Variable prefixes: DL (Data Layer), JS (JavaScript), CJS (Custom JS), URL (URL), C (Constant), 1ST (1st Party Cookie).',
    issues: varsNoConvention.slice(0, 15).map((v) => item(v.name, 'warn', `Type: ${v.type}`)),
  })

  return checks
}

// ─── Category 8: Folder Organization ─────────────────────────────────────────

function checkFolderOrganization(
  tags: GTMTag[],
  triggers: GTMTrigger[],
  variables: GTMVariable[],
  folders: GTMFolder[],
): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  const tagsNoFolder = tags.filter((t) => !t.folderId)
  const triggersNoFolder = triggers.filter((t) => !t.folderId)
  const varsNoFolder = variables.filter((v) => !v.folderId)

  const totalItems = tags.length + triggers.length + variables.length
  const unorganizedItems = tagsNoFolder.length + triggersNoFolder.length + varsNoFolder.length
  const orgPct = Math.round(((totalItems - unorganizedItems) / Math.max(totalItems, 1)) * 100)

  // 8.1 Folders present
  checks.push({
    id: 'fo-1',
    category: 'Folder Organization',
    name: 'Workspace Folders',
    status: folders.length > 0 ? 'pass' : totalItems > 20 ? 'warn' : 'info',
    message:
      folders.length > 0
        ? `${folders.length} folder(s) found: ${folders.map((f) => f.name).join(', ')}.`
        : 'No folders found in this workspace.',
    recommendation:
      folders.length === 0 && totalItems > 20
        ? 'Create folders to organize tags, triggers, and variables by vendor or feature (e.g., "Google Analytics", "Advertising", "Ecommerce").'
        : undefined,
    tip: 'Use folders to group related tags/triggers/variables. Suggested: Analytics, Advertising, Consent, Ecommerce, Utilities.',
    properlyConfigured: folders.map((f) => item(f.name, 'pass')),
  })

  // 8.2 Unorganized items
  checks.push({
    id: 'fo-2',
    category: 'Folder Organization',
    name: 'Items Not in Folders',
    status: orgPct >= 70 ? 'pass' : orgPct >= 40 ? 'warn' : folders.length === 0 ? 'info' : 'fail',
    message: `${orgPct}% of container items are organized in folders (${totalItems - unorganizedItems}/${totalItems}).`,
    recommendation:
      orgPct < 70 && folders.length > 0
        ? 'Move remaining items into appropriate folders for better organization.'
        : orgPct < 70 && folders.length === 0
          ? 'Create folders and organize your container items.'
          : undefined,
    issues:
      unorganizedItems > 0
        ? [
            ...(tagsNoFolder.length > 0
              ? [item(`${tagsNoFolder.length} unorganized tags`, 'warn')]
              : []),
            ...(triggersNoFolder.length > 0
              ? [item(`${triggersNoFolder.length} unorganized triggers`, 'warn')]
              : []),
            ...(varsNoFolder.length > 0
              ? [item(`${varsNoFolder.length} unorganized variables`, 'warn')]
              : []),
          ]
        : undefined,
  })

  return checks
}

// ─── Category 9: Security & Quality ──────────────────────────────────────────

function checkSecurityAndQuality(tags: GTMTag[]): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  const htmlTags = tags.filter((t) => t.type === 'html')

  // 9.1 Custom HTML tags with eval()
  const evalTags = htmlTags.filter((t) => tagContainsText(t, 'eval('))
  checks.push({
    id: 'sq-1',
    category: 'Security & Quality',
    name: 'Custom HTML: eval() Usage',
    status: evalTags.length > 0 ? 'fail' : 'pass',
    message:
      evalTags.length > 0
        ? `${evalTags.length} custom HTML tag(s) use eval() which is a security risk.`
        : 'No eval() usage detected in custom HTML tags.',
    recommendation:
      evalTags.length > 0
        ? 'Remove eval() usage from custom HTML tags. It can execute arbitrary code and pose security risks.'
        : undefined,
    tip: 'eval() in GTM tags is a security risk that can be exploited if a malicious actor modifies the data layer.',
    issues: evalTags.map((t) => item(t.name, 'fail', 'Contains eval()')),
  })

  // 9.2 Custom HTML tags loading external scripts dynamically
  const dynamicScriptTags = htmlTags.filter(
    (t) =>
      tagContainsText(t, 'document.createElement') &&
      tagContainsText(t, 'src') &&
      tagContainsText(t, 'http'),
  )
  checks.push({
    id: 'sq-2',
    category: 'Security & Quality',
    name: 'Custom HTML: Dynamic External Script Loading',
    status: dynamicScriptTags.length > 0 ? 'warn' : 'pass',
    message:
      dynamicScriptTags.length > 0
        ? `${dynamicScriptTags.length} custom HTML tag(s) dynamically load external scripts.`
        : 'No dynamic external script loading detected.',
    recommendation:
      dynamicScriptTags.length > 0
        ? 'Review dynamically loaded scripts. Prefer using GTM URL-based tags or Custom HTML templates with proper CSP headers.'
        : undefined,
    tip: 'Dynamically loaded third-party scripts bypass Content Security Policy if not properly configured.',
    issues: dynamicScriptTags.map((t) => item(t.name, 'warn', 'Dynamic external script loading')),
  })

  // 9.3 document.write usage
  const docWriteTags = htmlTags.filter((t) => tagContainsText(t, 'document.write'))
  checks.push({
    id: 'sq-3',
    category: 'Security & Quality',
    name: 'Custom HTML: document.write() Usage',
    status: docWriteTags.length > 0 ? 'fail' : 'pass',
    message:
      docWriteTags.length > 0
        ? `${docWriteTags.length} custom HTML tag(s) use document.write() which blocks rendering.`
        : 'No document.write() usage detected.',
    recommendation:
      docWriteTags.length > 0
        ? 'Remove document.write() — it synchronously blocks rendering and breaks pages in modern browsers.'
        : undefined,
    issues: docWriteTags.map((t) => item(t.name, 'fail', 'Contains document.write()')),
  })

  // 9.4 Total custom HTML tag count (risk surface)
  checks.push({
    id: 'sq-4',
    category: 'Security & Quality',
    name: 'Custom HTML Tag Count',
    status: htmlTags.length > 15 ? 'warn' : 'pass',
    message: `${htmlTags.length} custom HTML tag(s) found.`,
    tip: 'Each custom HTML tag is a potential security surface. Prefer official GTM templates when available.',
    recommendation:
      htmlTags.length > 15
        ? 'Review whether custom HTML tags can be replaced with vendor-provided GTM templates.'
        : undefined,
    issues:
      htmlTags.length > 15 ? htmlTags.slice(0, 15).map((t) => item(t.name, 'warn')) : undefined,
    properlyConfigured:
      htmlTags.length <= 15 && htmlTags.length > 0
        ? htmlTags.map((t) => item(t.name, 'info'))
        : undefined,
  })

  return checks
}

// ─── Category 10: Server-Side GTM ────────────────────────────────────────────

function checkServerSideGTM(tags: GTMTag[], containerType: string[]): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  const isServerContainer = containerType.includes('server')
  const allJson = JSON.stringify(tags).toLowerCase()

  // 10.1 Server-side container detection (web container checking for sGTM config URL)
  const hasServerConfig =
    allJson.includes('server-side-tagging') ||
    allJson.includes('sst.') ||
    allJson.includes('/gtm.js') ||
    allJson.includes('server_container_url') ||
    allJson.includes('serverContainerUrl')

  if (!isServerContainer) {
    checks.push({
      id: 'ss-1',
      category: 'Server-Side GTM',
      name: 'Server-Side GTM Configuration',
      status: hasServerConfig ? 'pass' : 'info',
      message: hasServerConfig
        ? 'Server-side GTM (sGTM) configuration URL detected in web container.'
        : 'No server-side GTM configuration detected in this web container.',
      recommendation: !hasServerConfig
        ? 'Consider implementing server-side GTM for better data control, performance, and ad tracking accuracy.'
        : undefined,
      tip: 'Server-side GTM improves first-party data collection, reduces client-side bloat, and helps with cookie consent compliance.',
    })

    // 10.2 GA4 config tag using server URL
    const ga4Tags = tags.filter((t) => t.type === 'gaawc' || t.type === 'googtag')
    const ga4WithServer = ga4Tags.filter((t) => {
      const serverUrl = getParamValue(t.parameter as R[], 'serverContainerUrl')
      return Boolean(serverUrl)
    })
    checks.push({
      id: 'ss-2',
      category: 'Server-Side GTM',
      name: 'GA4 Routed Through Server Container',
      status: ga4Tags.length === 0 ? 'info' : ga4WithServer.length > 0 ? 'pass' : 'warn',
      message:
        ga4Tags.length === 0
          ? 'No GA4 tags found.'
          : ga4WithServer.length > 0
            ? `${ga4WithServer.length} GA4 tag(s) route through a server container.`
            : `${ga4Tags.length} GA4 tag(s) found but none route through a server container.`,
      recommendation:
        ga4Tags.length > 0 && ga4WithServer.length === 0
          ? 'Set a server container URL on GA4 tags to route data through server-side GTM for better data quality.'
          : undefined,
      tip: 'Routing GA4 through server-side GTM enables server-side event enrichment and better cookie lifespans.',
    })
  } else {
    // Server container checks
    checks.push({
      id: 'ss-1',
      category: 'Server-Side GTM',
      name: 'Server Container Detected',
      status: 'pass',
      message: 'This is a server-side GTM container.',
      tip: 'Server-side containers improve data accuracy and reduce client-side tracking overhead.',
    })

    // GA4 client in server container
    const ga4ClientTag = tags.find(
      (t) => t.type === 'gaawc' || t.name.toLowerCase().includes('ga4'),
    )
    checks.push({
      id: 'ss-2',
      category: 'Server-Side GTM',
      name: 'GA4 Client Tag in Server Container',
      status: ga4ClientTag ? 'pass' : 'warn',
      message: ga4ClientTag
        ? `GA4-related tag/client "${ga4ClientTag.name}" found in server container.`
        : 'No GA4 client tag found in server container.',
      recommendation: !ga4ClientTag
        ? 'Add a GA4 Client to receive and forward GA4 events from the web container.'
        : undefined,
    })
  }

  return checks
}

// ─── Category 11: Performance ─────────────────────────────────────────────────

function checkPerformance(tags: GTMTag[], triggers: GTMTrigger[]): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  // 11.1 Synchronous (blocking) tags
  const syncTags = tags.filter((t) => {
    const params = (t.parameter || []) as R[]
    const supportDoc = getParamValue(params, 'supportDocumentWrite')
    return supportDoc === 'true' || (t.type === 'html' && tagContainsText(t, 'document.write'))
  })
  checks.push({
    id: 'perf-1',
    category: 'Performance',
    name: 'Synchronous / Blocking Tags',
    status: syncTags.length > 0 ? 'fail' : 'pass',
    message:
      syncTags.length > 0
        ? `${syncTags.length} tag(s) are configured to fire synchronously (blocking page render).`
        : 'No synchronous blocking tags detected.',
    recommendation:
      syncTags.length > 0
        ? 'Remove "Support document.write" from tags. Use asynchronous tag loading instead.'
        : undefined,
    tip: 'Synchronous tags block the browser from rendering the page until they complete, significantly hurting Core Web Vitals.',
    issues: syncTags.map((t) => item(t.name, 'fail', 'Synchronous / blocking')),
  })

  // 11.2 Tags with unlimited firing
  const unlimitedTags = tags.filter((t) => t.tagFiringOption === 'unlimited')
  checks.push({
    id: 'perf-2',
    category: 'Performance',
    name: 'Unlimited Firing Tags',
    status: unlimitedTags.length > 5 ? 'warn' : 'pass',
    message:
      unlimitedTags.length > 5
        ? `${unlimitedTags.length} tags fire on every matching event (unlimited). Consider once-per-page where appropriate.`
        : 'Firing frequency looks healthy.',
    recommendation:
      unlimitedTags.length > 5
        ? 'Review tags set to "unlimited" firing. For page-level tags, "once per page" or "once per event" is usually sufficient.'
        : undefined,
    issues: unlimitedTags.slice(0, 10).map((t) => item(t.name, 'warn', 'Firing: unlimited')),
  })

  // 11.3 Pixel-heavy advertising setup
  const adTagCount = tags.filter((t) =>
    [
      'fxads',
      'awct',
      'awrd',
      'floodl',
      'linkedInInsight',
      'tiktok_pixel',
      'snaptr',
      'msads_uet',
      'twttr',
      'pinterest',
    ].includes(t.type),
  ).length
  checks.push({
    id: 'perf-3',
    category: 'Performance',
    name: 'Advertising Pixel Load',
    status: adTagCount > 8 ? 'warn' : 'info',
    message: `${adTagCount} advertising pixel/tag(s) detected.`,
    recommendation:
      adTagCount > 8
        ? 'Review whether all advertising pixels are necessary. Each pixel adds JavaScript weight and network requests.'
        : undefined,
    tip: 'Consider using server-side GTM to consolidate advertising pixel data and reduce client-side load.',
  })

  return checks
}

// ─── Category 12: MarTech Stack ───────────────────────────────────────────────

export function extractMarTech(tags: GTMTag[]): MarTechItem[] {
  const martech: Record<string, MarTechItem> = {}

  tags.forEach((tag) => {
    const vendor = MARTECH_VENDORS[tag.type as keyof typeof MARTECH_VENDORS]
    if (vendor) {
      if (!martech[tag.type]) {
        martech[tag.type] = {
          name: vendor.name,
          category: vendor.category,
          tagType: tag.type,
          count: 0,
          tagNames: [],
          notes: vendor.deprecated ? `Deprecated. ${vendor.notes || ''}`.trim() : vendor.notes,
        }
      }
      martech[tag.type].count++
      martech[tag.type].tagNames.push(tag.name)
    } else if (tag.type === 'html') {
      // Try to detect vendor from tag name
      const name = tag.name.toLowerCase()
      const vendor2known = [
        ['hotjar', 'Hotjar', 'heatmap'],
        ['clarity', 'Microsoft Clarity', 'heatmap'],
        ['linkedin', 'LinkedIn Insight', 'advertising'],
        ['snapchat', 'Snapchat Pixel', 'advertising'],
        ['tiktok', 'TikTok Pixel', 'advertising'],
        ['pinterest', 'Pinterest Tag', 'advertising'],
        ['hubspot', 'HubSpot', 'customer-data'],
        ['intercom', 'Intercom', 'chat'],
        ['drift', 'Drift', 'chat'],
        ['zendesk', 'Zendesk', 'chat'],
        ['segment', 'Segment', 'customer-data'],
        ['amplitude', 'Amplitude', 'analytics'],
        ['mixpanel', 'Mixpanel', 'analytics'],
        ['fullstory', 'FullStory', 'heatmap'],
        ['logrocket', 'LogRocket', 'heatmap'],
        ['sentry', 'Sentry', 'error-tracking'],
        ['optimizely', 'Optimizely', 'ab-testing'],
        ['vwo', 'VWO', 'ab-testing'],
      ] as const

      for (const [keyword, vendorName, category] of vendor2known) {
        if (name.includes(keyword)) {
          const key = `html_${keyword}`
          if (!martech[key]) {
            martech[key] = { name: vendorName, category, tagType: 'html', count: 0, tagNames: [] }
          }
          martech[key].count++
          martech[key].tagNames.push(tag.name)
          break
        }
      }
    }
  })

  return Object.values(martech).sort((a, b) => a.category.localeCompare(b.category))
}

function checkMarTechStack(martech: MarTechItem[]): AuditCheckResult[] {
  const checks: AuditCheckResult[] = []

  // 12.1 Overview
  checks.push({
    id: 'mt-1',
    category: 'MarTech Stack',
    name: 'MarTech Stack Overview',
    status: 'info',
    message:
      martech.length > 0
        ? `${martech.length} distinct technology/vendor type(s) detected across ${martech.reduce((sum, m) => sum + m.count, 0)} tags.`
        : 'No common MarTech vendors auto-detected.',
    tip: 'Review your MarTech stack regularly to remove unused tools and consolidate overlap.',
    properlyConfigured: martech.map((m) =>
      item(`${m.name} (${m.count} tag${m.count > 1 ? 's' : ''})`, 'info', m.category),
    ),
  })

  // 12.2 Deprecated vendors
  const deprecatedVendors = martech.filter((m) => m.notes?.toLowerCase().startsWith('deprecated'))
  checks.push({
    id: 'mt-2',
    category: 'MarTech Stack',
    name: 'Deprecated Tags in Stack',
    status: deprecatedVendors.length > 0 ? 'fail' : 'pass',
    message:
      deprecatedVendors.length > 0
        ? `${deprecatedVendors.length} deprecated technology/vendor(s) detected.`
        : 'No deprecated vendors detected.',
    recommendation:
      deprecatedVendors.length > 0
        ? 'Remove deprecated tags and replace with current equivalents.'
        : undefined,
    issues: deprecatedVendors.map((m) => item(m.name, 'fail', m.notes || 'Deprecated')),
  })

  // 12.3 Advertising pixel diversity (too many ad pixels)
  const adVendors = martech.filter((m) => m.category === 'advertising')
  checks.push({
    id: 'mt-3',
    category: 'MarTech Stack',
    name: 'Advertising Platform Diversity',
    status: adVendors.length > 5 ? 'warn' : 'info',
    message: `${adVendors.length} advertising platform(s) detected.`,
    tip: 'Too many advertising pixels can slow page load and complicate consent management.',
    recommendation:
      adVendors.length > 5
        ? 'Consider consolidating advertising tracking via server-side GTM.'
        : undefined,
    properlyConfigured: adVendors.map((m) => item(m.name, 'info', m.tagNames.join(', '))),
  })

  return checks
}

// ─── Health Score Calculator ──────────────────────────────────────────────────

export function calculateHealthScore(checks: AuditCheckResult[]): number {
  const scoreable = checks.filter((c) => c.status !== 'info')
  if (scoreable.length === 0) return 100

  const weights = { pass: 1, warn: 0.5, fail: 0, info: 1 } as const
  const total = scoreable.reduce((sum, c) => sum + weights[c.status as keyof typeof weights], 0)
  return Math.round((total / scoreable.length) * 100)
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export function runAllGTMChecks(
  version: GTMLiveVersion,
  containerType: string[],
): AuditCheckResult[] {
  const tags = (version.tag || []) as unknown as GTMTag[]
  const triggers = (version.trigger || []) as unknown as GTMTrigger[]
  const variables = (version.variable || []) as unknown as GTMVariable[]
  const folders = (version.folder || []) as unknown as GTMFolder[]
  const martech = extractMarTech(tags)

  return [
    ...checkContainerOverview(version, containerType),
    ...checkTagConfiguration(tags, triggers),
    ...checkTriggerConfiguration(tags, triggers),
    ...checkVariableConfiguration(tags, triggers, variables),
    ...checkConsentMode(tags, triggers),
    ...checkEcommerceTracking(tags, variables),
    ...checkNamingConventions(tags, triggers, variables),
    ...checkFolderOrganization(tags, triggers, variables, folders),
    ...checkSecurityAndQuality(tags),
    ...checkServerSideGTM(tags, containerType),
    ...checkPerformance(tags, triggers),
    ...checkMarTechStack(martech),
  ]
}

import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 9. Privacy & Compliance ─────────────────────────────────────────────────

export function runPrivacyChecks(checks: AuditCheck[], customDims: R[], property: R) {
  const cat = AUDIT_CATEGORIES.PRIVACY_COMPLIANCE
  const dimNames = customDims.map((d) => ((d.parameterName as string) || '').toLowerCase())

  // PII Check
  const piiPatterns = [
    'email',
    'phone',
    'ssn',
    'social_security',
    'credit_card',
    'address',
    'first_name',
    'last_name',
    'full_name',
    'password',
    'ip_address',
    'dob',
    'date_of_birth',
  ]
  const piiDims = dimNames.filter((d) => piiPatterns.some((p) => d.includes(p)))

  checks.push({
    id: 'pc-1',
    category: cat,
    name: 'PII in Custom Dimensions',
    status: piiDims.length > 0 ? 'fail' : 'pass',
    message:
      piiDims.length > 0
        ? `${piiDims.length} custom dimension(s) may contain personally identifiable information (PII). This violates Google Analytics Terms of Service.`
        : 'No PII patterns detected in custom dimension names.',
    recommendation:
      piiDims.length > 0
        ? 'Remove or hash any PII before sending to GA4. Use pseudonymous identifiers instead of email addresses or names.'
        : undefined,
    tip: 'Google expressly prohibits sending PII to Google Analytics. This includes email addresses, names, phone numbers, and social security numbers. Use hashed values or anonymous IDs instead.',
    issues: piiDims.map((d) => item(d, 'fail', 'Potential PII — violates GA Terms of Service')),
    properlyConfigured:
      piiDims.length === 0
        ? [item('No PII detected', 'pass', 'Custom dimensions appear compliant')]
        : undefined,
  })

  void property // property available for future checks

  // Consent Mode
  checks.push({
    id: 'pc-2',
    category: cat,
    name: 'Consent Mode',
    status: 'info',
    message:
      'Consent Mode v2 status cannot be verified via the API. If you operate in the EU/EEA, consent mode is required for compliant data collection.',
    tip: 'Implement Google Consent Mode v2 with a Consent Management Platform (CMP). This allows GA4 to model conversion data for users who decline cookies, preserving measurement accuracy while respecting user privacy.',
  })

  // Data deletion requests
  checks.push({
    id: 'pc-3',
    category: cat,
    name: 'Data Deletion Process',
    status: 'info',
    message:
      'Ensure you have a process for handling user data deletion requests (GDPR/CCPA). GA4 supports data deletion requests via Admin → Property → Data Deletion Requests.',
    tip: 'Under GDPR Article 17 and CCPA, users can request deletion of their data. GA4 provides a data deletion request tool that removes data associated with specific identifiers.',
  })

  // IP anonymization
  checks.push({
    id: 'pc-4',
    category: cat,
    name: 'IP Anonymization',
    status: 'pass',
    message:
      'GA4 automatically anonymizes IP addresses. Unlike Universal Analytics, there is no option to disable this.',
    tip: 'GA4 does not log or store full IP addresses. This is built-in and cannot be changed, making GA4 more privacy-friendly by default.',
    properlyConfigured: [item('IP anonymization', 'pass', 'Automatic in GA4 — always active')],
  })

  // Data processing location
  checks.push({
    id: 'pc-5',
    category: cat,
    name: 'Data Processing Terms',
    status: 'info',
    message:
      'Ensure you have accepted the GA4 Data Processing Terms if required by your jurisdiction. Check Admin → Account Settings → Account Access Management.',
    tip: 'EU-based businesses should review the Data Processing Amendment under Admin → Account Settings to ensure compliance with GDPR data processing requirements.',
  })
}

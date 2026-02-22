import type { Metadata } from 'next'
import { AuditTool } from './sections'

export const metadata: Metadata = {
  title: 'Free GA4 Audit Tool | Check Your GA4 Health Score | Liyab Digital',
  description:
    'Run a free automated GA4 audit in under 2 minutes. Identify tracking gaps, misconfigured events, and data quality issues affecting your analytics.',
  keywords: [
    'ga4 audit',
    'google analytics audit',
    'ga4 health check',
    'ga4 tracking audit',
    'analytics audit tool',
    'ga4 configuration check',
    'free ga4 audit',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Free GA4 Audit Tool | Liyab Digital',
    description:
      'Automated GA4 audit — identify tracking gaps, misconfigured events, and data quality issues in under 2 minutes.',
    siteName: 'Liyab Digital',
  },
  robots: { index: true, follow: true },
}

export default function GA4AuditPage() {
  return <AuditTool />
}

import type { ReactNode } from 'react'

export interface AuditCategory {
  title: string
  desc: string
  icon: ReactNode
}

export const auditCategories: AuditCategory[] = [
  {
    title: 'Data Streams',
    desc: 'Verifies web/app data streams are active and properly configured.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path
          fillRule="evenodd"
          d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Conversion Tracking',
    desc: 'Checks if key events are marked as conversions with proper schemas.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
      </svg>
    ),
  },
  {
    title: 'Custom Definitions',
    desc: 'Reviews custom events, parameters, and user properties.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path
          fillRule="evenodd"
          d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Property Settings',
    desc: 'Checks time zone, currency, data retention, and attribution settings.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path
          fillRule="evenodd"
          d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Integrations',
    desc: 'Verifies Google Ads, Search Console, and BigQuery links.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path d="M4.464 3.162A2 2 0 016.28 2h7.44a2 2 0 011.816 1.162l1.154 2.5c.067.145.1.301.1.461V7a3 3 0 11-6 0 3 3 0 11-6 0v-.875c0-.16.033-.316.1-.461l1.154-2.5z" />
        <path
          fillRule="evenodd"
          d="M2 12V8.236c.256.15.532.272.824.363A3.992 3.992 0 006 10a3.99 3.99 0 004-1.401A3.99 3.99 0 0014 10c1.16 0 2.2-.494 2.928-1.283.39.16.752.372 1.072.627V12a1 1 0 01-1 1H3a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Data Quality',
    desc: 'Detects duplicate events, missing filters, and retention issues.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
        <path
          fillRule="evenodd"
          d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

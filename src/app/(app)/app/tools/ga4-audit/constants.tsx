import type { ReactNode } from 'react'

export interface AuditCategory {
  title: string
  desc: string
  icon: ReactNode
}

// Icons as small inline SVGs
const iconClass = 'w-3.5 h-3.5 text-orange-500'

export const auditCategories: AuditCategory[] = [
  {
    title: 'Data Collection & Streams',
    desc: 'Verifies web/app data streams, measurement IDs, and enhanced measurement.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Event & Data Setup',
    desc: 'Reviews custom dimensions, metrics, and event parameter registration.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Key Events & Conversions',
    desc: 'Checks key events (formerly conversions) configuration and limits.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
      </svg>
    ),
  },
  {
    title: 'Enhanced Ecommerce',
    desc: 'Validates ecommerce event funnel, item parameters, and revenue tracking.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
  },
  {
    title: 'User ID & Identity',
    desc: 'Checks User ID tracking, Google Signals, and reporting identity settings.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
      </svg>
    ),
  },
  {
    title: 'Attribution & Settings',
    desc: 'Reviews attribution model, lookback windows, and channel groupings.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Data Quality & Filters',
    desc: 'Checks traffic filters, data retention, cross-domain, referral exclusions, and annotations.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Traffic Sources & UTM',
    desc: 'Analyzes UTM tracking, (not set) values, and traffic source effectiveness.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Privacy & Compliance',
    desc: 'Checks PII in data, consent mode, IP anonymization, and data processing terms.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Integrations & Links',
    desc: 'Verifies Google Ads, Search Console, BigQuery, and Firebase linking.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
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
    title: 'Audience & Device Performance',
    desc: 'Analyzes device distribution, landing page UX, key event performance, and anomalies.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Property Configuration',
    desc: 'Checks timezone, currency, industry category, service level, and property age.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

import type { ReactNode } from 'react'
import type { MarTechCategory } from '@/types/gtm-audit'
export type { VendorInfo } from '@/lib/gtm-data'
export {
  MARTECH_VENDORS,
  GA4_ECOMMERCE_EVENTS,
  CONSENT_MODE_V2_TYPES,
  MARTECH_CATEGORY_LABELS,
} from '@/lib/gtm-data'

// ─── Audit Categories ─────────────────────────────────────────────────────────

export interface AuditCategory {
  id: string
  title: string
  description: string
  icon: ReactNode
}

const iconClass = 'w-3.5 h-3.5 text-orange-500'

export const auditCategories: AuditCategory[] = [
  {
    id: 'container-overview',
    title: 'Container Overview',
    description: 'Container type, live version, workspaces, and general health.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z" />
      </svg>
    ),
  },
  {
    id: 'tag-configuration',
    title: 'Tag Configuration',
    description: 'Paused tags, tags without triggers, redundant and outdated tags.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'trigger-configuration',
    title: 'Trigger Configuration',
    description: 'Unused triggers, redundant triggers, and trigger naming quality.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'variable-configuration',
    title: 'Variable Configuration',
    description: 'Unused variables, redundant variables, and built-in variable coverage.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'consent-mode',
    title: 'Consent Mode',
    description: 'Consent initialization, Consent Mode v2, CMP integration, and per-tag consent.',
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
    id: 'ecommerce-tracking',
    title: 'Ecommerce Tracking',
    description:
      'GA4 ecommerce events, purchase tag, data layer variables, and funnel completeness.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
  },
  {
    id: 'naming-conventions',
    title: 'Naming Conventions',
    description: 'Tag, trigger, and variable naming patterns for maintainability.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v11.75A2.75 2.75 0 0016.75 18h-12A2.75 2.75 0 012 15.25V3.5zm3.75 7a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM5 5.75A.75.75 0 015.75 5h4.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75h-4.5A.75.75 0 015 8.25v-2.5z"
          clipRule="evenodd"
        />
        <path d="M16.5 6.5h-1v8.75a1.25 1.25 0 002.5 0V8a1.5 1.5 0 00-1.5-1.5z" />
      </svg>
    ),
  },
  {
    id: 'folder-organization',
    title: 'Folder Organization',
    description: 'Workspace folder structure and unorganized tags, triggers, and variables.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM1.75 9A1.75 1.75 0 000 10.75v4.5C0 16.216.784 17 1.75 17h16.5A1.75 1.75 0 0020 15.25v-4.5A1.75 1.75 0 0018.25 9H1.75z" />
      </svg>
    ),
  },
  {
    id: 'security-quality',
    title: 'Security & Quality',
    description: 'Custom HTML risks, eval usage, external scripts, and data layer integrity.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.749zm4.196 5.954a.75.75 0 00-1.414-.482l-3.751 4.44-1.43-1.43a.75.75 0 10-1.06 1.06l2.25 2.25a.75.75 0 001.232-.218l4.173-4.62z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'server-side-gtm',
    title: 'Server-Side GTM',
    description: 'Server container detection, GA4 server-side configuration, and client setup.',
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
    id: 'performance',
    title: 'Performance',
    description: 'Tags firing on all pages, synchronous tags, and firing frequency.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h4.59l-2.1 1.95a.75.75 0 001.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 10-1.02 1.1l2.1 1.95H6.75z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'martech-stack',
    title: 'MarTech Stack',
    description: 'Detected technologies, advertising pixels, analytics tools, and overlap.',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={iconClass}>
        <path d="M4.464 3.162A2 2 0 016.28 2h7.44a2 2 0 011.816 1.162l1.154 2.5c.067.145.115.291.145.438A3.508 3.508 0 0016 6H4c-.288 0-.568.035-.835.1.03-.147.078-.293.145-.438l1.154-2.5z" />
        <path
          fillRule="evenodd"
          d="M2 9.5a2 2 0 012-2h12a2 2 0 110 4H4a2 2 0 01-2-2zm13.24 0a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V9.5zm-2.74 0a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V9.5zM4 14a2 2 0 00-2 2v.5a2 2 0 002 2h12a2 2 0 002-2V16a2 2 0 00-2-2H4zm13.24 2.5a.75.75 0 01.75-.75H18a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zm-2.74 0a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

// ─── Naming Convention Patterns (UI-only) ────────────────────────────────────

export const NAMING_PATTERNS = {
  bestPracticeTag: /^[A-Z][A-Za-z0-9]+ [-–] .+/,
  bestPracticeTrigger: /^[A-Z].*/,
  bestPracticeVariable: /^[A-Z][A-Za-z0-9]+ [-–] .+|^[A-Z][a-z].*/,
}

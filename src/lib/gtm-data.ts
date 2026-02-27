// ─── GTM Shared Data Constants ───────────────────────────────────────────────
// Used by both the API (checks.ts) and the UI (constants.tsx).
// No React imports — pure data only.

import type { MarTechCategory } from '@/types/gtm-audit'

export interface VendorInfo {
  name: string
  category: MarTechCategory
  deprecated?: boolean
  replacedBy?: string
  notes?: string
}

export const MARTECH_VENDORS: Record<string, VendorInfo> = {
  // Google Analytics
  ua: {
    name: 'Universal Analytics',
    category: 'analytics',
    deprecated: true,
    replacedBy: 'GA4 (googtag/gaawc)',
    notes: 'Universal Analytics was sunset July 2023',
  },
  gaawc: { name: 'Google Analytics 4', category: 'analytics' },
  googtag: { name: 'Google Tag (GA4/Ads)', category: 'analytics' },

  // Google Ads
  awct: { name: 'Google Ads Conversion Tracking', category: 'advertising' },
  awrd: { name: 'Google Ads Remarketing', category: 'advertising' },
  sp: { name: 'Google Ads Conversion Linker', category: 'advertising' },
  gclidw: { name: 'Google Ads GCLID Write', category: 'advertising' },
  floodl: { name: 'Floodlight (Campaign Manager)', category: 'advertising' },
  dc: { name: 'DoubleClick Floodlight', category: 'advertising' },

  // Meta / Facebook
  fxads: { name: 'Meta Pixel (Facebook)', category: 'advertising' },

  // LinkedIn
  linkedInInsight: { name: 'LinkedIn Insight Tag', category: 'advertising' },

  // TikTok
  tiktok_pixel: { name: 'TikTok Pixel', category: 'advertising' },

  // Twitter / X
  twttr: { name: 'X (Twitter) Pixel', category: 'advertising' },

  // Pinterest
  pinterest: { name: 'Pinterest Tag', category: 'advertising' },

  // Snapchat
  snaptr: { name: 'Snapchat Pixel', category: 'advertising' },

  // Microsoft Ads
  msads_uet: { name: 'Microsoft UET (Bing Ads)', category: 'advertising' },

  // Hotjar / Heatmaps
  hj: { name: 'Hotjar', category: 'heatmap' },
  mouseflow: { name: 'Mouseflow', category: 'heatmap' },
  clarity: { name: 'Microsoft Clarity', category: 'heatmap' },
  fullstory: { name: 'FullStory', category: 'heatmap' },
  logrocket: { name: 'LogRocket', category: 'heatmap' },

  // Chat & Support
  intercomsettings: { name: 'Intercom', category: 'chat' },
  hs_chat: { name: 'HubSpot Chat', category: 'chat' },
  drift: { name: 'Drift Chat', category: 'chat' },
  zopim: { name: 'Zendesk Chat', category: 'chat' },
  crisp: { name: 'Crisp Chat', category: 'chat' },

  // Consent / CMP
  onetrust: { name: 'OneTrust CMP', category: 'consent' },
  cookiebot: { name: 'Cookiebot CMP', category: 'consent' },
  consentmanager: { name: 'Consentmanager', category: 'consent' },
  didomi: { name: 'Didomi CMP', category: 'consent' },
  usercentrics: { name: 'Usercentrics CMP', category: 'consent' },
  consent_init_var: { name: 'Consent Initialization', category: 'consent' },
  gconsent: { name: 'Google Consent Mode', category: 'consent' },

  // A/B Testing
  optimizely: { name: 'Optimizely', category: 'ab-testing' },
  vwo: { name: 'Visual Website Optimizer', category: 'ab-testing' },
  convert: { name: 'Convert.com', category: 'ab-testing' },
  ab_tasty: { name: 'AB Tasty', category: 'ab-testing' },

  // Error Tracking
  sentry: { name: 'Sentry', category: 'error-tracking' },
  bugsnag: { name: 'Bugsnag', category: 'error-tracking' },

  // Customer Data / Marketing Automation
  hubspot: { name: 'HubSpot Tracking', category: 'customer-data' },
  marketo: { name: 'Marketo Munchkin', category: 'customer-data' },
  pardot: { name: 'Salesforce Pardot', category: 'customer-data' },
  klaviyo: { name: 'Klaviyo', category: 'customer-data' },
  segment: { name: 'Segment', category: 'customer-data' },
  amplitude: { name: 'Amplitude', category: 'analytics' },
  mixpanel: { name: 'Mixpanel', category: 'analytics' },

  // Generic
  html: { name: 'Custom HTML', category: 'other' },
  img: { name: 'Custom Image / Pixel', category: 'other' },
}

export const GA4_ECOMMERCE_EVENTS = [
  'view_item_list',
  'select_item',
  'view_item',
  'add_to_cart',
  'remove_from_cart',
  'view_cart',
  'begin_checkout',
  'add_shipping_info',
  'add_payment_info',
  'purchase',
  'refund',
  'view_promotion',
  'select_promotion',
]

export const CONSENT_MODE_V2_TYPES = [
  'ad_storage',
  'analytics_storage',
  'ad_user_data',
  'ad_personalization',
  'functionality_storage',
  'personalization_storage',
  'security_storage',
]

export const MARTECH_CATEGORY_LABELS: Record<MarTechCategory, string> = {
  analytics: 'Analytics',
  advertising: 'Advertising',
  consent: 'Consent / CMP',
  heatmap: 'Heatmaps & Recordings',
  chat: 'Chat & Support',
  social: 'Social',
  video: 'Video',
  'ab-testing': 'A/B Testing',
  'error-tracking': 'Error Tracking',
  security: 'Security',
  'customer-data': 'Customer Data',
  other: 'Other',
}

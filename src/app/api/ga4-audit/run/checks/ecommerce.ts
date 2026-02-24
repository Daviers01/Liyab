import { AUDIT_CATEGORIES } from '@/types/audit'
import { type AuditCheck, type R, item } from './helpers'

// ─── 4. Enhanced Ecommerce ───────────────────────────────────────────────────

export function runEcommerceChecks(checks: AuditCheck[], conversionEvents: R[], customDims: R[]) {
  const cat = AUDIT_CATEGORIES.ECOMMERCE

  const convNames = conversionEvents.map((c) => ((c.eventName as string) || '').toLowerCase())
  const dimNames = customDims.map((d) => ((d.parameterName as string) || '').toLowerCase())

  // Required ecommerce events
  const ecommerceEvents = [
    { name: 'view_item', desc: 'Product detail page view' },
    { name: 'view_item_list', desc: 'Product listing/category page view' },
    { name: 'select_item', desc: 'Product click from list' },
    { name: 'add_to_cart', desc: 'Item added to cart' },
    { name: 'remove_from_cart', desc: 'Item removed from cart' },
    { name: 'view_cart', desc: 'Cart page viewed' },
    { name: 'begin_checkout', desc: 'Checkout started' },
    { name: 'add_shipping_info', desc: 'Shipping info added' },
    { name: 'add_payment_info', desc: 'Payment info added' },
    { name: 'purchase', desc: 'Transaction completed' },
    { name: 'refund', desc: 'Refund issued' },
  ]

  const hasAnyEcommerce = ecommerceEvents.some((e) => convNames.includes(e.name))
  const presentEcom = ecommerceEvents.filter((e) => convNames.includes(e.name))
  const missingEcom = ecommerceEvents.filter((e) => !convNames.includes(e.name))

  // EC-1: Ecommerce funnel
  checks.push({
    id: 'ec-1',
    category: cat,
    name: 'Ecommerce Event Funnel',
    status: !hasAnyEcommerce ? 'info' : presentEcom.length >= 6 ? 'pass' : 'warn',
    message: !hasAnyEcommerce
      ? 'No ecommerce events detected. This check applies to ecommerce sites only.'
      : `${presentEcom.length}/${ecommerceEvents.length} ecommerce funnel events detected.`,
    recommendation:
      hasAnyEcommerce && missingEcom.length > 0
        ? `Missing events: ${missingEcom.map((e) => e.name).join(', ')}. Implement them for full funnel visibility.`
        : undefined,
    tip: 'GA4 enhanced ecommerce requires a series of events from product discovery through purchase. Each event should include an items[] array with item_id, item_name, and price.',
    issues: hasAnyEcommerce
      ? missingEcom.map((e) => item(e.name, 'warn', `${e.desc} — not tracked`))
      : undefined,
    properlyConfigured: presentEcom.map((e) => item(e.name, 'pass', `${e.desc} — tracked`)),
  })

  // EC-2: Item-scoped dimensions
  if (hasAnyEcommerce) {
    const itemParams = ['item_id', 'item_name', 'item_category', 'item_brand', 'price', 'quantity']
    const registeredItemParams = itemParams.filter((p) => dimNames.includes(p))

    checks.push({
      id: 'ec-2',
      category: cat,
      name: 'Item Parameters Registration',
      status: registeredItemParams.length > 0 ? 'pass' : 'info',
      message:
        registeredItemParams.length > 0
          ? `${registeredItemParams.length} item-level parameters registered as custom dimensions.`
          : 'Item parameters (item_category, item_brand, etc.) can be registered as custom dimensions for richer reporting.',
      tip: 'Register item_category, item_brand, and other item parameters as item-scoped custom dimensions to enable product-level analysis in explorations.',
    })
  }

  // EC-3: Currency & value tracking
  if (hasAnyEcommerce) {
    const hasPurchase = convNames.includes('purchase')
    checks.push({
      id: 'ec-3',
      category: cat,
      name: 'Revenue & Currency Tracking',
      status: hasPurchase ? 'pass' : 'warn',
      message: hasPurchase
        ? 'Purchase event detected. Ensure the "value" and "currency" parameters are sent with each transaction.'
        : 'Purchase event not detected. Revenue tracking requires the purchase event with value and currency parameters.',
      tip: 'Always send currency (ISO 4217 format, e.g., "USD") and value with purchase events for accurate revenue reporting.',
      properlyConfigured: hasPurchase
        ? [item('purchase event', 'pass', 'Key event present')]
        : undefined,
    })
  }
}

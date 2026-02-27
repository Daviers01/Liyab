'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { initializePaddle, Paddle } from '@paddle/paddle-js'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckoutConfig {
  priceId: string
  userId: string
}

type SubscriptionStatus = 'free' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused'

// ─── Feature list ─────────────────────────────────────────────────────────────

interface Feature {
  label: string
  free: boolean | string
  pro: boolean | string
}

const features: Feature[] = [
  { label: 'GA4 Audit Tool', free: true, pro: true },
  { label: 'Monthly audits', free: '5 / month', pro: 'Unlimited' },
  { label: 'Audit health score', free: true, pro: true },
  { label: 'Actionable fix recommendations', free: true, pro: true },
  { label: 'AI-powered fix suggestions', free: false, pro: true },
  { label: 'Detailed check breakdowns', free: false, pro: true },
  { label: 'PDF audit report export', free: false, pro: true },
  { label: 'GA4 data comparison snapshots', free: false, pro: true },
  { label: 'Priority support', free: false, pro: true },
  { label: 'Early access to new tools', free: false, pro: true },
]

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your profile settings at any time. You keep Pro access until the end of the billing period.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Visa, Mastercard, American Express, and PayPal — all processed securely by Paddle.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The free tier is yours forever with no time limit. You only upgrade when you need more audits or AI features.',
  },
  {
    q: 'How does billing work?',
    a: "You're billed $9 USD every month from the date you subscribe. Paddle handles all sales tax automatically.",
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('free')
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const paddleRef = useRef<Paddle | null>(null)
  const checkoutConfigRef = useRef<CheckoutConfig | null>(null)

  const isPro = subscriptionStatus === 'active' || subscriptionStatus === 'trialing'

  // Load current subscription status
  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.subscriptionStatus) setSubscriptionStatus(d.subscriptionStatus)
      })
      .catch(() => {})
      .finally(() => setLoadingStatus(false))
  }, [])

  // ── Paddle init ──────────────────────────────────────────────────────────
  const ensurePaddle = useCallback(async (): Promise<boolean> => {
    if (paddleRef.current && checkoutConfigRef.current) return true

    const res = await fetch('/api/paddle/checkout')
    if (!res.ok) {
      setError('Failed to load payment system. Please try again.')
      return false
    }
    const data = await res.json()

    const { initializePaddle: init } = (await import('@paddle/paddle-js')) as {
      initializePaddle: typeof initializePaddle
    }

    const instance = await init({
      environment: data.environment === 'production' ? 'production' : 'sandbox',
      token: data.clientToken,
      eventCallback: (event) => {
        if (event.name === 'checkout.error') {
          console.error('[Paddle] Checkout error:', event)
          setError('Checkout error. Check console for details.')
        }
      },
    })

    if (!instance) {
      setError('Failed to initialize payment system. Please try again.')
      return false
    }

    paddleRef.current = instance
    checkoutConfigRef.current = {
      priceId: data.priceId,
      userId: String(data.userId),
    }
    return true
  }, [])

  const handleUpgrade = async () => {
    setLoadingCheckout(true)
    setError(null)
    try {
      const ready = await ensurePaddle()
      if (!ready) return

      const paddle = paddleRef.current!
      const { priceId, userId } = checkoutConfigRef.current!

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { userId },
      })
    } catch (err) {
      console.error(err)
      setError('Failed to open checkout. Please try again.')
    } finally {
      setLoadingCheckout(false)
    }
  }

  return (
    <div className="relative min-h-full">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/8 to-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/6 to-orange-500/6 rounded-full blur-3xl" />
      </div>

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card/30">
        <div className="px-6 md:px-8 py-6 md:py-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mb-1.5">
            Pricing
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Start free. Upgrade when you need more power.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-8 py-8 md:py-12 max-w-5xl space-y-12">
        {/* ── Plan cards ────────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 md:p-7 flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border">
                  Current plan
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground">Free</h2>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Full access to core tools with generous free limits.
              </p>
            </div>

            <ul className="space-y-2.5 flex-1">
              {features
                .filter((f) => f.free !== false)
                .map((f) => (
                  <li
                    key={f.label}
                    className="flex items-start gap-2.5 text-xs text-muted-foreground"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 mt-0.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {f.label}
                      {typeof f.free === 'string' && (
                        <span className="ml-1 font-semibold text-foreground">{f.free}</span>
                      )}
                    </span>
                  </li>
                ))}
            </ul>

            <div className="mt-auto pt-2">
              <div className="w-full py-2.5 rounded-xl border border-border bg-muted/20 text-center text-sm font-semibold text-muted-foreground">
                Your current plan
              </div>
            </div>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5 backdrop-blur-sm p-6 md:p-7 flex flex-col gap-5 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  Most popular
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground">Pro</h2>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-foreground">$9</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                For power users who need unlimited audits, AI, and export capabilities.
              </p>
            </div>

            <ul className="space-y-2.5 flex-1">
              {features.map((f) => (
                <li
                  key={f.label}
                  className={`flex items-start gap-2.5 text-xs ${f.pro === false ? 'opacity-40 line-through' : 'text-muted-foreground'}`}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${f.pro !== false ? 'text-orange-500' : 'text-muted-foreground/40'}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {f.label}
                    {typeof f.pro === 'string' && (
                      <span className="ml-1 font-semibold text-foreground">{f.pro}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              {loadingStatus ? (
                <div className="w-full py-2.5 rounded-xl bg-muted/30 animate-pulse" />
              ) : isPro ? (
                <Link
                  href="/app/profile"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold text-sm hover:bg-orange-500/10 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                  You're on Pro — Manage plan
                </Link>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loadingCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm shadow-sm shadow-orange-500/20"
                >
                  {loadingCheckout ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeOpacity="0.25"
                        />
                        <path
                          d="M12 2a10 10 0 019.95 9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Loading…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Upgrade to Pro — $9/month
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400 -mt-6">{error}</p>}

        {/* ── Feature comparison table ────────────────────────────────────── */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-4">Full comparison</h2>
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3 border-b border-border bg-muted/20">
              <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Feature
              </div>
              <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                Free
              </div>
              <div className="px-5 py-3 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider text-center">
                Pro
              </div>
            </div>

            {features.map((f, i) => (
              <div
                key={f.label}
                className={`grid grid-cols-3 items-center ${i < features.length - 1 ? 'border-b border-border/60' : ''}`}
              >
                <div className="px-5 py-3.5 text-sm text-foreground">{f.label}</div>
                <div className="px-5 py-3.5 flex justify-center">
                  {typeof f.free === 'string' ? (
                    <span className="text-xs font-semibold text-foreground bg-muted/40 px-2 py-0.5 rounded-full">
                      {f.free}
                    </span>
                  ) : f.free ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-emerald-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-muted-foreground/30"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  )}
                </div>
                <div className="px-5 py-3.5 flex justify-center">
                  {typeof f.pro === 'string' ? (
                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                      {f.pro}
                    </span>
                  ) : f.pro ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-orange-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-muted-foreground/30"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-4">Frequently asked questions</h2>
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {faqOpen === i && (
                  <div className="px-5 md:px-6 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer note ───────────────────────────────────────────────────── */}
        <p className="text-xs text-muted-foreground text-center pb-4">
          Payments processed securely by{' '}
          <a
            href="https://paddle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            Paddle
          </a>
          . Prices in USD. Cancel anytime.
        </p>
      </div>
    </div>
  )
}

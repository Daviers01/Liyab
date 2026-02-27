'use client'

import { useState, useRef, useCallback } from 'react'
import type { initializePaddle, Paddle } from '@paddle/paddle-js'

interface SubscriptionData {
  subscriptionStatus: 'free' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused'
  subscriptionPlan: 'free' | 'pro_monthly'
  subscriptionCurrentPeriodEnd?: string | null
}

interface CheckoutConfig {
  priceId: string
  userId: string
}

export function SubscriptionSection({
  subscription,
  onCheckoutComplete,
}: {
  subscription: SubscriptionData
  onCheckoutComplete?: () => void
}) {
  const paddleRef = useRef<Paddle | null>(null)
  const checkoutConfigRef = useRef<CheckoutConfig | null>(null)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPro =
    subscription.subscriptionStatus === 'active' || subscription.subscriptionStatus === 'trialing'
  const isCanceled = subscription.subscriptionStatus === 'canceled'
  const isPastDue = subscription.subscriptionStatus === 'past_due'

  // ── Load Paddle.js lazily ─────────────────────────────────────────────────
  const ensurePaddle = useCallback(async (): Promise<boolean> => {
    // Already initialized
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
        if (event.name === 'checkout.completed') {
          // Poll until webhook has synced the subscription to the DB
          let attempts = 0
          const poll = async () => {
            attempts++
            try {
              const res = await fetch('/api/profile')
              if (res.ok) {
                const data = await res.json()
                if (
                  data.subscriptionStatus === 'active' ||
                  data.subscriptionStatus === 'trialing'
                ) {
                  onCheckoutComplete?.()
                  return
                }
              }
            } catch {}
            if (attempts < 10) setTimeout(poll, 2000)
          }
          setTimeout(poll, 2000)
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

  const handleManage = async () => {
    setLoadingPortal(true)
    setError(null)
    try {
      const res = await fetch('/api/paddle/portal')
      if (!res.ok) throw new Error('Failed to get portal URL')
      const { url } = await res.json()
      window.open(url, '_blank', 'noopener')
    } catch (err) {
      console.error(err)
      setError('Failed to open customer portal. Please try again.')
    } finally {
      setLoadingPortal(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-border">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Subscription
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your plan and billing settings
        </p>
      </div>

      <div className="p-5 md:p-6 space-y-4">
        {/* Current plan card */}
        <div
          className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${
            isPro
              ? 'border-orange-500/25 bg-gradient-to-r from-orange-500/5 to-amber-500/5'
              : 'border-border bg-muted/20'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isPro
                  ? 'bg-gradient-to-br from-orange-500 to-amber-600'
                  : 'bg-muted/50 border border-border'
              }`}
            >
              {isPro ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5 text-white">
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-muted-foreground"
                >
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </p>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    subscription.subscriptionStatus === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : subscription.subscriptionStatus === 'trialing'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : isPastDue
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : isCanceled
                            ? 'bg-muted/50 text-muted-foreground'
                            : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {subscription.subscriptionStatus === 'free'
                    ? 'Free'
                    : subscription.subscriptionStatus === 'active'
                      ? 'Active'
                      : subscription.subscriptionStatus === 'trialing'
                        ? 'Trial'
                        : subscription.subscriptionStatus === 'past_due'
                          ? 'Past Due'
                          : subscription.subscriptionStatus === 'canceled'
                            ? 'Canceled'
                            : 'Paused'}
                </span>
              </div>
              {isPro && subscription.subscriptionCurrentPeriodEnd && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {isCanceled ? 'Access until' : 'Renews'}{' '}
                  {new Date(subscription.subscriptionCurrentPeriodEnd).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
              {!isPro && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Limited to free tier features
                </p>
              )}
            </div>
          </div>

          {isPro && !isCanceled ? (
            <button
              onClick={handleManage}
              disabled={loadingPortal}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loadingPortal ? (
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.2"
                  />
                  <path
                    d="M12 2a10 10 0 019.95 9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
              )}
              Manage
            </button>
          ) : null}
        </div>

        {/* Upgrade CTA (free or canceled) */}
        {!isPro && (
          <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5 p-4 space-y-3">
            <div>
              <p className="text-sm font-bold text-foreground">Upgrade to Pro</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Unlock premium features at{' '}
                <span className="font-semibold text-foreground">$9/month</span>
              </p>
            </div>
            <ul className="space-y-1.5">
              {[
                'Unlimited GA4 audits per month',
                'AI-powered fix suggestions',
                'PDF audit report exports',
                'Priority support',
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-orange-500 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loadingCheckout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm shadow-sm"
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
                      strokeOpacity="0.2"
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
          </div>
        )}

        {/* Past due warning */}
        {isPastDue && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex items-start gap-2.5">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
              <span className="font-bold">Payment failed.</span> Please update your payment method
              to keep Pro access.{' '}
              <button onClick={handleManage} className="underline font-semibold cursor-pointer">
                Update now
              </button>
            </p>
          </div>
        )}

        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

        <p className="text-[10px] text-muted-foreground">
          Payments are processed securely by{' '}
          <a
            href="https://paddle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            Paddle
          </a>
          . You can cancel anytime from the customer portal.
        </p>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { EventName } from '@paddle/paddle-node-sdk'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getPaddle } from '@/lib/paddle'

// Paddle delivers webhooks with this header
const PADDLE_SIGNATURE_HEADER = 'paddle-signature'

/**
 * POST /api/paddle/webhook
 * Receives Paddle subscription lifecycle events and keeps the user record in sync.
 * Configured in: Paddle Dashboard → Notifications → Add destination
 * Required events: subscription.created, subscription.updated, subscription.canceled
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[paddle/webhook] PADDLE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const signature = req.headers.get(PADDLE_SIGNATURE_HEADER) ?? ''
  const rawBody = await req.text()

  let event
  try {
    const paddle = getPaddle()
    event = await paddle.webhooks.unmarshal(rawBody, secret, signature)
  } catch (err) {
    console.error('[paddle/webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    switch (event.eventType) {
      // ── Subscription created ────────────────────────────────────────
      case EventName.SubscriptionCreated: {
        const sub = event.data
        const userId = (sub.customData as Record<string, string> | null)?.userId
        if (!userId) break

        await payload.update({
          collection: 'users',
          id: userId,
          data: {
            paddleCustomerId: sub.customerId ?? undefined,
            paddleSubscriptionId: sub.id,
            subscriptionStatus: mapStatus(sub.status),
            subscriptionPlan: resolvePlan(sub.items),
            subscriptionCurrentPeriodEnd: sub.currentBillingPeriod?.endsAt
              ? new Date(sub.currentBillingPeriod.endsAt).toISOString()
              : undefined,
          },
          overrideAccess: true,
        })
        break
      }

      // ── Subscription updated ────────────────────────────────────────
      case EventName.SubscriptionUpdated: {
        const sub = event.data
        const userId = (sub.customData as Record<string, string> | null)?.userId
        if (!userId) break

        await payload.update({
          collection: 'users',
          id: userId,
          data: {
            paddleCustomerId: sub.customerId ?? undefined,
            paddleSubscriptionId: sub.id,
            subscriptionStatus: mapStatus(sub.status),
            subscriptionPlan: resolvePlan(sub.items),
            subscriptionCurrentPeriodEnd: sub.currentBillingPeriod?.endsAt
              ? new Date(sub.currentBillingPeriod.endsAt).toISOString()
              : undefined,
          },
          overrideAccess: true,
        })
        break
      }

      // ── Subscription canceled ───────────────────────────────────────
      case EventName.SubscriptionCanceled: {
        const sub = event.data
        const userId = (sub.customData as Record<string, string> | null)?.userId
        if (!userId) break

        await payload.update({
          collection: 'users',
          id: userId,
          data: {
            subscriptionStatus: 'canceled',
            subscriptionPlan: 'free',
            subscriptionCurrentPeriodEnd: sub.canceledAt
              ? new Date(sub.canceledAt).toISOString()
              : undefined,
          },
          overrideAccess: true,
        })
        break
      }

      default:
        // Unhandled event types — log and acknowledge
        console.log('[paddle/webhook] Unhandled event:', event.eventType)
    }
  } catch (err) {
    console.error('[paddle/webhook] Error processing event:', err)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused' | 'free'
type SubscriptionPlan = 'free' | 'pro_monthly'

function mapStatus(status: string): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    paused: 'paused',
  }
  return map[status] ?? 'free'
}

function resolvePlan(items: Array<{ price?: { id?: string } | null }>): SubscriptionPlan {
  const proMonthlyPriceId = process.env.PADDLE_PRO_MONTHLY_PRICE_ID ?? ''
  const priceIds = items.map((i) => i.price?.id).filter(Boolean)
  if (priceIds.includes(proMonthlyPriceId)) return 'pro_monthly'
  return 'free'
}

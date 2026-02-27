import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getPaddle } from '@/lib/paddle'

/**
 * GET /api/paddle/portal
 * Creates a Paddle customer portal session for the current user and returns the URL.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { user } = auth

  const paddleCustomerId = (user as unknown as Record<string, string>).paddleCustomerId
  if (!paddleCustomerId) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
  }

  const subscriptionId = (user as unknown as Record<string, string>).paddleSubscriptionId

  try {
    const paddle = getPaddle()
    const session = await paddle.customerPortalSessions.create(
      paddleCustomerId,
      subscriptionId ? [subscriptionId] : [],
    )

    const portalUrl =
      subscriptionId && session.urls?.subscriptions?.[0]?.cancelSubscription
        ? session.urls.subscriptions[0].cancelSubscription
        : session.urls?.general?.overview

    return NextResponse.json({ url: portalUrl })
  } catch (err) {
    console.error('[paddle/portal]', err)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}

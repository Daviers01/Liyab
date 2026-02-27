import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { PADDLE_PLANS } from '@/lib/paddle'

/**
 * GET /api/paddle/checkout
 * Returns the Paddle client token + price ID needed for the client-side overlay.
 * The actual checkout is opened on the client with Paddle.js.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { user } = auth

  const clientToken = process.env.PADDLE_CLIENT_TOKEN
  if (!clientToken) {
    return NextResponse.json({ error: 'Paddle client token not configured' }, { status: 500 })
  }

  const priceId = PADDLE_PLANS.pro_monthly
  if (!priceId) {
    return NextResponse.json({ error: 'Pro plan price not configured' }, { status: 500 })
  }

  return NextResponse.json({
    clientToken,
    priceId,
    userId: user.id,
    email: user.email,
    name: user.name ?? '',
    environment: process.env.PADDLE_ENVIRONMENT ?? 'sandbox',
  })
}

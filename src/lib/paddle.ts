import { Paddle, Environment } from '@paddle/paddle-node-sdk'

// ─── Paddle singleton (server-side only) ─────────────────────────────────────

let _paddle: Paddle | null = null

export function getPaddle(): Paddle {
  if (!_paddle) {
    const apiKey = process.env.PADDLE_API_KEY
    if (!apiKey) throw new Error('PADDLE_API_KEY is not set')

    _paddle = new Paddle(apiKey, {
      environment:
        process.env.PADDLE_ENVIRONMENT === 'production'
          ? Environment.production
          : Environment.sandbox,
    })
  }
  return _paddle
}

// ─── Plan config ─────────────────────────────────────────────────────────────

export const PADDLE_PLANS = {
  pro_monthly: process.env.PADDLE_PRO_MONTHLY_PRICE_ID ?? '',
} as const

export type PaddlePlan = keyof typeof PADDLE_PLANS

import { getPayload } from 'payload'
import config from '@payload-config'
import type { NextRequest } from 'next/server'
import type { User } from '@/payload-types'

// ─── Auth Helper ──────────────────────────────────────────────────────────────

type AuthResult =
  | { user: User; payload: Awaited<ReturnType<typeof getPayload>>; error?: never }
  | { user?: never; payload?: never; error: Response }

/**
 * requireAuth
 *
 * Authenticates the request using the Payload JWT cookie.
 * Returns `{ user, payload }` on success or `{ error: Response }` on failure.
 *
 * Usage:
 *   const auth = await requireAuth(req)
 *   if (auth.error) return auth.error
 *   const { user, payload } = auth
 */
export async function requireAuth(req: NextRequest): Promise<AuthResult> {
  // Fast bail if no cookie present
  if (!req.cookies.get('payload-token')?.value) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  return { user: user as User, payload }
}

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'

/**
 * GET /api/profile
 * Returns the current user's profile data.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    // Fetch full user doc and audit count in parallel
    const [fullUser, auditCountResult] = await Promise.all([
      payload.findByID({
        collection: 'users',
        id: user.id,
        overrideAccess: true,
      }),
      payload.count({
        collection: 'audit-reports',
        where: { user: { equals: user.id } },
        overrideAccess: true,
      }),
    ])

    return NextResponse.json({
      id: fullUser.id,
      name: fullUser.name || '',
      email: fullUser.email,
      organizationName: fullUser.organizationName || '',
      jobTitle: fullUser.jobTitle || '',
      authProvider: fullUser.authProvider || 'credentials',
      avatarUrl: fullUser.avatarUrl || null,
      deactivated: fullUser.deactivated || false,
      createdAt: fullUser.createdAt,
      // Subscription
      subscriptionStatus: fullUser.subscriptionStatus ?? 'free',
      subscriptionPlan: fullUser.subscriptionPlan ?? 'free',
      subscriptionCurrentPeriodEnd: fullUser.subscriptionCurrentPeriodEnd ?? null,
      // Usage
      auditCount: auditCountResult.totalDocs,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

/**
 * PATCH /api/profile
 * Updates user profile fields, handles password changes, deactivation, etc.
 *
 * Body:
 *  - action: 'update-profile' | 'set-password' | 'deactivate' | 'delete-audits'
 *  - For update-profile: { name, organizationName, jobTitle }
 *  - For set-password: { currentPassword?, newPassword }
 *  - For deactivate: {}
 *  - For delete-audits: {}
 */
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    const body = await req.json()
    const { action } = body

    switch (action) {
      case 'update-profile': {
        const { name, organizationName, jobTitle } = body
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            name: name ?? undefined,
            organizationName: organizationName ?? undefined,
            jobTitle: jobTitle ?? undefined,
          },
          overrideAccess: true,
        })
        return NextResponse.json({ success: true })
      }

      case 'set-password': {
        const { currentPassword, newPassword } = body

        if (!newPassword || newPassword.length < 8) {
          return NextResponse.json(
            { error: 'Password must be at least 8 characters' },
            { status: 400 },
          )
        }

        // Read user to check auth provider
        const fullUser = await payload.findByID({
          collection: 'users',
          id: user.id,
          overrideAccess: true,
        })

        // If user already has a password (credentials user), verify current password
        if (fullUser.authProvider === 'credentials') {
          if (!currentPassword) {
            return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
          }

          // Attempt login with current credentials to verify
          try {
            await payload.login({
              collection: 'users',
              data: {
                email: fullUser.email,
                password: currentPassword,
              },
            })
          } catch {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
          }
        }

        // Set the new password
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            password: newPassword,
            authProvider:
              fullUser.authProvider === 'google' ? 'credentials' : fullUser.authProvider,
          },
          overrideAccess: true,
        })

        return NextResponse.json({ success: true })
      }

      case 'deactivate': {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: { deactivated: true },
          overrideAccess: true,
        })
        return NextResponse.json({ success: true })
      }

      case 'delete-audits': {
        await payload.delete({
          collection: 'audit-reports',
          where: { user: { equals: user.id } },
          overrideAccess: true,
        })
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

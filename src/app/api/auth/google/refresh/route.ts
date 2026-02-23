import { NextRequest, NextResponse } from 'next/server'
import { createOAuth2Client, setGA4Cookie } from '@/lib/google-client'
import { requireAuth } from '@/lib/api-auth'

/**
 * POST /api/auth/google/refresh
 * Refreshes the GA4 access token using the stored refresh token.
 * Called by the GA4 audit tool when the current access token has expired.
 * Sets a new ga4_access_token cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    // Read the user's stored refresh token (bypass field-level access)
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      overrideAccess: true, // Need to read hidden token fields
    })

    const refreshToken = fullUser.googleRefreshToken

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No Google refresh token stored. Please re-login with Google.' },
        { status: 400 },
      )
    }

    // Use the refresh token to get a new access token
    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({ refresh_token: refreshToken })

    const { credentials } = await oauth2Client.refreshAccessToken()

    if (!credentials.access_token) {
      return NextResponse.json(
        { error: 'Failed to refresh Google token. Please re-login with Google.' },
        { status: 400 },
      )
    }

    // Update stored access token
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        googleAccessToken: credentials.access_token,
      },
    })

    // Set the refreshed access token cookie
    const response = NextResponse.json({ success: true })
    setGA4Cookie(response, credentials.access_token)
    return response
  } catch (err) {
    console.error('Token refresh error:', err)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 },
    )
  }
}

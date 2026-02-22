import { google } from 'googleapis'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'

/**
 * POST /api/auth/google/refresh
 * Refreshes the GA4 access token using the stored refresh token.
 * Called by the GA4 audit tool when the current access token has expired.
 * Sets a new ga4_access_token cookie.
 */
export async function POST(req: NextRequest) {
  try {
    // Get the current Payload user
    const payload = await getPayload({ config })

    // Extract user from the payload-token cookie
    const token = req.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify the JWT and get the user
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

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
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    )
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
    response.cookies.set('ga4_access_token', credentials.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Token refresh error:', err)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 },
    )
  }
}

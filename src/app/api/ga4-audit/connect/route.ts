import { google } from 'googleapis'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'

/**
 * POST /api/ga4-audit/connect
 *
 * Called from the GA4 audit tool when a credential-login user connects their
 * Google account. Exchanges the OAuth code, stores tokens on the user doc
 * for future use, sets the ga4_access_token cookie, and returns properties.
 *
 * Unlike /api/auth/google (login route) this does NOT create or re-authenticate
 * the Payload user — only links Google tokens to the already-logged-in user.
 */
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Missing auth code' }, { status: 400 })
    }

    // Verify the user is logged in
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // ── Exchange code for Google tokens ──────────────────────────────────
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google/callback`,
    )

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // ── Get Google profile (for googleSub / avatar) ─────────────────────
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: profile } = await oauth2.userinfo.get()

    // ── Store tokens on the user doc ────────────────────────────────────
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        googleSub: profile.id || undefined,
        googleAccessToken: tokens.access_token || undefined,
        googleRefreshToken: tokens.refresh_token || undefined,
        avatarUrl: profile.picture || user.avatarUrl || undefined,
      },
    })

    // ── List GA4 properties ─────────────────────────────────────────────
    const analyticsAdmin = google.analyticsadmin({
      version: 'v1beta',
      auth: oauth2Client,
    })

    const accountsRes = await analyticsAdmin.accounts.list()
    const accounts = accountsRes.data.accounts || []

    const properties: Array<{
      name: string
      displayName: string
      propertyId: string
    }> = []

    for (const account of accounts) {
      if (!account.name) continue
      try {
        const propsRes = await analyticsAdmin.properties.list({
          filter: `parent:${account.name}`,
        })
        const props = propsRes.data.properties || []
        for (const prop of props) {
          if (prop.name && prop.displayName) {
            properties.push({
              name: prop.name,
              displayName: prop.displayName,
              propertyId: prop.name,
            })
          }
        }
      } catch {
        continue
      }
    }

    // ── Set ga4_access_token cookie & return properties ──────────────────
    const response = NextResponse.json({ properties })

    if (tokens.access_token) {
      response.cookies.set('ga4_access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600,
        path: '/',
      })
    }

    return response
  } catch (err) {
    console.error('GA4 connect error:', err)
    return NextResponse.json(
      { error: 'Failed to connect Google account' },
      { status: 500 },
    )
  }
}

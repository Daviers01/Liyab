import { google } from 'googleapis'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import crypto from 'crypto'

/**
 * POST /api/auth/google
 * Receives { code } from the client after the Google OAuth popup.
 * - Exchanges the code for access/refresh tokens
 * - Gets the user's Google profile
 * - Finds or creates a Payload user
 * - Stores Google tokens on the user doc (for GA4 access)
 * - Returns a Payload JWT session cookie
 */
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Missing auth code' }, { status: 400 })
    }

    // ── Exchange code for Google tokens ──────────────────────────────────
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google/callback`,
    )

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // ── Get Google profile ──────────────────────────────────────────────
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: profile } = await oauth2.userinfo.get()

    if (!profile.email) {
      return NextResponse.json({ error: 'Could not retrieve email from Google' }, { status: 400 })
    }

    // ── Find or create Payload user ─────────────────────────────────────
    const payload = await getPayload({ config })

    // Look up by googleSub first, then by email
    let user = null
    if (profile.id) {
      const bySub = await payload.find({
        collection: 'users',
        where: { googleSub: { equals: profile.id } },
        limit: 1,
      })
      if (bySub.docs.length > 0) {
        user = bySub.docs[0]
      }
    }

    if (!user) {
      const byEmail = await payload.find({
        collection: 'users',
        where: { email: { equals: profile.email } },
        limit: 1,
      })
      if (byEmail.docs.length > 0) {
        user = byEmail.docs[0]
      }
    }

    if (user) {
      // Update existing user with latest tokens
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          googleSub: profile.id || undefined,
          googleAccessToken: tokens.access_token || undefined,
          googleRefreshToken: tokens.refresh_token || user.googleRefreshToken || undefined,
          avatarUrl: profile.picture || undefined,
          authProvider: 'google',
          name: user.name || profile.name || undefined,
        },
      })
    } else {
      // Create new user — generate a random password (user will only login via Google)
      const randomPassword = crypto.randomBytes(32).toString('hex')

      user = await payload.create({
        collection: 'users',
        data: {
          email: profile.email,
          password: randomPassword,
          name: profile.name || profile.email.split('@')[0],
          roles: ['user'],
          authProvider: 'google',
          googleSub: profile.id || undefined,
          googleAccessToken: tokens.access_token || undefined,
          googleRefreshToken: tokens.refresh_token || undefined,
          avatarUrl: profile.picture || undefined,
        },
      })
    }

    // ── Log the user in via Payload (sets JWT cookie) ────────────────────
    // We use the login endpoint with direct token generation
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: profile.email,
        password: '', // won't match, but we'll use the direct token approach
      },
    }).catch(() => null)

    // If password login fails (expected for Google users), generate token directly
    if (!loginResult) {
      // Generate a JWT token for the user manually
      const fullUser = await payload.findByID({
        collection: 'users',
        id: user.id,
      })

      // Use Payload's internal auth to generate token
      // We'll set a temp password, login, then it works
      const tempPassword = crypto.randomBytes(32).toString('hex')
      await payload.update({
        collection: 'users',
        id: user.id,
        data: { password: tempPassword },
      })

      const result = await payload.login({
        collection: 'users',
        data: {
          email: profile.email,
          password: tempPassword,
        },
      })

      const response = NextResponse.json({
        user: {
          id: fullUser.id,
          email: fullUser.email,
          name: fullUser.name,
          avatarUrl: fullUser.avatarUrl,
        },
      })

      // Set the Payload auth cookie
      if (result.token) {
        response.cookies.set('payload-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        })
      }

      // Also set the GA4 access token cookie for immediate audit use
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
    }

    // If direct login succeeded (unlikely for Google users, but handle it)
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    })

    if (loginResult.token) {
      response.cookies.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

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
    console.error('Google auth error:', err)
    return NextResponse.json(
      { error: 'Google authentication failed. Please try again.' },
      { status: 500 },
    )
  }
}

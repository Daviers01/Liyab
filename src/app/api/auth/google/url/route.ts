import { google } from 'googleapis'
import { NextResponse } from 'next/server'

/**
 * GET /api/auth/google/url
 * Returns the Google OAuth consent URL.
 * Scopes include openid profile/email AND analytics.readonly so
 * the GA4 audit tool works without a second login.
 */
export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google/callback`,
  )

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'openid',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/analytics.readonly',
    ],
  })

  return NextResponse.json({ url })
}

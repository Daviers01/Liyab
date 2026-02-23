import { google } from 'googleapis'
import type { NextResponse } from 'next/server'

// ─── OAuth2 Client Factory ────────────────────────────────────────────────────

/** Returns a configured OAuth2 client using environment credentials. */
export function createOAuth2Client(redirectUri?: string) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri ?? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google/callback`,
  )
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

const IS_PROD = process.env.NODE_ENV === 'production'

/** Cookie options shared across all GA4 access-token cookies. */
export const GA4_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax' as const,
  maxAge: 3600,
  path: '/',
}

/** Sets the ga4_access_token cookie on a response object. */
export function setGA4Cookie(
  response: Pick<ReturnType<typeof NextResponse.json>, 'cookies'>,
  accessToken: string,
) {
  response.cookies.set('ga4_access_token', accessToken, GA4_COOKIE_OPTIONS)
}

/** Clears GA4 auth cookies from a response (used after audit completes). */
export function clearGA4Cookies(response: Pick<ReturnType<typeof NextResponse.json>, 'cookies'>) {
  response.cookies.delete('ga4_access_token')
  response.cookies.delete('ga4_refresh_token')
}

/** Shared Payload auth-cookie options. */
export const PAYLOAD_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax' as const,
  path: '/',
}

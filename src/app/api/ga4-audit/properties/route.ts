import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { createOAuth2Client } from '@/lib/google-client'

/**
 * GET /api/ga4-audit/properties
 *
 * Lists GA4 properties using the stored access token (from Google login).
 * If the token is expired, returns 401 so the client can attempt a refresh.
 */
export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('ga4_access_token')?.value
    if (!accessToken) {
      return NextResponse.json({ error: 'no_token' }, { status: 401 })
    }

    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({ access_token: accessToken })

    const analyticsAdmin = google.analyticsadmin({
      version: 'v1beta',
      auth: oauth2Client,
    })

    const accountsRes = await analyticsAdmin.accounts.list()
    const accounts = accountsRes.data.accounts || []

    // Fetch properties from all accounts in parallel for speed
    const results = await Promise.allSettled(
      accounts
        .filter((a) => a.name)
        .map((account) => analyticsAdmin.properties.list({ filter: `parent:${account.name}` })),
    )

    const properties: Array<{
      name: string
      displayName: string
      propertyId: string
    }> = []

    for (const result of results) {
      if (result.status !== 'fulfilled') continue
      const props = result.value.data.properties || []
      for (const prop of props) {
        if (prop.name && prop.displayName) {
          properties.push({
            name: prop.name,
            displayName: prop.displayName,
            propertyId: prop.name,
          })
        }
      }
    }

    return NextResponse.json({ properties })
  } catch (err: unknown) {
    // Token revoked or expired
    const status = (err as { code?: number })?.code
    if (status === 401 || status === 403) {
      return NextResponse.json({ error: 'token_expired' }, { status: 401 })
    }
    console.error('GA4 properties list error:', err)
    return NextResponse.json({ error: 'Failed to list properties' }, { status: 500 })
  }
}

import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import type { GTMAccount } from '@/types/gtm-audit'

// GET: Return containers for all accessible GTM accounts (re-list after token set)
export async function GET(req: NextRequest) {
  let accessToken = req.cookies.get('gtm_access_token')?.value
  const refreshToken = req.cookies.get('gtm_refresh_token')?.value

  // If access token is missing but we have a refresh token, silently obtain a new one
  if (!accessToken && refreshToken) {
    try {
      const refreshClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      )
      refreshClient.setCredentials({ refresh_token: refreshToken })
      const { credentials } = await refreshClient.refreshAccessToken()
      accessToken = credentials.access_token ?? undefined
    } catch {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  oauth2Client.setCredentials({ access_token: accessToken })

  const tagmanager = google.tagmanager({ version: 'v2', auth: oauth2Client })

  try {
    const accountsRes = await tagmanager.accounts.list()
    const accounts = accountsRes.data.account || []

    const result: (GTMAccount & { containers: unknown[] })[] = await Promise.all(
      accounts.map(async (account) => {
        const containersRes = await tagmanager.accounts.containers.list({
          parent: account.path!,
        })
        return {
          accountId: account.accountId!,
          name: account.name!,
          path: account.path!,
          containers: (containersRes.data.container || []).map((c) => ({
            accountId: account.accountId!,
            accountName: account.name!,
            containerId: c.containerId!,
            name: c.name!,
            publicId: c.publicId!,
            usageContext: c.usageContext || [],
            path: c.path!,
          })),
        }
      }),
    )

    const response = NextResponse.json({ accounts: result })
    // Refresh the access token cookie so its 1-hour window resets on every use
    if (accessToken) {
      const IS_PROD = process.env.NODE_ENV === 'production'
      response.cookies.set('gtm_access_token', accessToken, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: 'lax',
        maxAge: 3600,
        path: '/',
      })
    }
    return response
  } catch (err) {
    console.error('GTM containers error:', err)
    return NextResponse.json({ error: 'Failed to list containers' }, { status: 500 })
  }
}

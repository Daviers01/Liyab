import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/ga4-audit/callback`,
)

// GET handler: receives the redirect from Google OAuth, renders a page that
// sends the auth code back to the opener window via postMessage.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return new NextResponse('Missing code parameter', { status: 400 })
  }

  // Return an HTML page that posts the code back to the parent window
  const html = `<!DOCTYPE html>
<html>
<head><title>Connecting...</title></head>
<body>
  <p>Connecting your account...</p>
  <script>
    window.opener.postMessage({ type: 'ga4-auth-callback', code: '${code}' }, '*');
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

// POST handler: exchanges the auth code for tokens and lists GA4 properties
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Missing auth code' }, { status: 400 })
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // List GA4 properties using the Admin API
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
        // Skip accounts we can't access
        continue
      }
    }

    // Store the access token in a short-lived cookie for the audit step
    const response = NextResponse.json({ properties })
    response.cookies.set('ga4_access_token', tokens.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes — just enough to run the audit
      path: '/',
    })
    if (tokens.refresh_token) {
      response.cookies.set('ga4_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 300,
        path: '/',
      })
    }

    return response
  } catch (err) {
    console.error('GA4 auth callback error:', err)
    return NextResponse.json(
      { error: 'Failed to authenticate with Google' },
      { status: 500 },
    )
  }
}

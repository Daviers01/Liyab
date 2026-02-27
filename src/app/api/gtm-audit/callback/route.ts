import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/gtm-audit/callback`,
)

const IS_PROD = process.env.NODE_ENV === 'production'
const GTM_ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax' as const,
  maxAge: 3600, // 1 hour
  path: '/',
}
const GTM_REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
}

// GET: OAuth redirect — posts code back to opener window
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return new NextResponse('Missing code parameter', { status: 400 })
  }

  const html = `<!DOCTYPE html>
<html>
<head><title>Connecting...</title></head>
<body>
  <p>Connecting your GTM account...</p>
  <script>
    window.opener.postMessage({ type: 'gtm-auth-callback', code: '${code}' }, '*');
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

// POST: Exchange code for token and list GTM accounts + containers
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Missing auth code' }, { status: 400 })
    }

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const tagmanager = google.tagmanager({ version: 'v2', auth: oauth2Client })

    // List all accounts the user has access to
    const accountsRes = await tagmanager.accounts.list()
    const accounts = accountsRes.data.account || []

    // Fetch containers for each account in parallel
    const accountsWithContainers = await Promise.all(
      accounts.map(async (account) => {
        try {
          const containersRes = await tagmanager.accounts.containers.list({
            parent: account.path!,
          })
          const containers = (containersRes.data.container || []).map((c) => ({
            accountId: account.accountId!,
            accountName: account.name!,
            containerId: c.containerId!,
            name: c.name!,
            publicId: c.publicId!,
            usageContext: c.usageContext || [],
            path: c.path!,
          }))
          return {
            accountId: account.accountId!,
            accountName: account.name!,
            containers,
          }
        } catch {
          return { accountId: account.accountId!, accountName: account.name!, containers: [] }
        }
      }),
    )

    const response = NextResponse.json({ accounts: accountsWithContainers })
    response.cookies.set('gtm_access_token', tokens.access_token!, GTM_ACCESS_COOKIE_OPTIONS)
    if (tokens.refresh_token) {
      response.cookies.set('gtm_refresh_token', tokens.refresh_token, GTM_REFRESH_COOKIE_OPTIONS)
    }
    return response
  } catch (err) {
    console.error('GTM callback error:', err)
    return NextResponse.json({ error: 'Failed to exchange auth code' }, { status: 500 })
  }
}

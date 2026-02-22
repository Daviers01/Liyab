import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/auth/google/callback
 * Google redirects here after consent. This page sends the code
 * back to the opener via postMessage (popup flow).
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return new NextResponse('Missing code parameter', { status: 400 })
  }

  const html = `<!DOCTYPE html>
<html>
<head><title>Signing in...</title></head>
<body>
  <p style="font-family:system-ui;text-align:center;padding:40px">Signing you in...</p>
  <script>
    if (window.opener) {
      window.opener.postMessage({ type: 'google-auth-callback', code: '${code}' }, '*');
    } else {
      document.body.innerHTML = '<p style="font-family:system-ui;text-align:center;padding:40px">Authentication complete. You can close this window.</p>';
    }
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

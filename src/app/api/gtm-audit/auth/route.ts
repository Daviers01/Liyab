import { google } from 'googleapis'
import { NextResponse } from 'next/server'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/gtm-audit/callback`,
)

export async function GET() {
  const scopes = ['https://www.googleapis.com/auth/tagmanager.readonly']

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })

  return NextResponse.json({ url })
}

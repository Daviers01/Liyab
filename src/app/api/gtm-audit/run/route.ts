import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { runAllGTMChecks, extractMarTech, calculateHealthScore } from './checks'
import type { GTMAuditReport } from '@/types/gtm-audit'
import type { AuditSummary } from '@/types/audit'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { containerPath, containerName, publicId, usageContext } = await req.json()

    if (!containerPath) {
      return NextResponse.json({ error: 'Missing containerPath' }, { status: 400 })
    }

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
        // fall through to the check below
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Session expired. Please reconnect your Google account.' },
        { status: 401 },
      )
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    )
    oauth2Client.setCredentials({ access_token: accessToken })

    const tagmanager = google.tagmanager({ version: 'v2', auth: oauth2Client })

    // Fetch the live container version (contains all tags, triggers, variables, folders)
    const liveVersionRes = await tagmanager.accounts.containers.versions.live({
      parent: containerPath,
    })

    const version = liveVersionRes.data

    if (!version) {
      return NextResponse.json(
        {
          error:
            'Could not fetch live container version. The container may have no published version yet.',
        },
        { status: 404 },
      )
    }

    // Determine container type
    const containerType: string[] = usageContext || ['web']

    // Run all checks
    const checks = runAllGTMChecks(version as never, containerType)

    // Extract MarTech stack
    const martech = extractMarTech((version.tag || []) as never)

    // Calculate health score
    const healthScore = calculateHealthScore(checks)

    // Build summary
    const summary: AuditSummary = {
      total: checks.length,
      passed: checks.filter((c) => c.status === 'pass').length,
      warnings: checks.filter((c) => c.status === 'warn').length,
      failures: checks.filter((c) => c.status === 'fail').length,
      info: checks.filter((c) => c.status === 'info').length,
    }

    const report: GTMAuditReport = {
      containerId: version.container?.containerId || containerPath.split('/')[3] || '',
      containerName: containerName || version.container?.name || 'GTM Container',
      publicId: publicId || version.container?.publicId || '',
      containerType,
      healthScore,
      timestamp: new Date().toISOString(),
      liveVersionId: version.containerVersionId || '0',
      tagCount: (version.tag || []).length,
      triggerCount: (version.trigger || []).length,
      variableCount: (version.variable || []).length,
      folderCount: (version.folder || []).length,
      checks,
      summary,
      martech,
    }

    return NextResponse.json({ report })
  } catch (err: unknown) {
    console.error('GTM audit run error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Audit failed: ${message}` }, { status: 500 })
  }
}

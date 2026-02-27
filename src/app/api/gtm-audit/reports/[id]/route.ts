import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api-auth'

// GET /api/gtm-audit/reports/[id] — get a specific saved GTM audit report
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    const { id: rawId } = await params
    const id = Number(rawId)
    if (!id || isNaN(id)) {
      return Response.json({ error: 'Invalid report ID' }, { status: 400 })
    }

    const report = await payload.findByID({
      collection: 'gtm-audit-reports',
      id,
      depth: 0,
      disableErrors: true,
    })

    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 })
    }

    const reportUserId =
      typeof report.user === 'object' ? (report.user as { id: number }).id : report.user
    if (reportUserId !== user.id && !user.roles?.includes('admin')) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    return Response.json({
      report: {
        id: report.id,
        containerName: report.containerName,
        containerId: report.containerId,
        publicId: report.publicId,
        healthScore: report.healthScore,
        checks: report.checks,
        summary: report.summary,
        martech: report.martech ?? null,
        containerType: report.containerType ?? null,
        tagCount: report.tagCount ?? null,
        triggerCount: report.triggerCount ?? null,
        variableCount: report.variableCount ?? null,
        createdAt: report.createdAt,
        timestamp: report.createdAt,
      },
    })
  } catch (err) {
    console.error('Failed to get GTM audit report:', err)
    return Response.json({ error: 'Failed to get report' }, { status: 500 })
  }
}

// DELETE /api/gtm-audit/reports/[id] — delete a specific GTM audit report
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    const { id: rawId } = await params
    const id = Number(rawId)
    if (!id || isNaN(id)) {
      return Response.json({ error: 'Invalid report ID' }, { status: 400 })
    }

    const report = await payload.findByID({
      collection: 'gtm-audit-reports',
      id,
      depth: 0,
      disableErrors: true,
    })

    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 })
    }

    const reportUserId =
      typeof report.user === 'object' ? (report.user as { id: number }).id : report.user
    if (reportUserId !== user.id && !user.roles?.includes('admin')) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    await payload.delete({
      collection: 'gtm-audit-reports',
      id,
    })

    return Response.json({ message: 'Report deleted' })
  } catch (err) {
    console.error('Failed to delete GTM audit report:', err)
    return Response.json({ error: 'Failed to delete report' }, { status: 500 })
  }
}

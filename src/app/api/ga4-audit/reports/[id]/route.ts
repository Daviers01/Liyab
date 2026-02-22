import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest } from 'next/server'

// GET /api/ga4-audit/reports/[id] — get a specific saved audit report
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayload({ config })

    const token = req.cookies.get('payload-token')?.value
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const report = await payload.findByID({
      collection: 'audit-reports',
      id,
      depth: 0,
    })

    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 })
    }

    // Ensure user owns this report (or is admin)
    const reportUserId = typeof report.user === 'object' ? (report.user as { id: number }).id : report.user
    if (reportUserId !== user.id && !user.roles?.includes('admin')) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    return Response.json({
      report: {
        id: report.id,
        propertyName: report.propertyName,
        propertyId: report.propertyId,
        healthScore: report.healthScore,
        checks: report.checks,
        summary: report.summary,
        createdAt: report.createdAt,
      },
    })
  } catch (err) {
    console.error('Failed to get audit report:', err)
    return Response.json({ error: 'Failed to get report' }, { status: 500 })
  }
}

// DELETE /api/ga4-audit/reports/[id] — delete a specific report
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayload({ config })

    const token = req.cookies.get('payload-token')?.value
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const report = await payload.findByID({
      collection: 'audit-reports',
      id,
      depth: 0,
    })

    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 })
    }

    const reportUserId = typeof report.user === 'object' ? (report.user as { id: number }).id : report.user
    if (reportUserId !== user.id && !user.roles?.includes('admin')) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    await payload.delete({
      collection: 'audit-reports',
      id,
    })

    return Response.json({ message: 'Report deleted' })
  } catch (err) {
    console.error('Failed to delete audit report:', err)
    return Response.json({ error: 'Failed to delete report' }, { status: 500 })
  }
}

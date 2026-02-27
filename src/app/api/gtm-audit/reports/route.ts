import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import type { Where } from 'payload'

// GET /api/gtm-audit/reports — list user's GTM audit reports
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const containerId = searchParams.get('containerId')

    const where: Where = {
      user: { equals: user.id },
    }

    if (containerId) {
      where.containerId = { equals: containerId }
    }

    const reports = await payload.find({
      collection: 'gtm-audit-reports',
      where,
      sort: '-createdAt',
      page,
      limit,
      depth: 0,
    })

    return Response.json({
      reports: reports.docs.map((r) => ({
        id: r.id,
        containerName: r.containerName,
        containerId: r.containerId,
        publicId: r.publicId,
        healthScore: r.healthScore,
        summary: r.summary,
        createdAt: r.createdAt,
      })),
      totalDocs: reports.totalDocs,
      totalPages: reports.totalPages,
      page: reports.page,
    })
  } catch (err) {
    console.error('Failed to list GTM audit reports:', err)
    return Response.json({ error: 'Failed to list reports' }, { status: 500 })
  }
}

// POST /api/gtm-audit/reports — save a GTM audit report
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    const body = await req.json()
    const { report } = body

    if (
      !report ||
      !report.containerName ||
      !report.containerId ||
      !report.checks ||
      !report.summary
    ) {
      return Response.json({ error: 'Invalid report data' }, { status: 400 })
    }

    const saved = await payload.create({
      collection: 'gtm-audit-reports',
      data: {
        user: user.id,
        containerName: report.containerName,
        containerId: report.containerId,
        publicId: report.publicId ?? '',
        healthScore: report.healthScore ?? 0,
        checks: report.checks,
        summary: report.summary,
        martech: report.martech ?? null,
        containerType: report.containerType ?? null,
        tagCount: report.tagCount ?? null,
        triggerCount: report.triggerCount ?? null,
        variableCount: report.variableCount ?? null,
      },
    })

    return Response.json({ id: saved.id, message: 'Report saved' })
  } catch (err) {
    console.error('Failed to save GTM audit report:', err)
    return Response.json({ error: 'Failed to save report' }, { status: 500 })
  }
}

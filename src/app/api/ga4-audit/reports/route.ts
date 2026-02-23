import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import type { Where } from 'payload'

// GET /api/ga4-audit/reports — list user's audit reports
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const propertyId = searchParams.get('propertyId')

    const where: Where = {
      user: { equals: user.id },
    }

    if (propertyId) {
      where.propertyId = { equals: propertyId }
    }

    const reports = await payload.find({
      collection: 'audit-reports',
      where,
      sort: '-createdAt',
      page,
      limit,
      depth: 0,
    })

    return Response.json({
      reports: reports.docs.map((r) => ({
        id: r.id,
        propertyName: r.propertyName,
        propertyId: r.propertyId,
        healthScore: r.healthScore,
        summary: r.summary,
        createdAt: r.createdAt,
      })),
      totalDocs: reports.totalDocs,
      totalPages: reports.totalPages,
      page: reports.page,
    })
  } catch (err) {
    console.error('Failed to list audit reports:', err)
    return Response.json({ error: 'Failed to list reports' }, { status: 500 })
  }
}

// POST /api/ga4-audit/reports — save an audit report
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { user, payload } = auth

    const body = await req.json()
    const { report } = body

    if (!report || !report.propertyName || !report.propertyId || !report.checks || !report.summary) {
      return Response.json({ error: 'Invalid report data' }, { status: 400 })
    }

    const saved = await payload.create({
      collection: 'audit-reports',
      data: {
        user: user.id,
        propertyName: report.propertyName,
        propertyId: report.propertyId,
        healthScore: report.healthScore ?? 0,
        checks: report.checks,
        summary: report.summary,
      },
    })

    return Response.json({
      id: saved.id,
      message: 'Report saved',
    })
  } catch (err) {
    console.error('Failed to save audit report:', err)
    return Response.json({ error: 'Failed to save report' }, { status: 500 })
  }
}

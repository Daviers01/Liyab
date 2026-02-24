'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { AnalyticsSnapshot } from '@/types/audit'

// ─── Color palette ──────────────────────────────────────────────────────────

const DEVICE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6366f1']
const SOURCE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899']
const CHART_ORANGE = '#f97316'
const CHART_BLUE = '#3b82f6'
const CHART_RED = '#ef4444'

// ─── Shared tooltip style ───────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.75rem',
    fontSize: '11px',
    padding: '8px 12px',
    color: 'hsl(var(--foreground))',
  },
  itemStyle: { color: 'hsl(var(--foreground))' },
  labelStyle: { color: 'hsl(var(--muted-foreground))', fontWeight: 600, marginBottom: 4 },
}

// ─── 1. Traffic Source Effectiveness ────────────────────────────────────────

export function TrafficSourceChart({ data }: { data: AnalyticsSnapshot['topSources'] }) {
  const chartData = useMemo(
    () =>
      data.slice(0, 8).map((s) => ({
        name: `${s.source} / ${s.medium}`.length > 25
          ? `${s.source} / ${s.medium}`.substring(0, 22) + '…'
          : `${s.source} / ${s.medium}`,
        fullName: `${s.source} / ${s.medium}`,
        sessions: s.sessions,
      })),
    [data],
  )

  if (chartData.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card/80 p-4">
      <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
          <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-3.5 4a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM8.25 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018.25 9zM6 12.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
        </svg>
        Traffic Sources (Last 30 Days)
      </h4>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
            <Tooltip
              {...tooltipStyle}
              formatter={(value) => [Number(value).toLocaleString(), 'Sessions']}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
            />
            <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── 2. Device Distribution ─────────────────────────────────────────────────

const RADIAN = Math.PI / 180
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPieLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props as {
    cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function DeviceDistributionChart({ data }: { data: AnalyticsSnapshot['deviceBreakdown'] }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.category.charAt(0).toUpperCase() + d.category.slice(1),
        value: d.sessions,
        percentage: d.percentage,
      })),
    [data],
  )

  if (chartData.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card/80 p-4">
      <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-purple-500">
          <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" clipRule="evenodd" />
        </svg>
        Device Distribution
      </h4>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={35}
              paddingAngle={2}
              label={renderPieLabel}
              labelLine={false}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => [`${Number(value).toLocaleString()} sessions`, name]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string, entry) => {
                const item = chartData.find((d) => d.name === value)
                return (
                  <span style={{ fontSize: 11, color: 'hsl(var(--foreground))' }}>
                    {value} ({item?.percentage || 0}%)
                  </span>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── 3. Landing Page Performance ────────────────────────────────────────────

export function LandingPageChart({ data }: { data: AnalyticsSnapshot['topLandingPages'] }) {
  const chartData = useMemo(
    () =>
      data
        .filter((p) => p.page !== '(not set)')
        .slice(0, 8)
        .map((p) => ({
          name: p.page.length > 30 ? p.page.substring(0, 27) + '…' : p.page,
          fullName: p.page,
          sessions: p.sessions,
          bounceRate: Math.round(p.bounceRate * 10) / 10,
        })),
    [data],
  )

  if (chartData.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card/80 p-4">
      <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-blue-500">
          <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm3.44-1.06a.75.75 0 10-1.06 1.06L12.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" clipRule="evenodd" />
        </svg>
        Top Landing Pages
      </h4>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
            <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 10 }} />
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => {
                if (name === 'bounceRate') return [`${Number(value)}%`, 'Bounce Rate']
                return [Number(value).toLocaleString(), 'Sessions']
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
            />
            <Bar dataKey="sessions" fill={CHART_BLUE} radius={[0, 4, 4, 0]} fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Bounce rate table below chart */}
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-[10px] text-muted-foreground font-semibold mb-1.5 uppercase tracking-wider">Bounce Rates</p>
        <div className="space-y-1">
          {chartData.slice(0, 5).map((p) => (
            <div key={p.fullName} className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground truncate mr-3 max-w-[200px]">{p.fullName}</span>
              <span className={`font-semibold tabular-nums ${p.bounceRate > 70 ? 'text-red-500' : p.bounceRate > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {p.bounceRate}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 4. Key Event Performance ───────────────────────────────────────────────

export function KeyEventChart({ data }: { data: AnalyticsSnapshot['keyEventCounts'] }) {
  const chartData = useMemo(
    () =>
      data.slice(0, 10).map((e) => ({
        name: e.eventName.length > 22 ? e.eventName.substring(0, 19) + '…' : e.eventName,
        fullName: e.eventName,
        count: e.count,
      })),
    [data],
  )

  if (chartData.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card/80 p-4">
      <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        Key Event Performance (Last 30 Days)
      </h4>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 0, right: 16, top: 4, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-35} textAnchor="end" height={60} interval={0} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
            <Tooltip
              {...tooltipStyle}
              formatter={(value) => [Number(value).toLocaleString(), 'Key Events']}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
            />
            <Bar dataKey="count" fill={CHART_ORANGE} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── 5. (not set) Quality Indicator ─────────────────────────────────────────

export function NotSetIndicator({
  notSetCounts,
  totalSessions,
}: {
  notSetCounts: AnalyticsSnapshot['notSetCounts']
  totalSessions: number
}) {
  const total = totalSessions || 1
  const dimensions = [
    {
      label: 'Source',
      count: notSetCounts.source,
      pct: Math.round((notSetCounts.source / total) * 100),
      fix: 'Add utm_source parameter to all campaign URLs. Use a UTM builder tool. Direct/organic traffic will naturally show (not set).',
    },
    {
      label: 'Medium',
      count: notSetCounts.medium,
      pct: Math.round((notSetCounts.medium / total) * 100),
      fix: 'Add utm_medium parameter (e.g., cpc, email, social, referral) to campaign URLs. Ensure consistent lowercase naming.',
    },
    {
      label: 'Campaign',
      count: notSetCounts.campaign,
      pct: Math.round((notSetCounts.campaign / total) * 100),
      fix: 'Add utm_campaign parameter to campaign URLs. Organic/direct sessions will not have campaigns — this is expected.',
    },
    {
      label: 'Landing Page',
      count: notSetCounts.landingPage,
      pct: Math.round((notSetCounts.landingPage / total) * 100),
      fix: 'Usually caused by sessions that only have events (no page_view). Check your gtag config for send_page_view: true, or ensure page_view fires before other events.',
    },
  ]

  const hasIssues = dimensions.some((d) => d.pct > 5)

  return (
    <div className="rounded-xl border border-border bg-card/80 p-4">
      <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
        <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 ${hasIssues ? 'text-amber-500' : 'text-emerald-500'}`}>
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        Data Quality: (not set) Values
      </h4>
      <p className="text-[11px] text-muted-foreground mb-3">
        {hasIssues
          ? 'Some dimensions have significant (not set) values. This impacts your ability to analyze traffic accurately.'
          : 'Data quality looks healthy — minimal (not set) values across key dimensions.'}
      </p>
      <div className="space-y-2.5">
        {dimensions.map((d) => {
          const severity = d.pct > 15 ? 'high' : d.pct > 5 ? 'med' : 'low'
          const barColor = severity === 'high' ? 'bg-red-500' : severity === 'med' ? 'bg-amber-500' : 'bg-emerald-500'
          const textColor = severity === 'high' ? 'text-red-500' : severity === 'med' ? 'text-amber-500' : 'text-emerald-500'

          return (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-foreground">{d.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{d.count.toLocaleString()} sessions</span>
                  <span className={`text-[11px] font-bold tabular-nums ${textColor}`}>{d.pct}%</span>
                </div>
              </div>
              {/* Progress bar: the bar shows (not set) percentage */}
              <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(d.pct, 100)}%` }} />
              </div>
              {/* Show fix suggestion if > 5% */}
              {d.pct > 5 && (
                <p className="text-[10px] text-muted-foreground mt-1 pl-2 border-l-2 border-amber-500/30">
                  <span className="font-semibold">Fix:</span> {d.fix}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

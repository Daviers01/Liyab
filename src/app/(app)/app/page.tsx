import Link from 'next/link'

// ─── Tool definitions ────────────────────────────────────────────────────────

interface Tool {
  slug: string
  name: string
  description: string
  category: string
  status: 'free' | 'pro' | 'coming-soon'
  href: string
  icon: React.ReactNode
  highlights: string[]
}

const tools: Tool[] = [
  {
    slug: 'ga4-audit',
    name: 'GA4 Audit',
    description:
      'Run a free automated GA4 audit in under 2 minutes. Identify tracking gaps, misconfigured events, and data quality issues.',
    category: 'Analytics',
    status: 'free',
    href: '/app/tools/ga4-audit',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
      </svg>
    ),
    highlights: ['18+ automated checks', 'Health score', 'Actionable fixes'],
  },
]

// ─── Stat cards ──────────────────────────────────────────────────────────────

const stats = [
  { label: 'Available Tools', value: '1', icon: '🛠️' },
  { label: 'Free Tools', value: '1', icon: '✅' },
  { label: 'Categories', value: '1', icon: '📂' },
  { label: 'Coming Soon', value: '0', icon: '🚀' },
]

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Tool['status'] }) {
  if (status === 'free')
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
        Free
      </span>
    )
  if (status === 'pro')
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
        Pro
      </span>
    )
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted/50 border border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
      Coming Soon
    </span>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AppDashboard() {
  return (
    <div className="relative">
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="px-6 md:px-8 py-6 md:py-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mb-1.5">
            Dashboard
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Welcome to Liyab Tools
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
            Free analytics and marketing tools built for data-driven teams.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-6 md:px-8 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{stat.icon}</span>
                <span className="text-[11px] text-muted-foreground font-medium">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="px-6 md:px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">All Tools</h2>
          <span className="text-xs text-muted-foreground">
            {tools.length} tool{tools.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="group relative flex flex-col p-5 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
            >
              {/* Category + Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {tool.category}
                </span>
                <StatusBadge status={tool.status} />
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3 text-orange-500 group-hover:bg-orange-500/15 transition-colors">
                {tool.icon}
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1.5">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1">
                {tool.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/50 border border-border text-[11px] text-muted-foreground"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 group-hover:gap-2.5 transition-all">
                Launch Tool
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path
                    fillRule="evenodd"
                    d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          ))}

          {/* More coming placeholder */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-border/60 bg-card/30 min-h-[260px]">
            <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border flex items-center justify-center mb-3 text-muted-foreground">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-muted-foreground mb-0.5">More Tools Coming</p>
            <p className="text-xs text-muted-foreground/70 text-center max-w-[180px]">
              New analytics and marketing tools are being built.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

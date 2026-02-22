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
  {
    label: 'Available Tools',
    value: '1',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
        <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Free Tools',
    value: '1',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    value: '1',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-500">
        <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
        <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.942V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" />
      </svg>
    ),
  },
  {
    label: 'Coming Soon',
    value: '0',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500">
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
      </svg>
    ),
  },
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
                <span>{stat.icon}</span>
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

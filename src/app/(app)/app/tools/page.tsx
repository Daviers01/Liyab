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
  checks: string
  time: string
}

const tools: Tool[] = [
  {
    slug: 'ga4-audit',
    name: 'GA4 Audit',
    description:
      'Identify tracking gaps, misconfigured events, and data quality issues in your GA4 setup with 18+ automated checks.',
    category: 'Analytics',
    status: 'free',
    href: '/app/tools/ga4-audit',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
      </svg>
    ),
    checks: '18+ checks',
    time: '< 2 min',
  },
  {
    slug: 'gtm-audit',
    name: 'GTM Audit',
    description:
      '50+ automated checks across tags, triggers, variables, consent mode, naming conventions, ecommerce tracking, security risks, and your full MarTech stack.',
    category: 'Tag Management',
    status: 'free',
    href: '/app/tools/gtm-audit',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v11.5A2.25 2.25 0 0115.75 18H4.25A2.25 2.25 0 012 15.75V4.25zm2.25-.75a.75.75 0 00-.75.75v.758l9.25 7.948 4.25-3.653v-5.053a.75.75 0 00-.75-.75H4.25z" />
      </svg>
    ),
    checks: '50+ checks',
    time: '< 1 min',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  return (
    <div className="relative">
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="px-6 md:px-8 py-6 md:py-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">All Tools</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Browse all available analytics and marketing tools.
          </p>
        </div>
      </div>

      {/* Tools list */}
      <div className="px-6 md:px-8 py-6">
        <div className="space-y-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:bg-orange-500/15 transition-colors shrink-0">
                {tool.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {tool.name}
                  </h3>
                  {tool.status === 'free' && (
                    <span className="inline-flex px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-1">
                  {tool.checks}
                </span>
                <span className="text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-1">
                  {tool.time}
                </span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 transition-colors"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

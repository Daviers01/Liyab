import { useState } from 'react'
import type { GTMAccountOption, ContainerOption } from '../types'

interface SelectContainerViewProps {
  accounts: GTMAccountOption[]
  onRunAudit: (container: ContainerOption) => void
  onReset: () => void
}

const CONTAINER_TYPE_STYLES: Record<string, string> = {
  web: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
  server: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
  amp: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
  android: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  ios: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
}

export function SelectContainerView({ accounts, onRunAudit, onReset }: SelectContainerViewProps) {
  const [search, setSearch] = useState('')

  const totalContainers = accounts.reduce((sum, a) => sum + a.containers.length, 0)

  const filtered = accounts
    .map((acc) => ({
      ...acc,
      containers: acc.containers.filter((c) => {
        const q = search.toLowerCase()
        return (
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.publicId.toLowerCase().includes(q) ||
          acc.accountName.toLowerCase().includes(q)
        )
      }),
    }))
    .filter((acc) => acc.containers.length > 0)

  return (
    <div className="px-6 md:px-8 py-8 max-w-4xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Select a Container</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {totalContainers} container{totalContainers === 1 ? '' : 's'} found across{' '}
            {accounts.length} account{accounts.length === 1 ? '' : 's'}.
          </p>
        </div>
        {totalContainers > 4 && (
          <div className="relative w-full sm:w-56">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter containers..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-colors"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {filtered.map((account) => (
          <div key={account.accountId} className="space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold pl-1">
              {account.accountName}
            </p>
            {account.containers.map((container) => (
              <button
                key={container.containerId}
                onClick={() => onRunAudit(container)}
                className="w-full text-left p-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/40 hover:bg-orange-500/[0.03] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-orange-500"
                      >
                        <path d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v11.5A2.25 2.25 0 0115.75 18H4.25A2.25 2.25 0 012 15.75V4.25zm2.25-.75a.75.75 0 00-.75.75v.758l9.25 7.948 4.25-3.653v-5.053a.75.75 0 00-.75-.75H4.25z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                          {container.name}
                        </p>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wide ${CONTAINER_TYPE_STYLES[container.usageContext?.[0]?.toLowerCase() ?? 'web'] ?? CONTAINER_TYPE_STYLES.web}`}
                        >
                          {container.usageContext?.[0] || 'web'}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-mono truncate">
                        {container.publicId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-orange-500 transition-colors shrink-0">
                    <span className="hidden sm:block">Audit</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path
                        fillRule="evenodd"
                        d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
        {search && filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No containers match &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        &larr; Start over
      </button>
    </div>
  )
}

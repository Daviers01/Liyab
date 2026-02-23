import type { GA4Property } from '../types'

interface SelectPropertyViewProps {
  properties: GA4Property[]
  propertySearch: string
  onPropertySearchChange: (value: string) => void
  onRunAudit: (property: GA4Property) => void
  onReset: () => void
}

export function SelectPropertyView({
  properties,
  propertySearch,
  onPropertySearchChange,
  onRunAudit,
  onReset,
}: SelectPropertyViewProps) {
  const filtered = properties.filter(
    (p) =>
      !propertySearch ||
      p.displayName.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.propertyId.toLowerCase().includes(propertySearch.toLowerCase()),
  )

  return (
    <div className="px-6 md:px-8 py-8 max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Select a GA4 Property</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found on your
            account.
          </p>
        </div>
        {properties.length > 4 && (
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
              value={propertySearch}
              onChange={(e) => onPropertySearchChange(e.target.value)}
              placeholder="Filter properties..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-colors"
            />
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {filtered.map((prop) => (
          <button
            key={prop.name}
            onClick={() => onRunAudit(prop)}
            className="w-full text-left p-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/40 hover:bg-orange-500/[0.03] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
                    <path
                      fillRule="evenodd"
                      d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                    {prop.displayName}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-mono truncate">
                    {prop.propertyId.replace('properties/', '')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-orange-500 transition-colors shrink-0">
                <span className="hidden sm:block">Run Audit</span>
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
        {propertySearch && filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No properties match &ldquo;{propertySearch}&rdquo;
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

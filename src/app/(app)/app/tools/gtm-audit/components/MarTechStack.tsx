import type { MarTechItem } from '@/types/gtm-audit'
import { MARTECH_CATEGORY_LABELS } from '@/lib/gtm-data'
import type { MarTechCategory } from '@/types/gtm-audit'

interface MarTechStackProps {
  items: MarTechItem[]
}

const CATEGORY_COLORS: Record<MarTechCategory, string> = {
  analytics: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
  advertising: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
  consent: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  heatmap: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
  chat: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
  social: 'bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400',
  video: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
  'ab-testing': 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  'error-tracking': 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
  security: 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400',
  'customer-data': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
  other: 'bg-muted/40 border-border text-muted-foreground',
}

export function MarTechStack({ items }: MarTechStackProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 text-center">
        <p className="text-sm text-muted-foreground">No common MarTech vendors auto-detected.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Custom HTML tags may contain undetected tools.
        </p>
      </div>
    )
  }

  // Group by category
  const grouped = items.reduce(
    (acc, item) => {
      const cat = item.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<string, MarTechItem[]>,
  )

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Detected MarTech Stack</h3>
        <span className="text-xs text-muted-foreground">
          {items.length} vendor{items.length > 1 ? 's' : ''} detected
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([category, vendors]) => (
          <div key={category}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
              {MARTECH_CATEGORY_LABELS[category as MarTechCategory] || category}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vendors.map((vendor) => (
                <span
                  key={vendor.tagType}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${CATEGORY_COLORS[vendor.category]}`}
                >
                  {vendor.name}
                  {vendor.count > 1 && <span className="opacity-60">×{vendor.count}</span>}
                  {vendor.notes?.toLowerCase().startsWith('deprecated') && (
                    <span className="text-[9px] bg-red-500/20 text-red-500 rounded px-1 py-0.5 font-semibold">
                      DEPRECATED
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import type { AuditSummary } from '@/types/audit'

interface SummaryCardsProps {
  summary: AuditSummary
  tagCount: number
  triggerCount: number
  variableCount: number
  publicId: string
}

export function SummaryCards({
  summary,
  tagCount,
  triggerCount,
  variableCount,
  publicId,
}: SummaryCardsProps) {
  const cards = [
    {
      label: 'Failed',
      value: summary.failures,
      color: 'text-red-500',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    {
      label: 'Warnings',
      value: summary.warnings,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Passed',
      value: summary.passed,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Info',
      value: summary.info,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border p-3 text-center ${card.bg}`}>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{card.label}</p>
        </div>
      ))}
      <div className="rounded-xl border border-border bg-card/60 p-3 text-center">
        <p className="text-2xl font-bold text-foreground">{tagCount}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Tags</p>
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-3 text-center">
        <p className="text-2xl font-bold text-foreground">{triggerCount}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Triggers</p>
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-3 text-center">
        <p className="text-2xl font-bold text-foreground">{variableCount}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Variables</p>
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-3 text-center">
        <p className="text-lg font-bold text-orange-500 truncate">{publicId || '—'}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Container ID</p>
      </div>
    </div>
  )
}

import type { AuditSummary } from '@/types/audit'

const cards = [
  { key: 'passed', label: 'Passed', color: 'emerald' },
  { key: 'warnings', label: 'Warnings', color: 'amber' },
  { key: 'failures', label: 'Failed', color: 'red' },
  { key: 'info', label: 'Info', color: 'blue' },
] as const

export function SummaryCards({ summary }: { summary: AuditSummary }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(({ key, label, color }) => (
        <div
          key={key}
          className={`rounded-xl border border-${color}-500/20 bg-${color}-500/5 p-3.5 text-center`}
        >
          <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
            {summary[key]}
          </p>
          <p
            className={`text-[11px] text-${color}-600/70 dark:text-${color}-400/70 font-medium mt-0.5`}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}

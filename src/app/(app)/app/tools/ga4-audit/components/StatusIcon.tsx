import type { AuditCheckResult } from '@/types/audit'

export function StatusIcon({ status }: { status: AuditCheckResult['status'] }) {
  const config = {
    pass: {
      bg: 'bg-emerald-500/15 border-emerald-500/25',
      text: 'text-emerald-500',
      path: 'M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z',
    },
    warn: {
      bg: 'bg-amber-500/15 border-amber-500/25',
      text: 'text-amber-500',
      path: 'M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z',
    },
    fail: {
      bg: 'bg-red-500/15 border-red-500/25',
      text: 'text-red-500',
      path: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z',
    },
    info: {
      bg: 'bg-blue-500/15 border-blue-500/25',
      text: 'text-blue-500',
      path: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z',
    },
  } as const

  const { bg, text, path } = config[status]

  return (
    <div className={`w-5 h-5 rounded-full ${bg} border flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 ${text}`}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
      </svg>
    </div>
  )
}

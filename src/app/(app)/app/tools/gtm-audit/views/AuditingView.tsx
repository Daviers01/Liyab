import { AuditingView as SharedAuditingView } from '../../shared/views/AuditingView'

interface AuditingViewProps {
  containerName: string
  auditPhase: number
}

export function AuditingView({ containerName, auditPhase }: AuditingViewProps) {
  return <SharedAuditingView service="gtm" name={containerName} auditPhase={auditPhase} />
}

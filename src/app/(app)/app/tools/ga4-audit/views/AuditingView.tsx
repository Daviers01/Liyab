import { AuditingView as SharedAuditingView } from '../../shared/views/AuditingView'

interface AuditingViewProps {
  propertyName: string
  auditPhase: number
}

export function AuditingView({ propertyName, auditPhase }: AuditingViewProps) {
  return <SharedAuditingView service="ga4" name={propertyName} auditPhase={auditPhase} />
}

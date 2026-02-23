export type AuditStatus = 'ready' | 'connecting' | 'selecting' | 'auditing' | 'done' | 'error'

export type ConnectPhase = 'checking' | 'popup' | 'exchanging'

export interface GA4Property {
  name: string
  displayName: string
  propertyId: string
}

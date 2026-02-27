// ─── GTM Audit UI State Types ─────────────────────────────────────────────────

export type GTMAuditStatus = 'ready' | 'connecting' | 'selecting' | 'auditing' | 'done' | 'error'

export type ConnectPhase = 'checking' | 'popup' | 'exchanging'

export interface GTMAccountOption {
  accountId: string
  accountName: string
  containers: ContainerOption[]
}

export interface ContainerOption {
  accountId: string
  accountName: string
  containerId: string
  name: string
  publicId: string
  usageContext: string[]
  path: string
}

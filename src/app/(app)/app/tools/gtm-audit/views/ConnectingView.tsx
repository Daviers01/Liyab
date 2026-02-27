import { ConnectingView as SharedConnectingView } from '../../shared/views/ConnectingView'
import type { ConnectPhase } from '../types'

interface ConnectingViewProps {
  connectPhase: ConnectPhase
  onCancel: () => void
}

export function ConnectingView({ connectPhase, onCancel }: ConnectingViewProps) {
  return <SharedConnectingView service="gtm" connectPhase={connectPhase} onCancel={onCancel} />
}

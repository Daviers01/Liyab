import { ErrorView as SharedErrorView } from '../../shared/views/ErrorView'

interface ErrorViewProps {
  error: string
  onReset: () => void
}

export function ErrorView({ error, onReset }: ErrorViewProps) {
  return <SharedErrorView service="gtm" error={error} onReset={onReset} />
}

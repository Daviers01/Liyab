interface ErrorViewProps {
  error: string
  onReset: () => void
}

export function ErrorView({ error, onReset }: ErrorViewProps) {
  return (
    <div className="px-6 md:px-8 py-16 max-w-lg mx-auto text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-red-500">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Something Went Wrong</h2>
        <p className="text-sm text-muted-foreground mt-1.5">{error}</p>
      </div>
      <div className="rounded-xl border border-border bg-card/80 p-4 text-left space-y-2">
        <p className="text-xs font-semibold text-foreground">Troubleshooting tips:</p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
          <li>Make sure you have at least Viewer access to a GA4 property</li>
          <li>Try connecting with a different Google account</li>
          <li>Check that popups are not blocked for this site</li>
          <li>If the issue persists, try refreshing the page</li>
        </ul>
      </div>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
      >
        Try Again
      </button>
    </div>
  )
}

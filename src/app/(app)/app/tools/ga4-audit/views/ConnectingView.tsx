import { FireLoader } from '@/app/(app)/components/FireLoader'
import type { ConnectPhase } from '../types'

interface ConnectingViewProps {
  connectPhase: ConnectPhase
  onCancel: () => void
}

export function ConnectingView({ connectPhase, onCancel }: ConnectingViewProps) {
  return (
    <div className="px-6 md:px-8 py-16 max-w-lg mx-auto text-center space-y-6">
      <FireLoader size={80} label="" />

      {connectPhase === 'checking' && (
        <div>
          <h2 className="text-lg font-bold text-foreground">Checking access...</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
            Looking for an existing Google connection on your account.
          </p>
        </div>
      )}

      {connectPhase === 'popup' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">Connect your Google account</h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              A pop-up window has opened. Sign in with Google and grant read-only analytics access
              to continue.
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left space-y-2">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              Pop-up not showing?
            </p>
            <ul className="text-[11px] text-amber-600/80 dark:text-amber-400/70 space-y-1 list-disc pl-4 leading-relaxed">
              <li>Check for a blocked-popup icon in your address bar</li>
              <li>Allow pop-ups for this site, then click below to retry</li>
            </ul>
          </div>
        </div>
      )}

      {connectPhase === 'exchanging' && (
        <div>
          <h2 className="text-lg font-bold text-foreground">Fetching your properties...</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
            Connected! Loading your GA4 properties now.
          </p>
        </div>
      )}

      <button
        onClick={onCancel}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        Cancel
      </button>
    </div>
  )
}

'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Image from 'next/image'
import { AppShell } from './AppShell'
import { FireLoader } from './FireLoader'

// ─── Auth context ────────────────────────────────────────────────────────────

interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
}

const AuthContext = createContext<AuthContextType>({ user: null })
export const useAppAuth = () => useContext(AuthContext)

// ─── Wrapper ─────────────────────────────────────────────────────────────────

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        const data = await res.json()
        if (data?.user) {
          setUser(data.user)
        }
      } catch {
        // not authenticated
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <FireLoader size={90} label="Loading..." />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return <AuthScreen />
  }

  // Authenticated — render shell
  return (
    <AuthContext.Provider value={{ user }}>
      <AppShell user={user}>{children}</AppShell>
    </AuthContext.Provider>
  )
}

// ─── Google Icon ─────────────────────────────────────────────────────────────

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ─── Auth Screen (Login + Register + Google) ─────────────────────────────────

function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // ── Credential login ──────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data?.user) {
        window.location.reload()
      } else {
        setError(data?.errors?.[0]?.message || 'Invalid email or password.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Credential register ───────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // Create user
      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name: name || email.split('@')[0] }),
      })
      const createData = await createRes.json()

      if (createData?.errors) {
        const msg =
          createData.errors?.[0]?.data?.[0]?.message ||
          createData.errors?.[0]?.message ||
          'Registration failed. The email may already be in use.'
        setError(msg)
        setSubmitting(false)
        return
      }

      // Auto-login after registration
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const loginData = await loginRes.json()

      if (loginData?.user) {
        window.location.reload()
      } else {
        // Account created but couldn't auto-login — switch to login tab
        setMode('login')
        setError('Account created! Please sign in.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Google login ──────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/google/url')
      const data = await res.json()

      if (data.url) {
        const popup = window.open(data.url, 'google-auth', 'width=500,height=700')

        const handler = async (e: MessageEvent) => {
          if (e.data?.type === 'google-auth-callback' && e.data.code) {
            window.removeEventListener('message', handler)
            popup?.close()

            // Exchange code for Payload session
            const tokenRes = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ code: e.data.code }),
            })
            const tokenData = await tokenRes.json()

            if (tokenData.user) {
              window.location.reload()
            } else {
              setError(tokenData.error || 'Google sign-in failed. Please try again.')
              setGoogleLoading(false)
            }
          }
        }

        window.addEventListener('message', handler)

        // Timeout: if popup closed without completing
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            setGoogleLoading(false)
          }
        }, 1000)
      }
    } catch {
      setError('Failed to connect to Google. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-500/8 to-amber-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-amber-500/5 to-yellow-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-3">
          <Image
            src="/logo-liyab-icon.png"
            alt="Liyab"
            width={48}
            height={48}
            className="w-12 h-12 mx-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">Liyab Tools</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === 'login'
                ? 'Sign in to access your analytics toolkit'
                : 'Create an account to get started'}
            </p>
          </div>
        </div>

        {/* Google sign-in */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card/80 backdrop-blur-sm hover:border-orange-500/30 hover:bg-card text-foreground font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.2"
                />
                <path
                  d="M12 2a10 10 0 019.95 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Connecting to Google...
            </>
          ) : (
            <>
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl border border-border bg-muted/30 p-0.5">
          <button
            onClick={() => {
              setMode('login')
              setError('')
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-[10px] transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register')
              setError('')
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-[10px] transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={mode === 'register' ? 8 : undefined}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-colors"
              />
              {mode === 'register' && (
                <p className="text-[11px] text-muted-foreground">Minimum 8 characters</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm cursor-pointer"
            >
              {submitting
                ? mode === 'login'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Google benefit note for register */}
        {mode === 'register' && (
          <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3.5 flex items-start gap-2.5">
            <GoogleIcon className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Tip:</span> Sign up with Google to
              instantly connect your GA4 properties without additional login steps.
            </p>
          </div>
        )}

        {/* Back link */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to Liyab Digital
          </a>
        </div>
      </div>
    </div>
  )
}

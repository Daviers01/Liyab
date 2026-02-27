'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SubscriptionSection } from './SubscriptionSection'

// ─── Toast ────────────────────────────────────────────────────────────────────

type Toast = { id: number; type: 'success' | 'error'; text: string }

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)
  const show = useCallback((type: 'success' | 'error', text: string) => {
    const id = ++counterRef.current
    setToasts((t) => [...t, { id, type, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])
  return { toasts, show }
}

// ─── Password input with per-field show/hide ──────────────────────────────────

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
        tabIndex={-1}
      >
        {show ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            <path
              fillRule="evenodd"
              d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
              clipRule="evenodd"
            />
            <path d="M10.748 13.93l2.523 2.523a10.004 10.004 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
          </svg>
        )}
      </button>
    </div>
  )
}

// ─── Password strength ────────────────────────────────────────────────────────

function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' }
  return { score, label: 'Strong', color: 'bg-emerald-500' }
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-5 md:p-6 border-b border-border flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface ProfileData {
  id: string
  name: string
  email: string
  organizationName: string
  jobTitle: string
  authProvider: 'credentials' | 'google'
  avatarUrl: string | null
  deactivated: boolean
  createdAt: string
  subscriptionStatus: 'free' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused'
  subscriptionPlan: 'free' | 'pro_monthly'
  subscriptionCurrentPeriodEnd: string | null
  auditCount: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toasts, show: showToast } = useToast()

  // Profile form
  const [name, setName] = useState('')
  const [orgName, setOrgName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Danger zone
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const [confirmDeleteAudits, setConfirmDeleteAudits] = useState(false)

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setName(data.name)
        setOrgName(data.organizationName)
        setJobTitle(data.jobTitle)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const profileDirty =
    profile &&
    (name !== profile.name || orgName !== profile.organizationName || jobTitle !== profile.jobTitle)

  const handleProfileSave = async () => {
    setProfileSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update-profile',
          name,
          organizationName: orgName,
          jobTitle,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('success', 'Profile updated successfully.')
        fetchProfile()
      } else {
        showToast('error', data.error || 'Failed to update profile.')
      }
    } catch {
      showToast('error', 'Something went wrong.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSave = async () => {
    if (newPassword.length < 8) {
      showToast('error', 'Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match.')
      return
    }
    setPasswordSaving(true)
    try {
      const body: Record<string, string> = { action: 'set-password', newPassword }
      if (profile?.authProvider === 'credentials') body.currentPassword = currentPassword
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('success', 'Password updated successfully.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        fetchProfile()
      } else {
        showToast('error', data.error || 'Failed to update password.')
      }
    } catch {
      showToast('error', 'Something went wrong.')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleDeactivate = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'deactivate' }),
      })
      if (res.ok) {
        await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
        window.location.href = '/app'
      } else {
        showToast('error', 'Failed to deactivate account.')
      }
    } catch {
      showToast('error', 'Something went wrong.')
    }
  }

  const handleDeleteAudits = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'delete-audits' }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('success', data.message || 'Audit data deletion requested.')
        setConfirmDeleteAudits(false)
      } else {
        showToast('error', data.error || 'Failed to request audit deletion.')
      }
    } catch {
      showToast('error', 'Something went wrong.')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/app'
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full flex flex-col animate-pulse">
        <div className="border-b border-border bg-card/30 px-6 md:px-8 py-5">
          <div className="h-5 w-36 bg-muted rounded-lg" />
          <div className="h-3 w-56 bg-muted/60 rounded mt-2" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 md:px-8 py-6 max-w-3xl mx-auto space-y-5">
            <div className="rounded-2xl border border-border bg-card/80 h-48" />
            <div className="rounded-2xl border border-border bg-card/80 h-64" />
            <div className="rounded-2xl border border-border bg-card/80 h-52" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="px-6 md:px-8 py-12 text-center">
        <p className="text-sm text-muted-foreground">Failed to load profile.</p>
      </div>
    )
  }

  const isGoogleOnly = profile.authProvider === 'google'
  const isPro = profile.subscriptionStatus === 'active' || profile.subscriptionStatus === 'trialing'
  const initials = (profile.name || profile.email).slice(0, 2).toUpperCase()
  const pwStrength = passwordStrength(newPassword)

  return (
    <div className="h-full flex flex-col relative">
      {/* ── Toast stack ──────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium backdrop-blur-sm ${
              t.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'
            }`}
          >
            {t.type === 'success' ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {t.text}
          </div>
        ))}
      </div>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card/30 px-6 md:px-8 py-5">
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-muted/60 border border-border flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-foreground/70">
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          </div>
          Profile Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your account details and preferences
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 md:px-8 py-6 max-w-3xl mx-auto space-y-5">
          {/* ── Usage ─────────────────────────────────────────────────── */}
          {(() => {
            const auditLimit = isPro ? null : 5 // null = unlimited
            const auditUsed = profile.auditCount
            const pct = auditLimit ? Math.min((auditUsed / auditLimit) * 100, 100) : 0
            const isFull = auditLimit !== null && auditUsed >= auditLimit
            const barColor = isFull ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-orange-500'
            return (
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="px-5 md:px-6 py-4 flex items-center justify-between gap-4 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-muted/60 border border-border flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-foreground/70"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-foreground">Usage</span>
                  </div>
                  {!isPro && (
                    <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      Upgrade for unlimited
                    </span>
                  )}
                </div>
                <div className="px-5 md:px-6 py-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3.5 h-3.5 text-muted-foreground shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium text-foreground">GA4 Audits saved</span>
                    </div>
                    <span
                      className={`text-xs font-bold ${isFull ? 'text-red-500' : 'text-foreground'}`}
                    >
                      {auditLimit === null ? (
                        <span>
                          {auditUsed.toLocaleString()}{' '}
                          <span className="text-muted-foreground font-normal">/ unlimited</span>
                        </span>
                      ) : (
                        <span>
                          {auditUsed}{' '}
                          <span className="text-muted-foreground font-normal">/ {auditLimit}</span>
                        </span>
                      )}
                    </span>
                  </div>
                  {auditLimit !== null ? (
                    <>
                      <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {isFull && (
                        <p className="text-[11px] text-red-500 mt-1.5">
                          Limit reached — upgrade to Pro to save more audits.
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-1.5 bg-orange-500/20 rounded-full" />
                  )}
                </div>
              </div>
            )
          })()}

          {/* ── Account overview ───────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            {/* Banner */}
            <div className="h-20 bg-gradient-to-b from-muted/50 to-muted/20" />
            {/* Avatar + name row */}
            <div className="px-5 md:px-6 -mt-8 flex flex-col sm:flex-row sm:items-end gap-4 pb-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shrink-0 border-4 border-card shadow-md">
                {initials}
              </div>
              <div className="flex-1 min-w-0 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-bold text-foreground truncate">
                    {profile.name || 'Unnamed User'}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isPro
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400'
                        : 'bg-muted/50 border-border text-muted-foreground'
                    }`}
                  >
                    {isPro ? '✦ Pro' : 'Free'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-border hover:border-red-500/30 hover:bg-red-500/5 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 font-medium rounded-xl transition-colors cursor-pointer text-xs shrink-0 mb-1"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path
                    fillRule="evenodd"
                    d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign Out
              </button>
            </div>
            {/* Stats strip */}
            <div className="px-5 md:px-6 py-4 mt-2 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-muted/30 border border-border/50 px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Sign-in
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  {isGoogleOnly ? (
                    <>
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-foreground">Google</span>
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 text-muted-foreground shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-foreground">Password</span>
                    </>
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-muted/30 border border-border/50 px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Member since
                </p>
                <p className="text-xs font-semibold text-foreground mt-1">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="rounded-xl bg-muted/30 border border-border/50 px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Plan
                </p>
                <p
                  className={`text-xs font-semibold mt-1 ${isPro ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'}`}
                >
                  {isPro ? 'Pro Monthly' : 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Personal Information ────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <SectionHeader
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
              }
              title="Personal Information"
              description="Update your name, organization, and role"
            />
            <div className="p-5 md:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-muted-foreground text-sm cursor-not-allowed"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Company or team name"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Marketing Manager"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {profileDirty ? (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Unsaved changes
                  </p>
                ) : (
                  <span />
                )}
                <button
                  onClick={handleProfileSave}
                  disabled={profileSaving || !profileDirty}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  {profileSaving ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
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
                      Saving…
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Password ───────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <SectionHeader
              icon={
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              title="Password"
              description={
                isGoogleOnly
                  ? 'Set a password to enable email login alongside Google.'
                  : 'Update your login password'
              }
            />
            <div className="p-5 md:p-6 space-y-4">
              {isGoogleOnly && (
                <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3 flex items-start gap-2.5">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Google sign-up detected. Setting a password lets you log in with email &amp;
                    password in addition to Google.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!isGoogleOnly && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Current Password
                    </label>
                    <PasswordInput
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      placeholder="Enter current password"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    {isGoogleOnly ? 'Set Password' : 'New Password'}
                  </label>
                  <PasswordInput
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Minimum 8 characters"
                  />
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-colors ${
                              i <= pwStrength.score ? pwStrength.color : 'bg-muted/40'
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-[10px] font-medium ${
                          pwStrength.score <= 1
                            ? 'text-red-500'
                            : pwStrength.score <= 3
                              ? 'text-amber-500'
                              : 'text-emerald-500'
                        }`}
                      >
                        {pwStrength.label}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Confirm Password
                  </label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Re-enter password"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1">Passwords do not match.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handlePasswordSave}
                  disabled={passwordSaving || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  {passwordSaving ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
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
                      Saving…
                    </>
                  ) : isGoogleOnly ? (
                    'Set Password'
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Subscription ───────────────────────────────────────────── */}
          <SubscriptionSection
            subscription={{
              subscriptionStatus: profile.subscriptionStatus,
              subscriptionPlan: profile.subscriptionPlan,
              subscriptionCurrentPeriodEnd: profile.subscriptionCurrentPeriodEnd,
            }}
            onCheckoutComplete={fetchProfile}
          />

          {/* ── Danger zone ────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.02] overflow-hidden">
            <div className="p-5 md:p-6 border-b border-red-500/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Irreversible actions — proceed with caution
                </p>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              {/* Delete all audits */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground">Delete All Audits</p>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                      Irreversible
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Permanently remove all audit reports associated with your account.
                  </p>
                </div>
                {!confirmDeleteAudits ? (
                  <button
                    onClick={() => setConfirmDeleteAudits(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 font-medium rounded-xl transition-colors cursor-pointer text-sm shrink-0"
                  >
                    Request Deletion
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleDeleteAudits}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors cursor-pointer text-sm"
                    >
                      Yes, Delete All
                    </button>
                    <button
                      onClick={() => setConfirmDeleteAudits(false)}
                      className="px-4 py-2 border border-border text-foreground font-medium rounded-xl transition-colors cursor-pointer text-sm hover:bg-muted/50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="h-px bg-red-500/10" />

              {/* Deactivate account */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground">Deactivate Account</p>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 uppercase tracking-wide">
                      High Risk
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Disable your account. You will be signed out immediately.
                  </p>
                </div>
                {!confirmDeactivate ? (
                  <button
                    onClick={() => setConfirmDeactivate(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 font-medium rounded-xl transition-colors cursor-pointer text-sm shrink-0"
                  >
                    Deactivate
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleDeactivate}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors cursor-pointer text-sm"
                    >
                      Yes, Deactivate
                    </button>
                    <button
                      onClick={() => setConfirmDeactivate(false)}
                      className="px-4 py-2 border border-border text-foreground font-medium rounded-xl transition-colors cursor-pointer text-sm hover:bg-muted/50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}

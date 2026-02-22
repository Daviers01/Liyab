'use client'

import { useState, useEffect, useCallback } from 'react'

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
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile form
  const [name, setName] = useState('')
  const [orgName, setOrgName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showPasswords, setShowPasswords] = useState(false)

  // Danger zone
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const [confirmDeleteAudits, setConfirmDeleteAudits] = useState(false)
  const [dangerMsg, setDangerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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

  const handleProfileSave = async () => {
    setProfileSaving(true)
    setProfileMsg(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'update-profile', name, organizationName: orgName, jobTitle }),
      })
      const data = await res.json()
      if (res.ok) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully.' })
        fetchProfile()
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile.' })
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSave = async () => {
    setPasswordMsg(null)

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setPasswordSaving(true)
    try {
      const body: Record<string, string> = { action: 'set-password', newPassword }
      if (profile?.authProvider === 'credentials') {
        body.currentPassword = currentPassword
      }
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        fetchProfile()
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Failed to update password.' })
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Something went wrong.' })
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
        // Logout after deactivation
        await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
        window.location.href = '/app'
      } else {
        setDangerMsg({ type: 'error', text: 'Failed to deactivate account.' })
      }
    } catch {
      setDangerMsg({ type: 'error', text: 'Something went wrong.' })
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
        setDangerMsg({ type: 'success', text: data.message || 'Audit data deletion requested.' })
        setConfirmDeleteAudits(false)
      } else {
        setDangerMsg({ type: 'error', text: data.error || 'Failed to request audit deletion.' })
      }
    } catch {
      setDangerMsg({ type: 'error', text: 'Something went wrong.' })
    }
  }

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/app'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-6 h-6 animate-spin text-orange-500" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
          <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
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

  return (
    <div className="h-full flex flex-col">
      {/* Page header */}
      <div className="border-b border-border bg-card/30 px-6 md:px-8 py-5">
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
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
        <div className="px-6 md:px-8 py-6 max-w-3xl mx-auto space-y-6">
          {/* ── Account overview ──────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 md:p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {(profile.name || profile.email).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-foreground truncate">
                  {profile.name || 'Unnamed User'}
                </p>
                <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] font-medium bg-muted/50 border border-border rounded-full px-2 py-0.5 text-muted-foreground">
                    {isGoogleOnly ? (
                      <span className="flex items-center gap-1">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google Account
                      </span>
                    ) : (
                      'Email & Password'
                    )}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal information ─────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">Personal Information</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Update your personal details</p>
            </div>
            <div className="p-5 md:p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-muted-foreground text-sm cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Email cannot be changed after account creation.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Organization</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Company or team name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Job Title / Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Marketing Manager"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
                />
              </div>

              {profileMsg && (
                <p className={`text-xs ${profileMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {profileMsg.text}
                </p>
              )}

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  {profileSaving ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                        <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Password ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">Password</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isGoogleOnly
                  ? 'You signed up with Google. Set a password to also enable email login.'
                  : 'Update your password'}
              </p>
            </div>
            <div className="p-5 md:p-6 space-y-4">
              {isGoogleOnly && (
                <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3 flex items-start gap-2.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-500 shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Google sign-up detected. Setting a password will allow you to log in with your email and password in addition to Google.
                  </p>
                </div>
              )}

              {!isGoogleOnly && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors pr-10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  {isGoogleOnly ? 'Set Password' : 'New Password'}
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Confirm Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  className="rounded border-border accent-orange-500"
                />
                <span className="text-xs text-muted-foreground">Show passwords</span>
              </label>

              {passwordMsg && (
                <p className={`text-xs ${passwordMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {passwordMsg.text}
                </p>
              )}

              <div className="flex justify-end pt-1">
                <button
                  onClick={handlePasswordSave}
                  disabled={passwordSaving || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  {passwordSaving ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                        <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Saving...
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

          {/* ── Session ──────────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">Session</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Sign out of your current session</p>
            </div>
            <div className="p-5 md:p-6">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2 border border-border hover:border-red-500/30 hover:bg-red-500/5 text-foreground hover:text-red-600 dark:hover:text-red-400 font-medium rounded-xl transition-colors cursor-pointer text-sm"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          {/* ── Danger zone ──────────────────────────────────────── */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.02] overflow-hidden">
            <div className="p-5 md:p-6 border-b border-red-500/15">
              <h2 className="text-sm font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Irreversible actions — proceed with caution</p>
            </div>
            <div className="p-5 md:p-6 space-y-5">
              {/* Delete audits */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Delete All Audits</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Request deletion of all audit reports associated with your account.
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
                      Confirm Delete
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Deactivate Account</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Disable your account. You will be logged out immediately.
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

              {dangerMsg && (
                <p className={`text-xs ${dangerMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {dangerMsg.text}
                </p>
              )}
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}

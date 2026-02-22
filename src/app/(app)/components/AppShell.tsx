'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, createContext, useContext } from 'react'

// ─── Sidebar context ─────────────────────────────────────────────────────────

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

// ─── Navigation ──────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/app',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
        <path
          fillRule="evenodd"
          d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    label: 'Tools',
    href: '/app/tools',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
        <path
          fillRule="evenodd"
          d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    children: [
      {
        label: 'GA4 Audit',
        href: '/app/tools/ga4-audit',
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
            <path d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" />
          </svg>
        ),
      },
    ],
  },
]

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function AppShell({ children, user }: { children: React.ReactNode; user: { email: string; name?: string } }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Persist collapsed state
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored === 'true') setCollapsed(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed))
  }, [collapsed])

  // Close mobile sidebar on route change
  const pathname = usePathname()
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex h-screen overflow-hidden">
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:relative z-40
            h-screen
            border-r border-border bg-card/95 backdrop-blur-xl
            transition-all duration-300 ease-in-out
            flex flex-col shrink-0
            ${collapsed ? 'w-[68px]' : 'w-[260px]'}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <SidebarContent
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setMobileOpen={setMobileOpen}
            user={user}
          />
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <TopBar onMenuClick={() => setMobileOpen(true)} user={user} />

          {/* Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

// ─── Sidebar Content ─────────────────────────────────────────────────────────

function SidebarContent({
  collapsed,
  setCollapsed,
  setMobileOpen,
  user,
}: {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  setMobileOpen: (v: boolean) => void
  user: { email: string; name?: string }
}) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['Tools'])

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    )
  }

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`border-b border-border ${collapsed ? 'flex items-center justify-center p-3.5' : 'p-4'}`}>
        <Link
          href="/app"
          className={`block ${collapsed ? '' : 'space-y-2'}`}
          onClick={() => setMobileOpen(false)}
        >
          {collapsed ? (
            <Image
              src="/logo-liyab-icon.png"
              alt="Liyab"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
          ) : (
            <>
              <Image
                src="/logo-liyab.png"
                alt="Liyab"
                width={200}
                height={50}
                className="w-full h-auto object-contain"
              />
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground text-center">Analytics Toolkit</p>
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto space-y-0.5 ${collapsed ? 'p-2' : 'p-3'}`}>
        {navigation.map((item) => {
          const active = isActive(item.href)
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedSections.includes(item.label)

          // Collapsed: icon-only, tooltip on hover
          if (collapsed) {
            return (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={item.label}
                  className={`flex items-center justify-center w-full h-10 rounded-xl transition-colors duration-150 ${
                    active
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className={active ? 'text-orange-500' : ''}>{item.icon}</span>
                </Link>
                {hasChildren &&
                  item.children!.map((child) => {
                    const childActive = isActive(child.href)
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        title={child.label}
                        className={`flex items-center justify-center w-full h-9 rounded-lg mt-0.5 transition-colors duration-150 ${
                          childActive
                            ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <span className={`${childActive ? 'text-orange-500' : ''} scale-[0.85]`}>
                          {child.icon}
                        </span>
                      </Link>
                    )
                  })}
              </div>
            )
          }

          // Expanded: normal
          return (
            <div key={item.label}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleSection(item.label)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 cursor-pointer ${
                      active
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`shrink-0 ${active ? 'text-orange-500' : ''}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                      {item.children!.map((child) => {
                        const childActive = isActive(child.href)
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                              childActive
                                ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10 font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            <span className={childActive ? 'text-orange-500' : ''}>
                              {child.icon}
                            </span>
                            <span className="truncate">{child.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className={`shrink-0 ${active ? 'text-orange-500' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom: collapse toggle + back */}
      <div className={`border-t border-border ${collapsed ? 'p-2' : 'p-3'} space-y-0.5`}>
        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden lg:flex items-center w-full rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150 cursor-pointer ${
            collapsed ? 'justify-center h-10' : 'gap-2.5 px-3 py-2.5'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-[18px] h-[18px] shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
          {!collapsed && <span className="truncate">Collapse</span>}
        </button>

        {/* Back to site */}
        <Link
          href="/"
          className={`flex items-center rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150 ${
            collapsed ? 'justify-center h-10' : 'gap-2.5 px-3 py-2.5'
          }`}
          title="Back to site"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] shrink-0">
            <path
              fillRule="evenodd"
              d="M17 4.25A2.25 2.25 0 0014.75 2h-5.5A2.25 2.25 0 007 4.25v2a.75.75 0 001.5 0v-2a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75h-5.5a.75.75 0 01-.75-.75v-2a.75.75 0 00-1.5 0v2A2.25 2.25 0 009.25 18h5.5A2.25 2.25 0 0017 15.75V4.25z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M14 10a.75.75 0 00-.75-.75H3.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0014 10z"
              clipRule="evenodd"
            />
          </svg>
          {!collapsed && <span className="truncate">Back to Site</span>}
        </Link>
      </div>
    </div>
  )
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar({
  onMenuClick,
  user,
}: {
  onMenuClick: () => void
  user: { email: string; name?: string }
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Build breadcrumbs from pathname
  const segments = pathname
    .replace('/app', '')
    .split('/')
    .filter(Boolean)

  const breadcrumbs = segments.map((seg, i) => ({
    label: seg
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    href: '/app/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/app'
  }

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 relative z-30">
      {/* Left: mobile hamburger + breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <nav className="flex items-center gap-1.5 text-sm min-w-0 overflow-hidden">
          <Link
            href="/app"
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Home
          </Link>
          {breadcrumbs.map((b) => (
            <span key={b.href} className="flex items-center gap-1.5 min-w-0">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
              {b.isLast ? (
                <span className="font-medium text-foreground truncate">{b.label}</span>
              ) : (
                <Link
                  href={b.href}
                  className="text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  {b.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right: user menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-foreground font-medium hidden sm:block max-w-[120px] truncate">
            {user.name || user.email.split('@')[0]}
          </span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted-foreground hidden sm:block">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-border bg-card shadow-lg shadow-black/10 z-50 overflow-hidden">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/app/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                  </svg>
                  Profile Settings
                </Link>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
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
            </div>
          </>
        )}
      </div>
    </header>
  )
}

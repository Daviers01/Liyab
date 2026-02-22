'use client'

import React, { useState, useEffect } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const staticNavItems = [
  { label: 'Home', href: '/' },
  { label: 'The Blueprint', href: '/#blueprint' },
  { label: 'The Lab', href: '/#lab' },
  { label: 'The Toolkit', href: '/#toolkit' },
  { label: 'The Journal', href: '/posts' },
]

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        {staticNavItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400 ${
              pathname === item.href 
                ? 'text-orange-600 dark:text-orange-400' 
                : 'text-foreground'
            }`}
          >
            {item.label}
          </Link>
        ))}
        {navItems.map(({ link }, i) => {
          return <CMSLink key={`cms-${i}`} {...link} appearance="link" />
        })}
        <Link href="/search" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5" />
        </Link>
        {user ? (
          <Link
            href="/app"
            className="flex items-center gap-2 ml-1 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/15 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-foreground">
              {user.name || user.email.split('@')[0]}
            </span>
          </Link>
        ) : (
          <Link
            href="/app"
            className="ml-1 px-4 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-colors"
          >
            Sign In
          </Link>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-3">
        <Link href="/search" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5" />
        </Link>
        {user ? (
          <Link
            href="/app"
            className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold"
            aria-label="Go to app"
          >
            {(user.name || user.email).charAt(0).toUpperCase()}
          </Link>
        ) : (
          <Link
            href="/app"
            className="px-3 py-1 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors"
          >
            Sign In
          </Link>
        )}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
          <nav className="container py-4 flex flex-col gap-4">
            {staticNavItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400 py-2 ${
                  pathname === item.href 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {navItems.map(({ link }, i) => {
              return (
                <div key={`cms-${i}`} onClick={() => setMobileMenuOpen(false)}>
                  <CMSLink {...link} appearance="link" />
                </div>
              )
            })}
          </nav>
          {user ? (
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 text-base font-medium text-orange-600 dark:text-orange-400"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-semibold text-orange-600 dark:text-orange-400"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </>
  )
}

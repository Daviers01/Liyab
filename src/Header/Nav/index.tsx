'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const staticNavItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { 
    label: 'Services', 
    href: '/services/google-tag-manager',
    subItems: [
      { label: 'Google Tag Manager', href: '/services/google-tag-manager' }
    ]
  },
  { label: 'Blog', href: '/posts' },
]

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-3">
        <Link href="/search" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5" />
        </Link>
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
        </div>
      )}
    </>
  )
}

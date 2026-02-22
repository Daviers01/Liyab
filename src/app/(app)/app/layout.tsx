'use client'

import { AppWrapper } from '../components/AppWrapper'

export default function AppAuthLayout({ children }: { children: React.ReactNode }) {
  return <AppWrapper>{children}</AppWrapper>
}

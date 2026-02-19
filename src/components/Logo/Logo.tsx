import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <Image
      alt="Liyab Digital Logo"
      width={180}
      height={50}
      loading={loading}
      priority={priority === 'high'}
      className={clsx('h-[60px] w-auto object-contain', className)}
      src="/logo-liyab.png"
    />
  )
}

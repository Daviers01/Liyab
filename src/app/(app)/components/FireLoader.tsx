'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const FIRE_URL = '/animations/fire.lottie'

interface FireLoaderProps {
  /** Size of the animation container in px (default 80) */
  size?: number
  /** Optional label shown below the animation */
  label?: string
}

export function FireLoader({ size = 80, label = 'Loading...' }: FireLoaderProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <DotLottieReact src={FIRE_URL} loop autoplay style={{ width: size, height: size }} />
      <p className="text-sm font-medium text-foreground/70">{label}</p>
    </div>
  )
}

/**
 * SmoothScroll Provider using Lenis
 * Wraps the application with smooth scrolling functionality
 */
'use client'

import type { ReactNode } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

// Temporarily disabled Lenis to enable native scrolling
// Re-enable by uncommenting ReactLenis import and wrapper
export default function SmoothScroll({ children }: SmoothScrollProps) {
  return <>{children}</>
}

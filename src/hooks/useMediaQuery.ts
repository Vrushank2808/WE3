/**
 * Custom hook for responsive media queries
 */
'use client'

import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '@/lib/constants'
import { isClient } from '@/lib/utils'

type BreakpointKey = keyof typeof BREAKPOINTS

interface MediaQueryState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isWide: boolean
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (!isClient) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (!isClient) return

    const mediaQuery = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

export function useBreakpoint(breakpoint: BreakpointKey): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`)
}

export function useResponsive(): MediaQueryState {
  const isAtLeastTablet = useBreakpoint('tablet')
  const isAtLeastDesktop = useBreakpoint('desktop')
  const isWide = useBreakpoint('wide')

  const isMobile = !isAtLeastTablet
  const isTablet = isAtLeastTablet && !isAtLeastDesktop
  const isDesktop = isAtLeastDesktop

  return { isMobile, isTablet, isDesktop, isWide }
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export default useMediaQuery

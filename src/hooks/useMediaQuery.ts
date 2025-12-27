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
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    if (!isClient) return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

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
  const isMobile = !useBreakpoint('tablet')
  const isTablet = useBreakpoint('tablet') && !useBreakpoint('desktop')
  const isDesktop = useBreakpoint('desktop')
  const isWide = useBreakpoint('wide')

  return { isMobile, isTablet, isDesktop, isWide }
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export default useMediaQuery

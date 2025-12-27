/**
 * Animation constants and GSAP configurations
 * Centralized animation timing and easing for consistency
 */

export const EASING = {
  smooth: 'power2.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  expo: 'expo.out',
  power3: 'power3.out',
  power4: 'power4.out',
} as const

export const DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  slower: 1.2,
} as const

export const SCROLL_TRIGGER_DEFAULTS = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
} as const

export const LENIS_CONFIG = {
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
} as const

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(max-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const

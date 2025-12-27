/**
 * Custom hook for GSAP scroll-triggered animations
 * Handles cleanup and reduced motion preferences
 */
'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/utils'

// Register plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface UseScrollAnimationOptions {
  trigger?: string | Element | null
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  markers?: boolean
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  _options: UseScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null)
  const contextRef = useRef<gsap.Context | null>(null)

  const createAnimation = useCallback(
    (
      animationCallback: (
        element: T,
        gsapInstance: typeof gsap
      ) => gsap.core.Timeline | gsap.core.Tween | void
    ) => {
      // Skip animations if reduced motion is preferred
      if (prefersReducedMotion()) {
        return
      }

      if (!ref.current) return

      // Clean up previous context
      if (contextRef.current) {
        contextRef.current.revert()
      }

      contextRef.current = gsap.context(() => {
        if (ref.current) {
          animationCallback(ref.current, gsap)
        }
      }, ref)
    },
    []
  )

  useEffect(() => {
    return () => {
      if (contextRef.current) {
        contextRef.current.revert()
      }
    }
  }, [])

  return { ref, createAnimation, gsap, ScrollTrigger }
}

/**
 * Hook for simple fade-in animations on scroll
 */
export function useFadeIn<T extends HTMLElement = HTMLElement>(
  options: {
    delay?: number
    duration?: number
    y?: number
    start?: string
  } = {}
) {
  const { delay = 0, duration = 0.8, y = 30, start = 'top 85%' } = options
  const { ref, createAnimation } = useScrollAnimation<T>()

  useEffect(() => {
    createAnimation((element, gsapInstance) => {
      gsapInstance.fromTo(
        element,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start,
          },
        }
      )
    })
  }, [createAnimation, delay, duration, y, start])

  return ref
}

/**
 * Hook for staggered children animations
 */
export function useStaggerChildren<T extends HTMLElement = HTMLElement>(
  childSelector: string,
  options: {
    stagger?: number
    duration?: number
    y?: number
    start?: string
  } = {}
) {
  const { stagger = 0.1, duration = 0.6, y = 30, start = 'top 80%' } = options
  const { ref, createAnimation } = useScrollAnimation<T>()

  useEffect(() => {
    createAnimation((element, gsapInstance) => {
      const children = element.querySelectorAll(childSelector)
      if (children.length === 0) return

      gsapInstance.fromTo(
        children,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start,
          },
        }
      )
    })
  }, [createAnimation, childSelector, stagger, duration, y, start])

  return ref
}

export default useScrollAnimation

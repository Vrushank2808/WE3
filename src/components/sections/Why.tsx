/**
 * Why Section
 * Visual breathing space with animated tagline
 */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Why.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Why() {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      if (textRef.current) {
        gsap.set(textRef.current, { y: 0 })
      }
      return
    }

    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className={styles.breathSection}
      ref={containerRef}
      id="why"
      aria-label="Our Promise"
    >
      <div className={styles.breathContent}>
        <h2 className={styles.breathText} ref={textRef}>
          Built to last.
        </h2>
      </div>
    </section>
  )
}

/**
 * Intro/Hero Section
 * Above-the-fold content with animated entrance
 */
'use client'

import { useLayoutEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { BREAKPOINTS } from '@/lib/constants'
import styles from './Intro.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Intro() {
  const containerRef = useRef<HTMLElement>(null)
  const introTextRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const enableScrollAnimations = useCallback(() => {
    const mm = gsap.matchMedia()

    mm.add(
      `(min-width: ${BREAKPOINTS.tablet}px) and (prefers-reduced-motion: no-preference)`,
      () => {
        gsap.to([titleRef.current, subRef.current, ctaRef.current], {
          y: -100,
          opacity: 0,
          filter: 'blur(8px)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      }
    )
  }, [])

  useLayoutEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      // Show content immediately without animation
      gsap.set([introTextRef.current, titleRef.current, subRef.current, ctaRef.current], {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          enableScrollAnimations()
        },
      })

      // 1. INTRO SEQUENCE (WE3)
      tl.to(introTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      })
        .to(
          introTextRef.current,
          {
            y: -50,
            duration: 1.5,
            ease: 'none',
          },
          '<'
        )
        .to(
          introTextRef.current,
          {
            opacity: 0,
            y: -100,
            duration: 0.8,
            ease: 'power2.in',
          },
          '>-0.5'
        )
        // 2. HERO REVEAL
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        })
        .to(
          [subRef.current, ctaRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out',
          },
          '-=0.6'
        )
    }, containerRef)

    return () => ctx.revert()
  }, [enableScrollAnimations])

  return (
    <section
      className={styles.introSection}
      ref={containerRef}
      id="intro"
      aria-label="Introduction"
    >
      {/* INTRO LAYER */}
      <div className={styles.introOverlay} aria-hidden="true">
        <div className={styles.introText} ref={introTextRef}>
          WE3
        </div>
      </div>

      {/* HERO LAYER */}
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle} ref={titleRef}>
          We build websites properly.
        </h1>
        <p className={styles.heroSubtext} ref={subRef}>
          No buzzwords. No confusing packages.
          <br />
          Just well-designed, well-built websites for businesses that care about
          quality.
        </p>
        <div className={styles.ctaWrapper} ref={ctaRef}>
          <a href="#work" className={styles.ctaButton}>
            View our work
            <ArrowRightIcon size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

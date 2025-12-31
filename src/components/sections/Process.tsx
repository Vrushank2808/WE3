/**
 * Process Section
 * Timeline-based display of our workflow
 */
'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROCESS_STEPS } from '@/lib/constants'
import ScrollReveal from '@/components/ui/ScrollReveal'
import styles from './Process.module.css'


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  const addToRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el)
    }
  }, [])

  useEffect(() => {
    const centerSectionIfHashMatches = () => {
      if (!sectionRef.current) return
      if (window.location.hash !== '#process') return

      const rect = sectionRef.current.getBoundingClientRect()
      const sectionCenterY = rect.top + rect.height / 2
      const viewportCenterY = window.innerHeight / 2
      const delta = sectionCenterY - viewportCenterY

      // Avoid tiny adjustments (and repeated smooth-scroll jitter)
      if (Math.abs(delta) < 24) return

      window.scrollBy({ top: delta, behavior: 'smooth' })
    }

    // Run on mount (initial deep-link) and on hash changes (in-page nav)
    const t = window.setTimeout(centerSectionIfHashMatches, 50)
    window.addEventListener('hashchange', centerSectionIfHashMatches)

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      stepsRef.current.forEach((step) => {
        if (step) gsap.set(step, { opacity: 1 })
      })
      return
    }

    const ctx = gsap.context(() => {
      // Draw Line Down
      gsap.fromTo(
        lineRef.current,
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )

      // Highlight Active Steps
      stepsRef.current.forEach((step) => {
        if (!step) return

        gsap.set(step, { opacity: 0.2 })

        gsap.to(step, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play reverse play reverse',
            toggleClass: { targets: step, className: styles.stepActive! },
          },
        })
      })
    }, sectionRef)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('hashchange', centerSectionIfHashMatches)
      ctx.revert()
    }
  }, [])

  return (
    <section
      className={styles.processSection}
      ref={sectionRef}
      id="process"
      aria-labelledby="process-title"
    >
      <div className="container">
        <ScrollReveal>
          <h2 id="process-title" className={styles.sectionLabel}>
            Our Process
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <p className={styles.sectionTagline}>Simple. Clear. Honest.</p>
        </ScrollReveal>

        <div className={styles.timelineContainer} role="list" aria-label="Process steps">
          {/* SVG Line with Gradient */}
          <svg
            className={styles.lineSvg}
            viewBox="0 0 4 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--text-color)" stopOpacity="0.85" />
                <stop offset="50%" stopColor="var(--text-color)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--text-color)" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path
              ref={lineRef}
              d="M 2 0 V 600"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {PROCESS_STEPS.map((step) => (
            <article
              key={step.number}
              className={styles.stepItem}
              ref={addToRefs}
              role="listitem"
              aria-labelledby={`step-${step.number}`}
            >
              <div className={styles.stepNumber} aria-hidden="true">
                {step.number}
              </div>
              <h3 id={`step-${step.number}`}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </article>
          ))}
        </div>

        <ScrollReveal delay={0.1}>
          <p className={styles.processNote}>
            We take on a limited number of projects so each one gets the attention
            it deserves.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

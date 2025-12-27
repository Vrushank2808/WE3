/**
 * Process Section
 * Timeline-based display of our workflow
 */
'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROCESS_STEPS } from '@/lib/constants'
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
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className={styles.processSection}
      ref={sectionRef}
      id="process"
      aria-labelledby="process-title"
    >
      <div className="container">
        <h2 id="process-title" className={styles.sectionLabel}>
          Our Process
        </h2>
        <p className={styles.sectionTagline}>Simple. Clear. Honest.</p>

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
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="50%" stopColor="#764ba2" />
                <stop offset="100%" stopColor="#f093fb" />
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

        <p className={styles.processNote}>
          We take on a limited number of projects so each one gets the attention
          it deserves.
        </p>
      </div>
    </section>
  )
}

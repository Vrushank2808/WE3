/**
 * Work/Portfolio Section
 * Horizontal scrolling showcase of projects
 */
'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS, BREAKPOINTS } from '@/lib/constants'
import styles from './Work.module.css'


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])

  const addToRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !imagesRef.current.includes(el)) {
      imagesRef.current.push(el)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      return // Let CSS handle the layout without animation
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop: Pin & Horizontal Scroll
      mm.add(`(min-width: ${BREAKPOINTS.tablet}px)`, () => {
        if (!containerRef.current || !sectionRef.current) return

        const scrollTween = gsap.to(containerRef.current, {
          x: () =>
            -(containerRef.current!.scrollWidth - window.innerWidth + 100),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            start: 'top top',
            end: '+=200%',
            invalidateOnRefresh: true,
          },
        })

        imagesRef.current.forEach((img) => {
          if (!img) return
          gsap.to(img, {
            xPercent: 10,
            ease: 'none',
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: img.parentElement,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          })
        })
      })

      // Mobile: Fade in cards
      mm.add(`(max-width: ${BREAKPOINTS.tablet - 1}px)`, () => {
        gsap.utils.toArray<Element>(`.${styles.caseStudyCard}`).forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
              },
            }
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className={styles.workSection}
      ref={sectionRef}
      id="work"
      aria-labelledby="work-title"
    >
      <h2 id="work-title" className="sr-only">
        Our Work
      </h2>
      <div className={styles.scrollContainer} ref={containerRef}>
        {PROJECTS.map((project) => (
          <article
            className={styles.caseStudyCard}
            key={project.id}
            aria-labelledby={`project-${project.id}`}
          >
            <div
              className={styles.cardImage}
              ref={addToRefs}
              style={{ background: project.gradient }}
              role="img"
              aria-label={`${project.title} project preview`}
            />
            <div className={styles.cardOverlay}>
              <span className={styles.cardCategory}>{project.category}</span>
              <h3 id={`project-${project.id}`} className={styles.cardTitle}>
                {project.title}
              </h3>
            </div>
          </article>
        ))}
        <div className={styles.scrollSpacer} aria-hidden="true" />
      </div>
    </section>
  )
}

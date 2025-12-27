'use client'

import { useLayoutEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DesignIcon, CodeIcon, SettingsIcon } from '@/components/ui/Icons'
import { SERVICES, BREAKPOINTS } from '@/lib/constants'
import styles from './Services.module.css'

gsap.registerPlugin(ScrollTrigger)

const iconComponents = {
  design: DesignIcon,
  code: CodeIcon,
  settings: SettingsIcon,
} as const

export default function Services() {
  const containerRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  const addToRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }, [])

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop animation
      mm.add(`(min-width: ${BREAKPOINTS.tablet}px)`, () => {
        cardsRef.current.forEach((card, index) => {
          const xStart = index % 2 === 0 ? -60 : 60

          gsap.fromTo(
            card,
            { opacity: 0, x: xStart },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
              },
            }
          )
        })
      })

      // Mobile animation
      mm.add(`(max-width: ${BREAKPOINTS.tablet - 1}px)`, () => {
        cardsRef.current.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
              },
            }
          )
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className={styles.servicesSection}
      id="services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <h2 id="services-title" className={styles.title}>
          What We Do
        </h2>

        <ul className={styles.listContainer} role="list">
          {SERVICES.map((service) => {
            const Icon =
              iconComponents[service.iconName as keyof typeof iconComponents]

            return (
              <li key={service.id}>
                <article
                  ref={addToRefs}
                  className={styles.serviceBlock}
                  aria-labelledby={`service-${service.id}`}
                >
                  <div className={styles.serviceIcon} aria-hidden="true">
                    <Icon size={28} />
                  </div>

                  <h3 id={`service-${service.id}`} className={styles.blockTitle}>
                    {service.title}
                  </h3>

                  <p className={styles.blockDescription}>
                    {service.description}
                  </p>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

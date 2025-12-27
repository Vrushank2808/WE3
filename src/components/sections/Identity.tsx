'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Identity.module.css'

gsap.registerPlugin(ScrollTrigger)

const STORY_LINES = [
  { text: 'A <strong>small team</strong>.<br />Focused on doing things <strong>properly</strong>.' },
  { text: 'We design and build <strong>reliable</strong> websites.' },
  { text: 'Nothing rushed.<br />Nothing <strong>careless</strong>.' },
  { text: 'Just <strong>thoughtful</strong> design,<br />and <strong>clean</strong> development.' },
]

export default function Identity() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.storyLine}`, {
        opacity: 0,
        y: 40,
        stagger: 0.25,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.identitySection}
      id="identity"
      aria-label="Who we are"
    >
      <div className="container">
        <h2 className={styles.label}>Who We Are</h2>

        <div className={styles.storyContainer}>
          {STORY_LINES.map((line, i) => (
            <p
              key={i}
              className={styles.storyLine}
              dangerouslySetInnerHTML={{ __html: line.text }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

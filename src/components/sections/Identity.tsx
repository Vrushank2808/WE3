'use client'

import { useRef } from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import styles from './Identity.module.css'

const STORY_LINES = [
  { text: 'A <strong>small team</strong>.<br />Focused on doing things <strong>properly</strong>.' },
  { text: 'We design and build <strong>reliable</strong> websites.' },
  { text: 'Nothing rushed.<br />Nothing <strong>careless</strong>.' },
  { text: 'Just <strong>thoughtful</strong> design,<br />and <strong>clean</strong> development.' },
]

export default function Identity() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      className={styles.identitySection}
      id="identity"
      aria-label="Who we are"
    >
      <div className="container">
        <ScrollReveal>
          <h2 className={styles.label}>Who We Are</h2>
        </ScrollReveal>

        <div className={styles.storyContainer}>
          {STORY_LINES.map((line, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <p
                className={styles.storyLine}
                dangerouslySetInnerHTML={{ __html: line.text }}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

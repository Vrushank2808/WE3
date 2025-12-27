/**
 * Background particles for visual effect
 * Purely decorative, hidden from screen readers
 */

import styles from './Particles.module.css'

const PARTICLE_COUNT = 6

export default function Particles() {
  return (
    <div className={styles.particles} aria-hidden="true">
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <div key={i} className={styles.particle} />
      ))}
    </div>
  )
}

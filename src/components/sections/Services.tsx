'use client'

import { DesignIcon, CodeIcon, SettingsIcon } from '@/components/ui/Icons'
import { SERVICES } from '@/lib/constants'
import ScrollReveal from '@/components/ui/ScrollReveal'
import styles from './Services.module.css'

const iconComponents = {
  design: DesignIcon,
  code: CodeIcon,
  settings: SettingsIcon,
} as const

export default function Services() {
  return (
    <section
      className={styles.servicesSection}
      id="services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <ScrollReveal>
          <h2 id="services-title" className={styles.title}>
            What We Do
          </h2>
        </ScrollReveal>

        <ul className={styles.listContainer} role="list">
          {SERVICES.map((service, index) => {
            const Icon =
              iconComponents[service.iconName as keyof typeof iconComponents]

            return (
              <li key={service.id}>
                <ScrollReveal delay={index * 0.1}>
                  <article
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
                </ScrollReveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

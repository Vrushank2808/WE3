/**
 * Contact Section with Footer
 * CTA and social links
 */
'use client'

import { TwitterIcon, LinkedInIcon, InstagramIcon } from '@/components/ui/Icons'
import { SITE_CONFIG } from '@/lib/constants'
import styles from './Contact.module.css'

const SOCIAL_LINKS = [
  { name: 'Twitter', href: '#', icon: TwitterIcon },
  { name: 'LinkedIn', href: SITE_CONFIG.social.linkedin, icon: LinkedInIcon },
  { name: 'Instagram', href: SITE_CONFIG.social.instagram, icon: InstagramIcon },
] as const

export default function Contact() {
  const currentYear = new Date().getFullYear()

  return (
    <section
      className={styles.contactSection}
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <h2 id="contact-title" className={styles.sectionLabel}>
          Get In Touch
        </h2>
        <p className={styles.sectionDescription}>
          If you think we might be a good fit, reach out.
          <br />
          No sales scripts — just an honest discussion about what you need.
        </p>
        <div className={styles.ctaContainer}>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className={styles.ctaLink}
            aria-label="Send us an email to start a conversation"
          >
            Start a conversation
            <span className={styles.ctaArrow} aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>

      <footer className={styles.footer} role="contentinfo">
        <div className={`container ${styles.footerContent}`}>
          <span>© {currentYear} {SITE_CONFIG.name} Agency. All rights reserved.</span>
          <nav aria-label="Social media links">
            <ul className={styles.socialLinks}>
              {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    className={styles.socialLink}
                    aria-label={`Follow us on ${name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </section>
  )
}

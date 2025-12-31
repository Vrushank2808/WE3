/**
 * Contact Section with Footer
 * CTA and social links
 */
'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/Icons'
import { Link003 } from '@/components/ui/AnimatedLinks'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { SITE_CONFIG } from '@/lib/constants'
import styles from './Contact.module.css'

const SOCIAL_LINKS = [

  { name: 'Instagram', href: SITE_CONFIG.social.instagram, icon: InstagramIcon },
  { name: 'WhatsApp', href: 'https://wa.me/919328702403?text=Hi%20Crevix%2C%20I%20would%20like%20to%20discuss%20a%20project.', icon: WhatsAppIcon },
] as const

export default function Contact() {
  const currentYear = new Date().getFullYear()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const isDisabled = useMemo(() => {
    if (status === 'sending') return true
    if (!name.trim()) return true
    if (!email.trim()) return true
    if (!message.trim()) return true
    return false
  }, [name, email, message, status])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null

      if (!res.ok) {
        throw new Error(data?.error ?? 'Failed to send message')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to send message')
    }
  }

  return (
    <section
      className={styles.contactSection}
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <ScrollReveal>
          <h2 id="contact-title" className={styles.sectionLabel}>
            Get In Touch
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <p className={styles.sectionDescription}>
            If you think we might be a good fit, reach out.
            <br />
            No sales scripts — just an honest discussion about what you need.
          </p>
        </ScrollReveal>

        <div className={styles.ctaContainer}>
          <ScrollReveal delay={0.1}>
            <form className={styles.contactForm} onSubmit={onSubmit} aria-label="Send us a message">
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    className={styles.fieldInput}
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    className={styles.fieldInput}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className={styles.fieldTextarea}
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className={styles.submitRow}>
                <button className={styles.submitButton} type="submit" disabled={isDisabled}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                  <span className={styles.ctaArrow} aria-hidden="true">
                    →
                  </span>
                </button>

                <p className={styles.helperText}>
                  Or email us directly at{' '}
                  <Link003 className={styles.inlineLink} href={`mailto:${SITE_CONFIG.email}`}>
                    {SITE_CONFIG.email}
                  </Link003>
                </p>
              </div>

              <div className={styles.formStatus} aria-live="polite" role="status">
                {status === 'success' && (
                  <p className={styles.successText}>Message sent. We’ll get back to you.</p>
                )}
                {status === 'error' && (
                  <p className={styles.errorText}>{error ?? 'Something went wrong.'}</p>
                )}
              </div>
            </form>
          </ScrollReveal>
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

'use client'

import { useLenis } from 'lenis/react'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
// import Image from 'next/image' // Unused
import { motion, AnimatePresence } from 'framer-motion'
// const { theme } = useTheme() // Unused
import styles from './Header.module.css'
import ThemeToggle from './ThemeToggle'
import { CrevixLogo } from '@/components/ui/Icons'

const tabs = [
    { id: 'rd-1', label: 'Home', href: '#intro' },
    { id: 'rd-2', label: 'About', href: '#identity' },
    { id: 'rd-3', label: 'Services', href: '#services' },
    { id: 'rd-4', label: 'Work', href: '#work' },
    { id: 'rd-5', label: 'Process', href: '#process' },
    { id: 'rd-6', label: 'Contact', href: '#contact' },
] as const

export default function Header() {
    const lenis = useLenis()
    // const { theme } = useTheme() // Unused
    // const [scrolled, setScrolled] = useState(false) // Unused
    const [hidden, setHidden] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    // const [hoverIndex, setHoverIndex] = useState<number | null>(null) // Unused
    const lastScrollY = useRef(0)
    const isScrollingProgrammatically = useRef(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Detect active section
    useEffect(() => {
        const updateActiveSection = () => {
            if (isScrollingProgrammatically.current) return
            const scrollPosition = window.scrollY + window.innerHeight / 3

            let currentActive = 0
            for (let i = tabs.length - 1; i >= 0; i--) {
                const href = tabs[i]?.href
                if (!href) continue
                const element = document.querySelector(href)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    const elementTop = rect.top + window.scrollY
                    if (scrollPosition >= elementTop - 100) {
                        currentActive = i
                        break
                    }
                }
            }
            setActiveIndex(currentActive)
        }

        const handleScroll = () => {
            const y = window.scrollY
            // setScrolled(y > 24)
            // const delta = y - lastScrollY.current
            // const shouldHide = y > 120 && delta > 6
            // const shouldShow = delta < -6
            // if (shouldHide) setHidden(true)
            // if (shouldShow) setHidden(false)
            setHidden(false)
            lastScrollY.current = y
            updateActiveSection()
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        const observers: IntersectionObserver[] = []
        tabs.forEach((tab, index) => {
            const element = document.querySelector(tab.href)
            if (element) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        if (isScrollingProgrammatically.current) return
                        entries.forEach((entry) => {
                            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                                setActiveIndex(index)
                            }
                        })
                    },
                    { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.3, 0.5, 1] }
                )
                observer.observe(element)
                observers.push(observer)
            }
        })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            observers.forEach(observer => observer.disconnect())
        }
    }, [])

    const handleTabClick = (href: string, index: number) => {
        setActiveIndex(index)
        isScrollingProgrammatically.current = true

        if (lenis) {
            lenis.scrollTo(href, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                onComplete: () => { setTimeout(() => { isScrollingProgrammatically.current = false }, 100) }
            })
        } else {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
            setTimeout(() => { isScrollingProgrammatically.current = false }, 1000)
        }
    }

    // Logo Logic
    // const logoSrc = theme === 'dark'
    //     ? '/crevix icon virsion darkk.png'
    //     : '/Picsart_25-12-31_15-44-50-181.png'

    return (
        <header className={styles.wrapper} data-hidden={hidden}>
            <div className={styles.shell}>
                {/* 1. Logo */}
                <Link href="#intro" className={styles.logoLink} onClick={() => handleTabClick('#intro', 0)}>
                    <CrevixLogo size={40} className={styles.logoImage} />
                </Link>

                {/* 2. Nav (Desktop) */}
                <nav className={styles.nav}>
                    {tabs.map((tab, index) => (
                        <React.Fragment key={tab.id}>
                            <input
                                type="radio"
                                id={tab.id}
                                name="nav-radio"
                                checked={index === activeIndex}
                                onChange={() => handleTabClick(tab.href, index)}
                            />
                            <label
                                htmlFor={tab.id}
                                className={styles.tab}
                                onClick={() => handleTabClick(tab.href, index)}
                            >
                                <span>{tab.label}</span>
                            </label>
                        </React.Fragment>
                    ))}
                    <div className={styles.bar}></div>
                    <div className={styles.slidebar}></div>
                </nav>

                {/* 3. Actions / Mobile Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ThemeToggle />
                    {/* Mobile Hamburger (Simple) */}
                    <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '1rem',
                            right: '1rem',
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(20px)',
                            padding: '1rem',
                            borderRadius: '16px',
                            border: '1px solid var(--card-border)',
                            pointerEvents: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    handleTabClick(tab.href, index)
                                    setMobileMenuOpen(false)
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-color)',
                                    fontSize: '1.1rem',
                                    padding: '0.75rem',
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

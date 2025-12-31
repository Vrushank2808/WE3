'use client'

import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

gsap.registerPlugin(ScrollTrigger)

type ScrollTriggerInstance = ScrollTrigger

export default function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
    const elementRef = useRef<HTMLDivElement>(null)
    const scrollTriggerRef = useRef<ScrollTriggerInstance | null>(null)

    useLayoutEffect(() => {
        const element = elementRef.current
        if (!element) return

        // Respect reduced motion
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReducedMotion) {
            gsap.set(element, {
                clearProps: 'transform',
                opacity: 1,
            })
            return
        }

        // Kill any existing ScrollTrigger for this element
        if (scrollTriggerRef.current) {
            scrollTriggerRef.current.kill()
            scrollTriggerRef.current = null
        }

        const setHidden = () => {
            gsap.set(element, {
                y: 50,
                opacity: 0,
                z: -50,
                scale: 0.95,
                rotateX: 5,
            })
        }

        const animateIn = (withDelay: number) => {
            gsap.to(element, {
                y: 0,
                opacity: 1,
                z: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.5,
                ease: 'power3.out',
                delay: withDelay,
                overwrite: 'auto',
            })
        }

        const animateOut = () => {
            gsap.to(element, {
                y: 50,
                opacity: 0,
                z: -50,
                scale: 0.95,
                rotateX: 5,
                duration: 0.5,
                ease: 'power2.in',
                overwrite: 'auto',
            })
        }

        // Reset element to initial state
        setHidden()

        const ctx = gsap.context(() => {
            const init = () => {
                // Always create ScrollTrigger so re-entry works even if initially in view
                scrollTriggerRef.current = ScrollTrigger.create({
                    trigger: element,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    once: false,
                    invalidateOnRefresh: true,
                    onEnter: () => animateIn(delay),
                    onEnterBack: () => animateIn(0),
                    onLeaveBack: () => animateOut(),
                })

                // If already in viewport (e.g., jumped via hash), reveal immediately
                const rect = element.getBoundingClientRect()
                const isInViewport = rect.top < window.innerHeight * 0.85 && rect.bottom > 0
                if (isInViewport) {
                    animateIn(delay)
                }

                ScrollTrigger.refresh()
            }

            const timeoutId = window.setTimeout(init, 200)

            // Also refresh when window resizes
            const handleResize = () => {
                ScrollTrigger.refresh()
            }
            window.addEventListener('resize', handleResize)

            return () => {
                clearTimeout(timeoutId)
                window.removeEventListener('resize', handleResize)
            }
        }, elementRef)

        return () => {
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill()
                scrollTriggerRef.current = null
            }
            ctx.revert()
        }
    }, [delay])

    return (
        <div
            ref={elementRef}
            className={`will-change-transform ${className ?? ''}`}
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }} // Enable 3D transitions
        >
            {children}
        </div>
    )
}

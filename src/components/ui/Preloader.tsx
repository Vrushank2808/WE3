'use client'

import { useLayoutEffect, useRef, useState, useEffect } from 'react'
// import Image from 'next/image'
import { gsap } from 'gsap'
import { CrevixLogo } from '@/components/ui/Icons'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { useTheme } from '@/components/providers/ThemeProvider'
import { useLenis } from 'lenis/react'

gsap.registerPlugin(ScrollTrigger)

export default function Preloader() {
    const [shouldRender, setShouldRender] = useState(true)
    const [percent, setPercent] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)
    const lenis = useLenis()
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const percentRef = useRef<HTMLDivElement>(null)
    const panelsRef = useRef<HTMLDivElement>(null)

    // Fallback safety to remove preloader if animation stalls
    useEffect(() => {
        if (!isLoaded) return

        const timer = setTimeout(() => {
            setShouldRender(false)
        }, 5000) // 5s max wait after loaded

        return () => clearTimeout(timer)
    }, [isLoaded])

    // Moved early return to bottom to satisfy Rules of Hooks

    // Prevent scrolling while loading
    useEffect(() => {
        if (!isLoaded) {
            // Lock body scroll
            document.body.classList.add('preloader-active')
            document.body.style.setProperty('overflow', 'hidden', 'important')
            document.body.style.setProperty('height', '100vh', 'important')
            document.documentElement.style.setProperty('overflow', 'hidden', 'important')
            document.documentElement.style.setProperty('height', '100vh', 'important')
            // Stop lenis if available
            if (lenis) lenis.stop()
        } else {
            // Unlock scroll after loading - explicitly reset all styles
            document.body.classList.remove('preloader-active')
            document.body.style.removeProperty('overflow')
            document.body.style.removeProperty('height')
            document.documentElement.style.removeProperty('overflow')
            document.documentElement.style.removeProperty('height')
        }

        return () => {
            // Cleanup: ensure scroll is unlocked
            document.body.classList.remove('preloader-active')
            document.body.style.removeProperty('overflow')
            document.body.style.removeProperty('height')
            document.documentElement.style.removeProperty('overflow')
            document.documentElement.style.removeProperty('height')
        }
    }, [isLoaded, lenis]) // eslint-disable-line react-hooks/exhaustive-deps

    // Track actual loading progress
    useEffect(() => {
        if (isLoaded) return

        let loadedResources = 0
        const totalResources = 1 // Start with 1 for document ready

        const updateProgress = () => {
            const progress = Math.min(100, Math.round((loadedResources / totalResources) * 100))
            setPercent(progress)
        }

        // Check if document is ready
        const checkDocumentReady = () => {
            if (document.readyState === 'complete') {
                loadedResources++
                updateProgress()
            } else {
                window.addEventListener('load', () => {
                    loadedResources++
                    updateProgress()
                })
            }
        }

        // Load all images
        const images = Array.from(document.querySelectorAll('img'))
        const imagePromises = images.map((img) => {
            if (img.complete) {
                loadedResources++
                updateProgress()
                return Promise.resolve()
            }
            return new Promise<void>((resolve) => {
                img.onload = () => {
                    loadedResources++
                    updateProgress()
                    resolve()
                }
                img.onerror = () => {
                    loadedResources++
                    updateProgress()
                    resolve()
                }
            })
        })

        // Wait for all resources
        Promise.all([
            new Promise<void>((resolve) => {
                checkDocumentReady()
                if (document.readyState === 'complete') {
                    resolve()
                } else {
                    window.addEventListener('load', () => resolve())
                }
            }),
            ...imagePromises,
            // Wait a minimum time for smooth animation
            new Promise<void>((resolve) => setTimeout(resolve, 2000))
        ]).then(() => {
            setPercent(100)
            setTimeout(() => setIsLoaded(true), 300)
        })
    }, [isLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

    // Animate progress bar based on percent
    useLayoutEffect(() => {
        if (!progressRef.current) return

        gsap.to(progressRef.current, {
            width: `${percent}%`,
            duration: 0.3,
            ease: 'power1.out',
        })
    }, [percent])

    // Initial logo animation - show logo first
    useLayoutEffect(() => {
        if (!logoRef.current || !textRef.current) return

        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set(logoRef.current, { opacity: 0, scale: 0.8 })
            gsap.set(textRef.current, { opacity: 0 })

            // Animate logo in first
            gsap.to(logoRef.current, {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power2.out',
            })
        }, containerRef)

        return () => ctx.revert()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Animation when loaded - show Crevix text then exit
    useLayoutEffect(() => {
        if (!isLoaded) return

        // Immediate lock
        if (lenis) lenis.stop()

        const tl = gsap.timeline()
        const ctx = gsap.context(() => {
            // 1. Hide progress bar and logo immediately to focus on the text
            gsap.to([percentRef.current, progressRef.current, '.loader-bar-bg', logoRef.current], {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out'
            })

            // 2. Animate "Crevix" Text - Zoom Effect
            // First ensure it's visible and centered
            tl.to(textRef.current, {
                opacity: 1,
                scale: 1,
                letterSpacing: '0.1em',
                duration: 0.5,
                ease: 'power2.out',
            })
                // Then massive scale up (fly through)
                .to(textRef.current, {
                    scale: 100,
                    opacity: 0, // Fade out at the very end
                    duration: 1.5,
                    ease: 'expo.in', // Accelerate into the camera
                    transformOrigin: 'center center',
                })

                // 3. Reveal Content (Panel Reveal)
                .to('.panel', {
                    height: 0,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'power4.inOut',
                }, '-=0.5') // Overlap with end of zoom

                // 4. Cleanup and Main Content Reveal
                .to(containerRef.current, {
                    opacity: 0,
                    zIndex: -1,
                    duration: 0.5,
                    onComplete: () => {
                        setShouldRender(false)
                        if (containerRef.current) {
                            containerRef.current.style.display = 'none'
                            containerRef.current.style.pointerEvents = 'none'
                        }
                        // Reveal main content
                        const mainContent = document.getElementById('main-content-wrapper')
                        if (mainContent) {
                            gsap.fromTo(mainContent,
                                { opacity: 0, scale: 0.95 },
                                {
                                    opacity: 1,
                                    scale: 1,
                                    duration: 1,
                                    ease: 'power2.out',
                                    onComplete: () => {
                                        setTimeout(() => ScrollTrigger.refresh(), 300)
                                    }
                                }
                            )
                        }
                        // Start lenis
                        setTimeout(() => {
                            lenis?.start()
                            setTimeout(() => ScrollTrigger.refresh(), 500)
                        }, 100)
                    },
                })
        }, containerRef)

        return () => ctx.revert()
    }, [isLoaded, lenis]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!shouldRender) return null

    if (isLoaded && containerRef.current?.style.display === 'none') {
        return null
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] flex flex-col items-center justify-center overflow-hidden"
            style={{
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
            }}
            suppressHydrationWarning
        >
            {/* Background panels for reveal effect */}
            <div ref={panelsRef} className="absolute inset-0 flex w-full h-full pointer-events-none z-0">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="panel w-1/5 h-full bg-[var(--bg-color)] relative border-r border-[var(--card-border)] last:border-r-0"></div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-4">
                {/* Logo - Centered, shown first */}
                <div ref={logoRef} className="relative w-32 h-32 mb-8" style={{ opacity: 0 }}>
                    <CrevixLogo className="w-full h-full text-foreground" />
                </div>

                {/* Crevix Intro Text - Appears after logo */}
                <h1
                    ref={textRef}
                    className="text-6xl md:text-8xl font-bold tracking-tighter gradient-text"
                    style={{
                        background: 'var(--accent-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                        opacity: 0,
                    }}
                >
                    Crevix
                </h1>

                {/* Counter */}
                <div
                    ref={percentRef}
                    className="text-4xl md:text-5xl font-mono font-light mb-4 tabular-nums"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {percent}%
                </div>

                {/* Progress Bar Container */}
                <div
                    className="loader-bar-bg w-full h-1 rounded-full overflow-hidden relative"
                    style={{ background: 'var(--card-border)' }}
                >
                    <div
                        ref={progressRef}
                        className="h-full w-0"
                        style={{ background: 'var(--accent-gradient)', boxShadow: '0 0 20px var(--accent-glow)' }}
                    />
                </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div
                    className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
                    style={{ background: 'var(--accent-glow)' }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
                    style={{ background: 'var(--accent-glow)', animationDelay: '1s' }}
                />
            </div>
        </div>
    )
}

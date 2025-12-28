'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader() {
    const [percent, setPercent] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLHeadingElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const percentRef = useRef<HTMLDivElement>(null)
    const panelsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const tl = gsap.timeline()
        const ctx = gsap.context(() => {
            // Disable scrolling
            document.body.style.overflow = 'hidden'

            // Counter Animation
            const counterObj = { value: 0 }
            tl.to(counterObj, {
                value: 100,
                duration: 2.5,
                ease: 'power2.inOut',
                onUpdate: () => {
                    setPercent(Math.round(counterObj.value))
                },
            })
                .to(
                    progressRef.current,
                    {
                        width: '100%',
                        duration: 2.5,
                        ease: 'power2.inOut',
                    },
                    0
                )

            // Text effects - "Crazy" part
            // Glitch/Scale effect at 100%
            tl.to(textRef.current, {
                scale: 1.5,
                duration: 0.5,
                color: '#fff',
                textShadow: '0 0 20px rgba(118, 75, 162, 0.8), 0 0 40px rgba(102, 126, 234, 0.8)',
                ease: 'elastic.out(1, 0.3)',
            })
                .to(textRef.current, {
                    opacity: 0,
                    y: -100,
                    duration: 0.5,
                    ease: 'power2.in',
                }, '+=0.2')

                // Hide percent and progress bar
                .to([percentRef.current, progressRef.current, '.loader-bar-bg'], {
                    opacity: 0,
                    duration: 0.3,
                }, '<')

                // Panel Reveal - "Curtains/Blinds"
                .to('.panel', {
                    height: 0,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'power4.inOut', // Dramatic ease
                })

                // Cleanup
                .to(containerRef.current, {
                    zIndex: -1,
                    display: 'none',
                    onComplete: () => {
                        document.body.style.overflow = ''
                    },
                })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden"
        >
            {/* Background panels for reveal effect */}
            <div ref={panelsRef} className="absolute inset-0 flex w-full h-full pointer-events-none z-0">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="panel w-1/5 h-full bg-[#050505] relative border-r border-white/5 last:border-r-0"></div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-4">
                {/* Main Text */}
                <h1
                    ref={textRef}
                    className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 gradient-text"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                    }}
                >
                    WE3
                </h1>

                {/* Counter */}
                <div ref={percentRef} className="text-4xl md:text-5xl font-mono font-light mb-4 tabular-nums text-white/50">
                    {percent}%
                </div>

                {/* Progress Bar Container */}
                <div className="loader-bar-bg w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        ref={progressRef}
                        className="h-full bg-gradient-to-r from-[#667eea] to-[#f093fb] w-0"
                        style={{ boxShadow: '0 0 20px rgba(118, 75, 162, 0.5)' }}
                    />
                </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
        </div>
    )
}

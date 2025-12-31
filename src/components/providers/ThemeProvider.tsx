'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark')
    const isFirstMount = useRef(true)

    useEffect(() => {
        const root = document.documentElement

        // Skip animation on first mount
        // Check for saved theme on mount
        if (isFirstMount.current) {
            const savedTheme = localStorage.getItem('theme') as Theme | null
            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                setThemeState(savedTheme)
            } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                setThemeState('light')
            }

            isFirstMount.current = false
            return
        }

        // Create overlay for smooth transition
        const overlay = document.createElement('div')
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-color);
            z-index: 99999;
            pointer-events: none;
            opacity: 0;
        `
        document.body.appendChild(overlay)

        // Animate overlay in, change theme, then animate out
        const tl = gsap.timeline({
            onComplete: () => {
                document.body.removeChild(overlay)
            }
        })

        tl.to(overlay, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut',
        })
            .call(() => {
                root.setAttribute('data-theme', theme)
                localStorage.setItem('theme', theme)
            })
            .to(overlay, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut',
            })
    }, [theme])


    const toggleTheme = () => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

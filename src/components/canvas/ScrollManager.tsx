'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { MathUtils } from 'three'

/**
 * ScrollManager
 * Syncs the R3F Camera position with the window scroll.
 * 
 * We map 1 DOM pixel to 0.01 3D units (generic scale), 
 * or we can calculate viewport height to map exactly 1 screen unit = 1 viewport height.
 * 
 * Strategy:
 * - We want the camera to move NEGATIVE Y as we scroll DOWN.
 * - This mimics moving "down" the page.
 */
export default function ScrollManager() {
    const { camera } = useThree()

    // Ref to store current scroll position to avoid re-renders
    const data = useRef({
        scroll: 0,
        lastScroll: 0,
    })

    useEffect(() => {
        const handleScroll = () => {
            // Normalized scroll 0 to 1 would be better, but pixel value works if we scale it.
            data.current.scroll = window.scrollY
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useFrame((_state, delta) => {
        // FLIGHT MECHANIC:
        // Move camera in Z (depth) and Y (vertical) based on scroll position
        // Works bidirectionally - scrolling up reverses the effect

        const scrollRange = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
        // avoid div/0
        const maxScroll = scrollRange > 0 ? scrollRange : 1;

        // Total depth range for dramatic "flight" effect
        const totalDepth = 40;

        // Total vertical movement range
        const totalVertical = 8;

        // Progress 0 to 1 based on scroll position
        // This works for both scrolling down (increasing) and up (decreasing)
        const progress = Math.max(0, Math.min(1, data.current.scroll / maxScroll));

        // Target Z: moves forward (negative) as we scroll down
        // Start: 10, End: 10 - 40 = -30
        const targetZ = 10 - (progress * totalDepth);

        // Target Y: moves down slightly as we scroll down for parallax effect
        // Start: 0, End: -8
        const targetY = -(progress * totalVertical);

        // Smoothly damp camera to target positions
        // Using higher damping factor for smoother, more responsive movement
        camera.position.setZ(MathUtils.damp(camera.position.z, targetZ, 8, delta))
        camera.position.setY(MathUtils.damp(camera.position.y, targetY, 6, delta))
    })

    return null
}

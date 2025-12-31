'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MathUtils } from 'three'

interface AnimatedParticlesProps {
    count?: number
    theme: 'light' | 'dark'
}

export default function AnimatedParticles({ count = 100, theme }: AnimatedParticlesProps) {
    const meshRef = useRef<THREE.Points>(null)
    const materialRef = useRef<THREE.PointsMaterial>(null)

    // Generate particle positions
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const velocities = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            // Random positions in a sphere
            const radius = MathUtils.randFloat(5, 20)
            const theta = MathUtils.randFloat(0, Math.PI * 2)
            const phi = Math.acos(MathUtils.randFloat(-1, 1))

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            positions[i3 + 2] = radius * Math.cos(phi)

            // Random velocities
            velocities[i3] = MathUtils.randFloat(-0.01, 0.01)
            velocities[i3 + 1] = MathUtils.randFloat(-0.01, 0.01)
            velocities[i3 + 2] = MathUtils.randFloat(-0.01, 0.01)
        }

        return { positions, velocities }
    }, [count])

    const geometry = useMemo(() => {
        const geom = new THREE.BufferGeometry()
        geom.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
        return geom
    }, [particles.positions])

    useFrame((state, delta) => {
        if (!meshRef.current || !materialRef.current) return

        const positionAttr = meshRef.current.geometry.getAttribute('position') as
            | THREE.BufferAttribute
            | undefined
        if (!positionAttr) return

        const positions = positionAttr.array as Float32Array
        const time = state.clock.elapsedTime

        // Animate particles
        for (let i = 0; i < count; i++) {
            const i3 = i * 3

            if (i3 + 2 >= positions.length || i3 + 2 >= particles.velocities.length) {
                continue
            }

            const vx = particles.velocities[i3] ?? 0
            const vy = particles.velocities[i3 + 1] ?? 0
            const vz = particles.velocities[i3 + 2] ?? 0
            const px = positions[i3] ?? 0
            const py = positions[i3 + 1] ?? 0
            const pz = positions[i3 + 2] ?? 0

            // Add velocity
            positions[i3] = px + vx * delta * 10
            positions[i3 + 1] = py + vy * delta * 10
            positions[i3 + 2] = pz + vz * delta * 10

            // Add wave motion
            positions[i3 + 1] = (positions[i3 + 1] ?? 0) + Math.sin(time + i) * 0.01

            // Wrap around if out of bounds
            const radius = Math.sqrt(
                (positions[i3] ?? 0) ** 2 +
                (positions[i3 + 1] ?? 0) ** 2 +
                (positions[i3 + 2] ?? 0) ** 2
            )

            if (radius > 25) {
                positions[i3] = ((positions[i3] ?? 0) / radius) * 5
                positions[i3 + 1] = ((positions[i3 + 1] ?? 0) / radius) * 5
                positions[i3 + 2] = ((positions[i3 + 2] ?? 0) / radius) * 5
            }
        }

        positionAttr.needsUpdate = true

        // Rotate the entire system
        meshRef.current.rotation.y += delta * 0.1
        meshRef.current.rotation.x += delta * 0.05
    })

    return (
        <points ref={meshRef} geometry={geometry}>
            <pointsMaterial
                ref={materialRef}
                size={0.1}
                color={theme === 'dark' ? '#ffffff' : '#000000'}
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}


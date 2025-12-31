'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WireframeSphereProps {
    theme: 'light' | 'dark'
}

export default function WireframeSphere({ theme }: WireframeSphereProps) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return

        const time = state.clock.elapsedTime

        // Slow rotation
        meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.3
        meshRef.current.rotation.y = time * 0.15

        // Subtle scale pulse
        const scale = 1 + Math.sin(time * 0.5) * 0.05
        meshRef.current.scale.setScalar(scale)
    })

    return (
        <mesh ref={meshRef} position={[-3, 2, -5]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshBasicMaterial
                color={theme === 'dark' ? '#ffffff' : '#000000'}
                wireframe
                transparent
                opacity={0.2}
            />
        </mesh>
    )
}


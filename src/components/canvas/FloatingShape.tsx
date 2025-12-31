'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
interface FloatingShapeProps {
    theme: 'light' | 'dark'
}

export default function FloatingShape({ theme }: FloatingShapeProps) {
    const meshRef = useRef<THREE.Mesh>(null)

    // Inertia refs
    const targetRotation = useRef({ x: 0, y: 0 })

    useFrame((state, delta) => {
        if (!meshRef.current) return

        // 1. Automatic slow idle rotation
        // Smoother, less linear feel
        const time = state.clock.elapsedTime
        meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.2 + (time * 0.05)
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
            meshRef.current.rotation.x,
            Math.sin(time * 0.5) * 0.1,
            delta * 0.5
        )

        // 2. Mouse Interaction (Parallax)
        // state.mouse is normalized (-1 to 1)
        const mouseX = state.mouse.x * 0.8 // Increased sensitivity
        const mouseY = state.mouse.y * 0.8

        // Smoothly interpolate towards mouse target (Inertia)
        targetRotation.current.x = -mouseY
        targetRotation.current.y = mouseX

        // Apply rotation with dampening - Slower, heavier feel for "premium" weight
        const dampening = 3 * delta

        // Add mouse influence to the base rotation
        meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * dampening * 0.2
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotation.current.y, dampening)

        // Subtle positional parallax - feels like it's "watching" the cursor
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 2 + state.mouse.x * 0.5, dampening)
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, state.mouse.y * 0.5, dampening)
    })

    // Material settings: "Soft materials: glass, matte plastic, subtle metal"
    // Low saturation, neutral tones
    const materialProps = theme === 'dark'
        ? {
            color: '#2a2a2a',
            roughness: 0.4,
            metalness: 0.5,
            clearcoat: 0.1,
            clearcoatRoughness: 0.1,
        }
        : {
            color: '#f0f0f0',
            roughness: 0.2, // More glass/ceramic like
            metalness: 0.1,
            transmission: 0.0, // Keeping it opaque but soft for now to ensure visibility
            clearcoat: 0.8,
            clearcoatRoughness: 0.2,
        }

    return (
        <group>
            <mesh ref={meshRef} scale={1.5} position={[2, 0, 0]}>
                {/* Abstract Geometry: Icosahedron is good for "engineered" look */}
                <icosahedronGeometry args={[1, 0]} />
                <meshPhysicalMaterial
                    {...materialProps}
                    envMapIntensity={0.8}
                />
            </mesh>
        </group>
    )
}

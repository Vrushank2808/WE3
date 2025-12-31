'use client'

import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MathUtils } from 'three'

interface DebrisFieldProps {
    count?: number
    theme: 'light' | 'dark'
}

export default function DebrisField({ count = 40, theme }: DebrisFieldProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    // const { viewport } = useThree() // Not needed for Z-distribution logic

    // Geometry: Tetrahedrons look "tech" and "angular"
    const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.5, 0), [])

    // Themes
    const material = useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            color: theme === 'dark' ? '#333' : '#e0e0e0',
            roughness: 0.6,
            metalness: 0.2,
            transparent: true,
            opacity: theme === 'dark' ? 0.4 : 0.6,
            side: THREE.DoubleSide
        })
    }, [theme])

    // Generate random particles
    const particles = useMemo(() => {
        const temp = []

        // We want particles from Z = 8 (just in front of camera) to Z = -40 (deep background)
        // Camera moves from 10 to -20.
        // So visual field needs to cover that range + buffer.

        for (let i = 0; i < count; i++) {
            const x = MathUtils.randFloatSpread(15) // Wider spread
            const y = MathUtils.randFloatSpread(15) // Full screen coverage

            // Z distribution: Bias towards negative (distance)
            // Uniform spread from 5 to -50
            const z = MathUtils.randFloat(5, -50)

            const scale = MathUtils.randFloat(0.2, 1.5)
            const rotationSpeed = MathUtils.randFloat(0.2, 0.8)

            temp.push({ x, y, z, scale, rotationSpeed, initialY: y })
        }
        return temp
    }, [count])

    // Initial placement
    useLayoutEffect(() => {
        if (!meshRef.current) return
        const tempObject = new THREE.Object3D()

        particles.forEach((p, i) => {
            tempObject.position.set(p.x, p.y, p.z)
            tempObject.scale.setScalar(p.scale)
            tempObject.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
            tempObject.updateMatrix()
            meshRef.current?.setMatrixAt(i, tempObject.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [particles])

    // Animation Loop: subtle floating + rotation + velocity warp
    useFrame((state, delta) => {
        if (!meshRef.current) return
        const tempObject = new THREE.Object3D()
        const time = state.clock.elapsedTime

        // Calculate scroll velocity (approximate via delta of camera Y or use ScrollManager store if we had one)
        // For now, let's just make them responsive to "time" and "camera movement"
        // Since we don't have direct access to velocity here without a store, 
        // we can use a simpler trick: The faster we move, the more we stretch?
        // Actually, ScrollManager is moving the CAMERA. The objects are static.
        // So relative to the camera, they appear to blur.

        // To add the "reverse" feel, we want them to perhaps rotate based on the VIEWING ANGLE.

        particles.forEach((p, i) => {
            // 1. Get current instance matrix
            meshRef.current?.getMatrixAt(i, tempObject.matrix)
            tempObject.matrix.decompose(tempObject.position, tempObject.quaternion, tempObject.scale)

            // 2. Animate rotation - Constant
            tempObject.rotation.x += p.rotationSpeed * delta * 0.2
            tempObject.rotation.y += p.rotationSpeed * delta * 0.1

            // 3. Subtle vertical float
            tempObject.position.y = p.initialY + Math.sin(time * 0.5 + i) * 0.5

            // Update matrix
            tempObject.updateMatrix()
            meshRef.current?.setMatrixAt(i, tempObject.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh
            ref={meshRef}
            args={[geometry, material, count]}
            frustumCulled={false} // Since we move camera, keep them all rendered or manage logic better
        />
    )
}

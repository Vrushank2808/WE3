'use client'

import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense } from 'react'
import FloatingShape from './FloatingShape'
import ScrollManager from './ScrollManager'
import DebrisField from './DebrisField'
import AnimatedParticles from './AnimatedParticles'
import WireframeSphere from './WireframeSphere'
import { useTheme } from '@/components/providers/ThemeProvider'

function SceneInner() {
    const { theme } = useTheme()

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none">
            <Canvas
                dpr={[1, 1.5]} // Cap DPR for performance on high-res screens
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                camera={{ position: [0, 0, 10], fov: 45 }}
            >
                <ScrollManager />

                <Suspense fallback={null}>
                    {/* Lighting setup */}
                    <ambientLight intensity={theme === 'dark' ? 0.8 : 1.2} />
                    <spotLight
                        position={[20, 20, 20]}
                        angle={0.2}
                        penumbra={1}
                        decay={0}
                        intensity={2}
                        color="#ffffff"
                    />
                    <pointLight position={[-10, 0, -10]} decay={0} intensity={1} color="#ffffff" />

                    {/* Content */}
                    <group position={[0, 0, 0]}>
                        {/* The main hero shape - we'll let it move with camera initially or stay static relative to world? 
                             If we put it in a group that DOESN'T move with camera, it will scroll away. 
                             But ScrollManager moves the CAMERA. So static objects appear to move UP.
                             Correct.
                         */}
                        <FloatingShape theme={theme} />
                    </group>

                    {/* Background Field */}
                    <DebrisField theme={theme} count={60} />

                    {/* Additional 3D Elements */}
                    <AnimatedParticles theme={theme} count={80} />
                    <WireframeSphere theme={theme} />

                    {/* Soft studio lighting environment */}
                    <Environment preset="city" environmentIntensity={theme === 'dark' ? 0.5 : 0.8} />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default dynamic(() => Promise.resolve(SceneInner), {
    ssr: false,
    loading: () => null,
})

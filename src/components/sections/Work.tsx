'use client'

// import styles from './Services.module.css'
// Reusing general section styles
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function Work() {
    return (
        <section id="work" className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <ScrollReveal>
                    <h2 className="text-title gradient-text" style={{ marginBottom: '1rem' }}>
                        Selected Work
                    </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <div style={{
                        padding: '3rem',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '24px',
                        backdropFilter: 'blur(10px)',
                        maxWidth: '600px',
                        margin: '2rem auto'
                    }}>
                        <motion.h3
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                fontSize: '2rem',
                                fontWeight: 300,
                                letterSpacing: '-0.02em',
                                marginBottom: '0.5rem'
                            }}
                        >
                            Coming Soon
                        </motion.h3>
                        <p className="text-body">
                            We are currently curating our finest projects. Check back shortly.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}

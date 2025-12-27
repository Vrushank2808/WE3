import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { SITE_CONFIG, SERVICES } from '@/lib/constants'
import { generateServiceSchema } from '@/lib/seo'

// Static imports for above-the-fold content (critical for LCP)
import Intro from '@/components/sections/Intro'
import Identity from '@/components/sections/Identity'

// Dynamic imports for below-the-fold content (code splitting)
const Services = dynamic(() => import('@/components/sections/Services'), {
  loading: () => <section aria-label="Loading services" />,
})
const Work = dynamic(() => import('@/components/sections/Work'), {
  loading: () => <section aria-label="Loading work" />,
})
const Process = dynamic(() => import('@/components/sections/Process'), {
  loading: () => <section aria-label="Loading process" />,
})
const Why = dynamic(() => import('@/components/sections/Why'), {
  loading: () => <section aria-label="Loading" />,
})
const Contact = dynamic(() => import('@/components/sections/Contact'), {
  loading: () => <section aria-label="Loading contact" />,
})

// Page-specific metadata
export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

// Generate structured data for services
function ServiceStructuredData() {
  const servicesSchema = SERVICES.map((service, index) =>
    generateServiceSchema(service, index)
  )

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(servicesSchema),
      }}
    />
  )
}

export default function HomePage() {
  return (
    <>
      <ServiceStructuredData />
      <main id="main-content" role="main">
        <Intro />
        <Identity />
        <Services />
        <Work />
        <Process />
        <Why />
        <Contact />
      </main>
    </>
  )
}

/**
 * SEO utility functions for generating metadata
 */

import type { Metadata } from 'next'
import { SITE_CONFIG, SEO_DEFAULTS } from '../constants/site'
import type { PageSEO, OpenGraphImage } from '../types'

/**
 * Generate comprehensive metadata for a page
 */
export function generatePageMetadata(seo: Partial<PageSEO>): Metadata {
  const title = seo.title || SITE_CONFIG.title
  const description = seo.description || SITE_CONFIG.description
  const canonical = seo.canonical || SITE_CONFIG.url

  const openGraphImages: OpenGraphImage[] = seo.openGraph?.images || [
    {
      url: `${SITE_CONFIG.url}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: SITE_CONFIG.name,
    },
  ]

  return {
    title,
    description,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical,
    },
    openGraph: {
      title: seo.openGraph?.title || title,
      description: seo.openGraph?.description || description,
      url: seo.openGraph?.url || canonical,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'website',
      images: openGraphImages,
    },
    twitter: {
      card: seo.twitter?.card || 'summary_large_image',
      title: seo.openGraph?.title || title,
      description: seo.openGraph?.description || description,
      site: SEO_DEFAULTS.twitter.site,
      creator: seo.twitter?.creator || SEO_DEFAULTS.twitter.handle,
      images: openGraphImages.map((img) => img.url),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add verification tokens here when available
      // google: 'your-google-verification-code',
    },
  }
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    sameAs: [SITE_CONFIG.social.linkedin, SITE_CONFIG.social.instagram],
  }
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate JSON-LD structured data for services
 */
export function generateServiceSchema(
  service: { title: string; description: string },
  index: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    position: index + 1,
  }
}

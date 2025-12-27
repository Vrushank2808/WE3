import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Add other static routes here if they exist in the future
  ]
}

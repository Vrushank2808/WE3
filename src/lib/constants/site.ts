/**
 * Site-wide constants and configuration
 * Centralized configuration for SEO, branding, and site metadata
 */

export const SITE_CONFIG = {
  name: 'Crevix',
  title: 'Crevix | Premium Web Design & Development Agency',
  description:
    'Crevix is a boutique digital agency specializing in premium web design, development, and digital storytelling.',
  shortDescription: 'Premium editorial web design and digital storytelling.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://crevix.agency',
  locale: 'en_US',
  type: 'website',
  author: 'Crevix',
  email: 'hello@crevix.agency',
  social: {
    twitter: '@crevix',
    linkedin: 'https://linkedin.com/company/crevix',
    instagram: 'https://www.instagram.com/crevix.works/?utm_source=ig_web_button_share_sheet',
  },
} as const

export const SEO_DEFAULTS = {
  titleTemplate: '%s | Crevix',
  defaultTitle: SITE_CONFIG.title,
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    handle: SITE_CONFIG.social.twitter,
    site: SITE_CONFIG.social.twitter,
    cardType: 'summary_large_image',
  },
} as const

export const NAVIGATION = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
] as const

export const SERVICES = [
  {
    id: 'design',
    title: 'Design',
    description:
      'Clean, intentional interfaces that communicate your brand story with elegance and clarity.',
    iconName: 'design',
  },
  {
    id: 'development',
    title: 'Development',
    description:
      'Fast, reliable, scalable code built with modern technologies and best practices.',
    iconName: 'code',
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description:
      'We stay involved. Continuous support, updates, and improvements to keep you ahead.',
    iconName: 'settings',
  },
] as const

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Listen',
    description:
      'We understand your business, goals, and constraints before writing a single line of code.',
  },
  {
    number: '02',
    title: 'Build',
    description:
      'We design and develop with care, keeping you updated at key stages throughout the journey.',
  },
  {
    number: '03',
    title: 'Launch',
    description:
      "Everything is tested properly before going live. We don't cut corners.",
  },
] as const

export const PROJECTS = [
  {
    id: 1,
    title: 'Luxe Boutique',
    category: 'E-Commerce',
    gradient: 'linear-gradient(135deg, var(--glass-bg) 0%, var(--card-bg) 100%)',
    slug: 'luxe-boutique',
  },
  {
    id: 2,
    title: 'Fintech Dashboard',
    category: 'Web Application',
    gradient: 'linear-gradient(225deg, var(--glass-bg) 0%, var(--card-bg) 100%)',
    slug: 'fintech-dashboard',
  },
  {
    id: 3,
    title: 'Creative Studio',
    category: 'Portfolio',
    gradient: 'linear-gradient(90deg, var(--glass-bg) 0%, var(--card-bg) 100%)',
    slug: 'creative-studio',
  },
] as const

export type Service = (typeof SERVICES)[number]
export type ProcessStep = (typeof PROCESS_STEPS)[number]
export type Project = (typeof PROJECTS)[number]
export type NavItem = (typeof NAVIGATION)[number]

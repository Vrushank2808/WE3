/**
 * Type definitions for component props and shared interfaces
 */

import type { ReactNode, CSSProperties } from 'react'

// Generic component props
export interface BaseComponentProps {
  className?: string
  style?: CSSProperties
  id?: string
}

export interface WithChildren {
  children: ReactNode
}

// Section components
export interface SectionProps extends BaseComponentProps {
  id: string
}

// Animation-related types
export interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string
}

// SEO-related types
export interface PageSEO {
  title: string
  description: string
  canonical?: string
  openGraph?: OpenGraphData
  twitter?: TwitterCardData
}

export interface OpenGraphData {
  title?: string
  description?: string
  url?: string
  type?: string
  images?: OpenGraphImage[]
}

export interface OpenGraphImage {
  url: string
  width?: number
  height?: number
  alt?: string
}

export interface TwitterCardData {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  creator?: string
}

// Service data type
export interface ServiceData {
  id: string
  title: string
  description: string
  iconName: string
}

// Project data type
export interface ProjectData {
  id: number
  title: string
  category: string
  gradient: string
  slug: string
  description?: string
  image?: string
}

// Process step type
export interface ProcessStepData {
  number: string
  title: string
  description: string
}

// Form-related types
export interface ContactFormData {
  name: string
  email: string
  message: string
  company?: string
}

export interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}

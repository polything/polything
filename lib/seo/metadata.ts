/**
 * SEO Metadata Generation Utilities
 * Generates Next.js metadata for pages with proper fallbacks
 */

import { Metadata } from 'next'
import { Doc, canonicalFor, pickSeoTitle, pickSeoDesc, pickImage } from './structured-data'

export interface MetadataOptions {
  baseUrl: string
  siteName: string
  defaultDescription?: string
  defaultImage?: string
  twitterHandle?: string
}

/**
 * Generates Next.js metadata for a document
 */
export function generateMetadata(
  doc: Doc,
  options: MetadataOptions
): Metadata {
  const {
    baseUrl,
    siteName,
    defaultDescription = 'Strategic Marketing for Visionary Brands',
    defaultImage = '/images/og-default.jpg',
    twitterHandle = '@polything'
  } = options

  const title = pickSeoTitle(doc)
  const description = pickSeoDesc(doc) || defaultDescription
  const canonical = canonicalFor(baseUrl, doc)
  const image = pickImage(doc, baseUrl) || absoluteUrl(baseUrl, defaultImage)

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`
    },
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'en_GB',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: twitterHandle,
      site: twitterHandle
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

/**
 * Generates site-wide metadata
 */
export function generateSiteMetadata(options: MetadataOptions): Metadata {
  const {
    baseUrl,
    siteName,
    defaultDescription = 'Strategic Marketing for Visionary Brands',
    defaultImage = '/images/og-default.jpg',
    twitterHandle = '@polything'
  } = options

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`
    },
    description: defaultDescription,
    keywords: [
      'marketing strategy',
      'brand strategy',
      'growth marketing',
      'digital marketing',
      'content strategy',
      'marketing consultancy',
      'startup marketing',
      'B2B marketing'
    ],
    authors: [{ name: 'Polything Ltd' }],
    creator: 'Polything Ltd',
    publisher: 'Polything Ltd',
    alternates: {
      canonical: baseUrl
    },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      url: baseUrl,
      siteName,
      title: siteName,
      description: defaultDescription,
      images: [
        {
          url: absoluteUrl(baseUrl, defaultImage),
          width: 1200,
          height: 630,
          alt: siteName
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: siteName,
      description: defaultDescription,
      images: [absoluteUrl(baseUrl, defaultImage)]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION
    }
  }
}

/**
 * Generates metadata for static pages
 */
export function generateStaticPageMetadata(
  doc: Doc,
  options: MetadataOptions
): Metadata {
  return generateMetadata(doc, options)
}

/**
 * Generates metadata for blog posts
 */
export function generateBlogPostMetadata(
  doc: Doc,
  options: MetadataOptions
): Metadata {
  const baseMetadata = generateMetadata(doc, options)
  
  // Add article-specific metadata
  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'article',
      publishedTime: doc.date,
      modifiedTime: doc.updated,
      authors: doc.seo?.schema?.author ? [doc.seo.schema.author] : ['Polything Ltd'],
      section: 'Blog',
      tags: doc.tags || []
    },
    twitter: {
      ...baseMetadata.twitter,
      card: 'summary_large_image'
    }
  }
}

/**
 * Generates metadata for project pages
 */
export function generateProjectMetadata(
  doc: Doc,
  options: MetadataOptions
): Metadata {
  const baseMetadata = generateMetadata(doc, options)
  
  // Add project-specific metadata
  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'website',
      section: 'Work'
    }
  }
}

/**
 * Utility function to generate absolute URL
 */
function absoluteUrl(base: string, path: string): string {
  if (!path.startsWith('/')) return path
  return base.replace(/\/$/, '') + path
}

/**
 * Validates metadata for SEO best practices
 */
export function validateMetadata(metadata: Metadata): {
  valid: boolean
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []

  // Check title length
  if (metadata.title && typeof metadata.title === 'string') {
    if (metadata.title.length > 60) {
      warnings.push(`Title too long: ${metadata.title.length} characters. Recommended max: 60.`)
    }
    if (metadata.title.length < 30) {
      warnings.push(`Title too short: ${metadata.title.length} characters. Recommended min: 30.`)
    }
  }

  // Check description length
  if (metadata.description) {
    if (metadata.description.length > 160) {
      warnings.push(`Description too long: ${metadata.description.length} characters. Recommended max: 160.`)
    }
    if (metadata.description.length < 120) {
      warnings.push(`Description too short: ${metadata.description.length} characters. Recommended min: 120.`)
    }
  }

  // Check for required fields
  if (!metadata.title) {
    errors.push('Title is required')
  }

  if (!metadata.description) {
    errors.push('Description is required')
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors
  }
}

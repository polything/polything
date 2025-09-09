/**
 * JSON-LD Structured Data Generation Utilities
 * Based on PRD requirements for SEO schema implementation
 */

import { ContentType, SEOSchema } from '@/lib/content/schema'

export interface Doc {
  type: 'page' | 'post' | 'project' | string
  slug: string
  title: string
  excerpt?: string
  date?: string
  updated?: string
  hero?: { image?: string }
  seo?: SEOSchema
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface OrganizationOptions {
  name: string
  logo?: string
  sameAs?: string[]
  contactPoint?: {
    telephone?: string
    email?: string
    contactType?: string
  }
}

/**
 * Generates absolute URL from base URL and path
 */
export function absoluteUrl(base: string, path: string): string {
  if (!path.startsWith('/')) return path
  return base.replace(/\/$/, '') + path
}

/**
 * Generates canonical URL for a document
 */
export function canonicalFor(base: string, doc: Doc): string {
  if (doc?.seo?.canonical) return doc.seo.canonical
  
  const path =
    doc.type === 'project' ? `/work/${doc.slug}` :
    doc.type === 'post'    ? `/blog/${doc.slug}` :
    `/${doc.slug}`
  
  return absoluteUrl(base, path)
}

/**
 * Picks SEO title with fallback to document title
 */
export function pickSeoTitle(doc: Doc): string {
  return doc?.seo?.title || doc.title
}

/**
 * Picks SEO description with fallback to excerpt, truncated to 160 chars
 */
export function pickSeoDesc(doc: Doc): string | undefined {
  const d = doc?.seo?.description || doc.excerpt || ''
  return d.length > 0 ? (d.length > 160 ? (d.slice(0, 157) + '…') : d) : undefined
}

/**
 * Picks schema type with content type defaults
 */
export function pickSchemaType(doc: Doc): 'WebPage' | 'Article' | 'BlogPosting' | 'CreativeWork' {
  const manual = doc?.seo?.schema?.type
  if (manual) return manual
  
  if (doc.type === 'project') return 'CreativeWork'
  if (doc.type === 'post') return 'BlogPosting'
  return 'WebPage'
}

/**
 * Picks image URL with fallback to hero image
 */
export function pickImage(doc: Doc, base: string): string | undefined {
  const img = doc?.seo?.schema?.image || doc?.hero?.image
  return img ? absoluteUrl(base, img) : undefined
}

/**
 * Extracts article dates for BlogPosting schema
 */
export function articleDates(doc: Doc): { datePublished?: string; dateModified?: string } {
  return {
    datePublished: doc?.seo?.schema?.publishDate || doc?.date,
    dateModified: doc?.seo?.schema?.modifiedDate || doc?.updated || doc?.date,
  }
}

/**
 * Generates BreadcrumbList JSON-LD
 */
export function breadcrumbsJsonLd(base: string, crumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: absoluteUrl(base, c.url),
    })),
  }
}

/**
 * Generates Organization JSON-LD
 */
export function orgJsonLd(base: string, opts: OrganizationOptions) {
  const org: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: opts.name,
    url: base,
  }

  if (opts.logo) {
    org.logo = absoluteUrl(base, opts.logo)
  }

  if (opts.sameAs?.length) {
    org.sameAs = opts.sameAs
  }

  if (opts.contactPoint) {
    org.contactPoint = {
      '@type': 'ContactPoint',
      ...opts.contactPoint,
    }
  }

  return org
}

/**
 * Generates Website JSON-LD
 */
export function websiteJsonLd(base: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: base,
  }
}

/**
 * Generates WebPage JSON-LD
 */
export function pageJsonLd(base: string, doc: Doc) {
  const url = canonicalFor(base, doc)
  const name = pickSeoTitle(doc)
  
  const page: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    headline: name,
    url,
  }

  const description = pickSeoDesc(doc)
  if (description) {
    page.description = description
  }

  const { dateModified } = articleDates(doc)
  if (dateModified) {
    page.dateModified = dateModified
  }

  const image = pickImage(doc, base)
  if (image) {
    page.image = image
  }

  return page
}

/**
 * Generates BlogPosting JSON-LD
 */
export function articleJsonLd(base: string, doc: Doc) {
  const url = canonicalFor(base, doc)
  const name = pickSeoTitle(doc)
  const { datePublished, dateModified } = articleDates(doc)
  
  const article: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: name,
    url,
    mainEntityOfPage: url,
  }

  const description = pickSeoDesc(doc)
  if (description) {
    article.description = description
  }

  const image = pickImage(doc, base)
  if (image) {
    article.image = [image]
  }

  if (datePublished) {
    article.datePublished = datePublished
  }

  if (dateModified) {
    article.dateModified = dateModified
  }

  if (doc?.seo?.schema?.author) {
    article.author = {
      '@type': 'Organization',
      name: doc.seo.schema.author,
    }
  }

  return article
}

/**
 * Generates CreativeWork JSON-LD for projects
 */
export function creativeWorkJsonLd(base: string, doc: Doc) {
  const url = canonicalFor(base, doc)
  const name = pickSeoTitle(doc)
  
  const work: any = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    url,
  }

  const description = pickSeoDesc(doc)
  if (description) {
    work.description = description
  }

  const image = pickImage(doc, base)
  if (image) {
    work.image = [image]
  }

  const { dateModified } = articleDates(doc)
  if (dateModified) {
    work.dateModified = dateModified
  }

  return work
}

/**
 * Generates appropriate JSON-LD based on document type
 */
export function generateJsonLd(base: string, doc: Doc) {
  const schemaType = pickSchemaType(doc)
  
  switch (schemaType) {
    case 'BlogPosting':
      return articleJsonLd(base, doc)
    case 'CreativeWork':
      return creativeWorkJsonLd(base, doc)
    case 'WebPage':
    default:
      return pageJsonLd(base, doc)
  }
}

/**
 * Generates all JSON-LD for a page including breadcrumbs if present
 */
export function generateAllJsonLd(base: string, doc: Doc) {
  const jsonLd = [generateJsonLd(base, doc)]
  
  // Add breadcrumbs if present
  if (doc?.seo?.schema?.breadcrumbs?.length) {
    jsonLd.push(breadcrumbsJsonLd(base, doc.seo.schema.breadcrumbs))
  }
  
  return jsonLd
}

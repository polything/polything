/**
 * Tests for SEO Metadata Generation Utilities
 */

import { Metadata } from 'next'
import {
  generateMetadata,
  generateSiteMetadata,
  generateStaticPageMetadata,
  generateBlogPostMetadata,
  generateProjectMetadata,
  validateMetadata,
  MetadataOptions,
  Doc
} from './metadata'

describe('SEO Metadata Generation', () => {
  const baseOptions: MetadataOptions = {
    baseUrl: 'https://polything.co.uk',
    siteName: 'Polything',
    defaultDescription: 'Strategic Marketing for Visionary Brands',
    defaultImage: '/images/og-default.jpg',
    twitterHandle: '@polything'
  }

  describe('generateMetadata', () => {
    test('generates basic metadata for a document', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'about',
        title: 'About Us',
        excerpt: 'Learn about our company'
      }

      const metadata = generateMetadata(doc, baseOptions)

      expect(metadata.title).toEqual({
        default: 'About Us',
        template: '%s | Polything'
      })
      expect(metadata.description).toBe('Learn about our company')
      expect(metadata.alternates?.canonical).toBe('https://polything.co.uk/about')
      expect(metadata.openGraph?.title).toBe('About Us')
      expect(metadata.openGraph?.description).toBe('Learn about our company')
      expect(metadata.openGraph?.url).toBe('https://polything.co.uk/about')
      expect(metadata.openGraph?.siteName).toBe('Polything')
      expect(metadata.twitter?.title).toBe('About Us')
      expect(metadata.twitter?.description).toBe('Learn about our company')
    })

    test('uses SEO overrides when present', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'about',
        title: 'About Us',
        excerpt: 'Learn about our company',
        seo: {
          title: 'SEO Title',
          description: 'SEO Description',
          canonical: 'https://custom.com/about'
        }
      }

      const metadata = generateMetadata(doc, baseOptions)

      expect(metadata.title?.default).toBe('SEO Title')
      expect(metadata.description).toBe('SEO Description')
      expect(metadata.alternates?.canonical).toBe('https://custom.com/about')
    })

    test('falls back to default description when no excerpt or SEO description', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'about',
        title: 'About Us'
      }

      const metadata = generateMetadata(doc, baseOptions)

      expect(metadata.description).toBe('Strategic Marketing for Visionary Brands')
    })

    test('includes hero image in OpenGraph', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'about',
        title: 'About Us',
        hero: { image: '/images/about-hero.jpg' }
      }

      const metadata = generateMetadata(doc, baseOptions)

      expect(metadata.openGraph?.images?.[0]?.url).toBe('https://polything.co.uk/images/about-hero.jpg')
      expect(metadata.openGraph?.images?.[0]?.alt).toBe('About Us')
    })

    test('includes SEO schema image when present', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'about',
        title: 'About Us',
        hero: { image: '/images/about-hero.jpg' },
        seo: {
          schema: { image: '/images/seo-image.jpg' }
        }
      }

      const metadata = generateMetadata(doc, baseOptions)

      expect(metadata.openGraph?.images?.[0]?.url).toBe('https://polything.co.uk/images/seo-image.jpg')
    })
  })

  describe('generateSiteMetadata', () => {
    test('generates site-wide metadata', () => {
      const metadata = generateSiteMetadata(baseOptions)

      expect(metadata.metadataBase).toEqual(new URL('https://polything.co.uk'))
      expect(metadata.title).toEqual({
        default: 'Polything',
        template: '%s | Polything'
      })
      expect(metadata.description).toBe('Strategic Marketing for Visionary Brands')
      expect(metadata.keywords).toContain('marketing strategy')
      expect(metadata.authors).toEqual([{ name: 'Polything Ltd' }])
      expect(metadata.openGraph?.type).toBe('website')
      expect(metadata.openGraph?.locale).toBe('en_GB')
      expect(metadata.twitter?.card).toBe('summary_large_image')
    })
  })

  describe('generateStaticPageMetadata', () => {
    test('generates metadata for static pages', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'contact',
        title: 'Contact Us',
        excerpt: 'Get in touch with our team'
      }

      const metadata = generateStaticPageMetadata(doc, baseOptions)

      expect(metadata.title?.default).toBe('Contact Us')
      expect(metadata.description).toBe('Get in touch with our team')
      expect(metadata.openGraph?.type).toBe('website')
    })
  })

  describe('generateBlogPostMetadata', () => {
    test('generates article-specific metadata for blog posts', () => {
      const doc: Doc = {
        type: 'post',
        slug: 'marketing-tips',
        title: 'Marketing Tips',
        excerpt: 'Learn effective marketing strategies',
        date: '2024-01-01',
        updated: '2024-01-15',
        tags: ['marketing', 'strategy'],
        seo: {
          schema: { author: 'John Doe' }
        }
      }

      const metadata = generateBlogPostMetadata(doc, baseOptions)

      expect(metadata.title?.default).toBe('Marketing Tips')
      expect(metadata.openGraph?.type).toBe('article')
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-01')
      expect(metadata.openGraph?.modifiedTime).toBe('2024-01-15')
      expect(metadata.openGraph?.authors).toEqual(['John Doe'])
      expect(metadata.openGraph?.section).toBe('Blog')
      expect(metadata.openGraph?.tags).toEqual(['marketing', 'strategy'])
    })

    test('falls back to default author when not specified', () => {
      const doc: Doc = {
        type: 'post',
        slug: 'marketing-tips',
        title: 'Marketing Tips',
        date: '2024-01-01'
      }

      const metadata = generateBlogPostMetadata(doc, baseOptions)

      expect(metadata.openGraph?.authors).toEqual(['Polything Ltd'])
    })
  })

  describe('generateProjectMetadata', () => {
    test('generates project-specific metadata', () => {
      const doc: Doc = {
        type: 'project',
        slug: 'client-case-study',
        title: 'Client Case Study',
        excerpt: 'A successful project case study'
      }

      const metadata = generateProjectMetadata(doc, baseOptions)

      expect(metadata.title?.default).toBe('Client Case Study')
      expect(metadata.openGraph?.type).toBe('website')
      expect(metadata.openGraph?.section).toBe('Work')
    })
  })

  describe('validateMetadata', () => {
    test('validates metadata and returns warnings for length issues', () => {
      const metadata: Metadata = {
        title: 'This is a very long title that exceeds the recommended 60 character limit for SEO purposes',
        description: 'This is a very long description that exceeds the recommended 160 character limit for SEO purposes and should trigger a warning in the validation system to help content creators'
      }

      const result = validateMetadata(metadata)

      expect(result.valid).toBe(true)
      expect(result.warnings).toContain('Title too long: 90 characters. Recommended max: 60.')
      expect(result.warnings).toContain('Description too long: 176 characters. Recommended max: 160.')
    })

    test('returns errors for missing required fields', () => {
      const metadata: Metadata = {}

      const result = validateMetadata(metadata)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Title is required')
      expect(result.errors).toContain('Description is required')
    })

    test('returns warnings for short titles and descriptions', () => {
      const metadata: Metadata = {
        title: 'Short',
        description: 'Too short'
      }

      const result = validateMetadata(metadata)

      expect(result.valid).toBe(true)
      expect(result.warnings).toContain('Title too short: 5 characters. Recommended min: 30.')
      expect(result.warnings).toContain('Description too short: 9 characters. Recommended min: 120.')
    })

    test('passes validation for optimal metadata', () => {
      const metadata: Metadata = {
        title: 'Perfect Length Title for SEO Optimization',
        description: 'This is a perfectly sized description that falls within the recommended 120-160 character range for optimal SEO performance and user experience.'
      }

      const result = validateMetadata(metadata)

      expect(result.valid).toBe(true)
      expect(result.warnings).toHaveLength(0)
      expect(result.errors).toHaveLength(0)
    })
  })
})

/**
 * Tests for Static Page Component
 * Validates JSON-LD generation and metadata
 */

import { render } from '@testing-library/react'
import { notFound } from 'next/navigation'
import StaticPage, { generateMetadata } from './page'
import { generateAllJsonLd } from '@/lib/seo/structured-data'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('contentlayer2/generated', () => ({
  allPages: [
    {
      slug: 'test-page',
      title: 'Test Page',
      date: '2024-01-01',
      updated: '2024-01-15',
      categories: ['About'],
      tags: ['test'],
      hero: {
        title: 'Test Page Hero',
        subtitle: 'A test page for validation',
        image: '/images/page-hero.jpg'
      },
      seo: {
        title: 'SEO Test Page',
        description: 'This is a test page for SEO validation purposes',
        canonical: 'https://polything.co.uk/test-page',
        schema: {
          type: 'WebPage',
          image: '/images/seo-image.jpg',
          author: 'Polything Ltd',
          publishDate: '2024-01-01',
          modifiedDate: '2024-01-15'
        }
      },
      body: {
        code: '<p>Test page content</p>'
      }
    }
  ]
}))

jest.mock('@/components/hero', () => {
  return function MockHero({ hero }: { hero: any }) {
    return <div data-testid="hero">{hero.title}</div>
  }
})

jest.mock('next-contentlayer2/hooks', () => ({
  MDXContent: ({ code }: { code: string }) => <div dangerouslySetInnerHTML={{ __html: code }} />
}))

describe('Static Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateMetadata', () => {
    test('generates correct metadata for existing page', async () => {
      const metadata = await generateMetadata({ params: { slug: 'test-page' } })

      expect(metadata.title?.default).toBe('SEO Test Page')
      expect(metadata.description).toBe('This is a test page for SEO validation purposes')
      expect(metadata.alternates?.canonical).toBe('https://polything.co.uk/test-page')
      expect(metadata.openGraph?.title).toBe('SEO Test Page')
      expect(metadata.openGraph?.type).toBe('website')
    })

    test('returns not found metadata for non-existent page', async () => {
      const metadata = await generateMetadata({ params: { slug: 'non-existent' } })

      expect(metadata.title).toBe('Page Not Found')
    })
  })

  describe('StaticPage Component', () => {
    test('renders page with correct JSON-LD structured data', async () => {
      const { container } = render(await StaticPage({ params: { slug: 'test-page' } }))

      // Check for JSON-LD scripts
      const scripts = container.querySelectorAll('script[type="application/ld+json"]')
      expect(scripts.length).toBeGreaterThan(0)

      // Parse and validate JSON-LD content
      const jsonLdContent = JSON.parse(scripts[0].innerHTML)
      expect(jsonLdContent['@context']).toBe('https://schema.org')
      expect(jsonLdContent['@type']).toBe('WebPage')
      expect(jsonLdContent.headline).toBe('SEO Test Page')
      expect(jsonLdContent.url).toBe('https://polything.co.uk/test-page')
      expect(jsonLdContent.description).toBe('This is a test page for SEO validation purposes')
    })

    test('includes hero section when present', async () => {
      const { getByTestId } = render(await StaticPage({ params: { slug: 'test-page' } }))

      expect(getByTestId('hero')).toBeInTheDocument()
      expect(getByTestId('hero')).toHaveTextContent('Test Page Hero')
    })

    test('renders page content', async () => {
      const { container } = render(await StaticPage({ params: { slug: 'test-page' } }))

      expect(container).toHaveTextContent('Test page content')
    })

    test('calls notFound for non-existent page', async () => {
      await StaticPage({ params: { slug: 'non-existent' } })

      expect(notFound).toHaveBeenCalled()
    })
  })

  describe('JSON-LD Validation', () => {
    test('generates valid WebPage schema', () => {
      const page = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: {
          title: 'Test Page Hero',
          image: '/images/page-hero.jpg'
        },
        seo: {
          title: 'SEO Test Page',
          description: 'Test page description',
          schema: {
            type: 'WebPage',
            image: '/images/seo-image.jpg'
          }
        }
      }

      const jsonLdArray = generateAllJsonLd('https://polything.co.uk', page)

      expect(jsonLdArray).toHaveLength(1)
      expect(jsonLdArray[0]['@type']).toBe('WebPage')
      expect(jsonLdArray[0].headline).toBe('SEO Test Page')
      expect(jsonLdArray[0].url).toBe('https://polything.co.uk/test-page')
    })

    test('includes breadcrumbs when present in schema', () => {
      const page = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: {
          title: 'Test Page Hero'
        },
        seo: {
          schema: {
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'About', url: '/about' },
              { name: 'Test Page', url: '/test-page' }
            ]
          }
        }
      }

      const jsonLdArray = generateAllJsonLd('https://polything.co.uk', page)

      expect(jsonLdArray).toHaveLength(2) // WebPage + BreadcrumbList
      expect(jsonLdArray[1]['@type']).toBe('BreadcrumbList')
      expect(jsonLdArray[1].itemListElement).toHaveLength(3)
    })
  })
})
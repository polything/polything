/**
 * Tests for Project Detail Page Component
 * Validates JSON-LD generation and metadata
 */

import { render } from '@testing-library/react'
import { notFound } from 'next/navigation'
import ProjectDetailPage, { generateMetadata } from './page'
import { generateAllJsonLd } from '@/lib/seo/structured-data'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('contentlayer2/generated', () => ({
  allProjects: [
    {
      slug: 'test-project',
      title: 'Test Project',
      date: '2024-01-01',
      updated: '2024-01-15',
      categories: ['Work'],
      tags: ['test'],
      hero: {
        title: 'Test Project Hero',
        subtitle: 'A test project for validation',
        image: '/images/test-hero.jpg'
      },
      links: {
        url: 'https://example.com/project',
        image: '/images/project-link.jpg'
      },
      seo: {
        title: 'SEO Test Project',
        description: 'This is a test project for SEO validation purposes',
        canonical: 'https://polything.co.uk/work/test-project',
        schema: {
          type: 'CreativeWork',
          image: '/images/seo-image.jpg',
          author: 'Polything Ltd',
          publishDate: '2024-01-01',
          modifiedDate: '2024-01-15'
        }
      },
      body: {
        code: '<p>Test project content</p>'
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

describe('Project Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateMetadata', () => {
    test('generates correct metadata for existing project', async () => {
      const metadata = await generateMetadata({ params: { slug: 'test-project' } })

      expect(metadata.title?.default).toBe('SEO Test Project')
      expect(metadata.description).toBe('This is a test project for SEO validation purposes')
      expect(metadata.alternates?.canonical).toBe('https://polything.co.uk/work/test-project')
      expect(metadata.openGraph?.title).toBe('SEO Test Project')
      expect(metadata.openGraph?.type).toBe('website')
      expect(metadata.openGraph?.section).toBe('Work')
    })

    test('returns not found metadata for non-existent project', async () => {
      const metadata = await generateMetadata({ params: { slug: 'non-existent' } })

      expect(metadata.title).toBe('Project Not Found')
    })
  })

  describe('ProjectDetailPage Component', () => {
    test('renders project with correct JSON-LD structured data', async () => {
      const { container } = render(await ProjectDetailPage({ params: { slug: 'test-project' } }))

      // Check for JSON-LD scripts
      const scripts = container.querySelectorAll('script[type="application/ld+json"]')
      expect(scripts.length).toBeGreaterThan(0)

      // Parse and validate JSON-LD content
      const jsonLdContent = JSON.parse(scripts[0].innerHTML)
      expect(jsonLdContent['@context']).toBe('https://schema.org')
      expect(jsonLdContent['@type']).toBe('CreativeWork')
      expect(jsonLdContent.name).toBe('SEO Test Project')
      expect(jsonLdContent.url).toBe('https://polything.co.uk/work/test-project')
      expect(jsonLdContent.description).toBe('This is a test project for SEO validation purposes')
    })

    test('includes hero section when present', async () => {
      const { getByTestId } = render(await ProjectDetailPage({ params: { slug: 'test-project' } }))

      expect(getByTestId('hero')).toBeInTheDocument()
      expect(getByTestId('hero')).toHaveTextContent('Test Project Hero')
    })

    test('renders project content', async () => {
      const { container } = render(await ProjectDetailPage({ params: { slug: 'test-project' } }))

      expect(container).toHaveTextContent('Test project content')
    })

    test('calls notFound for non-existent project', async () => {
      await ProjectDetailPage({ params: { slug: 'non-existent' } })

      expect(notFound).toHaveBeenCalled()
    })
  })

  describe('JSON-LD Validation', () => {
    test('generates valid CreativeWork schema', () => {
      const project = {
        type: 'project',
        slug: 'test-project',
        title: 'Test Project',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: {
          title: 'Test Project Hero',
          image: '/images/test-hero.jpg'
        },
        seo: {
          title: 'SEO Test Project',
          description: 'Test project description',
          schema: {
            type: 'CreativeWork',
            image: '/images/seo-image.jpg'
          }
        }
      }

      const jsonLdArray = generateAllJsonLd('https://polything.co.uk', project)

      expect(jsonLdArray).toHaveLength(1)
      expect(jsonLdArray[0]['@type']).toBe('CreativeWork')
      expect(jsonLdArray[0].name).toBe('SEO Test Project')
      expect(jsonLdArray[0].url).toBe('https://polything.co.uk/work/test-project')
    })

    test('includes breadcrumbs when present in schema', () => {
      const project = {
        type: 'project',
        slug: 'test-project',
        title: 'Test Project',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: {
          title: 'Test Project Hero'
        },
        seo: {
          schema: {
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Work', url: '/work' },
              { name: 'Test Project', url: '/work/test-project' }
            ]
          }
        }
      }

      const jsonLdArray = generateAllJsonLd('https://polything.co.uk', project)

      expect(jsonLdArray).toHaveLength(2) // CreativeWork + BreadcrumbList
      expect(jsonLdArray[1]['@type']).toBe('BreadcrumbList')
      expect(jsonLdArray[1].itemListElement).toHaveLength(3)
    })
  })
})
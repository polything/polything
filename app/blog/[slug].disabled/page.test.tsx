/**
 * Tests for Blog Post Page Component
 * Validates JSON-LD generation and metadata
 */

import { render } from '@testing-library/react'
import { notFound } from 'next/navigation'
import BlogPostPage, { generateMetadata } from './page'
import { generateAllJsonLd } from '@/lib/seo/structured-data'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('contentlayer2/generated', () => ({
  allPosts: [
    {
      slug: 'test-blog-post',
      title: 'Test Blog Post',
      date: '2024-01-01',
      updated: '2024-01-15',
      categories: ['Blog'],
      tags: ['test', 'seo'],
      featured: true,
      hero: {
        title: 'Test Blog Post Hero',
        subtitle: 'A test blog post for validation',
        image: '/images/blog-hero.jpg'
      },
      seo: {
        title: 'SEO Test Blog Post',
        description: 'This is a test blog post for SEO validation purposes',
        canonical: 'https://polything.co.uk/blog/test-blog-post',
        schema: {
          type: 'BlogPosting',
          image: '/images/seo-image.jpg',
          author: 'Polything Ltd',
          publishDate: '2024-01-01',
          modifiedDate: '2024-01-15'
        }
      },
      body: {
        code: '<p>Test blog post content</p>'
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

describe('Blog Post Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateMetadata', () => {
    test('generates correct metadata for existing blog post', async () => {
      const metadata = await generateMetadata({ params: { slug: 'test-blog-post' } })

      expect(metadata.title?.default).toBe('SEO Test Blog Post')
      expect(metadata.description).toBe('This is a test blog post for SEO validation purposes')
      expect(metadata.alternates?.canonical).toBe('https://polything.co.uk/blog/test-blog-post')
      expect(metadata.openGraph?.title).toBe('SEO Test Blog Post')
      expect(metadata.openGraph?.type).toBe('article')
      expect(metadata.openGraph?.section).toBe('Blog')
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-01')
      expect(metadata.openGraph?.modifiedTime).toBe('2024-01-15')
    })

    test('returns not found metadata for non-existent post', async () => {
      const metadata = await generateMetadata({ params: { slug: 'non-existent' } })

      expect(metadata.title).toBe('Post Not Found')
    })
  })

  describe('BlogPostPage Component', () => {
    test('renders blog post with correct JSON-LD structured data', async () => {
      const { container } = render(await BlogPostPage({ params: { slug: 'test-blog-post' } }))

      // Check for JSON-LD scripts
      const scripts = container.querySelectorAll('script[type="application/ld+json"]')
      expect(scripts.length).toBeGreaterThan(0)

      // Parse and validate JSON-LD content
      const jsonLdContent = JSON.parse(scripts[0].innerHTML)
      expect(jsonLdContent['@context']).toBe('https://schema.org')
      expect(jsonLdContent['@type']).toBe('BlogPosting')
      expect(jsonLdContent.headline).toBe('SEO Test Blog Post')
      expect(jsonLdContent.url).toBe('https://polything.co.uk/blog/test-blog-post')
      expect(jsonLdContent.description).toBe('This is a test blog post for SEO validation purposes')
      expect(jsonLdContent.datePublished).toBe('2024-01-01')
      expect(jsonLdContent.dateModified).toBe('2024-01-15')
    })

    test('includes hero section when present', async () => {
      const { getByTestId } = render(await BlogPostPage({ params: { slug: 'test-blog-post' } }))

      expect(getByTestId('hero')).toBeInTheDocument()
      expect(getByTestId('hero')).toHaveTextContent('Test Blog Post Hero')
    })

    test('renders blog post content', async () => {
      const { container } = render(await BlogPostPage({ params: { slug: 'test-blog-post' } }))

      expect(container).toHaveTextContent('Test blog post content')
    })

    test('shows featured badge for featured posts', async () => {
      const { container } = render(await BlogPostPage({ params: { slug: 'test-blog-post' } }))

      expect(container).toHaveTextContent('Featured')
    })

    test('calls notFound for non-existent post', async () => {
      await BlogPostPage({ params: { slug: 'non-existent' } })

      expect(notFound).toHaveBeenCalled()
    })
  })

  describe('JSON-LD Validation', () => {
    test('generates valid BlogPosting schema', () => {
      const post = {
        type: 'post',
        slug: 'test-blog-post',
        title: 'Test Blog Post',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: {
          title: 'Test Blog Post Hero',
          image: '/images/blog-hero.jpg'
        },
        seo: {
          title: 'SEO Test Blog Post',
          description: 'Test blog post description',
          schema: {
            type: 'BlogPosting',
            image: '/images/seo-image.jpg',
            author: 'Polything Ltd'
          }
        }
      }

      const jsonLdArray = generateAllJsonLd('https://polything.co.uk', post)

      expect(jsonLdArray).toHaveLength(1)
      expect(jsonLdArray[0]['@type']).toBe('BlogPosting')
      expect(jsonLdArray[0].headline).toBe('SEO Test Blog Post')
      expect(jsonLdArray[0].url).toBe('https://polything.co.uk/blog/test-blog-post')
      expect(jsonLdArray[0].author).toEqual({
        '@type': 'Organization',
        name: 'Polything Ltd'
      })
    })

    test('includes breadcrumbs when present in schema', () => {
      const post = {
        type: 'post',
        slug: 'test-blog-post',
        title: 'Test Blog Post',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: {
          title: 'Test Blog Post Hero'
        },
        seo: {
          schema: {
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: 'Test Blog Post', url: '/blog/test-blog-post' }
            ]
          }
        }
      }

      const jsonLdArray = generateAllJsonLd('https://polything.co.uk', post)

      expect(jsonLdArray).toHaveLength(2) // BlogPosting + BreadcrumbList
      expect(jsonLdArray[1]['@type']).toBe('BreadcrumbList')
      expect(jsonLdArray[1].itemListElement).toHaveLength(3)
    })
  })
})
/**
 * Comprehensive JSON-LD Validation Tests
 * Tests the complete SEO implementation as specified in the PRD
 */

import {
  generateJsonLd,
  generateAllJsonLd,
  pageJsonLd,
  articleJsonLd,
  creativeWorkJsonLd,
  breadcrumbsJsonLd,
  orgJsonLd,
  websiteJsonLd,
  Doc
} from '@/lib/seo/structured-data'

describe('JSON-LD Validation for SEO Implementation', () => {
  const baseUrl = 'https://polything.co.uk'

  describe('Schema Type Defaults (PRD Requirement 2.10)', () => {
    test('Project content defaults to CreativeWork schema', () => {
      const project: Doc = {
        type: 'project',
        slug: 'test-project',
        title: 'Test Project',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Project' }
      }

      const jsonLd = generateJsonLd(baseUrl, project)
      expect(jsonLd['@type']).toBe('CreativeWork')
    })

    test('Post content defaults to BlogPosting schema', () => {
      const post: Doc = {
        type: 'post',
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Post' }
      }

      const jsonLd = generateJsonLd(baseUrl, post)
      expect(jsonLd['@type']).toBe('BlogPosting')
    })

    test('Page content defaults to WebPage schema', () => {
      const page: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Page' }
      }

      const jsonLd = generateJsonLd(baseUrl, page)
      expect(jsonLd['@type']).toBe('WebPage')
    })
  })

  describe('Required Fields Validation (PRD Table)', () => {
    test('WebPage schema includes required fields', () => {
      const page: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Page' }
      }

      const jsonLd = pageJsonLd(baseUrl, page)
      
      // Required fields: headline, url, dateModified
      expect(jsonLd.headline).toBe('Test Page')
      expect(jsonLd.url).toBe('https://polything.co.uk/test-page')
      expect(jsonLd.dateModified).toBe('2024-01-15')
    })

    test('BlogPosting schema includes required fields', () => {
      const post: Doc = {
        type: 'post',
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Post' }
      }

      const jsonLd = articleJsonLd(baseUrl, post)
      
      // Required fields: headline, url, datePublished, dateModified
      expect(jsonLd.headline).toBe('Test Post')
      expect(jsonLd.url).toBe('https://polything.co.uk/blog/test-post')
      expect(jsonLd.datePublished).toBe('2024-01-01')
      expect(jsonLd.dateModified).toBe('2024-01-15')
    })

    test('CreativeWork schema includes required fields', () => {
      const project: Doc = {
        type: 'project',
        slug: 'test-project',
        title: 'Test Project',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Project' }
      }

      const jsonLd = creativeWorkJsonLd(baseUrl, project)
      
      // Required fields: name, url, dateModified
      expect(jsonLd.name).toBe('Test Project')
      expect(jsonLd.url).toBe('https://polything.co.uk/work/test-project')
      expect(jsonLd.dateModified).toBe('2024-01-15')
    })
  })

  describe('Optional Enrichments (PRD Table)', () => {
    test('includes image when available', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { 
          title: 'Test Page',
          image: '/images/test.jpg'
        }
      }

      const jsonLd = pageJsonLd(baseUrl, doc)
      expect(jsonLd.image).toBe('https://polything.co.uk/images/test.jpg')
    })

    test('includes description when available', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Page' },
        seo: {
          description: 'Test page description'
        }
      }

      const jsonLd = pageJsonLd(baseUrl, doc)
      expect(jsonLd.description).toBe('Test page description')
    })

    test('includes author when available', () => {
      const doc: Doc = {
        type: 'post',
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Post' },
        seo: {
          schema: {
            author: 'Polything Ltd'
          }
        }
      }

      const jsonLd = articleJsonLd(baseUrl, doc)
      expect(jsonLd.author).toEqual({
        '@type': 'Organization',
        name: 'Polything Ltd'
      })
    })
  })

  describe('BreadcrumbList Implementation (PRD Requirement 3.12)', () => {
    test('generates BreadcrumbList when breadcrumbs present', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Page' },
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

      const jsonLdArray = generateAllJsonLd(baseUrl, doc)
      
      expect(jsonLdArray).toHaveLength(2)
      expect(jsonLdArray[1]['@type']).toBe('BreadcrumbList')
      expect(jsonLdArray[1].itemListElement).toHaveLength(3)
      expect(jsonLdArray[1].itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://polything.co.uk/'
      })
    })

    test('does not include BreadcrumbList when breadcrumbs absent', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Page' }
      }

      const jsonLdArray = generateAllJsonLd(baseUrl, doc)
      
      expect(jsonLdArray).toHaveLength(1)
      expect(jsonLdArray[0]['@type']).toBe('WebPage')
    })
  })

  describe('Site-wide Schema (PRD Requirement 3.10)', () => {
    test('generates valid Organization schema', () => {
      const org = orgJsonLd(baseUrl, {
        name: 'Polything Ltd',
        logo: '/images/logo.png',
        sameAs: [
          'https://linkedin.com/company/polything',
          'https://twitter.com/polything'
        ],
        contactPoint: {
          email: 'hello@polything.co.uk',
          contactType: 'customer service'
        }
      })

      expect(org['@context']).toBe('https://schema.org')
      expect(org['@type']).toBe('Organization')
      expect(org.name).toBe('Polything Ltd')
      expect(org.url).toBe(baseUrl)
      expect(org.logo).toBe('https://polything.co.uk/images/logo.png')
      expect(org.sameAs).toHaveLength(2)
      expect(org.contactPoint).toBeDefined()
    })

    test('generates valid Website schema', () => {
      const website = websiteJsonLd(baseUrl, 'Polything')

      expect(website['@context']).toBe('https://schema.org')
      expect(website['@type']).toBe('WebSite')
      expect(website.name).toBe('Polything')
      expect(website.url).toBe(baseUrl)
    })
  })

  describe('Canonical URL Implementation (PRD Requirement 3.13)', () => {
    test('generates correct canonical URLs for different content types', () => {
      const project: Doc = {
        type: 'project',
        slug: 'test-project',
        title: 'Test Project',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Project' }
      }

      const post: Doc = {
        type: 'post',
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Post' }
      }

      const page: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Page' }
      }

      expect(generateJsonLd(baseUrl, project).url).toBe('https://polything.co.uk/work/test-project')
      expect(generateJsonLd(baseUrl, post).url).toBe('https://polything.co.uk/blog/test-post')
      expect(generateJsonLd(baseUrl, page).url).toBe('https://polything.co.uk/test-page')
    })

    test('uses custom canonical URL when provided', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Page' },
        seo: {
          canonical: 'https://custom.com/test-page'
        }
      }

      const jsonLd = generateJsonLd(baseUrl, doc)
      expect(jsonLd.url).toBe('https://custom.com/test-page')
    })
  })

  describe('SEO Fallbacks (PRD Requirement 2.9)', () => {
    test('uses SEO title with fallback to hero title', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Document Title',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Hero Title' },
        seo: { title: 'SEO Title' }
      }

      const jsonLd = pageJsonLd(baseUrl, doc)
      expect(jsonLd.headline).toBe('SEO Title')
    })

    test('falls back to hero title when SEO title not provided', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Document Title',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Hero Title' }
      }

      const jsonLd = pageJsonLd(baseUrl, doc)
      expect(jsonLd.headline).toBe('Hero Title')
    })

    test('uses SEO description with fallback to hero subtitle', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { 
          title: 'Test Page',
          subtitle: 'Hero Subtitle'
        },
        seo: { description: 'SEO Description' }
      }

      const jsonLd = pageJsonLd(baseUrl, doc)
      expect(jsonLd.description).toBe('SEO Description')
    })
  })

  describe('JSON-LD Structure Validation', () => {
    test('all schemas include required @context and @type', () => {
      const schemas = [
        pageJsonLd(baseUrl, { type: 'page', slug: 'test', title: 'Test', date: '2024-01-01', updated: '2024-01-01', hero: { title: 'Test' } }),
        articleJsonLd(baseUrl, { type: 'post', slug: 'test', title: 'Test', date: '2024-01-01', updated: '2024-01-01', hero: { title: 'Test' } }),
        creativeWorkJsonLd(baseUrl, { type: 'project', slug: 'test', title: 'Test', date: '2024-01-01', updated: '2024-01-01', hero: { title: 'Test' } }),
        breadcrumbsJsonLd(baseUrl, [{ name: 'Home', url: '/' }]),
        orgJsonLd(baseUrl, { name: 'Test' }),
        websiteJsonLd(baseUrl, 'Test')
      ]

      schemas.forEach(schema => {
        expect(schema['@context']).toBe('https://schema.org')
        expect(schema['@type']).toBeDefined()
      })
    })

    test('generates valid JSON that can be parsed', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { title: 'Test Page' }
      }

      const jsonLd = generateJsonLd(baseUrl, doc)
      const jsonString = JSON.stringify(jsonLd)
      
      // Should not throw when parsing
      expect(() => JSON.parse(jsonString)).not.toThrow()
      
      // Should maintain structure
      const parsed = JSON.parse(jsonString)
      expect(parsed['@context']).toBe('https://schema.org')
      expect(parsed['@type']).toBe('WebPage')
    })
  })
})

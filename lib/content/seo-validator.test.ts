/**
 * Tests for SEO Content Validation Utilities
 */

import {
  validateAndGenerateSEOFallbacks,
  enforceSchemaTypeDefaults,
  SEOValidationOptions,
  ContentType
} from './seo-validator'

describe('SEO Content Validation', () => {
  describe('validateAndGenerateSEOFallbacks', () => {
    test('generates title fallback from hero title', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Document Title',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: {
          title: 'Hero Title',
          subtitle: 'Hero Subtitle'
        }
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.valid).toBe(true)
      expect(result.fallbacks.title).toBe('Hero Title')
      expect(result.fallbacks.description).toBe('Hero Subtitle')
      expect(result.fallbacks.canonical).toBe('https://polything.co.uk/test')
    })

    test('prioritizes SEO title over hero title', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Document Title',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: {
          title: 'Hero Title'
        },
        seo: {
          title: 'SEO Title',
          description: 'SEO Description'
        }
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.fallbacks.title).toBe('SEO Title')
      expect(result.fallbacks.description).toBe('SEO Description')
    })

    test('falls back to document title when no hero or SEO title', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Document Title',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: {}
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.fallbacks.title).toBe('Document Title')
    })

    test('generates correct canonical URLs for different content types', () => {
      const pageContent: ContentType = {
        type: 'page',
        slug: 'about',
        title: 'About',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'About' }
      }

      const projectContent: ContentType = {
        type: 'project',
        slug: 'client-work',
        title: 'Client Work',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Client Work' },
        links: {}
      }

      const postContent: ContentType = {
        type: 'post',
        slug: 'blog-post',
        title: 'Blog Post',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Blog Post' },
        featured: false
      }

      const pageResult = validateAndGenerateSEOFallbacks(pageContent)
      const projectResult = validateAndGenerateSEOFallbacks(projectContent)
      const postResult = validateAndGenerateSEOFallbacks(postContent)

      expect(pageResult.fallbacks.canonical).toBe('https://polything.co.uk/about')
      expect(projectResult.fallbacks.canonical).toBe('https://polything.co.uk/work/client-work')
      expect(postResult.fallbacks.canonical).toBe('https://polything.co.uk/blog/blog-post')
    })

    test('uses custom canonical URL when provided', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Test' },
        seo: {
          canonical: 'https://custom.com/test'
        }
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.fallbacks.canonical).toBe('https://custom.com/test')
    })

    test('validates title length and generates warnings', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'This is a very long title that exceeds the recommended 60 character limit for SEO purposes',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'This is a very long title that exceeds the recommended 60 character limit for SEO purposes' }
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.valid).toBe(true)
      expect(result.warnings).toContain('SEO title too long: 90 characters. Recommended max: 60.')
    })

    test('validates description length and generates warnings', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: {
          title: 'Test',
          subtitle: 'This is a very long description that exceeds the recommended 160 character limit for SEO purposes and should trigger a warning in the validation system to help content creators optimize their metadata'
        }
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.valid).toBe(true)
      expect(result.warnings).toContain('SEO description too long: 200 characters. Recommended max: 160.')
    })

    test('validates custom SEO fields', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Test' },
        seo: {
          title: 'Very Long Custom SEO Title That Exceeds Recommended Limits',
          description: 'Very long custom SEO description that exceeds the recommended 160 character limit for optimal search engine optimization and user experience',
          canonical: 'invalid-url',
          schema: {
            type: 'InvalidType',
            publishDate: 'invalid-date',
            image: 'invalid-path',
            breadcrumbs: [
              { name: 'Home', url: 'invalid-url' },
              { name: '', url: '/test' } // Missing name
            ]
          }
        }
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid canonical URL format: invalid-url')
      expect(result.errors).toContain('Invalid schema type: InvalidType. Must be one of: WebPage, Article, BlogPosting, CreativeWork')
      expect(result.errors).toContain('Invalid publishDate format: invalid-date. Must be ISO 8601 format.')
      expect(result.errors).toContain('Breadcrumb 2 missing name or url')
      // Title is 58 characters, which is under the 60 limit, so no warning expected
      // Description is 140 characters, which is under the 160 limit, so no warning expected
      expect(result.warnings).toContain('Invalid schema image path: invalid-path. Expected /images/* path or full URL.')
      expect(result.warnings).toContain('Invalid breadcrumb URL: invalid-url')
    })

    test('validates breadcrumbs structure', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Test Page with Proper Length for SEO Validation',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { 
          title: 'Test Page with Proper Length for SEO Validation',
          subtitle: 'This is a proper description that meets the minimum length requirements for SEO validation and testing purposes to ensure optimal performance'
        },
        seo: {
          schema: {
            breadcrumbs: [
              { name: 'Home', url: 'https://polything.co.uk/' },
              { name: 'Test', url: 'https://polything.co.uk/test' }
            ]
          }
        }
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.valid).toBe(true)
      expect(result.warnings).toHaveLength(0)
    })

    test('handles missing title gracefully', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: '',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: {}
      }

      const result = validateAndGenerateSEOFallbacks(content)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('No title available for SEO fallback')
    })

    test('respects validation options', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Short',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { 
          title: 'Short',
          subtitle: 'This is a proper description for testing validation options'
        }
      }

      const options: SEOValidationOptions = {
        strictLengthValidation: false
      }

      const result = validateAndGenerateSEOFallbacks(content, options)

      expect(result.valid).toBe(true)
      expect(result.warnings).toHaveLength(0) // No length warnings when strict validation is disabled
    })
  })

  describe('enforceSchemaTypeDefaults', () => {
    test('enforces default schema types for different content types', () => {
      const pageContent: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Test' }
      }

      const projectContent: ContentType = {
        type: 'project',
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Test' },
        links: {}
      }

      const postContent: ContentType = {
        type: 'post',
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Test' },
        featured: false
      }

      const pageResult = enforceSchemaTypeDefaults(pageContent)
      const projectResult = enforceSchemaTypeDefaults(projectContent)
      const postResult = enforceSchemaTypeDefaults(postContent)

      expect(pageResult.seo?.schema?.type).toBe('WebPage')
      expect(projectResult.seo?.schema?.type).toBe('CreativeWork')
      expect(postResult.seo?.schema?.type).toBe('BlogPosting')
    })

    test('preserves existing schema type when specified', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Test' },
        seo: {
          schema: {
            type: 'Article'
          }
        }
      }

      const result = enforceSchemaTypeDefaults(content)

      expect(result.seo?.schema?.type).toBe('Article')
    })

    test('creates SEO and schema objects when missing', () => {
      const content: ContentType = {
        type: 'page',
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-01',
        categories: [],
        tags: [],
        hero: { title: 'Test' }
      }

      const result = enforceSchemaTypeDefaults(content)

      expect(result.seo).toBeDefined()
      expect(result.seo?.schema).toBeDefined()
      expect(result.seo?.schema?.type).toBe('WebPage')
    })
  })
})

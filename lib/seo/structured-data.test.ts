/**
 * Tests for JSON-LD Structured Data Generation Utilities
 */

import {
  absoluteUrl,
  canonicalFor,
  pickSeoTitle,
  pickSeoDesc,
  pickSchemaType,
  pickImage,
  articleDates,
  breadcrumbsJsonLd,
  orgJsonLd,
  websiteJsonLd,
  pageJsonLd,
  articleJsonLd,
  creativeWorkJsonLd,
  generateJsonLd,
  generateAllJsonLd,
  Doc,
} from './structured-data'

describe('JSON-LD Generation', () => {
  const baseUrl = 'https://polything.co.uk'
  
  describe('Utility Functions', () => {
    test('absoluteUrl generates correct URLs', () => {
      expect(absoluteUrl(baseUrl, '/about')).toBe('https://polything.co.uk/about')
      expect(absoluteUrl(baseUrl, 'https://example.com')).toBe('https://example.com')
      expect(absoluteUrl('https://polything.co.uk/', '/work')).toBe('https://polything.co.uk/work')
    })

    test('canonicalFor generates correct canonical URLs', () => {
      const doc: Doc = { type: 'page', slug: 'about', title: 'About' }
      expect(canonicalFor(baseUrl, doc)).toBe('https://polything.co.uk/about')
      
      const projectDoc: Doc = { type: 'project', slug: 'client-work', title: 'Client Work' }
      expect(canonicalFor(baseUrl, projectDoc)).toBe('https://polything.co.uk/work/client-work')
      
      const postDoc: Doc = { type: 'post', slug: 'blog-post', title: 'Blog Post' }
      expect(canonicalFor(baseUrl, postDoc)).toBe('https://polything.co.uk/blog/blog-post')
      
      const customCanonical: Doc = { 
        type: 'page', 
        slug: 'about', 
        title: 'About',
        seo: { canonical: 'https://custom.com/about' }
      }
      expect(canonicalFor(baseUrl, customCanonical)).toBe('https://custom.com/about')
    })

    test('pickSeoTitle returns SEO title or falls back to document title', () => {
      const doc: Doc = { type: 'page', slug: 'test', title: 'Document Title' }
      expect(pickSeoTitle(doc)).toBe('Document Title')
      
      const seoDoc: Doc = { 
        type: 'page', 
        slug: 'test', 
        title: 'Document Title',
        seo: { title: 'SEO Title' }
      }
      expect(pickSeoTitle(seoDoc)).toBe('SEO Title')
    })

    test('pickSeoDesc returns SEO description or falls back to excerpt', () => {
      const doc: Doc = { type: 'page', slug: 'test', title: 'Test' }
      expect(pickSeoDesc(doc)).toBeUndefined()
      
      const excerptDoc: Doc = { 
        type: 'page', 
        slug: 'test', 
        title: 'Test',
        excerpt: 'This is an excerpt'
      }
      expect(pickSeoDesc(excerptDoc)).toBe('This is an excerpt')
      
      const seoDoc: Doc = { 
        type: 'page', 
        slug: 'test', 
        title: 'Test',
        excerpt: 'This is an excerpt',
        seo: { description: 'SEO description' }
      }
      expect(pickSeoDesc(seoDoc)).toBe('SEO description')
      
      const longDesc: Doc = { 
        type: 'page', 
        slug: 'test', 
        title: 'Test',
        seo: { description: 'This is a very long description that exceeds the recommended 160 character limit and should be truncated to prevent issues with search engine display and user experience' }
      }
      expect(pickSeoDesc(longDesc)).toBe('This is a very long description that exceeds the recommended 160 character limit and should be truncated to prevent issues with search engine display and use…')
    })

    test('pickSchemaType returns correct schema types with defaults', () => {
      const pageDoc: Doc = { type: 'page', slug: 'test', title: 'Test' }
      expect(pickSchemaType(pageDoc)).toBe('WebPage')
      
      const projectDoc: Doc = { type: 'project', slug: 'test', title: 'Test' }
      expect(pickSchemaType(projectDoc)).toBe('CreativeWork')
      
      const postDoc: Doc = { type: 'post', slug: 'test', title: 'Test' }
      expect(pickSchemaType(postDoc)).toBe('BlogPosting')
      
      const customDoc: Doc = { 
        type: 'page', 
        slug: 'test', 
        title: 'Test',
        seo: { schema: { type: 'Article' } }
      }
      expect(pickSchemaType(customDoc)).toBe('Article')
    })

    test('pickImage returns SEO image or falls back to hero image', () => {
      const doc: Doc = { type: 'page', slug: 'test', title: 'Test' }
      expect(pickImage(doc, baseUrl)).toBeUndefined()
      
      const heroDoc: Doc = { 
        type: 'page', 
        slug: 'test', 
        title: 'Test',
        hero: { image: '/images/hero.jpg' }
      }
      expect(pickImage(heroDoc, baseUrl)).toBe('https://polything.co.uk/images/hero.jpg')
      
      const seoDoc: Doc = { 
        type: 'page', 
        slug: 'test', 
        title: 'Test',
        hero: { image: '/images/hero.jpg' },
        seo: { schema: { image: '/images/seo.jpg' } }
      }
      expect(pickImage(seoDoc, baseUrl)).toBe('https://polything.co.uk/images/seo.jpg')
    })

    test('articleDates extracts correct dates', () => {
      const doc: Doc = { 
        type: 'post', 
        slug: 'test', 
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-15'
      }
      const dates = articleDates(doc)
      expect(dates.datePublished).toBe('2024-01-01')
      expect(dates.dateModified).toBe('2024-01-15')
      
      const seoDoc: Doc = { 
        type: 'post', 
        slug: 'test', 
        title: 'Test',
        date: '2024-01-01',
        updated: '2024-01-15',
        seo: { 
          schema: { 
            publishDate: '2024-01-02',
            modifiedDate: '2024-01-16'
          }
        }
      }
      const seoDates = articleDates(seoDoc)
      expect(seoDates.datePublished).toBe('2024-01-02')
      expect(seoDates.dateModified).toBe('2024-01-16')
    })
  })

  describe('JSON-LD Generation', () => {
    test('breadcrumbsJsonLd generates correct breadcrumb structure', () => {
      const crumbs = [
        { name: 'Home', url: '/' },
        { name: 'Work', url: '/work' },
        { name: 'Project', url: '/work/project' }
      ]
      
      const result = breadcrumbsJsonLd(baseUrl, crumbs)
      
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('BreadcrumbList')
      expect(result.itemListElement).toHaveLength(3)
      expect(result.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://polything.co.uk/'
      })
    })

    test('orgJsonLd generates correct organization schema', () => {
      const org = orgJsonLd(baseUrl, {
        name: 'Polything Ltd',
        logo: '/logo.png',
        sameAs: ['https://linkedin.com/company/polything'],
        contactPoint: {
          email: 'hello@polything.co.uk',
          contactType: 'customer service'
        }
      })
      
      expect(org['@context']).toBe('https://schema.org')
      expect(org['@type']).toBe('Organization')
      expect(org.name).toBe('Polything Ltd')
      expect(org.url).toBe(baseUrl)
      expect(org.logo).toBe('https://polything.co.uk/logo.png')
      expect(org.sameAs).toEqual(['https://linkedin.com/company/polything'])
      expect(org.contactPoint).toEqual({
        '@type': 'ContactPoint',
        email: 'hello@polything.co.uk',
        contactType: 'customer service'
      })
    })

    test('websiteJsonLd generates correct website schema', () => {
      const website = websiteJsonLd(baseUrl, 'Polything')
      
      expect(website['@context']).toBe('https://schema.org')
      expect(website['@type']).toBe('WebSite')
      expect(website.name).toBe('Polything')
      expect(website.url).toBe(baseUrl)
    })

    test('pageJsonLd generates correct WebPage schema', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'about',
        title: 'About Us',
        excerpt: 'Learn about our company',
        updated: '2024-01-15',
        hero: { image: '/images/about-hero.jpg' }
      }
      
      const result = pageJsonLd(baseUrl, doc)
      
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('WebPage')
      expect(result.headline).toBe('About Us')
      expect(result.url).toBe('https://polything.co.uk/about')
      expect(result.description).toBe('Learn about our company')
      expect(result.dateModified).toBe('2024-01-15')
      expect(result.image).toBe('https://polything.co.uk/images/about-hero.jpg')
    })

    test('articleJsonLd generates correct BlogPosting schema', () => {
      const doc: Doc = {
        type: 'post',
        slug: 'marketing-tips',
        title: 'Marketing Tips',
        excerpt: 'Learn effective marketing strategies',
        date: '2024-01-01',
        updated: '2024-01-15',
        hero: { image: '/images/blog-hero.jpg' },
        seo: { 
          schema: { 
            author: 'Polything Ltd',
            publishDate: '2024-01-02',
            modifiedDate: '2024-01-16'
          }
        }
      }
      
      const result = articleJsonLd(baseUrl, doc)
      
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('BlogPosting')
      expect(result.headline).toBe('Marketing Tips')
      expect(result.url).toBe('https://polything.co.uk/blog/marketing-tips')
      expect(result.description).toBe('Learn effective marketing strategies')
      expect(result.image).toEqual(['https://polything.co.uk/images/blog-hero.jpg'])
      expect(result.datePublished).toBe('2024-01-02')
      expect(result.dateModified).toBe('2024-01-16')
      expect(result.author).toEqual({
        '@type': 'Organization',
        name: 'Polything Ltd'
      })
      expect(result.mainEntityOfPage).toBe('https://polything.co.uk/blog/marketing-tips')
    })

    test('creativeWorkJsonLd generates correct CreativeWork schema', () => {
      const doc: Doc = {
        type: 'project',
        slug: 'client-case-study',
        title: 'Client Case Study',
        excerpt: 'A successful project case study',
        updated: '2024-01-15',
        hero: { image: '/images/project-hero.jpg' }
      }
      
      const result = creativeWorkJsonLd(baseUrl, doc)
      
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('CreativeWork')
      expect(result.name).toBe('Client Case Study')
      expect(result.url).toBe('https://polything.co.uk/work/client-case-study')
      expect(result.description).toBe('A successful project case study')
      expect(result.image).toEqual(['https://polything.co.uk/images/project-hero.jpg'])
      expect(result.dateModified).toBe('2024-01-15')
    })

    test('generateJsonLd selects correct schema type', () => {
      const pageDoc: Doc = { type: 'page', slug: 'test', title: 'Test' }
      const pageResult = generateJsonLd(baseUrl, pageDoc)
      expect(pageResult['@type']).toBe('WebPage')
      
      const postDoc: Doc = { type: 'post', slug: 'test', title: 'Test' }
      const postResult = generateJsonLd(baseUrl, postDoc)
      expect(postResult['@type']).toBe('BlogPosting')
      
      const projectDoc: Doc = { type: 'project', slug: 'test', title: 'Test' }
      const projectResult = generateJsonLd(baseUrl, projectDoc)
      expect(projectResult['@type']).toBe('CreativeWork')
    })

    test('generateAllJsonLd includes breadcrumbs when present', () => {
      const doc: Doc = {
        type: 'page',
        slug: 'test',
        title: 'Test',
        seo: {
          schema: {
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Test', url: '/test' }
            ]
          }
        }
      }
      
      const result = generateAllJsonLd(baseUrl, doc)
      
      expect(result).toHaveLength(2)
      expect(result[0]['@type']).toBe('WebPage')
      expect(result[1]['@type']).toBe('BreadcrumbList')
    })
  })
})

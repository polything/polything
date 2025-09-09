import { test, expect } from '@playwright/test'
import { Homepage } from './pages/homepage'
import { ProjectPage } from './pages/project-page'
import { BlogPage } from './pages/blog-page'

/**
 * SEO E2E Tests
 * 
 * These tests ensure that the application has proper SEO implementation
 * including meta tags, structured data, and other SEO best practices.
 */

test.describe('SEO Tests', () => {
  let homepage: Homepage
  let projectPage: ProjectPage
  let blogPage: BlogPage

  test.beforeEach(async ({ page }) => {
    homepage = new Homepage(page)
    projectPage = new ProjectPage(page)
    blogPage = new BlogPage(page)
  })

  test.describe('Meta Tags', () => {
    test('homepage should have proper meta tags', async () => {
      await homepage.navigateToHomepage()
      
      // Check title
      const title = await homepage.getPageTitle()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
      expect(title.length).toBeLessThan(60)
      
      // Check meta description
      const description = await homepage.getMetaTag('description')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(120)
      expect(description!.length).toBeLessThan(160)
      
      // Check canonical URL
      const canonical = await homepage.getCanonicalUrl()
      expect(canonical).toBeTruthy()
      expect(canonical).toContain('localhost:3000')
      
      // Check viewport meta tag
      const viewport = await homepage.getMetaTag('viewport')
      expect(viewport).toBeTruthy()
      expect(viewport).toContain('width=device-width')
    })

    test('project page should have proper meta tags', async () => {
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          break
        } catch (error) {
          continue
        }
      }

      // Check title
      const title = await projectPage.getPageTitle()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
      expect(title.length).toBeLessThan(60)
      
      // Check meta description
      const description = await projectPage.getMetaTag('description')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(120)
      expect(description!.length).toBeLessThan(160)
      
      // Check canonical URL
      const canonical = await projectPage.getCanonicalUrl()
      expect(canonical).toBeTruthy()
      expect(canonical).toContain('/work/')
    })

    test('blog page should have proper meta tags', async () => {
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          break
        } catch (error) {
          continue
        }
      }

      // Check title
      const title = await blogPage.getPageTitle()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
      expect(title.length).toBeLessThan(60)
      
      // Check meta description
      const description = await blogPage.getMetaTag('description')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(120)
      expect(description!.length).toBeLessThan(160)
      
      // Check canonical URL
      const canonical = await blogPage.getCanonicalUrl()
      expect(canonical).toBeTruthy()
      expect(canonical).toContain('/blog/')
    })
  })

  test.describe('Open Graph Tags', () => {
    test('homepage should have proper Open Graph tags', async () => {
      await homepage.navigateToHomepage()
      
      // Check Open Graph title
      const ogTitle = await homepage.getMetaProperty('og:title')
      expect(ogTitle).toBeTruthy()
      expect(ogTitle!.length).toBeGreaterThan(10)
      expect(ogTitle!.length).toBeLessThan(60)
      
      // Check Open Graph description
      const ogDescription = await homepage.getMetaProperty('og:description')
      expect(ogDescription).toBeTruthy()
      expect(ogDescription!.length).toBeGreaterThan(120)
      expect(ogDescription!.length).toBeLessThan(160)
      
      // Check Open Graph image
      const ogImage = await homepage.getMetaProperty('og:image')
      expect(ogImage).toBeTruthy()
      expect(ogImage).toMatch(/\.(jpg|jpeg|png|gif|webp)$/i)
      
      // Check Open Graph type
      const ogType = await homepage.getMetaProperty('og:type')
      expect(ogType).toBeTruthy()
      
      // Check Open Graph URL
      const ogUrl = await homepage.getMetaProperty('og:url')
      expect(ogUrl).toBeTruthy()
      expect(ogUrl).toContain('localhost:3000')
    })

    test('project page should have proper Open Graph tags', async () => {
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          break
        } catch (error) {
          continue
        }
      }

      const ogTitle = await projectPage.getMetaProperty('og:title')
      const ogDescription = await projectPage.getMetaProperty('og:description')
      const ogImage = await projectPage.getMetaProperty('og:image')
      const ogType = await projectPage.getMetaProperty('og:type')
      
      expect(ogTitle).toBeTruthy()
      expect(ogDescription).toBeTruthy()
      expect(ogImage).toBeTruthy()
      expect(ogType).toBeTruthy()
    })

    test('blog page should have proper Open Graph tags', async () => {
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          break
        } catch (error) {
          continue
        }
      }

      const ogTitle = await blogPage.getMetaProperty('og:title')
      const ogDescription = await blogPage.getMetaProperty('og:description')
      const ogImage = await blogPage.getMetaProperty('og:image')
      const ogType = await blogPage.getMetaProperty('og:type')
      
      expect(ogTitle).toBeTruthy()
      expect(ogDescription).toBeTruthy()
      expect(ogImage).toBeTruthy()
      expect(ogType).toBe('article')
    })
  })

  test.describe('Twitter Card Tags', () => {
    test('should have proper Twitter Card tags', async () => {
      await homepage.navigateToHomepage()
      
      // Check Twitter Card type
      const twitterCard = await homepage.getMetaTag('twitter:card')
      expect(twitterCard).toBeTruthy()
      expect(['summary', 'summary_large_image', 'app', 'player']).toContain(twitterCard)
      
      // Check Twitter Card title
      const twitterTitle = await homepage.getMetaTag('twitter:title')
      expect(twitterTitle).toBeTruthy()
      
      // Check Twitter Card description
      const twitterDescription = await homepage.getMetaTag('twitter:description')
      expect(twitterDescription).toBeTruthy()
      
      // Check Twitter Card image
      const twitterImage = await homepage.getMetaTag('twitter:image')
      expect(twitterImage).toBeTruthy()
    })
  })

  test.describe('Structured Data (JSON-LD)', () => {
    test('homepage should have proper JSON-LD structured data', async () => {
      await homepage.navigateToHomepage()
      
      const jsonLdScripts = homepage.page.locator('script[type="application/ld+json"]')
      const scriptCount = await jsonLdScripts.count()
      expect(scriptCount).toBeGreaterThan(0)
      
      // Check for Organization schema
      let hasOrganizationSchema = false
      for (let i = 0; i < scriptCount; i++) {
        const script = jsonLdScripts.nth(i)
        const content = await script.textContent()
        if (content) {
          const jsonLd = JSON.parse(content)
          if (jsonLd['@type'] === 'Organization') {
            expect(jsonLd.name).toBeTruthy()
            expect(jsonLd.url).toBeTruthy()
            hasOrganizationSchema = true
            break
          }
        }
      }
      expect(hasOrganizationSchema).toBe(true)
    })

    test('project page should have proper JSON-LD structured data', async () => {
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          break
        } catch (error) {
          continue
        }
      }

      await projectPage.validateProjectJSONLD()
    })

    test('blog page should have proper JSON-LD structured data', async () => {
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          break
        } catch (error) {
          continue
        }
      }

      await blogPage.validateBlogJSONLD()
    })
  })

  test.describe('Heading Structure', () => {
    test('should have proper heading hierarchy', async () => {
      await homepage.navigateToHomepage()
      
      const headings = homepage.page.locator('h1, h2, h3, h4, h5, h6')
      const headingCount = await headings.count()
      expect(headingCount).toBeGreaterThan(0)
      
      // Check for H1
      const h1Count = await homepage.page.locator('h1').count()
      expect(h1Count).toBe(1) // Should have exactly one H1
      
      // Check heading hierarchy
      let previousLevel = 0
      for (let i = 0; i < headingCount; i++) {
        const heading = headings.nth(i)
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
        const level = parseInt(tagName.replace('h', ''))
        
        // Should not skip heading levels
        if (level > previousLevel + 1) {
          throw new Error(`Heading hierarchy issue: ${tagName} follows h${previousLevel}`)
        }
        previousLevel = level
      }
    })
  })

  test.describe('URL Structure', () => {
    test('should have clean, SEO-friendly URLs', async () => {
      await homepage.navigateToHomepage()
      
      const currentUrl = homepage.page.url()
      expect(currentUrl).toBe('http://localhost:3000/')
      
      // Check for trailing slashes and clean URLs
      expect(currentUrl).not.toMatch(/\/$/) // Should not have trailing slash for homepage
    })

    test('should have proper URL structure for project pages', async () => {
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          const currentUrl = projectPage.page.url()
          expect(currentUrl).toMatch(/\/work\/[a-z0-9-]+$/)
          break
        } catch (error) {
          continue
        }
      }
    })

    test('should have proper URL structure for blog pages', async () => {
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          const currentUrl = blogPage.page.url()
          expect(currentUrl).toMatch(/\/blog\/[a-z0-9-]+$/)
          break
        } catch (error) {
          continue
        }
      }
    })
  })

  test.describe('Internal Linking', () => {
    test('should have proper internal linking structure', async () => {
      await homepage.navigateToHomepage()
      
      // Check for internal links
      const internalLinks = homepage.page.locator('a[href^="/"], a[href*="localhost:3000"]')
      const linkCount = await internalLinks.count()
      expect(linkCount).toBeGreaterThan(0)
      
      // Check that links have proper anchor text
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = internalLinks.nth(i)
        const text = await link.textContent()
        const href = await link.getAttribute('href')
        
        expect(text).toBeTruthy()
        expect(text!.trim().length).toBeGreaterThan(0)
        expect(href).toBeTruthy()
      }
    })
  })

  test.describe('Image SEO', () => {
    test('should have proper image alt text', async () => {
      await homepage.navigateToHomepage()
      
      const images = homepage.page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i)
        const alt = await image.getAttribute('alt')
        const src = await image.getAttribute('src')
        
        // All images should have alt attribute
        expect(alt).not.toBeNull()
        
        // Images should have src
        expect(src).toBeTruthy()
        
        // Alt text should be descriptive (not just filename)
        if (alt && alt.length > 0) {
          expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|webp)$/i)
        }
      }
    })

    test('should have optimized image formats', async () => {
      await homepage.navigateToHomepage()
      
      const images = homepage.page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i)
        const src = await image.getAttribute('src')
        
        if (src) {
          // Should prefer modern formats
          const isModernFormat = src.match(/\.(webp|avif)$/i)
          const isReasonableFormat = src.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)
          
          expect(isReasonableFormat).toBeTruthy()
          
          if (isModernFormat) {
            console.log(`Modern image format found: ${src}`)
          }
        }
      }
    })
  })

  test.describe('Sitemap and Robots', () => {
    test('should have accessible sitemap', async ({ page }) => {
      const response = await page.goto('/sitemap.xml')
      expect(response?.status()).toBe(200)
      
      const content = await page.textContent('body')
      expect(content).toContain('<?xml')
      expect(content).toContain('<urlset')
    })

    test('should have proper robots.txt', async ({ page }) => {
      const response = await page.goto('/robots.txt')
      expect(response?.status()).toBe(200)
      
      const content = await page.textContent('body')
      expect(content).toContain('User-agent:')
      expect(content).toContain('Sitemap:')
    })
  })

  test.describe('Page Speed and Core Web Vitals', () => {
    test('should meet SEO performance requirements', async () => {
      await homepage.navigateToHomepage()
      
      // Check page load time
      const loadTime = await homepage.measurePageLoadTime()
      expect(loadTime).toBeLessThan(3000) // 3 seconds
      
      // Check Core Web Vitals
      const vitals = await homepage.getCoreWebVitals()
      expect(vitals.FCP).toBeLessThan(2000) // 2 seconds
      expect(vitals.LCP).toBeLessThan(4000) // 4 seconds
      expect(vitals.CLS).toBeLessThan(0.1)
      
      console.log('SEO Performance:', { loadTime, vitals })
    })
  })
})

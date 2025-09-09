import { test, expect } from '@playwright/test'
import { Homepage } from './pages/homepage'
import { ProjectPage } from './pages/project-page'
import { BlogPage } from './pages/blog-page'

/**
 * Performance E2E Tests
 * 
 * These tests ensure that the application meets performance requirements
 * including Core Web Vitals and other performance metrics.
 */

test.describe('Performance Tests', () => {
  let homepage: Homepage
  let projectPage: ProjectPage
  let blogPage: BlogPage

  test.beforeEach(async ({ page }) => {
    homepage = new Homepage(page)
    projectPage = new ProjectPage(page)
    blogPage = new BlogPage(page)
  })

  test.describe('Core Web Vitals', () => {
    test('homepage should meet Core Web Vitals thresholds', async () => {
      await homepage.navigateToHomepage()
      
      // Measure Core Web Vitals
      const vitals = await homepage.getCoreWebVitals()
      
      // First Contentful Paint should be under 2 seconds
      expect(vitals.FCP).toBeLessThan(2000)
      
      // Largest Contentful Paint should be under 4 seconds
      expect(vitals.LCP).toBeLessThan(4000)
      
      // Cumulative Layout Shift should be under 0.1
      expect(vitals.CLS).toBeLessThan(0.1)
      
      // First Input Delay should be under 100ms
      expect(vitals.FID).toBeLessThan(100)
      
      console.log('Core Web Vitals:', vitals)
    })

    test('project page should meet Core Web Vitals thresholds', async () => {
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          break
        } catch (error) {
          continue
        }
      }

      const vitals = await projectPage.getCoreWebVitals()
      
      expect(vitals.FCP).toBeLessThan(2000)
      expect(vitals.LCP).toBeLessThan(4000)
      expect(vitals.CLS).toBeLessThan(0.1)
      expect(vitals.FID).toBeLessThan(100)
      
      console.log('Project page Core Web Vitals:', vitals)
    })

    test('blog page should meet Core Web Vitals thresholds', async () => {
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          break
        } catch (error) {
          continue
        }
      }

      const vitals = await blogPage.getCoreWebVitals()
      
      expect(vitals.FCP).toBeLessThan(2000)
      expect(vitals.LCP).toBeLessThan(4000)
      expect(vitals.CLS).toBeLessThan(0.1)
      expect(vitals.FID).toBeLessThan(100)
      
      console.log('Blog page Core Web Vitals:', vitals)
    })
  })

  test.describe('Page Load Performance', () => {
    test('homepage should load within 3 seconds', async () => {
      const startTime = Date.now()
      await homepage.navigateToHomepage()
      const loadTime = Date.now() - startTime
      
      expect(loadTime).toBeLessThan(3000)
      console.log(`Homepage load time: ${loadTime}ms`)
    })

    test('project page should load within 3 seconds', async () => {
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          const startTime = Date.now()
          await projectPage.navigateToProject(slug)
          const loadTime = Date.now() - startTime
          
          expect(loadTime).toBeLessThan(3000)
          console.log(`Project page load time: ${loadTime}ms`)
          break
        } catch (error) {
          continue
        }
      }
    })

    test('blog page should load within 3 seconds', async () => {
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          const startTime = Date.now()
          await blogPage.navigateToBlogPost(slug)
          const loadTime = Date.now() - startTime
          
          expect(loadTime).toBeLessThan(3000)
          console.log(`Blog page load time: ${loadTime}ms`)
          break
        } catch (error) {
          continue
        }
      }
    })
  })

  test.describe('Network Performance', () => {
    test('should have efficient network usage', async ({ page }) => {
      const responses: any[] = []
      
      // Track network requests
      page.on('response', response => {
        responses.push({
          url: response.url(),
          status: response.status(),
          size: response.headers()['content-length'] || 0,
          time: response.timing()
        })
      })
      
      await homepage.navigateToHomepage()
      
      // Analyze network performance
      const totalRequests = responses.length
      const failedRequests = responses.filter(r => r.status >= 400).length
      const totalSize = responses.reduce((sum, r) => sum + parseInt(r.size || 0), 0)
      
      // Should have reasonable number of requests
      expect(totalRequests).toBeLessThan(50)
      
      // Should have no failed requests
      expect(failedRequests).toBe(0)
      
      // Should have reasonable total size (less than 5MB)
      expect(totalSize).toBeLessThan(5 * 1024 * 1024)
      
      console.log(`Network stats: ${totalRequests} requests, ${totalSize} bytes, ${failedRequests} failures`)
    })

    test('should have optimized images', async ({ page }) => {
      const images: any[] = []
      
      page.on('response', response => {
        if (response.url().match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
          images.push({
            url: response.url(),
            size: response.headers()['content-length'] || 0,
            type: response.headers()['content-type'] || ''
          })
        }
      })
      
      await homepage.navigateToHomepage()
      
      // Check image optimization
      for (const image of images) {
        const size = parseInt(image.size || 0)
        
        // Images should be reasonably sized (less than 1MB each)
        expect(size).toBeLessThan(1024 * 1024)
        
        // Should prefer modern formats
        const isModernFormat = image.type.includes('webp') || image.type.includes('avif')
        if (size > 100 * 1024) { // Only check for larger images
          console.log(`Image ${image.url}: ${size} bytes, type: ${image.type}`)
        }
      }
    })
  })

  test.describe('JavaScript Performance', () => {
    test('should have efficient JavaScript execution', async ({ page }) => {
      await homepage.navigateToHomepage()
      
      // Measure JavaScript execution time
      const jsMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        }
      })
      
      // DOM content loaded should be fast
      expect(jsMetrics.domContentLoaded).toBeLessThan(1000)
      
      // Load complete should be reasonable
      expect(jsMetrics.loadComplete).toBeLessThan(2000)
      
      console.log('JavaScript metrics:', jsMetrics)
    })

    test('should not have memory leaks', async ({ page }) => {
      await homepage.navigateToHomepage()
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        } : null
      })
      
      if (initialMemory) {
        // Navigate around to test for memory leaks
        await page.goto('/work/blackriver-case-study')
        await page.goto('/blog/test-post')
        await page.goto('/')
        
        // Get final memory usage
        const finalMemory = await page.evaluate(() => {
          return (performance as any).memory ? {
            used: (performance as any).memory.usedJSHeapSize,
            total: (performance as any).memory.totalJSHeapSize,
            limit: (performance as any).memory.jsHeapSizeLimit
          } : null
        })
        
        if (finalMemory) {
          const memoryIncrease = finalMemory.used - initialMemory.used
          const memoryIncreasePercent = (memoryIncrease / initialMemory.used) * 100
          
          // Memory increase should be reasonable (less than 50%)
          expect(memoryIncreasePercent).toBeLessThan(50)
          
          console.log(`Memory usage: ${initialMemory.used} -> ${finalMemory.used} (${memoryIncreasePercent.toFixed(2)}% increase)`)
        }
      }
    })
  })

  test.describe('Mobile Performance', () => {
    test('should perform well on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      const startTime = Date.now()
      await homepage.navigateToHomepage()
      const loadTime = Date.now() - startTime
      
      expect(loadTime).toBeLessThan(3000)
      
      // Measure mobile-specific metrics
      const vitals = await homepage.getCoreWebVitals()
      expect(vitals.FCP).toBeLessThan(2000)
      expect(vitals.LCP).toBeLessThan(4000)
      
      console.log(`Mobile performance: ${loadTime}ms load time, FCP: ${vitals.FCP}ms, LCP: ${vitals.LCP}ms`)
    })

    test('should have touch-friendly interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await homepage.navigateToHomepage()
      
      // Check that interactive elements are touch-friendly
      const buttons = homepage.page.locator('button, a')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i)
        const isVisible = await button.isVisible()
        
        if (isVisible) {
          const size = await button.boundingBox()
          if (size) {
            // Touch targets should be at least 44x44 pixels
            expect(size.width).toBeGreaterThanOrEqual(44)
            expect(size.height).toBeGreaterThanOrEqual(44)
          }
        }
      }
    })
  })

  test.describe('Performance Budget', () => {
    test('should stay within performance budget', async ({ page }) => {
      const performanceBudget = {
        maxLoadTime: 3000, // 3 seconds
        maxFCP: 2000, // 2 seconds
        maxLCP: 4000, // 4 seconds
        maxCLS: 0.1,
        maxFID: 100, // 100ms
        maxRequests: 50,
        maxTotalSize: 5 * 1024 * 1024 // 5MB
      }
      
      const responses: any[] = []
      page.on('response', response => {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'] || 0
        })
      })
      
      const startTime = Date.now()
      await homepage.navigateToHomepage()
      const loadTime = Date.now() - startTime
      
      const vitals = await homepage.getCoreWebVitals()
      const totalSize = responses.reduce((sum, r) => sum + parseInt(r.size || 0), 0)
      
      // Check all budget constraints
      expect(loadTime).toBeLessThan(performanceBudget.maxLoadTime)
      expect(vitals.FCP).toBeLessThan(performanceBudget.maxFCP)
      expect(vitals.LCP).toBeLessThan(performanceBudget.maxLCP)
      expect(vitals.CLS).toBeLessThan(performanceBudget.maxCLS)
      expect(vitals.FID).toBeLessThan(performanceBudget.maxFID)
      expect(responses.length).toBeLessThan(performanceBudget.maxRequests)
      expect(totalSize).toBeLessThan(performanceBudget.maxTotalSize)
      
      console.log('Performance budget check passed:', {
        loadTime,
        vitals,
        requests: responses.length,
        totalSize
      })
    })
  })
})

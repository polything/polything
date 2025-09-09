import { Page, expect } from '@playwright/test'

/**
 * Test Helper Utilities
 * 
 * This file contains utility functions that can be used across different test files
 * to provide common functionality and reduce code duplication.
 */

export class TestHelpers {
  static async waitForPageLoad(page: Page, timeout: number = 30000) {
    await page.waitForLoadState('networkidle', { timeout })
    await page.waitForSelector('body', { state: 'visible', timeout })
  }

  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    })
  }

  static async measurePageLoadTime(page: Page): Promise<number> {
    const startTime = Date.now()
    await this.waitForPageLoad(page)
    return Date.now() - startTime
  }

  static async getCoreWebVitals(page: Page) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          FCP: 0,
          LCP: 0,
          CLS: 0,
          FID: 0
        }

        // First Contentful Paint
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime
            }
          }
        }).observe({ entryTypes: ['paint'] })

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          vitals.LCP = lastEntry.startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              vitals.CLS += entry.value
            }
          }
        }).observe({ entryTypes: ['layout-shift'] })

        // First Input Delay
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            vitals.FID = entry.processingStart - entry.startTime
          }
        }).observe({ entryTypes: ['first-input'] })

        // Resolve after a delay to collect metrics
        setTimeout(() => resolve(vitals), 3000)
      })
    })
  }

  static async checkAccessibility(page: Page): Promise<string[]> {
    const issues: string[] = []

    // Check for alt text on images
    const imagesWithoutAlt = await page.locator('img:not([alt])').count()
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`)
    }

    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    let previousLevel = 0
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
      const level = parseInt(tagName.replace('h', ''))
      if (level > previousLevel + 1) {
        issues.push(`Heading hierarchy issue: ${tagName} follows h${previousLevel}`)
      }
      previousLevel = level
    }

    // Check for proper form labels
    const inputs = await page.locator('input, textarea, select').all()
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel = await label.count() > 0
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        
        if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
          issues.push(`Input with id "${id}" missing accessible name`)
        }
      }
    }

    return issues
  }

  static async validateSEO(page: Page): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = []

    // Check title
    const title = await page.title()
    if (!title || title.length < 10 || title.length > 60) {
      issues.push(`Title issue: "${title}" (length: ${title.length})`)
    }

    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    if (!description || description.length < 120 || description.length > 160) {
      issues.push(`Meta description issue: length ${description?.length || 0}`)
    }

    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    if (!canonical) {
      issues.push('Missing canonical URL')
    }

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    
    if (!ogTitle) issues.push('Missing og:title')
    if (!ogDescription) issues.push('Missing og:description')
    if (!ogImage) issues.push('Missing og:image')

    return {
      valid: issues.length === 0,
      issues
    }
  }

  static async validateJSONLD(page: Page): Promise<{ valid: boolean; schemas: string[] }> {
    const jsonLdScripts = page.locator('script[type="application/ld+json"]')
    const scriptCount = await jsonLdScripts.count()
    const schemas: string[] = []

    for (let i = 0; i < scriptCount; i++) {
      const script = jsonLdScripts.nth(i)
      const content = await script.textContent()
      if (content) {
        try {
          const jsonLd = JSON.parse(content)
          if (jsonLd['@type']) {
            schemas.push(jsonLd['@type'])
          }
        } catch (error) {
          console.error('Invalid JSON-LD:', error)
        }
      }
    }

    return {
      valid: schemas.length > 0,
      schemas
    }
  }

  static async testKeyboardNavigation(page: Page) {
    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
    const focusableCount = await focusableElements.count()
    
    if (focusableCount > 0) {
      // Test tabbing through first few elements
      for (let i = 0; i < Math.min(focusableCount, 5); i++) {
        await page.keyboard.press('Tab')
        await page.waitForTimeout(100)
        
        const activeElement = await page.evaluate(() => document.activeElement?.tagName)
        expect(activeElement).toBeTruthy()
      }
    }
  }

  static async testResponsiveDesign(page: Page, viewport: { width: number; height: number }) {
    await page.setViewportSize(viewport)
    await this.waitForPageLoad(page)
    
    // Check that page is responsive
    const body = page.locator('body')
    const bodyBox = await body.boundingBox()
    
    if (bodyBox) {
      expect(bodyBox.width).toBeLessThanOrEqual(viewport.width + 20) // Allow some margin
    }
  }

  static async measureNetworkPerformance(page: Page) {
    const responses: any[] = []
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'] || 0,
        time: response.timing()
      })
    })
    
    return responses
  }

  static async checkImageOptimization(page: Page) {
    const images = page.locator('img')
    const imageCount = await images.count()
    const issues: string[] = []
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      const src = await image.getAttribute('src')
      const alt = await image.getAttribute('alt')
      
      if (src) {
        // Check for modern formats
        const isModernFormat = src.match(/\.(webp|avif)$/i)
        const isReasonableFormat = src.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)
        
        if (!isReasonableFormat) {
          issues.push(`Unsupported image format: ${src}`)
        }
      }
      
      if (!alt) {
        issues.push(`Image missing alt text: ${src}`)
      }
    }
    
    return issues
  }

  static async generateTestReport(testName: string, results: any) {
    const report = {
      testName,
      timestamp: new Date().toISOString(),
      results
    }
    
    // In a real implementation, you might want to save this to a file
    console.log('Test Report:', JSON.stringify(report, null, 2))
    
    return report
  }

  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError!
  }

  static async waitForElementToBeVisible(page: Page, selector: string, timeout: number = 10000) {
    await page.waitForSelector(selector, { state: 'visible', timeout })
  }

  static async waitForElementToDisappear(page: Page, selector: string, timeout: number = 10000) {
    await page.waitForSelector(selector, { state: 'hidden', timeout })
  }

  static async scrollToElement(page: Page, selector: string) {
    await page.locator(selector).scrollIntoViewIfNeeded()
    await page.waitForTimeout(500) // Allow for scroll animations
  }

  static async clickAndWaitForNavigation(page: Page, selector: string) {
    await Promise.all([
      page.waitForNavigation(),
      page.click(selector)
    ])
  }

  static async fillFormField(page: Page, selector: string, value: string) {
    await page.locator(selector).fill(value)
    await page.waitForTimeout(100) // Allow for any validation
  }

  static async selectDropdownOption(page: Page, selector: string, value: string) {
    await page.locator(selector).selectOption(value)
    await page.waitForTimeout(100)
  }

  static async checkCheckbox(page: Page, selector: string) {
    const checkbox = page.locator(selector)
    if (!(await checkbox.isChecked())) {
      await checkbox.check()
    }
  }

  static async uncheckCheckbox(page: Page, selector: string) {
    const checkbox = page.locator(selector)
    if (await checkbox.isChecked()) {
      await checkbox.uncheck()
    }
  }
}

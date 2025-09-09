import { Page, Locator, expect } from '@playwright/test'

/**
 * Core Web Vitals interface
 */
export interface CoreWebVitals {
  FCP: number
  LCP: number
  CLS: number
  FID: number
}

/**
 * Base Page Class for Page Object Model
 * 
 * This class provides common functionality and utilities for all page objects.
 * It implements the Page Object Model pattern for maintainable E2E tests.
 */

export abstract class BasePage {
  protected page: Page
  protected baseUrl: string

  constructor(page: Page, baseUrl: string = 'http://localhost:3000') {
    this.page = page
    this.baseUrl = baseUrl
  }

  // Navigation methods
  async goto(path: string = '') {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`
    await this.page.goto(url, { waitUntil: 'networkidle' })
    await this.waitForPageLoad()
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForSelector('body', { state: 'visible' })
  }

  // Common locators
  get header(): Locator {
    return this.page.locator('header')
  }

  get footer(): Locator {
    return this.page.locator('footer')
  }

  get navigation(): Locator {
    return this.page.locator('nav')
  }

  get main(): Locator {
    return this.page.locator('main')
  }

  // Common actions
  async clickElement(locator: Locator) {
    await locator.click()
  }

  async fillInput(locator: Locator, text: string) {
    await locator.fill(text)
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || ''
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible()
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled()
  }

  // Screenshot and debugging
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    })
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title()
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url()
  }

  // SEO and accessibility helpers
  async getMetaTag(name: string): Promise<string | null> {
    const meta = this.page.locator(`meta[name="${name}"]`)
    return await meta.getAttribute('content')
  }

  async getMetaProperty(property: string): Promise<string | null> {
    const meta = this.page.locator(`meta[property="${property}"]`)
    return await meta.getAttribute('content')
  }

  async getCanonicalUrl(): Promise<string | null> {
    const canonical = this.page.locator('link[rel="canonical"]')
    return await canonical.getAttribute('href')
  }

  // Performance helpers
  async measurePageLoadTime(): Promise<number> {
    const startTime = Date.now()
    await this.page.waitForLoadState('networkidle')
    return Date.now() - startTime
  }

  async getCoreWebVitals(): Promise<CoreWebVitals> {
    return await this.page.evaluate(() => {
      return new Promise<CoreWebVitals>((resolve) => {
        const vitals: CoreWebVitals = {
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

  // Accessibility helpers
  async checkAccessibility() {
    // Basic accessibility checks
    const issues = []

    // Check for alt text on images
    const imagesWithoutAlt = await this.page.locator('img:not([alt])').count()
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`)
    }

    // Check for proper heading hierarchy
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all()
    let previousLevel = 0
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
      const level = parseInt(tagName.replace('h', ''))
      if (level > previousLevel + 1) {
        issues.push(`Heading hierarchy issue: ${tagName} follows h${previousLevel}`)
      }
      previousLevel = level
    }

    return issues
  }

  // Error handling
  async handleError(error: Error, context: string) {
    console.error(`Error in ${context}:`, error.message)
    await this.takeScreenshot(`error-${context}`)
    throw error
  }

  // Wait helpers
  async waitForElement(locator: Locator, timeout: number = 10000) {
    await locator.waitFor({ state: 'visible', timeout })
  }

  async waitForElementToDisappear(locator: Locator, timeout: number = 10000) {
    await locator.waitFor({ state: 'hidden', timeout })
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle')
  }
}

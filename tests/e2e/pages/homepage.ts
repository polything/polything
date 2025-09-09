import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

/**
 * Homepage Page Object
 * 
 * This class represents the homepage and provides methods to interact with
 * homepage elements and test homepage functionality.
 */

export class Homepage extends BasePage {
  // Hero section locators
  get heroSection(): Locator {
    return this.page.locator('[data-testid="hero-section"], .hero-section, section:first-of-type')
  }

  get heroTitle(): Locator {
    return this.page.locator('h1').first()
  }

  get heroSubtitle(): Locator {
    return this.page.locator('[data-testid="hero-subtitle"], .hero-subtitle, h2').first()
  }

  get heroCTA(): Locator {
    return this.page.locator('[data-testid="hero-cta"], .hero-cta, a[href*="contact"], button').first()
  }

  // Navigation locators
  get navigation(): Locator {
    return this.page.locator('nav, [role="navigation"]')
  }

  get logo(): Locator {
    return this.page.locator('[data-testid="logo"], .logo, img[alt*="logo"], img[alt*="Logo"]')
  }

  get navLinks(): Locator {
    return this.page.locator('nav a, [role="navigation"] a')
  }

  // Main content sections
  get aboutSection(): Locator {
    return this.page.locator('[data-testid="about"], .about, section:nth-of-type(2)')
  }

  get servicesSection(): Locator {
    return this.page.locator('[data-testid="services"], .services, section:nth-of-type(3)')
  }

  get caseStudiesSection(): Locator {
    return this.page.locator('[data-testid="case-studies"], .case-studies, section:nth-of-type(4)')
  }

  get testimonialsSection(): Locator {
    return this.page.locator('[data-testid="testimonials"], .testimonials, section:nth-of-type(5)')
  }

  get ctaSection(): Locator {
    return this.page.locator('[data-testid="cta"], .cta, section:last-of-type')
  }

  // Footer locators
  get footer(): Locator {
    return this.page.locator('footer')
  }

  get footerLinks(): Locator {
    return this.page.locator('footer a')
  }

  get socialLinks(): Locator {
    return this.page.locator('footer [data-testid="social"], .social-links a')
  }

  // Constructor
  constructor(page: Page) {
    super(page)
  }

  // Navigation methods
  async navigateToHomepage() {
    await this.goto('/')
  }

  async clickLogo() {
    await this.clickElement(this.logo)
  }

  async clickNavLink(linkText: string) {
    const link = this.navLinks.filter({ hasText: linkText })
    await this.clickElement(link)
  }

  async clickHeroCTA() {
    await this.clickElement(this.heroCTA)
  }

  // Content validation methods
  async validateHeroSection() {
    await this.waitForElement(this.heroSection)
    await this.waitForElement(this.heroTitle)
    
    const titleText = await this.getText(this.heroTitle)
    expect(titleText).toBeTruthy()
    expect(titleText.length).toBeGreaterThan(0)
  }

  async validateNavigation() {
    await this.waitForElement(this.navigation)
    await this.waitForElement(this.logo)
    
    const navLinksCount = await this.navLinks.count()
    expect(navLinksCount).toBeGreaterThan(0)
  }

  async validateMainSections() {
    const sections = [
      this.aboutSection,
      this.servicesSection,
      this.caseStudiesSection,
      this.testimonialsSection
    ]

    for (const section of sections) {
      if (await this.isVisible(section)) {
        await this.waitForElement(section)
      }
    }
  }

  async validateFooter() {
    await this.waitForElement(this.footer)
    
    const footerLinksCount = await this.footerLinks.count()
    expect(footerLinksCount).toBeGreaterThan(0)
  }

  // SEO validation methods
  async validateSEO() {
    // Check title
    const title = await this.getPageTitle()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(10)
    expect(title.length).toBeLessThan(60)

    // Check meta description
    const description = await this.getMetaTag('description')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(120)
    expect(description!.length).toBeLessThan(160)

    // Check canonical URL
    const canonical = await this.getCanonicalUrl()
    expect(canonical).toBeTruthy()
    expect(canonical).toContain('localhost:3000')

    // Check Open Graph tags
    const ogTitle = await this.getMetaProperty('og:title')
    const ogDescription = await this.getMetaProperty('og:description')
    const ogImage = await this.getMetaProperty('og:image')
    
    expect(ogTitle).toBeTruthy()
    expect(ogDescription).toBeTruthy()
    expect(ogImage).toBeTruthy()
  }

  // Performance validation methods
  async validatePerformance() {
    const loadTime = await this.measurePageLoadTime()
    expect(loadTime).toBeLessThan(3000) // 3 seconds

    const vitals = await this.getCoreWebVitals()
    expect(vitals.FCP).toBeLessThan(2000) // 2 seconds
    expect(vitals.LCP).toBeLessThan(4000) // 4 seconds
    expect(vitals.CLS).toBeLessThan(0.1)
  }

  // Accessibility validation methods
  async validateAccessibility() {
    const issues = await this.checkAccessibility()
    expect(issues).toHaveLength(0)
  }

  // Interaction methods
  async scrollToSection(section: Locator) {
    await section.scrollIntoViewIfNeeded()
    await this.page.waitForTimeout(500) // Allow for scroll animations
  }

  async scrollToBottom() {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await this.page.waitForTimeout(500)
  }

  async scrollToTop() {
    await this.page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await this.page.waitForTimeout(500)
  }

  // Form interaction methods (if any forms exist on homepage)
  async fillContactForm(data: { name: string; email: string; message: string }) {
    const nameInput = this.page.locator('input[name="name"], input[placeholder*="name"]')
    const emailInput = this.page.locator('input[name="email"], input[type="email"]')
    const messageInput = this.page.locator('textarea[name="message"], textarea[placeholder*="message"]')
    const submitButton = this.page.locator('button[type="submit"], input[type="submit"]')

    if (await this.isVisible(nameInput)) {
      await this.fillInput(nameInput, data.name)
    }
    if (await this.isVisible(emailInput)) {
      await this.fillInput(emailInput, data.email)
    }
    if (await this.isVisible(messageInput)) {
      await this.fillInput(messageInput, data.message)
    }
    if (await this.isVisible(submitButton)) {
      await this.clickElement(submitButton)
    }
  }

  // Comprehensive validation method
  async validateHomepage() {
    await this.validateHeroSection()
    await this.validateNavigation()
    await this.validateMainSections()
    await this.validateFooter()
    await this.validateSEO()
    await this.validatePerformance()
    await this.validateAccessibility()
  }
}

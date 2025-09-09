import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

/**
 * Project Page Object
 * 
 * This class represents individual project pages and provides methods to interact with
 * project page elements and test project page functionality.
 */

export class ProjectPage extends BasePage {
  // Project content locators
  get projectTitle(): Locator {
    return this.page.locator('h1').first()
  }

  get projectSubtitle(): Locator {
    return this.page.locator('[data-testid="project-subtitle"], .project-subtitle, h2').first()
  }

  get projectDescription(): Locator {
    return this.page.locator('[data-testid="project-description"], .project-description, p').first()
  }

  get projectImage(): Locator {
    return this.page.locator('[data-testid="project-image"], .project-image, img').first()
  }

  get projectGallery(): Locator {
    return this.page.locator('[data-testid="project-gallery"], .project-gallery, .gallery')
  }

  get projectDetails(): Locator {
    return this.page.locator('[data-testid="project-details"], .project-details, .details')
  }

  get projectTechnologies(): Locator {
    return this.page.locator('[data-testid="project-technologies"], .project-technologies, .technologies')
  }

  get projectResults(): Locator {
    return this.page.locator('[data-testid="project-results"], .project-results, .results')
  }

  get projectCTA(): Locator {
    return this.page.locator('[data-testid="project-cta"], .project-cta, a[href*="contact"], button')
  }

  // Navigation locators
  get breadcrumbs(): Locator {
    return this.page.locator('[data-testid="breadcrumbs"], .breadcrumbs, nav[aria-label="breadcrumb"]')
  }

  get backToWork(): Locator {
    return this.page.locator('[data-testid="back-to-work"], .back-to-work, a[href*="/work"]')
  }

  get nextProject(): Locator {
    return this.page.locator('[data-testid="next-project"], .next-project, a[href*="/work/"]')
  }

  get previousProject(): Locator {
    return this.page.locator('[data-testid="previous-project"], .previous-project, a[href*="/work/"]')
  }

  // Related content locators
  get relatedProjects(): Locator {
    return this.page.locator('[data-testid="related-projects"], .related-projects, .related')
  }

  get relatedProjectCards(): Locator {
    return this.page.locator('[data-testid="related-project-card"], .related-project-card, .project-card')
  }

  // Constructor
  constructor(page: Page) {
    super(page)
  }

  // Navigation methods
  async navigateToProject(projectSlug: string) {
    await this.goto(`/work/${projectSlug}`)
  }

  async clickBackToWork() {
    await this.clickElement(this.backToWork)
  }

  async clickNextProject() {
    await this.clickElement(this.nextProject)
  }

  async clickPreviousProject() {
    await this.clickElement(this.previousProject)
  }

  async clickRelatedProject(index: number = 0) {
    const projectCard = this.relatedProjectCards.nth(index)
    await this.clickElement(projectCard)
  }

  // Content validation methods
  async validateProjectContent() {
    await this.waitForElement(this.projectTitle)
    
    const titleText = await this.getText(this.projectTitle)
    expect(titleText).toBeTruthy()
    expect(titleText.length).toBeGreaterThan(0)

    // Check if project image exists
    if (await this.isVisible(this.projectImage)) {
      await this.waitForElement(this.projectImage)
      const imageSrc = await this.projectImage.getAttribute('src')
      expect(imageSrc).toBeTruthy()
    }
  }

  async validateProjectDetails() {
    if (await this.isVisible(this.projectDetails)) {
      await this.waitForElement(this.projectDetails)
      
      const detailsText = await this.getText(this.projectDetails)
      expect(detailsText).toBeTruthy()
      expect(detailsText.length).toBeGreaterThan(0)
    }
  }

  async validateProjectTechnologies() {
    if (await this.isVisible(this.projectTechnologies)) {
      await this.waitForElement(this.projectTechnologies)
      
      const technologiesText = await this.getText(this.projectTechnologies)
      expect(technologiesText).toBeTruthy()
    }
  }

  async validateProjectResults() {
    if (await this.isVisible(this.projectResults)) {
      await this.waitForElement(this.projectResults)
      
      const resultsText = await this.getText(this.projectResults)
      expect(resultsText).toBeTruthy()
    }
  }

  async validateBreadcrumbs() {
    if (await this.isVisible(this.breadcrumbs)) {
      await this.waitForElement(this.breadcrumbs)
      
      const breadcrumbLinks = this.breadcrumbs.locator('a')
      const linkCount = await breadcrumbLinks.count()
      expect(linkCount).toBeGreaterThan(0)
    }
  }

  async validateRelatedProjects() {
    if (await this.isVisible(this.relatedProjects)) {
      await this.waitForElement(this.relatedProjects)
      
      const projectCardsCount = await this.relatedProjectCards.count()
      expect(projectCardsCount).toBeGreaterThan(0)
    }
  }

  // SEO validation methods
  async validateProjectSEO() {
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
    expect(canonical).toContain('/work/')

    // Check Open Graph tags
    const ogTitle = await this.getMetaProperty('og:title')
    const ogDescription = await this.getMetaProperty('og:description')
    const ogImage = await this.getMetaProperty('og:image')
    
    expect(ogTitle).toBeTruthy()
    expect(ogDescription).toBeTruthy()
    expect(ogImage).toBeTruthy()
  }

  // JSON-LD validation methods
  async validateProjectJSONLD() {
    const jsonLdScripts = this.page.locator('script[type="application/ld+json"]')
    const scriptCount = await jsonLdScripts.count()
    expect(scriptCount).toBeGreaterThan(0)

    // Check for Project schema
    for (let i = 0; i < scriptCount; i++) {
      const script = jsonLdScripts.nth(i)
      const content = await script.textContent()
      if (content) {
        const jsonLd = JSON.parse(content)
        if (jsonLd['@type'] === 'Project' || jsonLd['@type'] === 'CreativeWork') {
          expect(jsonLd.name).toBeTruthy()
          expect(jsonLd.description).toBeTruthy()
          return
        }
      }
    }
    
    throw new Error('Project JSON-LD schema not found')
  }

  // Performance validation methods
  async validateProjectPerformance() {
    const loadTime = await this.measurePageLoadTime()
    expect(loadTime).toBeLessThan(3000) // 3 seconds

    const vitals = await this.getCoreWebVitals()
    expect(vitals.FCP).toBeLessThan(2000) // 2 seconds
    expect(vitals.LCP).toBeLessThan(4000) // 4 seconds
    expect(vitals.CLS).toBeLessThan(0.1)
  }

  // Accessibility validation methods
  async validateProjectAccessibility() {
    const issues = await this.checkAccessibility()
    expect(issues).toHaveLength(0)
  }

  // Interaction methods
  async scrollToSection(section: Locator) {
    await section.scrollIntoViewIfNeeded()
    await this.page.waitForTimeout(500)
  }

  async scrollToGallery() {
    if (await this.isVisible(this.projectGallery)) {
      await this.scrollToSection(this.projectGallery)
    }
  }

  async scrollToRelatedProjects() {
    if (await this.isVisible(this.relatedProjects)) {
      await this.scrollToSection(this.relatedProjects)
    }
  }

  // Gallery interaction methods
  async clickGalleryImage(index: number = 0) {
    if (await this.isVisible(this.projectGallery)) {
      const galleryImages = this.projectGallery.locator('img')
      const image = galleryImages.nth(index)
      await this.clickElement(image)
    }
  }

  // Comprehensive validation method
  async validateProjectPage() {
    await this.validateProjectContent()
    await this.validateProjectDetails()
    await this.validateProjectTechnologies()
    await this.validateProjectResults()
    await this.validateBreadcrumbs()
    await this.validateRelatedProjects()
    await this.validateProjectSEO()
    await this.validateProjectJSONLD()
    await this.validateProjectPerformance()
    await this.validateProjectAccessibility()
  }

  // Utility methods
  async getProjectTitle(): Promise<string> {
    return await this.getText(this.projectTitle)
  }

  async getProjectDescription(): Promise<string> {
    return await this.getText(this.projectDescription)
  }

  async getRelatedProjectsCount(): Promise<number> {
    return await this.relatedProjectCards.count()
  }
}

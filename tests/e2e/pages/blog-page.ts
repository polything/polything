import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'

/**
 * Blog Page Object
 * 
 * This class represents individual blog post pages and provides methods to interact with
 * blog page elements and test blog page functionality.
 */

export class BlogPage extends BasePage {
  // Blog content locators
  get blogTitle(): Locator {
    return this.page.locator('h1').first()
  }

  get blogSubtitle(): Locator {
    return this.page.locator('[data-testid="blog-subtitle"], .blog-subtitle, h2').first()
  }

  get blogMeta(): Locator {
    return this.page.locator('[data-testid="blog-meta"], .blog-meta, .post-meta')
  }

  get blogDate(): Locator {
    return this.page.locator('[data-testid="blog-date"], .blog-date, time, .date')
  }

  get blogAuthor(): Locator {
    return this.page.locator('[data-testid="blog-author"], .blog-author, .author')
  }

  get blogImage(): Locator {
    return this.page.locator('[data-testid="blog-image"], .blog-image, img').first()
  }

  get blogContent(): Locator {
    return this.page.locator('[data-testid="blog-content"], .blog-content, .post-content, article')
  }

  get blogExcerpt(): Locator {
    return this.page.locator('[data-testid="blog-excerpt"], .blog-excerpt, .excerpt')
  }

  // Navigation locators
  get breadcrumbs(): Locator {
    return this.page.locator('[data-testid="breadcrumbs"], .breadcrumbs, nav[aria-label="breadcrumb"]')
  }

  get backToBlog(): Locator {
    return this.page.locator('[data-testid="back-to-blog"], .back-to-blog, a[href*="/blog"]')
  }

  get nextPost(): Locator {
    return this.page.locator('[data-testid="next-post"], .next-post, a[href*="/blog/"]')
  }

  get previousPost(): Locator {
    return this.page.locator('[data-testid="previous-post"], .previous-post, a[href*="/blog/"]')
  }

  // Related content locators
  get relatedPosts(): Locator {
    return this.page.locator('[data-testid="related-posts"], .related-posts, .related')
  }

  get relatedPostCards(): Locator {
    return this.page.locator('[data-testid="related-post-card"], .related-post-card, .post-card')
  }

  // Social sharing locators
  get socialSharing(): Locator {
    return this.page.locator('[data-testid="social-sharing"], .social-sharing, .share-buttons')
  }

  get shareButtons(): Locator {
    return this.page.locator('[data-testid="share-button"], .share-button, .social-share')
  }

  // Comments section (if exists)
  get commentsSection(): Locator {
    return this.page.locator('[data-testid="comments"], .comments, .comment-section')
  }

  // Constructor
  constructor(page: Page) {
    super(page)
  }

  // Navigation methods
  async navigateToBlogPost(postSlug: string) {
    await this.goto(`/blog/${postSlug}`)
  }

  async clickBackToBlog() {
    await this.clickElement(this.backToBlog)
  }

  async clickNextPost() {
    await this.clickElement(this.nextPost)
  }

  async clickPreviousPost() {
    await this.clickElement(this.previousPost)
  }

  async clickRelatedPost(index: number = 0) {
    const postCard = this.relatedPostCards.nth(index)
    await this.clickElement(postCard)
  }

  // Content validation methods
  async validateBlogContent() {
    await this.waitForElement(this.blogTitle)
    
    const titleText = await this.getText(this.blogTitle)
    expect(titleText).toBeTruthy()
    expect(titleText.length).toBeGreaterThan(0)

    // Check if blog content exists
    if (await this.isVisible(this.blogContent)) {
      await this.waitForElement(this.blogContent)
      const contentText = await this.getText(this.blogContent)
      expect(contentText).toBeTruthy()
      expect(contentText.length).toBeGreaterThan(0)
    }
  }

  async validateBlogMeta() {
    if (await this.isVisible(this.blogMeta)) {
      await this.waitForElement(this.blogMeta)
      
      // Check for date
      if (await this.isVisible(this.blogDate)) {
        const dateText = await this.getText(this.blogDate)
        expect(dateText).toBeTruthy()
      }
      
      // Check for author
      if (await this.isVisible(this.blogAuthor)) {
        const authorText = await this.getText(this.blogAuthor)
        expect(authorText).toBeTruthy()
      }
    }
  }

  async validateBlogImage() {
    if (await this.isVisible(this.blogImage)) {
      await this.waitForElement(this.blogImage)
      const imageSrc = await this.blogImage.getAttribute('src')
      expect(imageSrc).toBeTruthy()
      
      // Check for alt text
      const altText = await this.blogImage.getAttribute('alt')
      expect(altText).toBeTruthy()
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

  async validateRelatedPosts() {
    if (await this.isVisible(this.relatedPosts)) {
      await this.waitForElement(this.relatedPosts)
      
      const postCardsCount = await this.relatedPostCards.count()
      expect(postCardsCount).toBeGreaterThan(0)
    }
  }

  async validateSocialSharing() {
    if (await this.isVisible(this.socialSharing)) {
      await this.waitForElement(this.socialSharing)
      
      const shareButtonsCount = await this.shareButtons.count()
      expect(shareButtonsCount).toBeGreaterThan(0)
    }
  }

  // SEO validation methods
  async validateBlogSEO() {
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
    expect(canonical).toContain('/blog/')

    // Check Open Graph tags
    const ogTitle = await this.getMetaProperty('og:title')
    const ogDescription = await this.getMetaProperty('og:description')
    const ogImage = await this.getMetaProperty('og:image')
    const ogType = await this.getMetaProperty('og:type')
    
    expect(ogTitle).toBeTruthy()
    expect(ogDescription).toBeTruthy()
    expect(ogImage).toBeTruthy()
    expect(ogType).toBe('article')
  }

  // JSON-LD validation methods
  async validateBlogJSONLD() {
    const jsonLdScripts = this.page.locator('script[type="application/ld+json"]')
    const scriptCount = await jsonLdScripts.count()
    expect(scriptCount).toBeGreaterThan(0)

    // Check for Article schema
    for (let i = 0; i < scriptCount; i++) {
      const script = jsonLdScripts.nth(i)
      const content = await script.textContent()
      if (content) {
        const jsonLd = JSON.parse(content)
        if (jsonLd['@type'] === 'Article' || jsonLd['@type'] === 'BlogPosting') {
          expect(jsonLd.headline).toBeTruthy()
          expect(jsonLd.description).toBeTruthy()
          expect(jsonLd.author).toBeTruthy()
          expect(jsonLd.datePublished).toBeTruthy()
          return
        }
      }
    }
    
    throw new Error('Article JSON-LD schema not found')
  }

  // Performance validation methods
  async validateBlogPerformance() {
    const loadTime = await this.measurePageLoadTime()
    expect(loadTime).toBeLessThan(3000) // 3 seconds

    const vitals = await this.getCoreWebVitals()
    expect(vitals.FCP).toBeLessThan(2000) // 2 seconds
    expect(vitals.LCP).toBeLessThan(4000) // 4 seconds
    expect(vitals.CLS).toBeLessThan(0.1)
  }

  // Accessibility validation methods
  async validateBlogAccessibility() {
    const issues = await this.checkAccessibility()
    expect(issues).toHaveLength(0)
  }

  // Interaction methods
  async scrollToSection(section: Locator) {
    await section.scrollIntoViewIfNeeded()
    await this.page.waitForTimeout(500)
  }

  async scrollToRelatedPosts() {
    if (await this.isVisible(this.relatedPosts)) {
      await this.scrollToSection(this.relatedPosts)
    }
  }

  async scrollToComments() {
    if (await this.isVisible(this.commentsSection)) {
      await this.scrollToSection(this.commentsSection)
    }
  }

  // Social sharing interaction methods
  async clickShareButton(platform: string) {
    if (await this.isVisible(this.socialSharing)) {
      const shareButton = this.shareButtons.filter({ hasText: platform })
      if (await this.isVisible(shareButton)) {
        await this.clickElement(shareButton)
      }
    }
  }

  // Comprehensive validation method
  async validateBlogPage() {
    await this.validateBlogContent()
    await this.validateBlogMeta()
    await this.validateBlogImage()
    await this.validateBreadcrumbs()
    await this.validateRelatedPosts()
    await this.validateSocialSharing()
    await this.validateBlogSEO()
    await this.validateBlogJSONLD()
    await this.validateBlogPerformance()
    await this.validateBlogAccessibility()
  }

  // Utility methods
  async getBlogTitle(): Promise<string> {
    return await this.getText(this.blogTitle)
  }

  async getBlogExcerpt(): Promise<string> {
    return await this.getText(this.blogExcerpt)
  }

  async getRelatedPostsCount(): Promise<number> {
    return await this.relatedPostCards.count()
  }

  async getBlogDate(): Promise<string> {
    return await this.getText(this.blogDate)
  }

  async getBlogAuthor(): Promise<string> {
    return await this.getText(this.blogAuthor)
  }
}

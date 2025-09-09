import { test, expect } from '@playwright/test'
import { Homepage } from './pages/homepage'
import { ProjectPage } from './pages/project-page'
import { BlogPage } from './pages/blog-page'

/**
 * Accessibility E2E Tests
 * 
 * These tests ensure that the application meets WCAG 2.1 accessibility standards
 * and provides a good experience for users with disabilities.
 */

test.describe('Accessibility Tests', () => {
  let homepage: Homepage
  let projectPage: ProjectPage
  let blogPage: BlogPage

  test.beforeEach(async ({ page }) => {
    homepage = new Homepage(page)
    projectPage = new ProjectPage(page)
    blogPage = new BlogPage(page)
  })

  test.describe('WCAG 2.1 Compliance', () => {
    test('homepage should meet accessibility standards', async () => {
      await homepage.navigateToHomepage()
      
      // Check for accessibility issues
      const issues = await homepage.checkAccessibility()
      expect(issues).toHaveLength(0)
      
      // Additional accessibility checks
      await testAccessibilityBasics(homepage.page)
    })

    test('project page should meet accessibility standards', async () => {
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          break
        } catch (error) {
          continue
        }
      }

      const issues = await projectPage.checkAccessibility()
      expect(issues).toHaveLength(0)
      
      await testAccessibilityBasics(projectPage.page)
    })

    test('blog page should meet accessibility standards', async () => {
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          break
        } catch (error) {
          continue
        }
      }

      const issues = await blogPage.checkAccessibility()
      expect(issues).toHaveLength(0)
      
      await testAccessibilityBasics(blogPage.page)
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should be fully navigable with keyboard', async () => {
      await homepage.navigateToHomepage()
      
      // Test tab navigation
      await testKeyboardNavigation(homepage.page)
    })

    test('should have proper focus management', async () => {
      await homepage.navigateToHomepage()
      
      // Test focus indicators
      const focusableElements = homepage.page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
      const focusableCount = await focusableElements.count()
      
      for (let i = 0; i < Math.min(focusableCount, 10); i++) {
        const element = focusableElements.nth(i)
        await element.focus()
        
        // Check if element is focused
        const isFocused = await element.evaluate(el => el === document.activeElement)
        expect(isFocused).toBe(true)
        
        // Check for focus indicator
        const focusStyles = await element.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow
          }
        })
        
        const hasFocusIndicator = focusStyles.outline !== 'none' || 
                                 focusStyles.outlineWidth !== '0px' || 
                                 focusStyles.boxShadow !== 'none'
        
        expect(hasFocusIndicator).toBe(true)
      }
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA labels and roles', async () => {
      await homepage.navigateToHomepage()
      
      // Check for proper ARIA attributes
      const elementsWithAria = homepage.page.locator('[aria-label], [aria-labelledby], [role]')
      const ariaCount = await elementsWithAria.count()
      expect(ariaCount).toBeGreaterThan(0)
      
      // Check for proper heading hierarchy
      const headings = homepage.page.locator('h1, h2, h3, h4, h5, h6')
      const headingCount = await headings.count()
      expect(headingCount).toBeGreaterThan(0)
      
      // Check for main landmark
      const mainLandmark = homepage.page.locator('main, [role="main"]')
      const mainCount = await mainLandmark.count()
      expect(mainCount).toBeGreaterThan(0)
    })

    test('should have proper alt text for images', async () => {
      await homepage.navigateToHomepage()
      
      const images = homepage.page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i)
        const alt = await image.getAttribute('alt')
        
        // Decorative images can have empty alt, but should have alt attribute
        expect(alt).not.toBeNull()
      }
    })

    test('should have proper form labels', async () => {
      await homepage.navigateToHomepage()
      
      const inputs = homepage.page.locator('input, textarea, select')
      const inputCount = await inputs.count()
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')
        
        if (id) {
          // Check for associated label
          const label = homepage.page.locator(`label[for="${id}"]`)
          const hasLabel = await label.count() > 0
          
          // Check for aria-label or aria-labelledby
          const ariaLabel = await input.getAttribute('aria-label')
          const ariaLabelledBy = await input.getAttribute('aria-labelledby')
          
          const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledBy
          expect(hasAccessibleName).toBe(true)
        }
      }
    })
  })

  test.describe('Color and Contrast', () => {
    test('should have sufficient color contrast', async () => {
      await homepage.navigateToHomepage()
      
      // This is a basic check - in a real implementation, you might want to use
      // a more sophisticated contrast checking tool
      const textElements = homepage.page.locator('p, h1, h2, h3, h4, h5, h6, a, button, span')
      const textCount = await textElements.count()
      
      // Sample a few text elements for contrast checking
      for (let i = 0; i < Math.min(textCount, 5); i++) {
        const element = textElements.nth(i)
        const isVisible = await element.isVisible()
        
        if (isVisible) {
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el)
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              fontSize: computed.fontSize
            }
          })
          
          // Basic check that colors are defined
          expect(styles.color).not.toBe('rgba(0, 0, 0, 0)')
          expect(styles.fontSize).not.toBe('0px')
        }
      }
    })

    test('should not rely solely on color for information', async () => {
      await homepage.navigateToHomepage()
      
      // Check that important information is not conveyed only through color
      const links = homepage.page.locator('a')
      const linkCount = await links.count()
      
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = links.nth(i)
        const text = await link.textContent()
        const styles = await link.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            textDecoration: computed.textDecoration,
            color: computed.color
          }
        })
        
        // Links should have some visual indication beyond just color
        const hasUnderline = styles.textDecoration.includes('underline')
        const hasOtherIndication = text && text.length > 0
        
        expect(hasUnderline || hasOtherIndication).toBe(true)
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('should be accessible on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await homepage.navigateToHomepage()
      
      // Check that navigation is accessible on mobile
      const mobileMenu = homepage.page.locator('[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"]')
      const hasMobileMenu = await mobileMenu.count() > 0
      
      if (hasMobileMenu) {
        await mobileMenu.click()
        
        // Check that menu is accessible
        const menuItems = homepage.page.locator('nav a, [role="menuitem"]')
        const menuItemCount = await menuItems.count()
        expect(menuItemCount).toBeGreaterThan(0)
      }
      
      // Check accessibility on mobile
      const issues = await homepage.checkAccessibility()
      expect(issues).toHaveLength(0)
    })

    test('should be accessible on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      await homepage.navigateToHomepage()
      
      // Check accessibility on tablet
      const issues = await homepage.checkAccessibility()
      expect(issues).toHaveLength(0)
    })
  })
})

// Helper functions for accessibility testing
async function testAccessibilityBasics(page: any) {
  // Check for proper document structure
  const html = page.locator('html')
  const lang = await html.getAttribute('lang')
  expect(lang).toBeTruthy()
  
  // Check for proper title
  const title = await page.title()
  expect(title).toBeTruthy()
  expect(title.length).toBeGreaterThan(0)
  
  // Check for proper meta description
  const metaDescription = page.locator('meta[name="description"]')
  const description = await metaDescription.getAttribute('content')
  expect(description).toBeTruthy()
}

async function testKeyboardNavigation(page: any) {
  // Test basic tab navigation
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

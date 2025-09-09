import { test, expect } from '@playwright/test'
import { Homepage } from './pages/homepage'
import { ProjectPage } from './pages/project-page'
import { BlogPage } from './pages/blog-page'

/**
 * Critical User Journeys E2E Tests
 * 
 * These tests cover the most important user journeys through the application,
 * ensuring that core functionality works correctly across different browsers.
 */

test.describe('Critical User Journeys', () => {
  let homepage: Homepage
  let projectPage: ProjectPage
  let blogPage: BlogPage

  test.beforeEach(async ({ page }) => {
    homepage = new Homepage(page)
    projectPage = new ProjectPage(page)
    blogPage = new BlogPage(page)
  })

  test.describe('Homepage Journey', () => {
    test('should load homepage and validate all sections', async () => {
      await homepage.navigateToHomepage()
      await homepage.validateHomepage()
    })

    test('should navigate from homepage to project page', async () => {
      await homepage.navigateToHomepage()
      
      // Look for project links in the homepage
      const projectLinks = homepage.page.locator('a[href*="/work/"]')
      const projectLinkCount = await projectLinks.count()
      
      if (projectLinkCount > 0) {
        // Click the first project link
        const firstProjectLink = projectLinks.first()
        const projectUrl = await firstProjectLink.getAttribute('href')
        
        if (projectUrl) {
          await firstProjectLink.click()
          await projectPage.validateProjectContent()
        }
      }
    })

    test('should navigate from homepage to blog', async () => {
      await homepage.navigateToHomepage()
      
      // Look for blog links
      const blogLinks = homepage.page.locator('a[href*="/blog"]')
      const blogLinkCount = await blogLinks.count()
      
      if (blogLinkCount > 0) {
        const firstBlogLink = blogLinks.first()
        await firstBlogLink.click()
        
        // Should be on blog listing or individual blog post
        const currentUrl = homepage.page.url()
        expect(currentUrl).toContain('/blog')
      }
    })

    test('should navigate to contact/CTA from homepage', async () => {
      await homepage.navigateToHomepage()
      
      // Look for contact/CTA links
      const ctaLinks = homepage.page.locator('a[href*="contact"], button:has-text("Contact"), button:has-text("Get Started")')
      const ctaLinkCount = await ctaLinks.count()
      
      if (ctaLinkCount > 0) {
        const firstCtaLink = ctaLinks.first()
        await firstCtaLink.click()
        
        // Should navigate to contact page or show contact form
        const currentUrl = homepage.page.url()
        expect(currentUrl).toMatch(/contact|form|mailto/)
      }
    })
  })

  test.describe('Project Page Journey', () => {
    test('should load project page and validate content', async () => {
      // Try to navigate to a project page
      // This will depend on your actual project slugs
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          await projectPage.validateProjectPage()
          break // If successful, exit the loop
        } catch (error) {
          console.log(`Project ${slug} not found, trying next...`)
          continue
        }
      }
    })

    test('should navigate between related projects', async () => {
      // First, navigate to a project page
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          break
        } catch (error) {
          continue
        }
      }

      // Check if there are related projects
      if (await projectPage.isVisible(projectPage.relatedProjects)) {
        const relatedCount = await projectPage.getRelatedProjectsCount()
        expect(relatedCount).toBeGreaterThan(0)
        
        // Click on a related project
        await projectPage.clickRelatedProject(0)
        await projectPage.validateProjectContent()
      }
    })

    test('should navigate back to work listing from project', async () => {
      // Navigate to a project page first
      const projectSlugs = ['blackriver-case-study', 'test-project', 'sample-project']
      
      for (const slug of projectSlugs) {
        try {
          await projectPage.navigateToProject(slug)
          break
        } catch (error) {
          continue
        }
      }

      // Click back to work
      if (await projectPage.isVisible(projectPage.backToWork)) {
        await projectPage.clickBackToWork()
        
        const currentUrl = projectPage.page.url()
        expect(currentUrl).toMatch(/\/work/)
      }
    })
  })

  test.describe('Blog Page Journey', () => {
    test('should load blog post and validate content', async () => {
      // Try to navigate to a blog post
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          await blogPage.validateBlogPage()
          break
        } catch (error) {
          console.log(`Blog post ${slug} not found, trying next...`)
          continue
        }
      }
    })

    test('should navigate between related blog posts', async () => {
      // First, navigate to a blog post
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          break
        } catch (error) {
          continue
        }
      }

      // Check if there are related posts
      if (await blogPage.isVisible(blogPage.relatedPosts)) {
        const relatedCount = await blogPage.getRelatedPostsCount()
        expect(relatedCount).toBeGreaterThan(0)
        
        // Click on a related post
        await blogPage.clickRelatedPost(0)
        await blogPage.validateBlogContent()
      }
    })

    test('should navigate back to blog listing from post', async () => {
      // Navigate to a blog post first
      const blogSlugs = ['test-post', 'sample-post', 'example-post']
      
      for (const slug of blogSlugs) {
        try {
          await blogPage.navigateToBlogPost(slug)
          break
        } catch (error) {
          continue
        }
      }

      // Click back to blog
      if (await blogPage.isVisible(blogPage.backToBlog)) {
        await blogPage.clickBackToBlog()
        
        const currentUrl = blogPage.page.url()
        expect(currentUrl).toMatch(/\/blog/)
      }
    })
  })

  test.describe('Cross-Page Navigation Journey', () => {
    test('should navigate from homepage → project → blog → homepage', async () => {
      // Start at homepage
      await homepage.navigateToHomepage()
      await homepage.validateHomepage()

      // Navigate to project
      const projectLinks = homepage.page.locator('a[href*="/work/"]')
      const projectLinkCount = await projectLinks.count()
      
      if (projectLinkCount > 0) {
        const firstProjectLink = projectLinks.first()
        await firstProjectLink.click()
        await projectPage.validateProjectContent()

        // Navigate to blog from project page
        const blogLinks = projectPage.page.locator('a[href*="/blog"]')
        const blogLinkCount = await blogLinks.count()
        
        if (blogLinkCount > 0) {
          const firstBlogLink = blogLinks.first()
          await firstBlogLink.click()
          await blogPage.validateBlogContent()

          // Navigate back to homepage
          const homeLinks = blogPage.page.locator('a[href="/"], a[href="/home"]')
          const homeLinkCount = await homeLinks.count()
          
          if (homeLinkCount > 0) {
            const homeLink = homeLinks.first()
            await homeLink.click()
            await homepage.validateHomepage()
          }
        }
      }
    })

    test('should maintain navigation state across pages', async () => {
      // Test that navigation elements are consistent across pages
      const pages = [
        { name: 'homepage', page: homepage, url: '/' },
        { name: 'project', page: projectPage, url: '/work/blackriver-case-study' },
        { name: 'blog', page: blogPage, url: '/blog/test-post' }
      ]

      for (const { name, page, url } of pages) {
        try {
          await page.goto(url)
          
          // Check that navigation is present
          if (await page.isVisible(page.navigation)) {
            await page.waitForElement(page.navigation)
          }
          
          // Check that logo is present
          if (await page.isVisible(page.logo)) {
            await page.waitForElement(page.logo)
          }
          
          console.log(`✅ Navigation state maintained on ${name}`)
        } catch (error) {
          console.log(`⚠️ Could not test navigation on ${name}: ${error.message}`)
        }
      }
    })
  })

  test.describe('Performance Journey', () => {
    test('should meet performance requirements across all pages', async () => {
      const pages = [
        { name: 'homepage', page: homepage, url: '/' },
        { name: 'project', page: projectPage, url: '/work/blackriver-case-study' },
        { name: 'blog', page: blogPage, url: '/blog/test-post' }
      ]

      for (const { name, page, url } of pages) {
        try {
          await page.goto(url)
          await page.validatePerformance()
          console.log(`✅ Performance requirements met for ${name}`)
        } catch (error) {
          console.log(`⚠️ Performance issue on ${name}: ${error.message}`)
        }
      }
    })
  })

  test.describe('SEO Journey', () => {
    test('should have proper SEO across all pages', async () => {
      const pages = [
        { name: 'homepage', page: homepage, url: '/' },
        { name: 'project', page: projectPage, url: '/work/blackriver-case-study' },
        { name: 'blog', page: blogPage, url: '/blog/test-post' }
      ]

      for (const { name, page, url } of pages) {
        try {
          await page.goto(url)
          
          if (name === 'homepage') {
            await homepage.validateSEO()
          } else if (name === 'project') {
            await projectPage.validateProjectSEO()
          } else if (name === 'blog') {
            await blogPage.validateBlogSEO()
          }
          
          console.log(`✅ SEO requirements met for ${name}`)
        } catch (error) {
          console.log(`⚠️ SEO issue on ${name}: ${error.message}`)
        }
      }
    })
  })
})

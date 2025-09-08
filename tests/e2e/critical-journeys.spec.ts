import { test, expect } from '@playwright/test';

/**
 * E2E tests for critical user journeys
 * Task 4.5: E2E tests (critical journeys: homepage → project → blog → contact)
 */

test.describe('Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test.describe('Homepage Journey', () => {
    test('should load homepage with hero section', async ({ page }) => {
      // Check that the page loads
      await expect(page).toHaveTitle(/Polything/);
      
      // Check for hero section
      const heroSection = page.locator('[data-testid="hero-section"], .hero, section').first();
      await expect(heroSection).toBeVisible();
      
      // Check for navigation
      const navigation = page.locator('nav, [role="navigation"]');
      await expect(navigation).toBeVisible();
      
      // Check for footer
      const footer = page.locator('footer, [role="contentinfo"]');
      await expect(footer).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
      // Test main navigation links
      const navLinks = page.locator('nav a, [role="navigation"] a');
      const linkCount = await navLinks.count();
      
      expect(linkCount).toBeGreaterThan(0);
      
      // Test that links are clickable and navigate correctly
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
          await link.click();
          await page.waitForLoadState('networkidle');
          
          // Verify we're on a valid page (not 404)
          const title = await page.title();
          expect(title).not.toContain('404');
          expect(title).not.toContain('Not Found');
          
          // Go back to homepage for next test
          await page.goto('/');
        }
      }
    });

    test('should have responsive design', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');
      
      // Check that content is still visible and properly laid out
      const heroSection = page.locator('[data-testid="hero-section"], .hero, section').first();
      await expect(heroSection).toBeVisible();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForLoadState('networkidle');
      
      await expect(heroSection).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForLoadState('networkidle');
      
      await expect(heroSection).toBeVisible();
    });
  });

  test.describe('Project Journey', () => {
    test('should navigate to project page and display content', async ({ page }) => {
      // Look for project links on homepage
      const projectLinks = page.locator('a[href*="/work/"], a[href*="/project/"]');
      const projectLinkCount = await projectLinks.count();
      
      if (projectLinkCount > 0) {
        // Click on first project link
        const firstProjectLink = projectLinks.first();
        const projectUrl = await firstProjectLink.getAttribute('href');
        
        await firstProjectLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify we're on a project page
        expect(page.url()).toContain('/work/');
        
        // Check for project content
        const projectTitle = page.locator('h1, [data-testid="project-title"]');
        await expect(projectTitle).toBeVisible();
        
        // Check for project content
        const projectContent = page.locator('main, [data-testid="project-content"], .content');
        await expect(projectContent).toBeVisible();
        
        // Check for back navigation or breadcrumbs
        const backLink = page.locator('a[href="/"], a[href="/work"], [data-testid="back-link"]');
        const backLinkCount = await backLink.count();
        expect(backLinkCount).toBeGreaterThan(0);
      } else {
        // If no project links on homepage, try to navigate directly to a project
        await page.goto('/work/test-project');
        
        // Check if page exists (not 404)
        const title = await page.title();
        if (!title.includes('404') && !title.includes('Not Found')) {
          const projectTitle = page.locator('h1, [data-testid="project-title"]');
          await expect(projectTitle).toBeVisible();
        }
      }
    });

    test('should display project hero section', async ({ page }) => {
      // Try to navigate to a project page
      await page.goto('/work/test-project');
      
      // Check if page exists
      const title = await page.title();
      if (!title.includes('404') && !title.includes('Not Found')) {
        // Check for hero section
        const heroSection = page.locator('[data-testid="hero-section"], .hero, section').first();
        await expect(heroSection).toBeVisible();
        
        // Check for hero title
        const heroTitle = page.locator('[data-testid="hero-title"], .hero h1, .hero h2');
        await expect(heroTitle).toBeVisible();
      }
    });
  });

  test.describe('Blog Journey', () => {
    test('should navigate to blog and display posts', async ({ page }) => {
      // Look for blog links on homepage
      const blogLinks = page.locator('a[href*="/blog/"], a[href*="/posts/"]');
      const blogLinkCount = await blogLinks.count();
      
      if (blogLinkCount > 0) {
        // Click on first blog link
        const firstBlogLink = blogLinks.first();
        await firstBlogLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify we're on a blog page
        expect(page.url()).toContain('/blog/');
        
        // Check for blog content
        const blogTitle = page.locator('h1, [data-testid="blog-title"]');
        await expect(blogTitle).toBeVisible();
        
        // Check for blog content
        const blogContent = page.locator('main, [data-testid="blog-content"], .content');
        await expect(blogContent).toBeVisible();
      } else {
        // If no blog links on homepage, try to navigate directly to a blog post
        await page.goto('/blog/test-post');
        
        // Check if page exists (not 404)
        const title = await page.title();
        if (!title.includes('404') && !title.includes('Not Found')) {
          const blogTitle = page.locator('h1, [data-testid="blog-title"]');
          await expect(blogTitle).toBeVisible();
        }
      }
    });

    test('should display blog post content', async ({ page }) => {
      // Try to navigate to a blog post
      await page.goto('/blog/test-post');
      
      // Check if page exists
      const title = await page.title();
      if (!title.includes('404') && !title.includes('Not Found')) {
        // Check for blog post content
        const blogContent = page.locator('main, [data-testid="blog-content"], .content');
        await expect(blogContent).toBeVisible();
        
        // Check for blog post title
        const blogTitle = page.locator('h1, [data-testid="blog-title"]');
        await expect(blogTitle).toBeVisible();
      }
    });
  });

  test.describe('Contact Journey', () => {
    test('should navigate to contact page', async ({ page }) => {
      // Look for contact links
      const contactLinks = page.locator('a[href*="/contact"], a[href*="/get-in-touch"], a[href*="/book-a-call"]');
      const contactLinkCount = await contactLinks.count();
      
      if (contactLinkCount > 0) {
        // Click on first contact link
        const firstContactLink = contactLinks.first();
        await firstContactLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify we're on a contact page
        const url = page.url();
        expect(url).toMatch(/\/contact|\/get-in-touch|\/book-a-call/);
        
        // Check for contact content
        const contactContent = page.locator('main, [data-testid="contact-content"], .content');
        await expect(contactContent).toBeVisible();
      } else {
        // If no contact links, try to navigate directly
        await page.goto('/contact');
        
        // Check if page exists (not 404)
        const title = await page.title();
        if (!title.includes('404') && !title.includes('Not Found')) {
          const contactContent = page.locator('main, [data-testid="contact-content"], .content');
          await expect(contactContent).toBeVisible();
        }
      }
    });

    test('should have working contact form or CTA', async ({ page }) => {
      // Navigate to contact page
      await page.goto('/contact');
      
      // Check if page exists
      const title = await page.title();
      if (!title.includes('404') && !title.includes('Not Found')) {
        // Look for contact form or CTA button
        const contactForm = page.locator('form, [data-testid="contact-form"]');
        const ctaButton = page.locator('a[href*="mailto:"], a[href*="tel:"], button, [data-testid="cta-button"]');
        
        const formCount = await contactForm.count();
        const ctaCount = await ctaButton.count();
        
        // Should have either a form or CTA
        expect(formCount + ctaCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('SEO and Performance', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Check for essential meta tags
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      
      // Check for meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription.length).toBeGreaterThan(50);
      
      // Check for Open Graph tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      
      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
    });

    test('should have structured data (JSON-LD)', async ({ page }) => {
      await page.goto('/');
      
      // Check for JSON-LD structured data
      const jsonLdScripts = page.locator('script[type="application/ld+json"]');
      const scriptCount = await jsonLdScripts.count();
      
      expect(scriptCount).toBeGreaterThan(0);
      
      // Verify JSON-LD is valid
      for (let i = 0; i < scriptCount; i++) {
        const scriptContent = await jsonLdScripts.nth(i).textContent();
        expect(scriptContent).toBeTruthy();
        
        // Try to parse as JSON
        expect(() => JSON.parse(scriptContent)).not.toThrow();
      }
    });

    test('should load within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds (3000ms)
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have working sitemap', async ({ page }) => {
      // Check sitemap
      const response = await page.goto('/sitemap.xml');
      
      if (response && response.status() === 200) {
        const content = await response.text();
        expect(content).toContain('<?xml');
        expect(content).toContain('<urlset');
      }
    });

    test('should have working robots.txt', async ({ page }) => {
      // Check robots.txt
      const response = await page.goto('/robots.txt');
      
      if (response && response.status() === 200) {
        const content = await response.text();
        expect(content).toContain('User-agent');
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      // Check for h1 tag
      const h1Elements = page.locator('h1');
      const h1Count = await h1Elements.count();
      expect(h1Count).toBeGreaterThan(0);
      
      // Check that h1 comes before h2
      const firstH1 = h1Elements.first();
      const firstH2 = page.locator('h2').first();
      
      if (await firstH2.count() > 0) {
        const h1Position = await firstH1.evaluate(el => el.offsetTop);
        const h2Position = await firstH2.evaluate(el => el.offsetTop);
        
        expect(h1Position).toBeLessThanOrEqual(h2Position);
      }
    });

    test('should have proper alt text for images', async ({ page }) => {
      await page.goto('/');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Images should have alt text (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      // Check that focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Test that we can navigate with keyboard
      await page.keyboard.press('Tab');
      const newFocusedElement = page.locator(':focus');
      await expect(newFocusedElement).toBeVisible();
    });
  });
});

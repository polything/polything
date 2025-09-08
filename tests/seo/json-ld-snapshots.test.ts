/**
 * Snapshot tests for JSON-LD structured data output
 * Task 4.8: Snapshot tests for JSON-LD output
 */

import { 
  generateJsonLd, 
  generateAllJsonLd,
  pageJsonLd,
  articleJsonLd,
  creativeWorkJsonLd,
  breadcrumbsJsonLd,
  orgJsonLd,
  websiteJsonLd
} from '../../lib/seo/structured-data';

describe('JSON-LD Snapshot Tests', () => {
  const baseUrl = 'https://polything.co.uk';

  describe('Page JSON-LD', () => {
    test('should generate consistent WebPage JSON-LD', () => {
      const doc = {
        type: 'page',
        slug: 'about',
        title: 'About Polything',
        excerpt: 'Learn more about our company and mission.',
        date: '2024-01-15T10:00:00Z',
        updated: '2024-01-20T15:30:00Z',
        hero: {
          image: '/images/2024/01/about-hero.jpg'
        },
        seo: {
          title: 'About Us - Polything',
          description: 'Discover our story, mission, and the team behind Polything.',
          canonical: 'https://polything.co.uk/about',
          schema: {
            type: 'WebPage',
            image: '/images/2024/01/about-schema.jpg'
          }
        }
      };

      const result = pageJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('page-json-ld');
    });

    test('should generate minimal WebPage JSON-LD', () => {
      const doc = {
        type: 'page',
        slug: 'contact',
        title: 'Contact Us'
      };

      const result = pageJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('page-json-ld-minimal');
    });
  });

  describe('Article JSON-LD', () => {
    test('should generate consistent BlogPosting JSON-LD', () => {
      const doc = {
        type: 'post',
        slug: 'wordpress-to-nextjs-migration',
        title: 'WordPress to Next.js Migration Guide',
        excerpt: 'A comprehensive guide to migrating from WordPress to Next.js.',
        date: '2024-01-15T10:00:00Z',
        updated: '2024-01-20T15:30:00Z',
        hero: {
          image: '/images/2024/01/migration-hero.jpg'
        },
        seo: {
          title: 'WordPress to Next.js Migration - Complete Guide',
          description: 'Learn how to migrate your WordPress site to Next.js with our step-by-step guide.',
          canonical: 'https://polything.co.uk/blog/wordpress-to-nextjs-migration',
          schema: {
            type: 'BlogPosting',
            author: 'Polything Team',
            publishDate: '2024-01-15T10:00:00Z',
            modifiedDate: '2024-01-20T15:30:00Z'
          }
        }
      };

      const result = articleJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('article-json-ld');
    });

    test('should generate minimal BlogPosting JSON-LD', () => {
      const doc = {
        type: 'post',
        slug: 'simple-post',
        title: 'Simple Post',
        date: '2024-01-15T10:00:00Z'
      };

      const result = articleJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('article-json-ld-minimal');
    });
  });

  describe('CreativeWork JSON-LD', () => {
    test('should generate consistent CreativeWork JSON-LD for projects', () => {
      const doc = {
        type: 'project',
        slug: 'blackriver-case-study',
        title: 'Blackriver Security Case Study',
        excerpt: 'How we helped Blackriver Security achieve 297% sales growth.',
        date: '2024-01-15T10:00:00Z',
        updated: '2024-01-20T15:30:00Z',
        hero: {
          image: '/images/2024/01/blackriver-hero.jpg'
        },
        seo: {
          title: 'Blackriver Security - 297% Sales Growth Case Study',
          description: 'Discover how our digital strategy helped Blackriver Security achieve remarkable growth.',
          canonical: 'https://polything.co.uk/work/blackriver-case-study',
          schema: {
            type: 'CreativeWork',
            author: 'Polything Ltd',
            about: 'Digital transformation and growth strategy for security company'
          }
        }
      };

      const result = creativeWorkJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('creative-work-json-ld');
    });

    test('should generate minimal CreativeWork JSON-LD', () => {
      const doc = {
        type: 'project',
        slug: 'simple-project',
        title: 'Simple Project',
        date: '2024-01-15T10:00:00Z'
      };

      const result = creativeWorkJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('creative-work-json-ld-minimal');
    });
  });

  describe('Breadcrumbs JSON-LD', () => {
    test('should generate consistent BreadcrumbList JSON-LD', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://polything.co.uk' },
        { name: 'Work', url: 'https://polything.co.uk/work' },
        { name: 'Blackriver Case Study', url: 'https://polything.co.uk/work/blackriver-case-study' }
      ];

      const result = breadcrumbsJsonLd(breadcrumbs);
      expect(result).toMatchSnapshot('breadcrumbs-json-ld');
    });

    test('should generate minimal BreadcrumbList JSON-LD', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://polything.co.uk' },
        { name: 'About', url: 'https://polything.co.uk/about' }
      ];

      const result = breadcrumbsJsonLd(breadcrumbs);
      expect(result).toMatchSnapshot('breadcrumbs-json-ld-minimal');
    });
  });

  describe('Organization JSON-LD', () => {
    test('should generate consistent Organization JSON-LD', () => {
      const result = orgJsonLd(baseUrl, 'Polything Ltd');
      expect(result).toMatchSnapshot('organization-json-ld');
    });
  });

  describe('Website JSON-LD', () => {
    test('should generate consistent Website JSON-LD', () => {
      const result = websiteJsonLd(baseUrl, 'Polything');
      expect(result).toMatchSnapshot('website-json-ld');
    });
  });

  describe('Dynamic JSON-LD Generation', () => {
    test('should generate correct JSON-LD based on content type', () => {
      const projectDoc = {
        type: 'project',
        slug: 'test-project',
        title: 'Test Project',
        date: '2024-01-15T10:00:00Z'
      };

      const postDoc = {
        type: 'post',
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-15T10:00:00Z'
      };

      const pageDoc = {
        type: 'page',
        slug: 'test-page',
        title: 'Test Page'
      };

      const projectResult = generateJsonLd(baseUrl, projectDoc);
      const postResult = generateJsonLd(baseUrl, postDoc);
      const pageResult = generateJsonLd(baseUrl, pageDoc);

      expect(projectResult).toMatchSnapshot('dynamic-project-json-ld');
      expect(postResult).toMatchSnapshot('dynamic-post-json-ld');
      expect(pageResult).toMatchSnapshot('dynamic-page-json-ld');
    });

    test('should generate complete JSON-LD with breadcrumbs', () => {
      const doc = {
        type: 'project',
        slug: 'complex-project',
        title: 'Complex Project',
        date: '2024-01-15T10:00:00Z',
        seo: {
          schema: {
            breadcrumbs: [
              { name: 'Home', url: '/home' },
              { name: 'Work', url: '/work' },
              { name: 'Complex Project', url: '/work/complex-project' }
            ]
          }
        }
      };

      const result = generateAllJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('complete-json-ld-with-breadcrumbs');
    });

    test('should generate complete JSON-LD without breadcrumbs', () => {
      const doc = {
        type: 'post',
        slug: 'simple-post',
        title: 'Simple Post',
        date: '2024-01-15T10:00:00Z'
      };

      const result = generateAllJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('complete-json-ld-without-breadcrumbs');
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing optional fields gracefully', () => {
      const doc = {
        type: 'page',
        slug: 'minimal-page',
        title: 'Minimal Page'
      };

      const result = generateJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('minimal-page-json-ld');
    });

    test('should handle special characters in titles', () => {
      const doc = {
        type: 'post',
        slug: 'special-chars',
        title: 'Post with "Special" Characters & Symbols',
        date: '2024-01-15T10:00:00Z'
      };

      const result = generateJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('special-chars-json-ld');
    });

    test('should handle long descriptions', () => {
      const doc = {
        type: 'project',
        slug: 'long-description',
        title: 'Project with Long Description',
        excerpt: 'This is a very long description that goes on and on and contains multiple sentences to test how the JSON-LD generation handles lengthy content and ensures it is properly formatted and escaped in the structured data output.',
        date: '2024-01-15T10:00:00Z'
      };

      const result = generateJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('long-description-json-ld');
    });

    test('should handle missing dates', () => {
      const doc = {
        type: 'page',
        slug: 'no-dates',
        title: 'Page Without Dates'
      };

      const result = generateJsonLd(baseUrl, doc);
      expect(result).toMatchSnapshot('no-dates-json-ld');
    });
  });

  describe('Schema Type Validation', () => {
    test('should enforce correct schema types for different content types', () => {
      const projectDoc = {
        type: 'project',
        slug: 'schema-test-project',
        title: 'Schema Test Project',
        date: '2024-01-15T10:00:00Z'
      };

      const postDoc = {
        type: 'post',
        slug: 'schema-test-post',
        title: 'Schema Test Post',
        date: '2024-01-15T10:00:00Z'
      };

      const pageDoc = {
        type: 'page',
        slug: 'schema-test-page',
        title: 'Schema Test Page'
      };

      const projectResult = generateJsonLd(baseUrl, projectDoc);
      const postResult = generateJsonLd(baseUrl, postDoc);
      const pageResult = generateJsonLd(baseUrl, pageDoc);

      // Verify correct @type values
      expect(projectResult['@type']).toBe('CreativeWork');
      expect(postResult['@type']).toBe('BlogPosting');
      expect(pageResult['@type']).toBe('WebPage');

      expect(projectResult).toMatchSnapshot('schema-type-project');
      expect(postResult).toMatchSnapshot('schema-type-post');
      expect(pageResult).toMatchSnapshot('schema-type-page');
    });
  });
});

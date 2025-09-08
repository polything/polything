/**
 * Tests for the enhanced front-matter writer
 */

import {
  generateMDXFrontMatter,
  generateMDXContent,
  validateFrontMatter,
  applySEODefaults,
  FrontMatterWriterOptions
} from './front-matter-writer';

describe('Front Matter Writer', () => {
  describe('generateMDXFrontMatter', () => {
    test('should generate basic front-matter', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        date: '2024-01-01',
        categories: ['tech'],
        tags: ['javascript', 'typescript']
      };
      
      const result = generateMDXFrontMatter(frontMatter);
      
      expect(result).toContain('title: "Test Title"');
      expect(result).toContain('slug: "test-slug"');
      expect(result).toContain('type: "post"');
      expect(result).toContain('date: "2024-01-01"');
      expect(result).toContain('categories: ["tech"]');
      expect(result).toContain('tags: ["javascript", "typescript"]');
      expect(result).toMatch(/^---\s*\n[\s\S]*\n---$/);
    });

    test('should generate hero section', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        hero: {
          title: 'Hero Title',
          subtitle: 'Hero Subtitle',
          image: '/images/hero.jpg',
          cta: {
            text: 'Learn More',
            url: '/learn-more'
          }
        }
      };
      
      const result = generateMDXFrontMatter(frontMatter);
      
      expect(result).toContain('hero:');
      expect(result).toContain('  title: "Hero Title"');
      expect(result).toContain('  subtitle: "Hero Subtitle"');
      expect(result).toContain('  image: "/images/hero.jpg"');
      expect(result).toContain('  cta:');
      expect(result).toContain('    text: "Learn More"');
      expect(result).toContain('    url: "/learn-more"');
    });

    test('should generate links section for projects', () => {
      const frontMatter = {
        title: 'Test Project',
        slug: 'test-project',
        type: 'project',
        links: {
          website: 'https://example.com',
          github: 'https://github.com/example',
          demo: 'https://demo.example.com'
        }
      };
      
      const result = generateMDXFrontMatter(frontMatter);
      
      expect(result).toContain('links:');
      expect(result).toContain('  website: "https://example.com"');
      expect(result).toContain('  github: "https://github.com/example"');
      expect(result).toContain('  demo: "https://demo.example.com"');
    });

    test('should generate enhanced SEO section', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        seo: {
          title: 'SEO Title',
          description: 'SEO Description',
          canonical: 'https://example.com/test-slug',
          schemaType: 'BlogPosting',
          image: {
            url: '/images/seo-image.jpg',
            alt: 'SEO Image Alt Text',
            width: 1200,
            height: 630
          },
          author: {
            name: 'John Doe',
            url: 'https://example.com/author/john-doe'
          },
          dates: {
            published: '2024-01-01T00:00:00Z',
            modified: '2024-01-02T00:00:00Z'
          },
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: 'Test Title', url: '/test-slug' }
          ]
        }
      };
      
      const result = generateMDXFrontMatter(frontMatter);
      
      expect(result).toContain('seo:');
      expect(result).toContain('  title: "SEO Title"');
      expect(result).toContain('  description: "SEO Description"');
      expect(result).toContain('  canonical: "https://example.com/test-slug"');
      expect(result).toContain('  schemaType: "BlogPosting"');
      expect(result).toContain('  image:');
      expect(result).toContain('    url: "/images/seo-image.jpg"');
      expect(result).toContain('    alt: "SEO Image Alt Text"');
      expect(result).toContain('    width: 1200');
      expect(result).toContain('    height: 630');
      expect(result).toContain('  author:');
      expect(result).toContain('    name: "John Doe"');
      expect(result).toContain('    url: "https://example.com/author/john-doe"');
      expect(result).toContain('  dates:');
      expect(result).toContain('    published: "2024-01-01T00:00:00Z"');
      expect(result).toContain('    modified: "2024-01-02T00:00:00Z"');
      expect(result).toContain('  breadcrumbs:');
      expect(result).toContain('    -');
      expect(result).toContain('      name: "Home"');
      expect(result).toContain('      url: "/"');
    });

    test('should include theme_meta when requested', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        theme_meta: {
          themerain_seo_title: 'WP SEO Title',
          themerain_hero_title: 'WP Hero Title',
          themerain_custom_field: 'Custom Value'
        }
      };
      
      const options: FrontMatterWriterOptions = { includeThemeMeta: true };
      const result = generateMDXFrontMatter(frontMatter, options);
      
      expect(result).toContain('theme_meta:');
      expect(result).toContain('  themerain_seo_title: "WP SEO Title"');
      expect(result).toContain('  themerain_hero_title: "WP Hero Title"');
      expect(result).toContain('  themerain_custom_field: "Custom Value"');
    });

    test('should handle special characters in strings', () => {
      const frontMatter = {
        title: 'Test "Title" with \'quotes\'',
        slug: 'test-slug',
        type: 'post',
        description: 'Description with\nnewlines and: colons'
      };
      
      const result = generateMDXFrontMatter(frontMatter);
      
      expect(result).toContain('title: "Test \\"Title\\" with \'quotes\'"');
      expect(result).toContain('description: "Description with\nnewlines and: colons"');
    });

    test('should handle arrays and objects', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        categories: ['tech', 'javascript'],
        tags: ['frontend', 'react'],
        featured: true,
        customArray: [1, 2, 3],
        customObject: { key: 'value', nested: { deep: 'value' } }
      };
      
      const result = generateMDXFrontMatter(frontMatter);
      
      expect(result).toContain('categories: ["tech", "javascript"]');
      expect(result).toContain('tags: ["frontend", "react"]');
      expect(result).toContain('featured: true');
      expect(result).toContain('customArray: [1, 2, 3]');
      expect(result).toContain('customObject: {"key":"value","nested":{"deep":"value"}}');
    });
  });

  describe('generateMDXContent', () => {
    test('should generate complete MDX content', () => {
      const content = {
        frontMatter: {
          title: 'Test Title',
          slug: 'test-slug',
          type: 'post'
        },
        content: '# Test Content\n\nThis is test content.'
      };
      
      const result = generateMDXContent(content);
      
      expect(result).toContain('---');
      expect(result).toContain('title: "Test Title"');
      expect(result).toContain('slug: "test-slug"');
      expect(result).toContain('type: "post"');
      expect(result).toContain('---');
      expect(result).toContain('# Test Content');
      expect(result).toContain('This is test content.');
    });

    test('should handle content without frontMatter property', () => {
      const content = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        body: '# Test Content\n\nThis is test content.'
      };
      
      const result = generateMDXContent(content);
      
      expect(result).toContain('---');
      expect(result).toContain('title: "Test Title"');
      expect(result).toContain('---');
      expect(result).toContain('# Test Content');
    });
  });

  describe('validateFrontMatter', () => {
    test('should validate correct front-matter', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        date: '2024-01-01'
      };
      
      const result = validateFrontMatter(frontMatter);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect missing required fields', () => {
      const frontMatter = {
        slug: 'test-slug'
      };
      
      const result = validateFrontMatter(frontMatter);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
      expect(result.errors).toContain('Type is required');
    });

    test('should validate slug format', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'Test_Slug_With_Invalid_Chars!',
        type: 'post'
      };
      
      const result = validateFrontMatter(frontMatter);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Slug must contain only lowercase letters, numbers, and hyphens');
    });

    test('should validate type', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'invalid-type'
      };
      
      const result = validateFrontMatter(frontMatter);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Type must be one of: post, page, project');
    });

    test('should warn about SEO field lengths', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        seo: {
          title: 'This is a very long SEO title that exceeds the recommended 60 character limit for optimal search engine optimization',
          description: 'This is a very long SEO description that exceeds the recommended 160 character limit for optimal search engine optimization and should be shortened to improve readability and search engine performance'
        }
      };
      
      const result = validateFrontMatter(frontMatter);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('SEO title is longer than recommended 60 characters');
      expect(result.warnings).toContain('SEO description is longer than recommended 160 characters');
    });

    test('should warn about short SEO description', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        seo: {
          description: 'Short description'
        }
      };
      
      const result = validateFrontMatter(frontMatter);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('SEO description is shorter than recommended 120 characters');
    });
  });

  describe('applySEODefaults', () => {
    test('should apply SEO defaults to missing fields', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        seo: {
          title: 'Existing SEO Title'
        }
      };
      
      const defaults = {
        title: 'Default SEO Title',
        description: 'Default SEO Description',
        canonical: 'https://example.com/test-slug',
        schemaType: 'BlogPosting'
      };
      
      const result = applySEODefaults(frontMatter, defaults);
      
      expect(result.seo.title).toBe('Existing SEO Title'); // Should not override existing
      expect(result.seo.description).toBe('Default SEO Description');
      expect(result.seo.canonical).toBe('https://example.com/test-slug');
      expect(result.seo.schemaType).toBe('BlogPosting');
    });

    test('should create SEO section if it does not exist', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post'
      };
      
      const defaults = {
        title: 'Default SEO Title',
        description: 'Default SEO Description'
      };
      
      const result = applySEODefaults(frontMatter, defaults);
      
      expect(result.seo).toBeDefined();
      expect(result.seo.title).toBe('Default SEO Title');
      expect(result.seo.description).toBe('Default SEO Description');
    });

    test('should not override existing non-empty values', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        seo: {
          title: 'Existing Title',
          description: '',
          canonical: null
        }
      };
      
      const defaults = {
        title: 'Default Title',
        description: 'Default Description',
        canonical: 'https://example.com/default'
      };
      
      const result = applySEODefaults(frontMatter, defaults);
      
      expect(result.seo.title).toBe('Existing Title'); // Should not override
      expect(result.seo.description).toBe('Default Description'); // Should override empty string
      expect(result.seo.canonical).toBe('https://example.com/default'); // Should override null
    });

    test('should handle empty defaults', () => {
      const frontMatter = {
        title: 'Test Title',
        slug: 'test-slug',
        type: 'post',
        seo: {
          title: 'Existing Title'
        }
      };
      
      const result = applySEODefaults(frontMatter, {});
      
      expect(result).toEqual(frontMatter);
    });
  });
});

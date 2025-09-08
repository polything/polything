/**
 * @jest-environment node
 */

import { 
  validateContentSchema, 
  getDefaultSchemaType, 
  applySchemaDefaults,
  ValidationResult 
} from './schema-validator';
import { ProjectContent, PostContent, PageContent } from './schema';

describe('Schema Validator', () => {
  const validProjectContent: ProjectContent = {
    title: 'Test Project',
    slug: 'test-project',
    type: 'project',
    date: '2024-01-01T00:00:00.000Z',
    updated: '2024-01-01T00:00:00.000Z',
    categories: [1, 2],
    tags: [3, 4],
    hero: {
      title: 'Project Hero Title',
      subtitle: 'Project Hero Subtitle',
      image: '/images/2024/01/hero.jpg',
      video: '/images/2024/01/hero.mp4',
      text_color: '#ffffff',
      background_color: '#000000'
    },
    links: {
      url: 'https://example.com/project',
      image: '/images/2024/01/link.jpg',
      video: '/images/2024/01/link.mp4'
    },
    seo: {
      title: 'SEO Title',
      description: 'This is a valid SEO description that is long enough to meet the minimum requirements for search engines.',
      canonical: 'https://polything.co.uk/work/test-project',
      schema: {
        type: 'CreativeWork',
        image: '/images/2024/01/hero.jpg',
        author: 'Polything Ltd',
        publishDate: '2024-01-01T00:00:00.000Z',
        modifiedDate: '2024-01-01T00:00:00.000Z'
      }
    }
  };

  const validPostContent: PostContent = {
    title: 'Test Post',
    slug: 'test-post',
    type: 'post',
    date: '2024-01-01T00:00:00.000Z',
    updated: '2024-01-01T00:00:00.000Z',
    categories: [1],
    tags: [2],
    featured: true,
    hero: {
      title: 'Post Hero Title',
      subtitle: 'Post Hero Subtitle',
      image: '/images/2024/01/hero.jpg',
      video: '/images/2024/01/hero.mp4',
      text_color: '#ffffff',
      background_color: '#000000'
    },
    seo: {
      title: 'SEO Title',
      description: 'This is a valid SEO description that is long enough to meet the minimum requirements for search engines.',
      canonical: 'https://polything.co.uk/blog/test-post',
      schema: {
        type: 'BlogPosting'
      }
    }
  };

  const validPageContent: PageContent = {
    title: 'Test Page',
    slug: 'test-page',
    type: 'page',
    date: '2024-01-01T00:00:00.000Z',
    updated: '2024-01-01T00:00:00.000Z',
    categories: [],
    tags: [],
    hero: {
      title: 'Page Hero Title',
      subtitle: 'Page Hero Subtitle',
      image: '/images/2024/01/hero.jpg',
      video: '/images/2024/01/hero.mp4',
      text_color: '#ffffff',
      background_color: '#000000'
    },
    seo: {
      title: 'SEO Title',
      description: 'This is a valid SEO description that is long enough to meet the minimum requirements for search engines.',
      canonical: 'https://polything.co.uk/test-page',
      schema: {
        type: 'WebPage'
      }
    }
  };

  describe('validateContentSchema', () => {
    test('should validate valid project content', () => {
      const result = validateContentSchema(validProjectContent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate valid post content', () => {
      const result = validateContentSchema(validPostContent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate valid page content', () => {
      const result = validateContentSchema(validPageContent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should catch missing required fields', () => {
      const invalidContent = { ...validProjectContent };
      delete (invalidContent as any).title;
      delete (invalidContent as any).slug;
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing or empty required field: title');
      expect(result.errors).toContain('Missing or empty required field: slug');
    });

    test('should catch invalid slug format', () => {
      const invalidContent = { ...validProjectContent, slug: 'Invalid_Slug!' };
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid slug format: Invalid_Slug!. Must contain only lowercase letters, numbers, and hyphens.');
    });

    test('should catch invalid date format', () => {
      const invalidContent = { ...validProjectContent, date: 'invalid-date' };
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date format: invalid-date. Must be ISO 8601 format.');
    });

    test('should catch missing hero section', () => {
      const invalidContent = { ...validProjectContent };
      delete (invalidContent as any).hero;
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing hero section');
    });

    test('should catch missing links section for project', () => {
      const invalidContent = { ...validProjectContent };
      delete (invalidContent as any).links;
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing links section for project content');
    });

    test('should catch invalid featured field for post', () => {
      const invalidContent = { ...validPostContent, featured: 'not-boolean' as any };
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Featured field must be a boolean for post content');
    });

    test('should warn about invalid color formats', () => {
      const invalidContent = { ...validProjectContent };
      invalidContent.hero.text_color = 'invalid-color';
      invalidContent.hero.background_color = 'rgb(255,255,255)';
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(true); // Still valid, just warnings
      expect(result.warnings).toContain('Invalid text_color format: invalid-color. Expected hex color.');
      expect(result.warnings).toContain('Invalid background_color format: rgb(255,255,255). Expected hex color.');
    });

    test('should warn about SEO title length', () => {
      const invalidContent = { ...validProjectContent };
      invalidContent.seo.title = 'This is a very long SEO title that exceeds the recommended 60 character limit for search engine optimization';
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(true); // Still valid, just warnings
      expect(result.warnings.some(w => w.includes('SEO title too long'))).toBe(true);
    });

    test('should warn about SEO description length', () => {
      const invalidContent = { ...validProjectContent };
      invalidContent.seo.description = 'Too short';
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(true); // Still valid, just warnings
      expect(result.warnings.some(w => w.includes('SEO description too short'))).toBe(true);
    });

    test('should warn about invalid image paths', () => {
      const invalidContent = { ...validProjectContent };
      invalidContent.hero.image = 'invalid-path.jpg';
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(true); // Still valid, just warnings
      expect(result.warnings).toContain('Invalid image path format: invalid-path.jpg. Expected /images/* path.');
    });

    test('should warn about invalid URLs', () => {
      const invalidContent = { ...validProjectContent };
      invalidContent.links.url = 'not-a-url';
      invalidContent.seo.canonical = 'also-not-a-url';
      
      const result = validateContentSchema(invalidContent);
      
      expect(result.valid).toBe(true); // Still valid, just warnings
      expect(result.warnings).toContain('Invalid URL format: not-a-url');
      expect(result.warnings).toContain('Invalid canonical URL format: also-not-a-url');
    });
  });

  describe('getDefaultSchemaType', () => {
    test('should return CreativeWork for project', () => {
      expect(getDefaultSchemaType('project')).toBe('CreativeWork');
    });

    test('should return BlogPosting for post', () => {
      expect(getDefaultSchemaType('post')).toBe('BlogPosting');
    });

    test('should return WebPage for page', () => {
      expect(getDefaultSchemaType('page')).toBe('WebPage');
    });

    test('should return WebPage for unknown type', () => {
      expect(getDefaultSchemaType('unknown')).toBe('WebPage');
    });
  });

  describe('applySchemaDefaults', () => {
    test('should apply default schema type when missing', () => {
      const content = { ...validProjectContent };
      delete (content as any).seo;
      
      const result = applySchemaDefaults(content);
      
      expect(result.seo.schema.type).toBe('CreativeWork');
    });

    test('should apply default schema type when schema exists but type is missing', () => {
      const content = { ...validProjectContent };
      content.seo.schema = {};
      
      const result = applySchemaDefaults(content);
      
      expect(result.seo.schema.type).toBe('CreativeWork');
    });

    test('should not override existing schema type', () => {
      const content = { ...validProjectContent };
      content.seo.schema.type = 'Article';
      
      const result = applySchemaDefaults(content);
      
      expect(result.seo.schema.type).toBe('Article');
    });

    test('should apply correct defaults for different content types', () => {
      const projectContent = { ...validProjectContent };
      delete (projectContent as any).seo;
      
      const postContent = { ...validPostContent };
      delete (postContent as any).seo;
      
      const pageContent = { ...validPageContent };
      delete (pageContent as any).seo;
      
      const projectResult = applySchemaDefaults(projectContent);
      const postResult = applySchemaDefaults(postContent);
      const pageResult = applySchemaDefaults(pageContent);
      
      expect(projectResult.seo.schema.type).toBe('CreativeWork');
      expect(postResult.seo.schema.type).toBe('BlogPosting');
      expect(pageResult.seo.schema.type).toBe('WebPage');
    });
  });
});

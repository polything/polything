/**
 * Tests for the schema defaults enforcer
 */

import {
  enforceSchemaDefaults,
  getDefaultSchemaType,
  validateSchemaTypeConsistency,
  enforceSchemaDefaultsBatch,
  SchemaDefaultsOptions
} from './schema-defaults-enforcer';
import { ProjectContent, PostContent, PageContent } from './schema';

describe('Schema Defaults Enforcer', () => {
  const baseProjectContent: ProjectContent = {
    title: 'Test Project',
    slug: 'test-project',
    type: 'project',
    date: '2024-01-01T00:00:00Z',
    updated: '2024-01-02T00:00:00Z',
    categories: [1],
    tags: [1, 2],
    featured: true,
    hero: {
      title: 'Project Hero Title'
    },
    links: {
      url: 'https://example.com'
    },
    content: 'This is a test project content.'
  };

  const basePostContent: PostContent = {
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    type: 'post',
    date: '2024-01-01T00:00:00Z',
    updated: '2024-01-02T00:00:00Z',
    categories: [1],
    tags: [1, 2],
    featured: false,
    hero: {
      title: 'Blog Post Hero Title'
    },
    content: 'This is a test blog post content.'
  };

  const basePageContent: PageContent = {
    title: 'Test Page',
    slug: 'test-page',
    type: 'page',
    date: '2024-01-01T00:00:00Z',
    updated: '2024-01-02T00:00:00Z',
    categories: [1],
    tags: [1, 2],
    featured: false,
    hero: {
      title: 'Page Hero Title'
    },
    content: 'This is a test page content.'
  };

  describe('enforceSchemaDefaults', () => {
    test('should apply project schema defaults', () => {
      const content = { ...baseProjectContent };
      const result = enforceSchemaDefaults(content);
      
      expect(result.seo).toBeDefined();
      expect(result.seo?.schema).toBeDefined();
      expect(result.seo?.schema?.type).toBe('CreativeWork');
      expect(result.seo?.schema?.publishDate).toBe('2024-01-01T00:00:00Z');
      expect(result.seo?.schema?.modifiedDate).toBe('2024-01-02T00:00:00Z');
      expect(result.seo?.schema?.author).toBe('Polything Team');
      expect(result.seo?.schema?.breadcrumbs).toEqual([
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/projects' },
        { name: 'Test Project', url: '/projects/test-project' }
      ]);
    });

    test('should apply post schema defaults', () => {
      const content = { ...basePostContent };
      const result = enforceSchemaDefaults(content);
      
      expect(result.seo).toBeDefined();
      expect(result.seo?.schema).toBeDefined();
      expect(result.seo?.schema?.type).toBe('BlogPosting');
      expect(result.seo?.schema?.publishDate).toBe('2024-01-01T00:00:00Z');
      expect(result.seo?.schema?.modifiedDate).toBe('2024-01-02T00:00:00Z');
      expect(result.seo?.schema?.author).toBe('Polything Team');
      expect(result.seo?.schema?.breadcrumbs).toEqual([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Test Blog Post', url: '/blog/test-blog-post' }
      ]);
    });

    test('should apply page schema defaults', () => {
      const content = { ...basePageContent };
      const result = enforceSchemaDefaults(content);
      
      expect(result.seo).toBeDefined();
      expect(result.seo?.schema).toBeDefined();
      expect(result.seo?.schema?.type).toBe('WebPage');
      expect(result.seo?.schema?.publishDate).toBe('2024-01-01T00:00:00Z');
      expect(result.seo?.schema?.modifiedDate).toBe('2024-01-02T00:00:00Z');
      expect(result.seo?.schema?.author).toBeUndefined(); // Pages don't have authors
      expect(result.seo?.schema?.breadcrumbs).toEqual([
        { name: 'Home', url: '/' },
        { name: 'Test Page', url: '/test-page' }
      ]);
    });

    test('should preserve existing SEO data', () => {
      const content = {
        ...baseProjectContent,
        seo: {
          title: 'Custom SEO Title',
          description: 'Custom SEO Description',
          schema: {
            type: 'Article' as const,
            author: 'Custom Author',
            image: '/custom-image.jpg'
          }
        }
      };
      
      const result = enforceSchemaDefaults(content);
      
      expect(result.seo?.title).toBe('Custom SEO Title');
      expect(result.seo?.description).toBe('Custom SEO Description');
      expect(result.seo?.schema?.type).toBe('Article'); // Should preserve existing
      expect(result.seo?.schema?.author).toBe('Custom Author'); // Should preserve existing
      expect(result.seo?.schema?.image).toBe('/custom-image.jpg'); // Should preserve existing
      expect(result.seo?.schema?.publishDate).toBe('2024-01-01T00:00:00Z'); // Should add missing
    });

    test('should not override existing schema fields', () => {
      const content = {
        ...baseProjectContent,
        seo: {
          schema: {
            type: 'BlogPosting' as const,
            publishDate: '2023-12-01T00:00:00Z',
            modifiedDate: '2023-12-02T00:00:00Z',
            author: 'Existing Author'
          }
        }
      };
      
      const result = enforceSchemaDefaults(content);
      
      expect(result.seo?.schema?.type).toBe('BlogPosting'); // Should preserve existing
      expect(result.seo?.schema?.publishDate).toBe('2023-12-01T00:00:00Z'); // Should preserve existing
      expect(result.seo?.schema?.modifiedDate).toBe('2023-12-02T00:00:00Z'); // Should preserve existing
      expect(result.seo?.schema?.author).toBe('Existing Author'); // Should preserve existing
    });

    test('should handle content without SEO section', () => {
      const content = { ...baseProjectContent };
      delete (content as any).seo;
      
      const result = enforceSchemaDefaults(content);
      
      expect(result.seo).toBeDefined();
      expect(result.seo?.schema).toBeDefined();
      expect(result.seo?.schema?.type).toBe('CreativeWork');
    });

    test('should respect enforcement options', () => {
      const content = { ...baseProjectContent };
      const options: SchemaDefaultsOptions = {
        enforceSchemaTypes: false,
        enforceRequiredFields: false,
        applyContentTypeDefaults: false
      };
      
      const result = enforceSchemaDefaults(content, options);
      
      // Should not apply any defaults when options are disabled
      expect(result.seo).toBeUndefined();
    });
  });

  describe('getDefaultSchemaType', () => {
    test('should return correct schema types for content types', () => {
      expect(getDefaultSchemaType('post')).toBe('BlogPosting');
      expect(getDefaultSchemaType('page')).toBe('WebPage');
      expect(getDefaultSchemaType('project')).toBe('CreativeWork');
    });
  });

  describe('validateSchemaTypeConsistency', () => {
    test('should validate correct schema types', () => {
      const content = {
        ...baseProjectContent,
        seo: {
          schema: {
            type: 'CreativeWork'
          }
        }
      };
      
      const result = validateSchemaTypeConsistency(content);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    test('should warn about mismatched schema types', () => {
      const content = {
        ...baseProjectContent,
        seo: {
          schema: {
            type: 'BlogPosting' // Wrong type for project
          }
        }
      };
      
      const result = validateSchemaTypeConsistency(content);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain("Schema type 'BlogPosting' for project doesn't match expected 'CreativeWork'");
    });

    test('should warn about missing schema type', () => {
      const content = { ...baseProjectContent };
      
      const result = validateSchemaTypeConsistency(content);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('No schema type specified for project, will use default: CreativeWork');
    });

    test('should validate different content types', () => {
      const postContent = {
        ...basePostContent,
        seo: {
          schema: {
            type: 'BlogPosting'
          }
        }
      };
      
      const pageContent = {
        ...basePageContent,
        seo: {
          schema: {
            type: 'WebPage'
          }
        }
      };
      
      const postResult = validateSchemaTypeConsistency(postContent);
      const pageResult = validateSchemaTypeConsistency(pageContent);
      
      expect(postResult.valid).toBe(true);
      expect(postResult.warnings).toHaveLength(0);
      
      expect(pageResult.valid).toBe(true);
      expect(pageResult.warnings).toHaveLength(0);
    });
  });

  describe('enforceSchemaDefaultsBatch', () => {
    test('should process multiple content items', () => {
      const contents = [baseProjectContent, basePostContent, basePageContent];
      const result = enforceSchemaDefaultsBatch(contents);
      
      expect(result.processed).toHaveLength(3);
      expect(result.summary.total).toBe(3);
      expect(result.summary.processed).toBe(3);
      expect(result.summary.errors).toBe(0);
      
      // Check that each content type got the correct schema type
      expect(result.processed[0].seo?.schema?.type).toBe('CreativeWork'); // Project
      expect(result.processed[1].seo?.schema?.type).toBe('BlogPosting'); // Post
      expect(result.processed[2].seo?.schema?.type).toBe('WebPage'); // Page
    });

    test('should handle mixed valid and invalid content', () => {
      const validContent = { ...baseProjectContent };
      const invalidContent = { ...baseProjectContent, slug: '' }; // Invalid slug
      
      const contents = [validContent, invalidContent];
      const result = enforceSchemaDefaultsBatch(contents);
      
      expect(result.summary.total).toBe(2);
      expect(result.summary.processed).toBeGreaterThan(0);
      expect(result.summary.errors).toBeGreaterThanOrEqual(0);
    });

    test('should respect options for batch processing', () => {
      const contents = [baseProjectContent, basePostContent];
      const options: SchemaDefaultsOptions = {
        enforceSchemaTypes: false
      };
      
      const result = enforceSchemaDefaultsBatch(contents, options);
      
      expect(result.processed).toHaveLength(2);
      // Should still process but with limited enforcement
      expect(result.summary.processed).toBe(2);
    });
  });

  describe('breadcrumb generation', () => {
    test('should generate correct breadcrumbs for projects', () => {
      const content = { ...baseProjectContent };
      const result = enforceSchemaDefaults(content);
      
      const breadcrumbs = result.seo?.schema?.breadcrumbs;
      expect(breadcrumbs).toEqual([
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/projects' },
        { name: 'Test Project', url: '/projects/test-project' }
      ]);
    });

    test('should generate correct breadcrumbs for posts', () => {
      const content = { ...basePostContent };
      const result = enforceSchemaDefaults(content);
      
      const breadcrumbs = result.seo?.schema?.breadcrumbs;
      expect(breadcrumbs).toEqual([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Test Blog Post', url: '/blog/test-blog-post' }
      ]);
    });

    test('should generate correct breadcrumbs for pages', () => {
      const content = { ...basePageContent };
      const result = enforceSchemaDefaults(content);
      
      const breadcrumbs = result.seo?.schema?.breadcrumbs;
      expect(breadcrumbs).toEqual([
        { name: 'Home', url: '/' },
        { name: 'Test Page', url: '/test-page' }
      ]);
    });

    test('should preserve existing breadcrumbs', () => {
      const content = {
        ...baseProjectContent,
        seo: {
          schema: {
            breadcrumbs: [
              { name: 'Custom Home', url: '/custom' },
              { name: 'Custom Project', url: '/custom/project' }
            ]
          }
        }
      };
      
      const result = enforceSchemaDefaults(content);
      
      const breadcrumbs = result.seo?.schema?.breadcrumbs;
      expect(breadcrumbs).toEqual([
        { name: 'Custom Home', url: '/custom' },
        { name: 'Custom Project', url: '/custom/project' }
      ]);
    });
  });
});

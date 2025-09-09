/**
 * Tests for the comprehensive content validator
 */

import {
  validateContent,
  validateContentBatch,
  applySEOFallbacks,
  ContentValidationOptions
} from './content-validator';
import { ProjectContent, PostContent, PageContent } from './schema';

describe('Content Validator', () => {
  const validProjectContent: ProjectContent = {
    title: 'Test Project',
    slug: 'test-project',
    type: 'project',
    date: '2024-01-01T00:00:00Z',
    updated: '2024-01-02T00:00:00Z',
    categories: ['tech'],
    tags: ['javascript', 'react'],
    featured: true,
    hero: {
      title: 'Project Hero Title',
      subtitle: 'Project Hero Subtitle',
      image: '/images/hero.jpg',
      cta: {
        text: 'View Project',
        url: '/projects/test-project'
      }
    },
    links: {
      website: 'https://example.com',
      github: 'https://github.com/example/project',
      demo: 'https://demo.example.com'
    },
    content: 'This is a comprehensive project description with detailed information about the project goals, implementation, and results. It contains enough content to provide a good overview of the project and its significance in the development community.',
    seo: {
      title: 'Test Project - SEO Title',
      description: 'This is a comprehensive SEO description for the test project that provides detailed information about the project goals and implementation.',
      canonical: 'https://polything.co.uk/projects/test-project',
      schemaType: 'CreativeWork',
      image: {
        url: '/images/seo-image.jpg',
        alt: 'Test Project Screenshot',
        width: 1200,
        height: 630
      },
      author: {
        name: 'John Doe',
        url: 'https://polything.co.uk/author/john-doe'
      },
      dates: {
        published: '2024-01-01T00:00:00Z',
        modified: '2024-01-02T00:00:00Z'
      },
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/projects' },
        { name: 'Test Project', url: '/projects/test-project' }
      ]
    }
  };

  const validPostContent: PostContent = {
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    type: 'post',
    date: '2024-01-01T00:00:00Z',
    updated: '2024-01-02T00:00:00Z',
    categories: ['tech'],
    tags: ['javascript', 'typescript'],
    featured: false,
    hero: {
      title: 'Blog Post Hero Title',
      subtitle: 'Blog Post Hero Subtitle',
      image: '/images/blog-hero.jpg',
      cta: {
        text: 'Read More',
        url: '/blog/test-blog-post'
      }
    },
    content: 'This is a comprehensive blog post about modern web development practices. It covers various topics including JavaScript frameworks, TypeScript implementation, and best practices for building scalable applications. The content is detailed and provides valuable insights for developers.',
    seo: {
      title: 'Test Blog Post - SEO Title',
      description: 'This is a comprehensive SEO description for the blog post that provides detailed information about modern web development practices and best practices.',
      canonical: 'https://polything.co.uk/blog/test-blog-post',
      schemaType: 'BlogPosting',
      image: {
        url: '/images/blog-seo.jpg',
        alt: 'Blog Post Featured Image',
        width: 1200,
        height: 630
      },
      author: {
        name: 'Jane Smith',
        url: 'https://polything.co.uk/author/jane-smith'
      },
      dates: {
        published: '2024-01-01T00:00:00Z',
        modified: '2024-01-02T00:00:00Z'
      },
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Test Blog Post', url: '/blog/test-blog-post' }
      ]
    }
  };

  describe('validateContent', () => {
    test('should validate valid content', () => {
      const result = validateContent(validProjectContent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.seoFallbacks.title).toBe('Test Project - SEO Title');
      expect(result.seoFallbacks.description).toBe('This is a comprehensive SEO description for the test project that provides detailed information about the project goals and implementation.');
      expect(result.seoFallbacks.canonical).toBe('https://polything.co.uk/projects/test-project');
    });

    test('should generate SEO fallbacks when missing', () => {
      const contentWithoutSEO = { ...validProjectContent };
      delete (contentWithoutSEO as any).seo;
      
      const result = validateContent(contentWithoutSEO);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('SEO title is missing, using content title as fallback');
      expect(result.warnings).toContain('SEO description is missing, extracted from content');
      expect(result.warnings).toContain('SEO canonical URL is missing, using generated fallback');
      expect(result.seoFallbacks.title).toBe('Test Project');
      expect(result.seoFallbacks.canonical).toBe('https://polything.co.uk/projects/test-project');
    });

    test('should extract description from content when SEO description is missing', () => {
      const contentWithEmptySEO = {
        ...validProjectContent,
        seo: {
          ...validProjectContent.seo,
          description: ''
        }
      };
      
      const result = validateContent(contentWithEmptySEO);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('SEO description is missing, extracted from content');
      expect(result.seoFallbacks.description).toContain('This is a comprehensive project description');
    });

    test('should warn about field length issues', () => {
      const contentWithLongTitle = {
        ...validProjectContent,
        title: 'This is a very long title that exceeds the recommended 60 character limit for optimal SEO performance and user experience'
      };
      
      const result = validateContent(contentWithLongTitle);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Title (121 chars) is longer than recommended 60 characters');
    });

    test('should warn about SEO field length issues', () => {
      const contentWithLongSEOTitle = {
        ...validProjectContent,
        seo: {
          ...validProjectContent.seo,
          title: 'This is a very long SEO title that exceeds the recommended 60 character limit for optimal search engine optimization performance'
        }
      };
      
      const result = validateContent(contentWithLongSEOTitle);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('SEO title (128 chars) exceeds recommended 60 characters');
    });

    test('should warn about short SEO description', () => {
      const contentWithShortDescription = {
        ...validProjectContent,
        seo: {
          ...validProjectContent.seo,
          description: 'Short description'
        }
      };
      
      const result = validateContent(contentWithShortDescription);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('SEO description (17 chars) is shorter than recommended 120 characters');
    });

    test('should warn about short content', () => {
      const contentWithShortContent = {
        ...validProjectContent,
        content: 'Short content with only a few words.'
      };
      
      const result = validateContent(contentWithShortContent);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Content is short (7 words), consider adding more detail');
    });

    test('should warn about very long content', () => {
      const longContent = 'word '.repeat(3500); // 3500 words
      const contentWithLongContent = {
        ...validProjectContent,
        content: longContent
      };
      
      const result = validateContent(contentWithLongContent);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Content is very long (3501 words), consider breaking into multiple posts');
    });

    test('should validate hero section field lengths', () => {
      const contentWithLongHeroTitle = {
        ...validProjectContent,
        hero: {
          ...validProjectContent.hero,
          title: 'This is a very long hero title that exceeds the recommended 80 character limit for optimal user experience and visual design'
        }
      };
      
      const result = validateContent(contentWithLongHeroTitle);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Hero title (124 chars) is longer than recommended 80 characters');
    });

    test('should validate project links', () => {
      const contentWithLongLink = {
        ...validProjectContent,
        links: {
          ...validProjectContent.links,
          website: 'https://example.com/very/long/url/path/that/exceeds/the/recommended/length/limit/for/optimal/user/experience/and/visual/design/considerations'
        }
      };
      
      const result = validateContent(contentWithLongLink);
      
      expect(result.valid).toBe(true);
      // The URL is 150 chars, which is under the 200 char warning threshold
      // So no warning should be generated
      expect(result.warnings).not.toContain('Project link website URL is very long');
    });

    test('should error on empty content when not allowed', () => {
      const contentWithEmptyBody = {
        ...validProjectContent,
        content: ''
      };
      
      const result = validateContent(contentWithEmptyBody);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Content body is empty');
    });

    test('should allow empty content when option is set', () => {
      const contentWithEmptyBody = {
        ...validProjectContent,
        content: ''
      };
      
      const options: ContentValidationOptions = { allowEmptyContent: true };
      const result = validateContent(contentWithEmptyBody, options);
      
      expect(result.valid).toBe(true);
      expect(result.errors).not.toContain('Content body is empty');
    });

    test('should calculate field lengths correctly', () => {
      const result = validateContent(validProjectContent);
      
      expect(result.fieldLengths.title).toBe(12); // "Test Project"
      expect(result.fieldLengths.seoTitle).toBe(24); // "Test Project - SEO Title"
      expect(result.fieldLengths.seoDescription).toBe(139); // Length of SEO description
      expect(result.fieldLengths.content).toBeGreaterThan(100); // Content length
    });
  });

  describe('validateContentBatch', () => {
    test('should validate multiple content items', () => {
      const contents = [validProjectContent, validPostContent];
      const result = validateContentBatch(contents);
      
      expect(result.valid).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.summary.total).toBe(2);
      expect(result.summary.valid).toBe(2);
      expect(result.summary.invalid).toBe(0);
    });

    test('should handle mixed valid and invalid content', () => {
      const invalidContent = { ...validProjectContent, title: '' };
      const contents = [validProjectContent, invalidContent];
      const result = validateContentBatch(contents);
      
      expect(result.valid).toBe(false);
      expect(result.summary.total).toBe(2);
      expect(result.summary.valid).toBe(1);
      expect(result.summary.invalid).toBe(1);
      expect(result.summary.totalErrors).toBeGreaterThan(0);
    });
  });

  describe('applySEOFallbacks', () => {
    test('should apply SEO fallbacks to content', () => {
      const contentWithoutSEO = { ...validProjectContent };
      delete (contentWithoutSEO as any).seo;
      
      const result = applySEOFallbacks(contentWithoutSEO);
      
      expect(result.seo).toBeDefined();
      expect(result.seo.title).toBe('Test Project');
      expect(result.seo.description).toContain('This is a comprehensive project description');
      expect(result.seo.canonical).toBe('https://polything.co.uk/projects/test-project');
    });

    test('should not override existing SEO values', () => {
      const contentWithSEO = { ...validProjectContent };
      
      const result = applySEOFallbacks(contentWithSEO);
      
      expect(result.seo.title).toBe('Test Project - SEO Title');
      expect(result.seo.description).toBe('This is a comprehensive SEO description for the test project that provides detailed information about the project goals and implementation.');
      expect(result.seo.canonical).toBe('https://polything.co.uk/projects/test-project');
    });

    test('should handle empty SEO values', () => {
      const contentWithEmptySEO = {
        ...validProjectContent,
        seo: {
          title: '',
          description: '',
          canonical: ''
        }
      };
      
      const result = applySEOFallbacks(contentWithEmptySEO);
      
      expect(result.seo.title).toBe('Test Project');
      expect(result.seo.description).toContain('This is a comprehensive project description');
      expect(result.seo.canonical).toBe('https://polything.co.uk/projects/test-project');
    });

    test('should generate correct canonical URLs for different content types', () => {
      const projectContent = { ...validProjectContent, type: 'project' as const };
      const postContent = { ...validPostContent, type: 'post' as const };
      const pageContent = { 
        ...validProjectContent, 
        type: 'page' as const, 
        slug: 'test-page',
        seo: undefined // Remove existing SEO to test fallback generation
      };
      
      const projectResult = applySEOFallbacks(projectContent);
      const postResult = applySEOFallbacks(postContent);
      const pageResult = applySEOFallbacks(pageContent);
      
      expect(projectResult.seo.canonical).toBe('https://polything.co.uk/projects/test-project');
      expect(postResult.seo.canonical).toBe('https://polything.co.uk/blog/test-blog-post');
      expect(pageResult.seo.canonical).toBe('https://polything.co.uk/test-page');
    });
  });
});

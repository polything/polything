/**
 * Tests for the comprehensive validation runner
 */

import {
  runContentValidation,
  runBatchValidation,
  validateYAMLSyntax,
  generateValidationReport,
  ValidationRunnerOptions
} from './validation-runner';
import { ProjectContent, PostContent, PageContent } from './schema';

describe('Validation Runner', () => {
  const validProjectContent: ProjectContent = {
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
    content: 'This is a test project content with **bold** and *italic* formatting.',
    seo: {
      title: 'Test Project - SEO Title',
      description: 'This is a comprehensive SEO description for the test project.',
      canonical: 'https://polything.co.uk/projects/test-project',
      schema: {
        type: 'CreativeWork',
        publishDate: '2024-01-01T00:00:00Z',
        modifiedDate: '2024-01-02T00:00:00Z',
        author: 'Polything Team'
      }
    }
  };

  const validPostContent: PostContent = {
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
    content: 'This is a test blog post content with ```code blocks``` and `inline code`.',
    seo: {
      title: 'Test Blog Post - SEO Title',
      description: 'This is a comprehensive SEO description for the blog post.',
      canonical: 'https://polything.co.uk/blog/test-blog-post',
      schema: {
        type: 'BlogPosting',
        publishDate: '2024-01-01T00:00:00Z',
        modifiedDate: '2024-01-02T00:00:00Z',
        author: 'Polything Team'
      }
    }
  };

  const invalidContent = {
    title: '', // Invalid: empty title
    slug: 'Invalid_Slug!', // Invalid: contains invalid characters
    type: 'project',
    date: 'invalid-date', // Invalid: not ISO format
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
    content: 'This is content with ```unclosed code block', // Invalid: unclosed code block
    seo: {
      title: 'Test Project - SEO Title',
      description: 'This is a comprehensive SEO description for the test project.',
      canonical: 'https://polything.co.uk/projects/test-project'
    }
  };

  describe('runContentValidation', () => {
    test('should validate valid content successfully', () => {
      const result = runContentValidation(validProjectContent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.metadata.contentType).toBe('project');
      expect(result.metadata.slug).toBe('test-project');
      expect(result.metadata.title).toBe('Test Project');
      expect(result.metadata.checksPerformed).toContain('Schema validation');
      expect(result.metadata.checksPerformed).toContain('Front-matter validation');
      expect(result.metadata.checksPerformed).toContain('MDX validation');
      expect(result.metadata.checksPerformed).toContain('Comprehensive content validation');
      expect(result.metadata.validationTime).toBeGreaterThanOrEqual(0);
    });

    test('should catch validation errors', () => {
      const result = runContentValidation(invalidContent as any);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Missing or empty required field: title');
      expect(result.errors).toContain('Invalid slug format: Invalid_Slug!. Must contain only lowercase letters, numbers, and hyphens.');
      expect(result.errors).toContain('Invalid date format: invalid-date. Must be ISO 8601 format.');
      expect(result.errors).toContain('Unclosed code block detected');
    });

    test('should respect validation options', () => {
      const options: ValidationRunnerOptions = {
        validateSchema: false,
        validateFrontMatter: false,
        validateMDX: false,
        validateSchemaTypes: false,
        includeWarnings: false,
        includeMetadata: false
      };
      
      const result = runContentValidation(validProjectContent, options);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
      expect(result.metadata.validationTime).toBe(0);
      expect(result.metadata.checksPerformed).toHaveLength(0);
    });

    test('should stop on first error when requested', () => {
      const options: ValidationRunnerOptions = {
        stopOnFirstError: true
      };
      
      const result = runContentValidation(invalidContent as any, options);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0); // Should have at least one error
      // The exact number depends on which validation step runs first
    });

    test('should perform HTML sanitization when requested', () => {
      const contentWithWordPressHTML = {
        ...validProjectContent,
        content: '<div class="wp-block-group">Content with <strong>WordPress classes</strong></div>'
      };
      
      const options: ValidationRunnerOptions = {
        sanitizeHTML: true,
        sanitization: {
          removeWordPressClasses: true
        }
      };
      
      const result = runContentValidation(contentWithWordPressHTML, options);
      
      expect(result.valid).toBe(true);
      expect(result.metadata.checksPerformed).toContain('HTML sanitization');
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('runBatchValidation', () => {
    test('should validate multiple content items', () => {
      const contents = [validProjectContent, validPostContent];
      const result = runBatchValidation(contents);
      
      expect(result.valid).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.summary.total).toBe(2);
      expect(result.summary.valid).toBe(2);
      expect(result.summary.invalid).toBe(0);
      expect(result.summary.totalErrors).toBe(0);
      expect(result.summary.validationTime).toBeGreaterThanOrEqual(0);
      expect(result.summary.checksPerformed.length).toBeGreaterThan(0);
    });

    test('should handle mixed valid and invalid content', () => {
      const contents = [validProjectContent, invalidContent as any];
      const result = runBatchValidation(contents);
      
      expect(result.valid).toBe(false);
      expect(result.summary.total).toBe(2);
      expect(result.summary.valid).toBe(1);
      expect(result.summary.invalid).toBe(1);
      expect(result.summary.totalErrors).toBeGreaterThan(0);
    });

    test('should perform slug conflict validation', () => {
      const contentWithSameSlug = {
        ...validProjectContent,
        slug: 'duplicate-slug'
      };
      const contentWithSameSlug2 = {
        ...validPostContent,
        slug: 'duplicate-slug'
      };
      
      const contents = [contentWithSameSlug, contentWithSameSlug2];
      const result = runBatchValidation(contents);
      
      expect(result.summary.checksPerformed).toContain('Slug conflict validation');
      expect(result.summary.totalWarnings).toBeGreaterThan(0);
    });

    test('should respect batch validation options', () => {
      const contents = [validProjectContent, validPostContent];
      const options: ValidationRunnerOptions = {
        validateSlugs: false,
        includeWarnings: false
      };
      
      const result = runBatchValidation(contents, options);
      
      expect(result.valid).toBe(true);
      expect(result.summary.totalWarnings).toBe(0);
      // Should not include slug conflict validation
      expect(result.summary.checksPerformed).not.toContain('Slug conflict validation');
    });
  });

  describe('validateYAMLSyntax', () => {
    test('should validate correct YAML syntax', () => {
      const validYAML = `---
title: Test Project
slug: test-project
type: project
seo:
  title: SEO Title
  description: SEO Description
---`;
      
      const result = validateYAMLSyntax(validYAML);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should catch YAML syntax errors', () => {
      const invalidYAML = `title: Test Project
slug: test-project
type: project
seo:
  title: SEO Title
  description: SEO Description`;
      
      const result = validateYAMLSyntax(invalidYAML);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('YAML front-matter must start with ---');
      expect(result.errors).toContain('YAML front-matter must end with ---');
    });

    test('should warn about YAML formatting issues', () => {
      const yamlWithWarnings = `---
title: Test Project
slug: test-project
type: project
seo:
 title: SEO Title  # Odd indentation
  description: SEO Description
---`;
      
      const result = validateYAMLSyntax(yamlWithWarnings);
      
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('YAML should use 2-space indentation'))).toBe(true);
    });

    test('should handle empty or invalid YAML', () => {
      const result1 = validateYAMLSyntax('');
      const result2 = validateYAMLSyntax(null as any);
      const result3 = validateYAMLSyntax(undefined as any);
      
      expect(result1.valid).toBe(false);
      expect(result1.errors).toContain('YAML content is empty or invalid');
      
      expect(result2.valid).toBe(false);
      expect(result2.errors).toContain('YAML content is empty or invalid');
      
      expect(result3.valid).toBe(false);
      expect(result3.errors).toContain('YAML content is empty or invalid');
    });

    test('should warn about unquoted values', () => {
      const yamlWithUnquotedValues = `---
title: Test Project
description: This is a description with spaces and: colons
url: https://example.com
---`;
      
      const result = validateYAMLSyntax(yamlWithUnquotedValues);
      
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('Consider quoting value'))).toBe(true);
    });
  });

  describe('generateValidationReport', () => {
    test('should generate single validation report', () => {
      const result = runContentValidation(validProjectContent);
      const report = generateValidationReport(result);
      
      expect(report).toContain('=== VALIDATION REPORT ===');
      expect(report).toContain('Title: Test Project');
      expect(report).toContain('Type: project');
      expect(report).toContain('Slug: test-project');
      expect(report).toContain('Valid: Yes');
      expect(report).toContain('Validation Time:');
      expect(report).toContain('Checks Performed:');
    });

    test('should generate batch validation report', () => {
      const contents = [validProjectContent, validPostContent];
      const result = runBatchValidation(contents);
      const report = generateValidationReport(result);
      
      expect(report).toContain('=== BATCH VALIDATION REPORT ===');
      expect(report).toContain('Total Items: 2');
      expect(report).toContain('Valid: 2');
      expect(report).toContain('Invalid: 0');
      expect(report).toContain('Total Errors: 0');
      expect(report).toContain('=== DETAILED RESULTS ===');
      expect(report).toContain('1. Test Project (project)');
      expect(report).toContain('2. Test Blog Post (post)');
    });

    test('should include errors and warnings in report', () => {
      const result = runContentValidation(invalidContent as any);
      const report = generateValidationReport(result);
      
      expect(report).toContain('Valid: No');
      expect(report).toContain('Errors (');
      expect(report).toContain('- Missing or empty required field: title');
    });
  });

  describe('integration tests', () => {
    test('should perform complete validation workflow', () => {
      const contents = [validProjectContent, validPostContent];
      const options: ValidationRunnerOptions = {
        contentValidation: {
          enforceSEOFallbacks: true,
          strictLengthValidation: true,
          validateMDXSyntax: true
        },
        sanitization: {
          removeWordPressClasses: true,
          fixBrokenLinks: true
        },
        validateSchema: true,
        validateFrontMatter: true,
        validateMDX: true,
        validateSchemaTypes: true,
        sanitizeHTML: false,
        includeWarnings: true,
        includeMetadata: true
      };
      
      const result = runBatchValidation(contents, options);
      
      expect(result.valid).toBe(true);
      expect(result.summary.checksPerformed).toContain('Schema validation');
      expect(result.summary.checksPerformed).toContain('Front-matter validation');
      expect(result.summary.checksPerformed).toContain('MDX validation');
      expect(result.summary.checksPerformed).toContain('Schema type validation');
      expect(result.summary.checksPerformed).toContain('Comprehensive content validation');
      expect(result.summary.checksPerformed).toContain('Slug conflict validation');
    });

    test('should handle validation errors gracefully', () => {
      const contents = [validProjectContent, invalidContent as any];
      const result = runBatchValidation(contents);
      
      expect(result.valid).toBe(false);
      expect(result.results[0].valid).toBe(true);
      expect(result.results[1].valid).toBe(false);
      expect(result.results[1].errors.length).toBeGreaterThan(0);
    });
  });
});

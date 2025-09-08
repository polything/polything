/**
 * @jest-environment node
 */

import {
  resolveSlugConflicts,
  isValidSlug,
  normalizeSlug,
  generateSlugFromTitle,
  validateSlugs,
  generateSlugResolutionReport,
  getCanonicalPath,
  getContentTypeFromPath,
  ContentItem,
  SlugConflict
} from './slug-manager';

describe('Slug Manager', () => {
  const sampleContentItems: ContentItem[] = [
    {
      id: '1',
      slug: 'about',
      type: 'page',
      title: 'About Us'
    },
    {
      id: '2',
      slug: 'about',
      type: 'project',
      title: 'About Project'
    },
    {
      id: '3',
      slug: 'about',
      type: 'post',
      title: 'About Blog Post'
    },
    {
      id: '4',
      slug: 'contact',
      type: 'page',
      title: 'Contact'
    },
    {
      id: '5',
      slug: 'services',
      type: 'page',
      title: 'Services'
    },
    {
      id: '6',
      slug: 'services',
      type: 'post',
      title: 'Services Blog Post'
    }
  ];

  describe('resolveSlugConflicts', () => {
    test('should resolve conflicts with page precedence', () => {
      const result = resolveSlugConflicts(sampleContentItems);
      
      expect(result.stats.total).toBe(6);
      expect(result.stats.resolved).toBe(6);
      expect(result.stats.conflicts).toBe(2); // 'about' and 'services'
      
      // Page should keep original slug
      expect(result.resolved['about']).toHaveProperty('type', 'page');
      expect(result.resolved['about']).toHaveProperty('title', 'About Us');
      
      // Project and post should get modified slugs
      const projectSlug = Object.keys(result.resolved).find(slug => 
        result.resolved[slug].type === 'project' && result.resolved[slug].title === 'About Project'
      );
      const postSlug = Object.keys(result.resolved).find(slug => 
        result.resolved[slug].type === 'post' && result.resolved[slug].title === 'About Blog Post'
      );
      
      expect(projectSlug).toBe('about-project');
      expect(postSlug).toBe('about-post');
    });

    test('should handle no conflicts', () => {
      const noConflictItems: ContentItem[] = [
        { id: '1', slug: 'page1', type: 'page', title: 'Page 1' },
        { id: '2', slug: 'project1', type: 'project', title: 'Project 1' },
        { id: '3', slug: 'post1', type: 'post', title: 'Post 1' }
      ];
      
      const result = resolveSlugConflicts(noConflictItems);
      
      expect(result.stats.total).toBe(3);
      expect(result.stats.resolved).toBe(3);
      expect(result.stats.conflicts).toBe(0);
      expect(result.conflicts).toHaveLength(0);
    });

    test('should handle empty array', () => {
      const result = resolveSlugConflicts([]);
      
      expect(result.stats.total).toBe(0);
      expect(result.stats.resolved).toBe(0);
      expect(result.stats.conflicts).toBe(0);
      expect(result.conflicts).toHaveLength(0);
    });

    test('should handle multiple conflicts with same precedence', () => {
      const multipleConflictItems: ContentItem[] = [
        { id: '1', slug: 'test', type: 'page', title: 'Page 1' },
        { id: '2', slug: 'test', type: 'page', title: 'Page 2' },
        { id: '3', slug: 'test', type: 'project', title: 'Project 1' }
      ];
      
      const result = resolveSlugConflicts(multipleConflictItems);
      
      expect(result.stats.conflicts).toBe(1);
      expect(result.resolved['test']).toHaveProperty('type', 'page');
      
      // Second page should get modified slug
      const secondPageSlug = Object.keys(result.resolved).find(slug => 
        result.resolved[slug].title === 'Page 2'
      );
      expect(secondPageSlug).toBe('test-page-2');
    });
  });

  describe('isValidSlug', () => {
    test('should validate correct slug formats', () => {
      expect(isValidSlug('about')).toBe(true);
      expect(isValidSlug('about-us')).toBe(true);
      expect(isValidSlug('about-us-2024')).toBe(true);
      expect(isValidSlug('test123')).toBe(true);
    });

    test('should reject invalid slug formats', () => {
      expect(isValidSlug('About')).toBe(false); // Uppercase
      expect(isValidSlug('about-')).toBe(false); // Ends with hyphen
      expect(isValidSlug('-about')).toBe(false); // Starts with hyphen
      expect(isValidSlug('about--us')).toBe(false); // Double hyphen
      expect(isValidSlug('about us')).toBe(false); // Space
      expect(isValidSlug('about_us')).toBe(false); // Underscore
      expect(isValidSlug('about.us')).toBe(false); // Dot
      expect(isValidSlug('')).toBe(false); // Empty
      expect(isValidSlug(null as any)).toBe(false); // Null
    });
  });

  describe('normalizeSlug', () => {
    test('should normalize various inputs to valid slugs', () => {
      expect(normalizeSlug('About Us')).toBe('about-us');
      expect(normalizeSlug('About Us!')).toBe('about-us');
      expect(normalizeSlug('About   Us')).toBe('about-us');
      expect(normalizeSlug('About---Us')).toBe('about-us');
      expect(normalizeSlug('About-Us-2024')).toBe('about-us-2024');
      expect(normalizeSlug('About Us & More')).toBe('about-us-more');
    });

    test('should handle edge cases', () => {
      expect(normalizeSlug('')).toBe('');
      expect(normalizeSlug('   ')).toBe('');
      expect(normalizeSlug('---')).toBe('');
      expect(normalizeSlug('123')).toBe('123');
      expect(normalizeSlug('a')).toBe('a');
    });
  });

  describe('generateSlugFromTitle', () => {
    test('should generate slugs from titles', () => {
      expect(generateSlugFromTitle('About Us')).toBe('about-us');
      expect(generateSlugFromTitle('Our Services & Solutions')).toBe('our-services-solutions');
      expect(generateSlugFromTitle('Contact Us!')).toBe('contact-us');
      expect(generateSlugFromTitle('2024 Year in Review')).toBe('2024-year-in-review');
    });

    test('should handle edge cases', () => {
      expect(generateSlugFromTitle('')).toBe('');
      expect(generateSlugFromTitle('   ')).toBe('');
      expect(generateSlugFromTitle(null as any)).toBe('');
    });
  });

  describe('validateSlugs', () => {
    test('should validate content items and report issues', () => {
      const invalidItems: ContentItem[] = [
        { id: '1', slug: 'valid-slug', type: 'page', title: 'Valid' },
        { id: '2', slug: 'Invalid Slug', type: 'page', title: 'Invalid' },
        { id: '3', slug: 'valid-slug', type: 'project', title: 'Conflict' }
      ];
      
      const result = validateSlugs(invalidItems);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid slug format for page "Invalid": "Invalid Slug"');
      expect(result.warnings).toContain('Slug conflict for "valid-slug": page, project');
    });

    test('should return valid for correct items', () => {
      const validItems: ContentItem[] = [
        { id: '1', slug: 'page1', type: 'page', title: 'Page 1' },
        { id: '2', slug: 'project1', type: 'project', title: 'Project 1' }
      ];
      
      const result = validateSlugs(validItems);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('generateSlugResolutionReport', () => {
    test('should generate comprehensive report', () => {
      const result = resolveSlugConflicts(sampleContentItems);
      const report = generateSlugResolutionReport(result);
      
      expect(report).toContain('Slug Resolution Report:');
      expect(report).toContain('Total items: 6');
      expect(report).toContain('Resolved slugs: 6');
      expect(report).toContain('Conflicts found: 2');
      expect(report).toContain('Conflicts resolved:');
      expect(report).toContain('Slug: "about"');
      expect(report).toContain('Primary (keeps slug): page - "About Us"');
    });

    test('should handle no conflicts report', () => {
      const noConflictItems: ContentItem[] = [
        { id: '1', slug: 'page1', type: 'page', title: 'Page 1' }
      ];
      
      const result = resolveSlugConflicts(noConflictItems);
      const report = generateSlugResolutionReport(result);
      
      expect(report).toContain('Conflicts found: 0');
      expect(report).not.toContain('Conflicts resolved:');
    });
  });

  describe('getCanonicalPath', () => {
    test('should generate correct canonical paths', () => {
      const pageItem: ContentItem = { id: '1', slug: 'about', type: 'page', title: 'About' };
      const projectItem: ContentItem = { id: '2', slug: 'project', type: 'project', title: 'Project' };
      const postItem: ContentItem = { id: '3', slug: 'post', type: 'post', title: 'Post' };
      
      expect(getCanonicalPath(pageItem)).toBe('/about');
      expect(getCanonicalPath(projectItem)).toBe('/work/project');
      expect(getCanonicalPath(postItem)).toBe('/blog/post');
    });
  });

  describe('getContentTypeFromPath', () => {
    test('should identify content types from paths', () => {
      expect(getContentTypeFromPath('/work/project')).toBe('project');
      expect(getContentTypeFromPath('/blog/post')).toBe('post');
      expect(getContentTypeFromPath('/page')).toBe('page');
      expect(getContentTypeFromPath('/')).toBe('page');
      expect(getContentTypeFromPath('invalid')).toBe(null);
    });
  });

  describe('Complex scenarios', () => {
    test('should handle multiple conflicts with different types', () => {
      const complexItems: ContentItem[] = [
        { id: '1', slug: 'test', type: 'page', title: 'Test Page' },
        { id: '2', slug: 'test', type: 'project', title: 'Test Project' },
        { id: '3', slug: 'test', type: 'post', title: 'Test Post' },
        { id: '4', slug: 'another', type: 'project', title: 'Another Project' },
        { id: '5', slug: 'another', type: 'post', title: 'Another Post' }
      ];
      
      const result = resolveSlugConflicts(complexItems);
      
      expect(result.stats.total).toBe(5);
      expect(result.stats.conflicts).toBe(2);
      
      // First conflict: page wins
      expect(result.resolved['test']).toHaveProperty('type', 'page');
      
      // Second conflict: project wins (no page)
      expect(result.resolved['another']).toHaveProperty('type', 'project');
      
      // Check modified slugs
      const testProjectSlug = Object.keys(result.resolved).find(slug => 
        result.resolved[slug].title === 'Test Project'
      );
      const testPostSlug = Object.keys(result.resolved).find(slug => 
        result.resolved[slug].title === 'Test Post'
      );
      const anotherPostSlug = Object.keys(result.resolved).find(slug => 
        result.resolved[slug].title === 'Another Post'
      );
      
      expect(testProjectSlug).toBe('test-project');
      expect(testPostSlug).toBe('test-post');
      expect(anotherPostSlug).toBe('another-post');
    });
  });
});

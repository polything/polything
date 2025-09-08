/**
 * Integration tests for WordPress API → MDX export workflow
 * Task 4.3: Integration tests for WP API → MDX export
 */

const fs = require('fs').promises;
const path = require('path');
const { 
  fetchWordPressContent, 
  processContentItem, 
  saveMDXFile 
} = require('../../scripts/wp-export.js');
const { 
  transformWordPressContent, 
  resolveMediaIds 
} = require('../../lib/content/transformers.js');
const { mapThemerainFields } = require('../../lib/content/field-mapper.js');

// Mock fetch for testing
global.fetch = jest.fn();

describe('WordPress API → MDX Export Integration', () => {
  const testSiteUrl = 'https://polything.co.uk';
  const testOutputDir = './test-output';
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure test output directory exists
    return fs.mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test output
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('fetchWordPressContent Integration', () => {
    test('should fetch and process WordPress posts successfully', async () => {
      const mockPosts = [
        {
          id: 1,
          title: { rendered: 'Test Post' },
          slug: 'test-post',
          content: { rendered: '<p>Test content</p>' },
          excerpt: { rendered: 'Test excerpt' },
          date: '2024-01-15T10:00:00',
          modified: '2024-01-20T15:30:00',
          categories: [1, 2],
          tags: [3, 4],
          meta: {
            themerain_hero_title: 'Test Hero Title',
            themerain_hero_subtitle: 'Test Hero Subtitle',
            themerain_hero_image: '1234'
          }
        }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      });

      const result = await fetchWordPressContent(testSiteUrl, 'posts', 10);
      
      expect(result).toEqual(mockPosts);
      expect(global.fetch).toHaveBeenCalledWith(
        `${testSiteUrl}/wp-json/wp/v2/posts?per_page=10&page=1`,
        expect.objectContaining({
          signal: expect.any(Object)
        })
      );
    });

    test('should handle API errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchWordPressContent(testSiteUrl, 'posts'))
        .rejects.toThrow('Network error');
    });

    test('should handle pagination correctly', async () => {
      const mockPostsPage1 = Array(10).fill().map((_, i) => ({
        id: i + 1,
        title: { rendered: `Post ${i + 1}` },
        slug: `post-${i + 1}`
      }));
      
      const mockPostsPage2 = Array(5).fill().map((_, i) => ({
        id: i + 11,
        title: { rendered: `Post ${i + 11}` },
        slug: `post-${i + 11}`
      }));

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPostsPage1
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPostsPage2
        });

      const result = await fetchWordPressContent(testSiteUrl, 'posts', 10);
      
      expect(result).toHaveLength(15);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Content Transformation Integration', () => {
    test('should transform WordPress post to MDX-ready content', async () => {
      const mockPost = {
        id: 1,
        title: { rendered: 'Test Project' },
        slug: 'test-project',
        content: { rendered: '<h2>Introduction</h2><p>This is a test project.</p>' },
        excerpt: { rendered: 'A test project description.' },
        date: '2024-01-15T10:00:00',
        modified: '2024-01-20T15:30:00',
        categories: [1, 2],
        tags: [3, 4],
        meta: {
          themerain_hero_title: 'Project Hero Title',
          themerain_hero_subtitle: 'Project Hero Subtitle',
          themerain_hero_image: '1234',
          themerain_project_link_url: 'https://example.com'
        }
      };

      const mockMediaData = {
        '1234': {
          id: 1234,
          source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/hero.jpg',
          media_type: 'image',
          alt_text: 'Hero image'
        }
      };

      const result = transformWordPressContent(mockPost, 'project', mockMediaData);
      
      expect(result).toHaveProperty('frontMatter');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('mediaReferences');
      
      expect(result.frontMatter.title).toBe('Test Project');
      expect(result.frontMatter.type).toBe('project');
      expect(result.frontMatter.hero.title).toBe('Project Hero Title');
      expect(result.frontMatter.links.url).toBe('https://example.com');
    });

    test('should handle media resolution errors gracefully', async () => {
      const mockPost = {
        id: 1,
        title: { rendered: 'Test Post' },
        slug: 'test-post',
        content: { rendered: '<p>Test content</p>' },
        meta: {
          themerain_hero_image: '9999' // Non-existent media ID
        }
      };

      const result = transformWordPressContent(mockPost, 'post', {});
      
      expect(result.frontMatter.hero.image).toBe('9999');
      // Media references might be empty if no media is found
      expect(result.mediaReferences).toBeDefined();
    });
  });

  describe('MDX File Generation Integration', () => {
    test('should save MDX file with correct structure', async () => {
      const mockContent = {
        frontMatter: {
          title: 'Test Project',
          slug: 'test-project',
          type: 'project',
          date: '2024-01-15T10:00:00',
          hero: {
            title: 'Hero Title',
            subtitle: 'Hero Subtitle',
            image: '/images/2024/01/hero.jpg'
          },
          links: {
            url: 'https://example.com'
          }
        },
        content: '# Test Project\n\nThis is a test project.',
        mediaReferences: {
          '1234': {
            id: '1234',
            originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/hero.jpg',
            localPath: '/images/2024/01/hero.jpg'
          }
        }
      };

      const filePath = await saveMDXFile(mockContent, 'project', {
        outputDir: testOutputDir
      });

      expect(filePath).toContain('test-project');
      expect(filePath).toContain('index.mdx');

      // Verify file was created
      const fileContent = await fs.readFile(filePath, 'utf8');
      expect(fileContent).toContain('title: "Test Project"');
      expect(fileContent).toContain('type: "project"');
      expect(fileContent).toContain('# Test Project');
    });

    test('should create proper directory structure', async () => {
      const mockContent = {
        frontMatter: {
          title: 'Test Post',
          slug: 'test-post',
          type: 'post'
        },
        content: 'Test content'
      };

      const filePath = await saveMDXFile(mockContent, 'post', {
        outputDir: testOutputDir
      });

      const expectedDir = path.join(testOutputDir, 'post', 'test-post');
      expect(filePath).toContain(expectedDir);
      
      // Verify directory was created
      const dirExists = await fs.access(path.dirname(filePath))
        .then(() => true)
        .catch(() => false);
      expect(dirExists).toBe(true);
    });
  });

  describe('End-to-End Export Workflow', () => {
    test('should complete full export workflow for projects', async () => {
      const mockProjects = [
        {
          id: 1,
          title: { rendered: 'Blackriver Case Study' },
          slug: 'blackriver-case-study',
          content: { rendered: '<h2>Introduction</h2><p>Blackriver case study content.</p>' },
          excerpt: { rendered: 'A case study about Blackriver.' },
          date: '2024-01-15T10:00:00',
          modified: '2024-01-20T15:30:00',
          categories: [1],
          tags: [2],
          meta: {
            themerain_hero_title: "Blackriver's 297% Sales Surge",
            themerain_hero_subtitle: "Read more about their Christmas strategy success",
            themerain_hero_video: "10681",
            themerain_project_link_url: "https://blackriver.com"
          }
        }
      ];

      const mockMediaData = {
        '10681': {
          id: 10681,
          source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/hero-video.mp4',
          media_type: 'video'
        }
      };

      // Mock API response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjects
      });

      // Fetch content
      const fetchedProjects = await fetchWordPressContent(testSiteUrl, 'project', 10);
      expect(fetchedProjects).toHaveLength(1);

      // Transform content
      const transformedContent = transformWordPressContent(
        fetchedProjects[0], 
        'project', 
        mockMediaData
      );

      expect(transformedContent.frontMatter.title).toBe('Blackriver Case Study');
      expect(transformedContent.frontMatter.hero.title).toBe("Blackriver's 297% Sales Surge");

      // Save MDX file
      const filePath = await saveMDXFile(transformedContent, 'project', {
        outputDir: testOutputDir
      });

      // Verify file exists and has correct content
      const fileContent = await fs.readFile(filePath, 'utf8');
      expect(fileContent).toContain('title: "Blackriver Case Study"');
      expect(fileContent).toContain('type: "project"');
      expect(fileContent).toContain('hero:');
      expect(fileContent).toContain('links:');
    });

    test('should handle mixed content types in batch export', async () => {
      const mockContent = [
        {
          id: 1,
          title: { rendered: 'Test Project' },
          slug: 'test-project',
          content: { rendered: '<p>Project content</p>' },
          meta: { themerain_hero_title: 'Project Title' }
        },
        {
          id: 2,
          title: { rendered: 'Test Post' },
          slug: 'test-post',
          content: { rendered: '<p>Post content</p>' },
          meta: { themerain_hero_title: 'Post Title' }
        },
        {
          id: 3,
          title: { rendered: 'Test Page' },
          slug: 'test-page',
          content: { rendered: '<p>Page content</p>' },
          meta: { themerain_page_title: 'Page Title' }
        }
      ];

      // Mock API responses for different content types
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => [mockContent[0]] })
        .mockResolvedValueOnce({ ok: true, json: async () => [mockContent[1]] })
        .mockResolvedValueOnce({ ok: true, json: async () => [mockContent[2]] });

      // Export each content type
      const projects = await fetchWordPressContent(testSiteUrl, 'project', 10);
      const posts = await fetchWordPressContent(testSiteUrl, 'posts', 10);
      const pages = await fetchWordPressContent(testSiteUrl, 'pages', 10);

      expect(projects).toHaveLength(1);
      expect(posts).toHaveLength(1);
      expect(pages).toHaveLength(1);

      // Transform and save each type
      const projectContent = transformWordPressContent(projects[0], 'project');
      const postContent = transformWordPressContent(posts[0], 'post');
      const pageContent = transformWordPressContent(pages[0], 'page');

      const projectPath = await saveMDXFile(projectContent, 'project', { outputDir: testOutputDir });
      const postPath = await saveMDXFile(postContent, 'post', { outputDir: testOutputDir });
      const pagePath = await saveMDXFile(pageContent, 'page', { outputDir: testOutputDir });

      // Verify all files were created
      expect(projectPath).toContain('project/test-project');
      expect(postPath).toContain('post/test-post');
      expect(pagePath).toContain('page/test-page');
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle transformation errors gracefully', async () => {
      const invalidPost = {
        id: 1,
        title: null, // Invalid title
        slug: 'invalid-post',
        content: { rendered: '<p>Content</p>' },
        meta: {}
      };

      // Should not throw error, but handle gracefully
      const result = transformWordPressContent(invalidPost, 'post');
      
      expect(result.frontMatter.title).toBe('');
      expect(result.frontMatter.slug).toBe('invalid-post');
    });

    test('should handle file system errors during save', async () => {
      const mockContent = {
        frontMatter: { title: 'Test', slug: 'test', type: 'post' },
        content: 'Test content'
      };

      // Create a read-only directory to simulate permission error
      const readOnlyDir = path.join(testOutputDir, 'readonly');
      await fs.mkdir(readOnlyDir, { recursive: true });
      await fs.chmod(readOnlyDir, 0o444);

      await expect(
        saveMDXFile(mockContent, 'post', { outputDir: readOnlyDir })
      ).rejects.toThrow();

      // Clean up
      await fs.chmod(readOnlyDir, 0o755);
    });
  });
});

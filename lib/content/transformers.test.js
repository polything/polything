/**
 * @jest-environment node
 */

const { 
  transformWordPressContent, 
  resolveMediaIds, 
  generateMDXFrontMatter,
  sanitizeHTMLContent 
} = require('./transformers.js');

describe('Content Transformation', () => {
  const sampleWordPressPost = {
    id: 10680,
    title: { rendered: "Blackriver Case Study" },
    slug: "blackriver-case-study",
    content: { rendered: "<h2>Introduction</h2><p>This is a case study about Blackriver.</p>" },
    excerpt: { rendered: "A case study about Blackriver's success." },
    date: "2024-01-15T10:00:00",
    modified: "2024-01-20T15:30:00",
    categories: [1, 2],
    tags: [3, 4],
    featured_media: 10681,
    meta: {
      themerain_hero_title: "Blackriver's 297% Sales Surge",
      themerain_hero_subtitle: "Read more about their Christmas strategy success",
      themerain_hero_video: "10681",
      themerain_hero_text_color: "#ffffff"
    }
  };

  const sampleMediaData = {
    10681: {
      id: 10681,
      source_url: "https://polything.co.uk/wp-content/uploads/2024/01/hero-video.mp4",
      media_type: "video"
    }
  };

  describe('transformWordPressContent', () => {
    test('should transform WordPress post to MDX-ready content', () => {
      const result = transformWordPressContent(sampleWordPressPost, 'project', sampleMediaData);
      
      expect(result).toHaveProperty('frontMatter');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('mediaReferences');
      
      expect(result.frontMatter.title).toBe("Blackriver Case Study");
      expect(result.frontMatter.slug).toBe("blackriver-case-study");
      expect(result.frontMatter.type).toBe("project");
      expect(result.frontMatter.hero.title).toBe("Blackriver's 297% Sales Surge");
    });

    test('should handle different content types', () => {
      const postResult = transformWordPressContent(sampleWordPressPost, 'post', sampleMediaData);
      const pageResult = transformWordPressContent(sampleWordPressPost, 'page', sampleMediaData);
      
      expect(postResult.frontMatter.type).toBe("post");
      expect(pageResult.frontMatter.type).toBe("page");
    });
  });

  describe('resolveMediaIds', () => {
    test('should resolve media IDs to local paths', () => {
      const mediaIds = ["10681", "1234"];
      const result = resolveMediaIds(mediaIds, sampleMediaData);
      
      expect(result).toHaveProperty('10681');
      expect(result).toHaveProperty('1234');
      expect(result['10681']).toHaveProperty('localPath', '/images/2024/01/hero-video.mp4');
      expect(result['1234']).toHaveProperty('error', 'Media not found');
    });

    test('should handle empty media IDs array', () => {
      const result = resolveMediaIds([], sampleMediaData);
      expect(result).toEqual({});
    });
  });

  describe('generateMDXFrontMatter', () => {
    test('should generate valid YAML front-matter', () => {
      const frontMatter = {
        title: "Test Post",
        slug: "test-post",
        type: "post",
        date: "2024-01-15T10:00:00",
        hero: {
          title: "Hero Title",
          subtitle: "Hero Subtitle"
        }
      };
      
      const result = generateMDXFrontMatter(frontMatter);
      
      expect(result).toContain('title: "Test Post"');
      expect(result).toContain('type: "post"');
      expect(result).toContain('hero:');
      expect(result).toContain('title: "Hero Title"');
    });
  });

  describe('sanitizeHTMLContent', () => {
    test('should clean WordPress-specific HTML', () => {
      const dirtyHTML = '<p class="wp-block-paragraph">Content with <span class="wp-inline-code">code</span></p>';
      const result = sanitizeHTMLContent(dirtyHTML);
      
      expect(result).not.toContain('wp-block-paragraph');
      expect(result).not.toContain('wp-inline-code');
      expect(result).toContain('<p>Content with <span>code</span></p>');
    });

    test('should preserve valid HTML structure', () => {
      const validHTML = '<h2>Title</h2><p>Paragraph with <strong>bold</strong> text.</p>';
      const result = sanitizeHTMLContent(validHTML);
      
      expect(result).toContain('<h2>Title</h2>');
      expect(result).toContain('<p>Paragraph with <strong>bold</strong> text.</p>');
    });
  });
});

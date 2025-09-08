/**
 * @jest-environment node
 */

const { 
  mapThemerainFields, 
  transformProjectFields, 
  transformPostFields, 
  transformPageFields,
  generateSEOSchema,
  getDefaultSchemaType
} = require('./field-mapper.js');

describe('Themerain Field Mapping', () => {
  const sampleProjectMeta = {
    themerain_hero_title: "Blackriver's 297% Sales Surge",
    themerain_hero_subtitle: "Read more about their Christmas strategy success",
    themerain_hero_video: "10681",
    themerain_hero_text_color: "#ffffff",
    themerain_hero_bg_color: "",
    themerain_project_link_url: "",
    themerain_project_link_image: "",
    themerain_project_link_video: ""
  };

  const samplePostMeta = {
    themerain_hero_title: "Blog Post Title",
    themerain_hero_subtitle: "Blog post subtitle",
    themerain_hero_image: "1234",
    themerain_hero_text_color: "#000000"
  };

  const samplePageMeta = {
    themerain_page_title: "Page Title",
    themerain_page_subtitle: "Page subtitle",
    themerain_hero_image: "5678",
    themerain_page_text_color: "#333333"
  };

  describe('mapThemerainFields', () => {
    test('should map project themerain fields to clean schema', () => {
      const result = mapThemerainFields(sampleProjectMeta, 'project');
      
      expect(result).toHaveProperty('hero');
      expect(result.hero).toHaveProperty('title', "Blackriver's 297% Sales Surge");
      expect(result.hero).toHaveProperty('subtitle', "Read more about their Christmas strategy success");
      expect(result.hero).toHaveProperty('video', "10681");
      expect(result.hero).toHaveProperty('text_color', "#ffffff");
      expect(result.hero).toHaveProperty('background_color', "");
      
      expect(result).toHaveProperty('links');
      expect(result.links).toHaveProperty('url', "");
      expect(result.links).toHaveProperty('image', "");
      expect(result.links).toHaveProperty('video', "");
    });

    test('should map post themerain fields to clean schema', () => {
      const result = mapThemerainFields(samplePostMeta, 'post');
      
      expect(result).toHaveProperty('hero');
      expect(result.hero).toHaveProperty('title', "Blog Post Title");
      expect(result.hero).toHaveProperty('subtitle', "Blog post subtitle");
      expect(result.hero).toHaveProperty('image', "1234");
      expect(result.hero).toHaveProperty('text_color', "#000000");
      
      expect(result).not.toHaveProperty('links'); // Posts don't have links
    });

    test('should map page themerain fields to clean schema', () => {
      const result = mapThemerainFields(samplePageMeta, 'page');
      
      expect(result).toHaveProperty('hero');
      expect(result.hero).toHaveProperty('title', "Page Title");
      expect(result.hero).toHaveProperty('subtitle', "Page subtitle");
      expect(result.hero).toHaveProperty('image', "5678");
      expect(result.hero).toHaveProperty('text_color', "#333333");
      
      expect(result).not.toHaveProperty('links'); // Pages don't have links
    });

    test('should handle empty/null values gracefully', () => {
      const emptyMeta = {
        themerain_hero_title: "",
        themerain_hero_subtitle: null,
        themerain_hero_image: undefined
      };
      
      const result = mapThemerainFields(emptyMeta, 'project');
      
      expect(result.hero.title).toBe("");
      expect(result.hero.subtitle).toBe("");
      expect(result.hero.image).toBe("");
    });
  });

  describe('transformProjectFields', () => {
    test('should transform project fields correctly', () => {
      const result = transformProjectFields(sampleProjectMeta);
      
      expect(result).toHaveProperty('hero');
      expect(result).toHaveProperty('links');
      expect(result.hero.title).toBe("Blackriver's 297% Sales Surge");
      expect(result.links.url).toBe("");
    });
  });

  describe('transformPostFields', () => {
    test('should transform post fields correctly', () => {
      const result = transformPostFields(samplePostMeta);
      
      expect(result).toHaveProperty('hero');
      expect(result).not.toHaveProperty('links');
      expect(result.hero.title).toBe("Blog Post Title");
    });
  });

  describe('transformPageFields', () => {
    test('should transform page fields correctly', () => {
      const result = transformPageFields(samplePageMeta);
      
      expect(result).toHaveProperty('hero');
      expect(result).not.toHaveProperty('links');
      expect(result.hero.title).toBe("Page Title");
    });
  });

  describe('SEO Schema Generation', () => {
    const sampleSEOMeta = {
      themerain_seo_title: "Custom SEO Title",
      themerain_seo_description: "Custom SEO description for the page",
      themerain_seo_canonical: "https://polything.co.uk/custom-canonical",
      themerain_seo_image: "/images/seo-image.jpg",
      themerain_seo_author: "Custom Author",
      themerain_seo_publish_date: "2024-01-01T00:00:00.000Z",
      themerain_seo_modified_date: "2024-01-15T00:00:00.000Z"
    };

    test('should generate SEO schema for project', () => {
      const result = generateSEOSchema(sampleSEOMeta, 'project');
      
      expect(result).toHaveProperty('title', 'Custom SEO Title');
      expect(result).toHaveProperty('description', 'Custom SEO description for the page');
      expect(result).toHaveProperty('canonical', 'https://polything.co.uk/custom-canonical');
      expect(result).toHaveProperty('schema');
      expect(result.schema).toHaveProperty('type', 'CreativeWork');
      expect(result.schema).toHaveProperty('image', '/images/seo-image.jpg');
      expect(result.schema).toHaveProperty('author', 'Custom Author');
    });

    test('should generate SEO schema for post', () => {
      const result = generateSEOSchema(sampleSEOMeta, 'post');
      
      expect(result.schema).toHaveProperty('type', 'BlogPosting');
    });

    test('should generate SEO schema for page', () => {
      const result = generateSEOSchema(sampleSEOMeta, 'page');
      
      expect(result.schema).toHaveProperty('type', 'WebPage');
    });

    test('should use defaults when SEO fields are missing', () => {
      const emptyMeta = {};
      const seoDefaults = {
        title: 'Default Title',
        description: 'Default description',
        author: 'Default Author'
      };
      
      const result = generateSEOSchema(emptyMeta, 'project', seoDefaults);
      
      expect(result).toHaveProperty('title', 'Default Title');
      expect(result).toHaveProperty('description', 'Default description');
      expect(result.schema).toHaveProperty('author', 'Default Author');
      expect(result.schema).toHaveProperty('type', 'CreativeWork');
    });

    test('should clean up empty values', () => {
      const emptyMeta = {
        themerain_seo_title: "",
        themerain_seo_description: null,
        themerain_seo_canonical: undefined
      };
      
      const result = generateSEOSchema(emptyMeta, 'project');
      
      expect(result).not.toHaveProperty('title');
      expect(result).not.toHaveProperty('description');
      expect(result).not.toHaveProperty('canonical');
      expect(result).toHaveProperty('schema');
      expect(result.schema).toHaveProperty('type', 'CreativeWork');
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

  describe('Enhanced mapThemerainFields with options', () => {
    test('should include theme_meta when requested', () => {
      const options = { includeThemeMeta: true };
      const result = mapThemerainFields(sampleProjectMeta, 'project', options);
      
      expect(result).toHaveProperty('theme_meta');
      expect(result.theme_meta).toEqual(sampleProjectMeta);
    });

    test('should not include theme_meta by default', () => {
      const result = mapThemerainFields(sampleProjectMeta, 'project');
      
      expect(result).not.toHaveProperty('theme_meta');
    });

    test('should include SEO fields by default', () => {
      const result = mapThemerainFields(sampleProjectMeta, 'project');
      
      expect(result).toHaveProperty('seo');
      expect(result.seo).toHaveProperty('schema');
      expect(result.seo.schema).toHaveProperty('type', 'CreativeWork');
    });

    test('should use SEO defaults when provided', () => {
      const options = {
        seoDefaults: {
          title: 'Default SEO Title',
          description: 'Default SEO description',
          author: 'Default Author'
        }
      };
      
      const result = mapThemerainFields({}, 'project', options);
      
      expect(result.seo).toHaveProperty('title', 'Default SEO Title');
      expect(result.seo).toHaveProperty('description', 'Default SEO description');
      expect(result.seo.schema).toHaveProperty('author', 'Default Author');
    });
  });
});

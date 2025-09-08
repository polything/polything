/**
 * @jest-environment node
 */

const { mapThemerainFields, transformProjectFields, transformPostFields, transformPageFields } = require('./field-mapper.js');

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
});

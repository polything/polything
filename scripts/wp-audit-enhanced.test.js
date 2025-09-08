/**
 * @jest-environment node
 */

const { auditWordPressSite, discoverContentTypes, validateRESTEndpoints } = require('./wp-audit.js');

describe('Enhanced WordPress Site Audit with Themerain Fields', () => {
  const testSiteUrl = 'https://polything.co.uk';
  
  describe('auditWordPressSite with themerain field detection', () => {
    test('should detect themerain_* fields via diagnostic endpoint', async () => {
      const result = await auditWordPressSite(testSiteUrl);
      
      expect(result).toHaveProperty('themerainFields');
      expect(result.themerainFields['https://polything.co.uk']).toBeDefined();
      expect(result.themerainFields['https://polything.co.uk'].project).toBeDefined();
      
      const projectFields = result.themerainFields['https://polything.co.uk'].project;
      expect(projectFields).toHaveProperty('found_keys');
      expect(projectFields).toHaveProperty('meta');
      
      // Should find key themerain fields
      expect(projectFields.found_keys).toContain('themerain_hero_title');
      expect(projectFields.found_keys).toContain('themerain_hero_subtitle');
      expect(projectFields.found_keys).toContain('themerain_hero_video');
      expect(projectFields.found_keys).toContain('themerain_hero_text_color');
      
      // Should have actual values
      expect(projectFields.meta.themerain_hero_title).toBeDefined();
      expect(projectFields.meta.themerain_hero_subtitle).toBeDefined();
    });

    test('should handle diagnostic endpoint failures gracefully', async () => {
      const result = await auditWordPressSite('https://invalid-site.com');
      
      expect(result).toHaveProperty('themerainFields');
      // For invalid sites, themerainFields will be empty since site fails WordPress check
      expect(result.themerainFields).toEqual({});
      expect(result.isWordPress).toBe(false);
    });
  });

  describe('discoverThemerainFields', () => {
    test('should discover themerain fields for a specific post', async () => {
      const { discoverThemerainFields } = require('./wp-audit.js');
      
      const fields = await discoverThemerainFields(testSiteUrl, 'project', 10680);
      
      expect(fields).toHaveProperty('found_keys');
      expect(fields).toHaveProperty('meta');
      expect(fields.found_keys.length).toBeGreaterThan(0);
      expect(fields.meta).toHaveProperty('themerain_hero_title');
    });

    test('should handle invalid post IDs gracefully', async () => {
      const { discoverThemerainFields } = require('./wp-audit.js');
      
      const fields = await discoverThemerainFields(testSiteUrl, 'project', 99999);
      
      // The diagnostic endpoint returns empty arrays for non-existent posts
      expect(fields).toHaveProperty('found_keys');
      expect(fields).toHaveProperty('meta');
      expect(fields.found_keys).toEqual([]);
    });
  });

  describe('validateRESTEndpoints with themerain field detection', () => {
    test('should detect themerain fields in meta field discovery', async () => {
      const contentTypes = await discoverContentTypes(testSiteUrl);
      const endpoints = await validateRESTEndpoints(testSiteUrl, contentTypes);
      
      // Should detect meta fields availability
      expect(endpoints.project).toHaveProperty('metaFields');
      expect(endpoints.project.metaFields).toBeDefined();
    });
  });
});

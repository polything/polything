/**
 * Field mapping utilities for converting themerain_* fields to clean schema
 * Based on actual field discovery from polything.co.uk and mightybooth.com
 */

/**
 * Maps themerain_* fields to clean front-matter schema
 * @param {Object} themerainMeta - Raw themerain meta fields from WordPress
 * @param {string} contentType - Content type: 'project', 'post', or 'page'
 * @returns {Object} Clean schema object
 */
function mapThemerainFields(themerainMeta, contentType) {
  if (!themerainMeta || typeof themerainMeta !== 'object') {
    return getEmptySchema(contentType);
  }

  switch (contentType) {
    case 'project':
      return transformProjectFields(themerainMeta);
    case 'post':
      return transformPostFields(themerainMeta);
    case 'page':
      return transformPageFields(themerainMeta);
    default:
      return getEmptySchema(contentType);
  }
}

/**
 * Transforms project themerain fields to clean schema
 * @param {Object} meta - Project themerain meta fields
 * @returns {Object} Clean project schema
 */
function transformProjectFields(meta) {
  return {
    hero: {
      title: meta.themerain_hero_title || meta.themerain_page_title || "",
      subtitle: meta.themerain_hero_subtitle || meta.themerain_page_subtitle || "",
      image: meta.themerain_hero_image || "",
      video: meta.themerain_hero_video || "",
      text_color: meta.themerain_hero_text_color || meta.themerain_page_text_color || "",
      background_color: meta.themerain_hero_bg_color || meta.themerain_page_bg_color || ""
    },
    links: {
      url: meta.themerain_project_link_url || "",
      image: meta.themerain_project_link_image || "",
      video: meta.themerain_project_link_video || ""
    }
  };
}

/**
 * Transforms post themerain fields to clean schema
 * @param {Object} meta - Post themerain meta fields
 * @returns {Object} Clean post schema
 */
function transformPostFields(meta) {
  return {
    hero: {
      title: meta.themerain_hero_title || meta.themerain_page_title || "",
      subtitle: meta.themerain_hero_subtitle || meta.themerain_page_subtitle || "",
      image: meta.themerain_hero_image || "",
      video: meta.themerain_hero_video || "",
      text_color: meta.themerain_hero_text_color || meta.themerain_page_text_color || "",
      background_color: meta.themerain_hero_bg_color || meta.themerain_page_bg_color || ""
    }
    // Posts don't have links section
  };
}

/**
 * Transforms page themerain fields to clean schema
 * @param {Object} meta - Page themerain meta fields
 * @returns {Object} Clean page schema
 */
function transformPageFields(meta) {
  return {
    hero: {
      title: meta.themerain_hero_title || meta.themerain_page_title || "",
      subtitle: meta.themerain_hero_subtitle || meta.themerain_page_subtitle || "",
      image: meta.themerain_hero_image || "",
      video: meta.themerain_hero_video || "",
      text_color: meta.themerain_hero_text_color || meta.themerain_page_text_color || "",
      background_color: meta.themerain_hero_bg_color || meta.themerain_page_bg_color || ""
    }
    // Pages don't have links section
  };
}

/**
 * Returns empty schema for a content type
 * @param {string} contentType - Content type
 * @returns {Object} Empty schema
 */
function getEmptySchema(contentType) {
  const baseSchema = {
    hero: {
      title: "",
      subtitle: "",
      image: "",
      video: "",
      text_color: "",
      background_color: ""
    }
  };

  if (contentType === 'project') {
    baseSchema.links = {
      url: "",
      image: "",
      video: ""
    };
  }

  return baseSchema;
}

/**
 * Validates that required fields are present and have valid values
 * @param {Object} schema - Clean schema object
 * @param {string} contentType - Content type
 * @returns {Object} Validation result with errors array
 */
function validateSchema(schema, contentType) {
  const errors = [];

  // Check hero section exists
  if (!schema.hero) {
    errors.push('Missing hero section');
    return { valid: false, errors };
  }

  // Check required hero fields
  const requiredHeroFields = ['title', 'subtitle', 'image', 'video', 'text_color', 'background_color'];
  for (const field of requiredHeroFields) {
    if (!(field in schema.hero)) {
      errors.push(`Missing hero.${field}`);
    }
  }

  // Check project-specific fields
  if (contentType === 'project') {
    if (!schema.links) {
      errors.push('Missing links section for project');
    } else {
      const requiredLinkFields = ['url', 'image', 'video'];
      for (const field of requiredLinkFields) {
        if (!(field in schema.links)) {
          errors.push(`Missing links.${field}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Gets field mapping documentation for debugging
 * @returns {Object} Field mapping documentation
 */
function getFieldMappingDocs() {
  return {
    hero: {
      title: ['themerain_hero_title', 'themerain_page_title'],
      subtitle: ['themerain_hero_subtitle', 'themerain_page_subtitle'],
      image: ['themerain_hero_image'],
      video: ['themerain_hero_video'],
      text_color: ['themerain_hero_text_color', 'themerain_page_text_color'],
      background_color: ['themerain_hero_bg_color', 'themerain_page_bg_color']
    },
    links: {
      url: ['themerain_project_link_url'],
      image: ['themerain_project_link_image'],
      video: ['themerain_project_link_video']
    },
    notes: {
      'Project fields': 'Include both hero and links sections',
      'Post fields': 'Include only hero section',
      'Page fields': 'Include only hero section',
      'Fallback logic': 'Uses page_* fields as fallback for hero_* fields'
    }
  };
}

module.exports = {
  mapThemerainFields,
  transformProjectFields,
  transformPostFields,
  transformPageFields,
  validateSchema,
  getFieldMappingDocs
};

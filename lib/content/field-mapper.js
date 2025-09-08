/**
 * Field mapping utilities for converting themerain_* fields to clean schema
 * Based on actual field discovery from polything.co.uk and mightybooth.com
 */

/**
 * Maps themerain_* fields to clean front-matter schema
 * @param {Object} themerainMeta - Raw themerain meta fields from WordPress
 * @param {string} contentType - Content type: 'project', 'post', or 'page'
 * @param {Object} options - Mapping options
 * @param {boolean} options.includeThemeMeta - Whether to include raw theme_meta
 * @param {Object} options.seoDefaults - Default SEO values
 * @returns {Object} Clean schema object
 */
function mapThemerainFields(themerainMeta, contentType, options = {}) {
  if (!themerainMeta || typeof themerainMeta !== 'object') {
    return getEmptySchema(contentType, options);
  }

  let result;
  switch (contentType) {
    case 'project':
      result = transformProjectFields(themerainMeta);
      break;
    case 'post':
      result = transformPostFields(themerainMeta);
      break;
    case 'page':
      result = transformPageFields(themerainMeta);
      break;
    default:
      result = getEmptySchema(contentType, options);
  }

  // Add SEO fields
  result.seo = generateSEOSchema(themerainMeta, contentType, options.seoDefaults);

  // Add theme_meta if requested
  if (options.includeThemeMeta) {
    result.theme_meta = themerainMeta;
  }

  return result;
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
 * @param {Object} options - Mapping options
 * @returns {Object} Empty schema
 */
function getEmptySchema(contentType, options = {}) {
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

  // Add SEO fields
  baseSchema.seo = generateSEOSchema({}, contentType, options.seoDefaults);

  // Add theme_meta if requested
  if (options.includeThemeMeta) {
    baseSchema.theme_meta = {};
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
 * Generates SEO schema from themerain meta and defaults
 * @param {Object} themerainMeta - Raw themerain meta fields
 * @param {string} contentType - Content type
 * @param {Object} seoDefaults - Default SEO values
 * @returns {Object} SEO schema object
 */
function generateSEOSchema(themerainMeta, contentType, seoDefaults = {}) {
  const seo = {
    title: themerainMeta.themerain_seo_title || seoDefaults.title || "",
    description: themerainMeta.themerain_seo_description || seoDefaults.description || "",
    canonical: themerainMeta.themerain_seo_canonical || seoDefaults.canonical || "",
    schema: {
      type: getDefaultSchemaType(contentType),
      image: themerainMeta.themerain_seo_image || "",
      author: themerainMeta.themerain_seo_author || seoDefaults.author || "Polything Ltd",
      publishDate: themerainMeta.themerain_seo_publish_date || "",
      modifiedDate: themerainMeta.themerain_seo_modified_date || "",
      breadcrumbs: themerainMeta.themerain_seo_breadcrumbs || []
    }
  };

  // Clean up empty values
  Object.keys(seo).forEach(key => {
    if (seo[key] === "" || seo[key] === null || seo[key] === undefined) {
      delete seo[key];
    }
  });

  if (seo.schema) {
    Object.keys(seo.schema).forEach(key => {
      if (seo.schema[key] === "" || seo.schema[key] === null || seo.schema[key] === undefined) {
        delete seo.schema[key];
      }
    });
    
    // Remove schema object if it's empty
    if (Object.keys(seo.schema).length === 0) {
      delete seo.schema;
    }
  }

  return seo;
}

/**
 * Gets default schema type for content type
 * @param {string} contentType - Content type
 * @returns {string} Default schema type
 */
function getDefaultSchemaType(contentType) {
  switch (contentType) {
    case 'project':
      return 'CreativeWork';
    case 'post':
      return 'BlogPosting';
    case 'page':
    default:
      return 'WebPage';
  }
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
    seo: {
      title: ['themerain_seo_title'],
      description: ['themerain_seo_description'],
      canonical: ['themerain_seo_canonical'],
      schema: {
        type: ['Default based on content type'],
        image: ['themerain_seo_image'],
        author: ['themerain_seo_author'],
        publishDate: ['themerain_seo_publish_date'],
        modifiedDate: ['themerain_seo_modified_date'],
        breadcrumbs: ['themerain_seo_breadcrumbs']
      }
    },
    notes: {
      'Project fields': 'Include both hero and links sections',
      'Post fields': 'Include only hero section',
      'Page fields': 'Include only hero section',
      'Fallback logic': 'Uses page_* fields as fallback for hero_* fields',
      'SEO defaults': 'Schema type defaults based on content type'
    }
  };
}

module.exports = {
  mapThemerainFields,
  transformProjectFields,
  transformPostFields,
  transformPageFields,
  validateSchema,
  generateSEOSchema,
  getDefaultSchemaType,
  getFieldMappingDocs
};

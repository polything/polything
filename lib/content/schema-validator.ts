/**
 * Schema validation utilities for content transformation
 * Ensures exported content matches the defined schema
 */

import { ContentType, ProjectContent, PostContent, PageContent, SEOSchema } from './schema';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SchemaDefaults {
  seo: {
    schema: {
      type: 'WebPage' | 'Article' | 'BlogPosting' | 'CreativeWork';
    };
  };
}

/**
 * Validates content against the defined schema
 * @param content - Content to validate
 * @returns Validation result with errors and warnings
 */
export function validateContentSchema(content: ContentType): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate base content
  validateBaseContent(content, errors, warnings);

  // Validate content type specific fields
  switch (content.type) {
    case 'project':
      validateProjectContent(content as ProjectContent, errors, warnings);
      break;
    case 'post':
      validatePostContent(content as PostContent, errors, warnings);
      break;
    case 'page':
      validatePageContent(content as PageContent, errors, warnings);
      break;
  }

  // Validate SEO schema
  validateSEOSchema(content.seo, content.type, errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates base content fields
 */
function validateBaseContent(content: ContentType, errors: string[], warnings: string[]): void {
  // Required string fields
  const requiredStringFields = ['title', 'slug', 'date', 'updated'];
  for (const field of requiredStringFields) {
    if (!content[field as keyof ContentType] || String(content[field as keyof ContentType]).trim() === '') {
      errors.push(`Missing or empty required field: ${field}`);
    }
  }

  // Validate slug format
  if (content.slug && !/^[a-z0-9-]+$/.test(content.slug)) {
    errors.push(`Invalid slug format: ${content.slug}. Must contain only lowercase letters, numbers, and hyphens.`);
  }

  // Validate date format
  if (content.date && !isValidISODate(content.date)) {
    errors.push(`Invalid date format: ${content.date}. Must be ISO 8601 format.`);
  }

  if (content.updated && !isValidISODate(content.updated)) {
    errors.push(`Invalid updated date format: ${content.updated}. Must be ISO 8601 format.`);
  }

  // Validate arrays
  if (!Array.isArray(content.categories)) {
    errors.push('Categories must be an array');
  }

  if (!Array.isArray(content.tags)) {
    errors.push('Tags must be an array');
  }

  // Validate hero section
  if (!content.hero) {
    errors.push('Missing hero section');
  } else {
    validateHeroFields(content.hero, errors, warnings);
  }
}

/**
 * Validates project-specific content
 */
function validateProjectContent(content: ProjectContent, errors: string[], warnings: string[]): void {
  if (!content.links) {
    errors.push('Missing links section for project content');
  } else {
    validateProjectLinks(content.links, errors, warnings);
  }
}

/**
 * Validates post-specific content
 */
function validatePostContent(content: PostContent, errors: string[], warnings: string[]): void {
  if (typeof content.featured !== 'boolean') {
    errors.push('Featured field must be a boolean for post content');
  }
}

/**
 * Validates page-specific content
 */
function validatePageContent(content: PageContent, errors: string[], warnings: string[]): void {
  // Pages don't have additional required fields beyond base content
}

/**
 * Validates hero fields
 */
function validateHeroFields(hero: any, errors: string[], warnings: string[]): void {
  const requiredHeroFields = ['title', 'subtitle', 'image', 'video', 'text_color', 'background_color'];
  
  for (const field of requiredHeroFields) {
    if (!(field in hero)) {
      errors.push(`Missing hero field: ${field}`);
    }
  }

  // Validate color formats
  if (hero.text_color && !isValidColor(hero.text_color)) {
    warnings.push(`Invalid text_color format: ${hero.text_color}. Expected hex color.`);
  }

  if (hero.background_color && !isValidColor(hero.background_color)) {
    warnings.push(`Invalid background_color format: ${hero.background_color}. Expected hex color.`);
  }

  // Validate image/video paths
  if (hero.image && !isValidImagePath(hero.image)) {
    warnings.push(`Invalid image path format: ${hero.image}. Expected /images/* path.`);
  }

  if (hero.video && !isValidImagePath(hero.video)) {
    warnings.push(`Invalid video path format: ${hero.video}. Expected /images/* path.`);
  }
}

/**
 * Validates project links
 */
function validateProjectLinks(links: any, errors: string[], warnings: string[]): void {
  const requiredLinkFields = ['url', 'image', 'video'];
  
  for (const field of requiredLinkFields) {
    if (!(field in links)) {
      errors.push(`Missing links field: ${field}`);
    }
  }

  // Validate URL format
  if (links.url && !isValidURL(links.url)) {
    warnings.push(`Invalid URL format: ${links.url}`);
  }

  // Validate image/video paths
  if (links.image && !isValidImagePath(links.image)) {
    warnings.push(`Invalid links image path format: ${links.image}. Expected /images/* path.`);
  }

  if (links.video && !isValidImagePath(links.video)) {
    warnings.push(`Invalid links video path format: ${links.video}. Expected /images/* path.`);
  }
}

/**
 * Validates SEO schema
 */
function validateSEOSchema(seo: SEOSchema, contentType: string, errors: string[], warnings: string[]): void {
  if (!seo) {
    errors.push('Missing SEO section');
    return;
  }

  // Validate title length
  if (seo.title && seo.title.length > 60) {
    warnings.push(`SEO title too long: ${seo.title.length} characters. Recommended max: 60.`);
  }

  // Validate description length
  if (seo.description) {
    if (seo.description.length < 120) {
      warnings.push(`SEO description too short: ${seo.description.length} characters. Recommended min: 120.`);
    }
    if (seo.description.length > 160) {
      warnings.push(`SEO description too long: ${seo.description.length} characters. Recommended max: 160.`);
    }
  }

  // Validate canonical URL
  if (seo.canonical && !isValidURL(seo.canonical)) {
    warnings.push(`Invalid canonical URL format: ${seo.canonical}`);
  }

  // Validate schema type
  if (seo.schema) {
    validateSchemaType(seo.schema, contentType, errors, warnings);
  }
}

/**
 * Validates schema type and defaults
 */
function validateSchemaType(schema: any, contentType: string, errors: string[], warnings: string[]): void {
  const validTypes = ['WebPage', 'Article', 'BlogPosting', 'CreativeWork'];
  
  if (schema.type && !validTypes.includes(schema.type)) {
    errors.push(`Invalid schema type: ${schema.type}. Must be one of: ${validTypes.join(', ')}`);
  }

  // Apply defaults if not specified
  if (!schema.type) {
    const defaultType = getDefaultSchemaType(contentType);
    schema.type = defaultType;
    warnings.push(`Schema type not specified, using default: ${defaultType}`);
  }

  // Validate dates
  if (schema.publishDate && !isValidISODate(schema.publishDate)) {
    errors.push(`Invalid publishDate format: ${schema.publishDate}. Must be ISO 8601 format.`);
  }

  if (schema.modifiedDate && !isValidISODate(schema.modifiedDate)) {
    errors.push(`Invalid modifiedDate format: ${schema.modifiedDate}. Must be ISO 8601 format.`);
  }

  // Validate breadcrumbs
  if (schema.breadcrumbs && !Array.isArray(schema.breadcrumbs)) {
    errors.push('Breadcrumbs must be an array');
  } else if (schema.breadcrumbs) {
    validateBreadcrumbs(schema.breadcrumbs, errors, warnings);
  }
}

/**
 * Validates breadcrumbs structure
 */
function validateBreadcrumbs(breadcrumbs: any[], errors: string[], warnings: string[]): void {
  for (let i = 0; i < breadcrumbs.length; i++) {
    const crumb = breadcrumbs[i];
    if (!crumb.name || !crumb.url) {
      errors.push(`Breadcrumb ${i + 1} missing name or url`);
    }
    if (crumb.url && !isValidURL(crumb.url)) {
      warnings.push(`Invalid breadcrumb URL: ${crumb.url}`);
    }
  }
}

/**
 * Gets default schema type for content type
 */
export function getDefaultSchemaType(contentType: string): 'WebPage' | 'Article' | 'BlogPosting' | 'CreativeWork' {
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
 * Applies schema defaults to content
 */
export function applySchemaDefaults(content: ContentType): ContentType {
  const defaults = getSchemaDefaults(content.type);
  
  // Apply SEO defaults
  if (!content.seo) {
    content.seo = defaults.seo;
  } else if (!content.seo.schema) {
    content.seo.schema = defaults.seo.schema;
  } else if (!content.seo.schema.type) {
    content.seo.schema.type = defaults.seo.schema.type;
  }

  return content;
}

/**
 * Gets schema defaults for content type
 */
function getSchemaDefaults(contentType: string): SchemaDefaults {
  return {
    seo: {
      schema: {
        type: getDefaultSchemaType(contentType)
      }
    }
  };
}

// Utility functions
function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && dateString === date.toISOString();
}

function isValidColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

function isValidImagePath(path: string): boolean {
  return path.startsWith('/images/') || path.startsWith('http');
}

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

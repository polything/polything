/**
 * Schema defaults enforcer for content types
 * Automatically applies appropriate schema types and defaults based on content type
 */

import { ContentType, ProjectContent, PostContent, PageContent, SEOSchema } from './schema';

export interface SchemaDefaultsOptions {
  enforceSchemaTypes?: boolean;
  enforceRequiredFields?: boolean;
  applyContentTypeDefaults?: boolean;
}

/**
 * Enforces schema type defaults based on content type
 * @param content - Content to process
 * @param options - Enforcement options
 * @returns Content with schema defaults applied
 */
export function enforceSchemaDefaults(
  content: ContentType,
  options: SchemaDefaultsOptions = {}
): ContentType {
  const {
    enforceSchemaTypes = true,
    enforceRequiredFields = true,
    applyContentTypeDefaults = true
  } = options;

  const result = { ...content };

  // Apply content type specific defaults
  if (applyContentTypeDefaults) {
    result.seo = applyContentTypeSEODefaults(result);
  }

  // Enforce schema types
  if (enforceSchemaTypes) {
    result.seo = enforceSchemaTypeDefaults(result);
  }

  // Enforce required fields
  if (enforceRequiredFields) {
    result.seo = enforceRequiredSEOFields(result);
  }

  return result;
}

/**
 * Applies content type specific SEO defaults
 */
function applyContentTypeSEODefaults(content: ContentType): SEOSchema {
  const seo = content.seo || {};
  
  // Ensure schema section exists
  if (!seo.schema) {
    seo.schema = {};
  }

  // Apply content type specific defaults
  switch (content.type) {
    case 'post':
      return applyPostDefaults(content, seo);
    case 'page':
      return applyPageDefaults(content, seo);
    case 'project':
      return applyProjectDefaults(content, seo);
    default:
      return seo;
  }
}

/**
 * Applies post-specific defaults
 */
function applyPostDefaults(content: PostContent, seo: SEOSchema): SEOSchema {
  const defaults = {
    ...seo,
    schema: {
      ...seo.schema,
      type: seo.schema?.type || 'BlogPosting',
      publishDate: seo.schema?.publishDate || content.date,
      modifiedDate: seo.schema?.modifiedDate || content.updated,
      author: seo.schema?.author || 'Polything Team',
      breadcrumbs: seo.schema?.breadcrumbs || generatePostBreadcrumbs(content)
    }
  };

  return defaults;
}

/**
 * Applies page-specific defaults
 */
function applyPageDefaults(content: PageContent, seo: SEOSchema): SEOSchema {
  const defaults = {
    ...seo,
    schema: {
      ...seo.schema,
      type: seo.schema?.type || 'WebPage',
      publishDate: seo.schema?.publishDate || content.date,
      modifiedDate: seo.schema?.modifiedDate || content.updated,
      breadcrumbs: seo.schema?.breadcrumbs || generatePageBreadcrumbs(content)
    }
  };

  return defaults;
}

/**
 * Applies project-specific defaults
 */
function applyProjectDefaults(content: ProjectContent, seo: SEOSchema): SEOSchema {
  const defaults = {
    ...seo,
    schema: {
      ...seo.schema,
      type: seo.schema?.type || 'CreativeWork',
      publishDate: seo.schema?.publishDate || content.date,
      modifiedDate: seo.schema?.modifiedDate || content.updated,
      author: seo.schema?.author || 'Polything Team',
      breadcrumbs: seo.schema?.breadcrumbs || generateProjectBreadcrumbs(content)
    }
  };

  return defaults;
}

/**
 * Enforces schema type defaults when unspecified
 */
function enforceSchemaTypeDefaults(content: ContentType): SEOSchema {
  const seo = content.seo || {};
  
  if (!seo.schema) {
    seo.schema = {};
  }

  // Set default schema type if not specified
  if (!seo.schema.type) {
    switch (content.type) {
      case 'post':
        seo.schema.type = 'BlogPosting';
        break;
      case 'page':
        seo.schema.type = 'WebPage';
        break;
      case 'project':
        seo.schema.type = 'CreativeWork';
        break;
    }
  }

  return seo;
}

/**
 * Enforces required SEO fields
 */
function enforceRequiredSEOFields(content: ContentType): SEOSchema {
  const seo = content.seo || {};
  
  // Ensure schema section exists
  if (!seo.schema) {
    seo.schema = {};
  }

  // Set required fields if missing
  if (!seo.schema.publishDate) {
    seo.schema.publishDate = content.date;
  }

  if (!seo.schema.modifiedDate) {
    seo.schema.modifiedDate = content.updated;
  }

  // Set author for posts and projects
  if ((content.type === 'post' || content.type === 'project') && !seo.schema.author) {
    seo.schema.author = 'Polything Team';
  }

  return seo;
}

/**
 * Generates breadcrumbs for posts
 */
function generatePostBreadcrumbs(content: PostContent): Array<{ name: string; url: string }> {
  return [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: content.title, url: `/blog/${content.slug}` }
  ];
}

/**
 * Generates breadcrumbs for pages
 */
function generatePageBreadcrumbs(content: PageContent): Array<{ name: string; url: string }> {
  return [
    { name: 'Home', url: '/' },
    { name: content.title, url: `/${content.slug}` }
  ];
}

/**
 * Generates breadcrumbs for projects
 */
function generateProjectBreadcrumbs(content: ProjectContent): Array<{ name: string; url: string }> {
  return [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: content.title, url: `/projects/${content.slug}` }
  ];
}

/**
 * Gets the default schema type for a content type
 */
export function getDefaultSchemaType(contentType: 'post' | 'page' | 'project'): 'WebPage' | 'Article' | 'BlogPosting' | 'CreativeWork' {
  switch (contentType) {
    case 'post':
      return 'BlogPosting';
    case 'page':
      return 'WebPage';
    case 'project':
      return 'CreativeWork';
    default:
      return 'WebPage';
  }
}

/**
 * Validates that schema types match content types
 */
export function validateSchemaTypeConsistency(content: ContentType): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content.seo?.schema?.type) {
    warnings.push(`No schema type specified for ${content.type}, will use default: ${getDefaultSchemaType(content.type)}`);
    return { valid: true, errors, warnings };
  }

  const expectedType = getDefaultSchemaType(content.type);
  const actualType = content.seo.schema.type;

  if (actualType !== expectedType) {
    warnings.push(`Schema type '${actualType}' for ${content.type} doesn't match expected '${expectedType}'`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Processes multiple content items with schema defaults
 */
export function enforceSchemaDefaultsBatch(
  contents: ContentType[],
  options: SchemaDefaultsOptions = {}
): {
  processed: ContentType[];
  summary: {
    total: number;
    processed: number;
    errors: number;
    warnings: number;
  };
} {
  const processed: ContentType[] = [];
  let errors = 0;
  let warnings = 0;

  for (const content of contents) {
    try {
      const result = enforceSchemaDefaults(content, options);
      processed.push(result);
    } catch (error) {
      errors++;
      console.error(`Error processing content ${content.slug}:`, error);
    }
  }

  // Validate consistency
  for (const content of processed) {
    const validation = validateSchemaTypeConsistency(content);
    warnings += validation.warnings.length;
    errors += validation.errors.length;
  }

  return {
    processed,
    summary: {
      total: contents.length,
      processed: processed.length,
      errors,
      warnings
    }
  };
}

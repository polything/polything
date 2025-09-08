/**
 * Comprehensive content validator for WordPress to Next.js migration
 * Ensures SEO title/description fallbacks work and validates field lengths
 */

import { ContentType, ProjectContent, PostContent, PageContent, SEOSchema } from './schema';
import { validateContentSchema } from './schema-validator';
import { validateFrontMatter } from './front-matter-writer';
import { validateMDXContent } from './html-to-mdx';
import { validateSlugs } from './slug-manager';

export interface ContentValidationOptions {
  enforceSEOFallbacks?: boolean;
  strictLengthValidation?: boolean;
  allowEmptyContent?: boolean;
  validateSlugConflicts?: boolean;
  validateMDXSyntax?: boolean;
}

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  seoFallbacks: {
    title: string | null;
    description: string | null;
    canonical: string | null;
  };
  fieldLengths: {
    title: number;
    seoTitle: number;
    seoDescription: number;
    content: number;
  };
}

/**
 * Validates content with comprehensive checks including SEO fallbacks
 * @param content - Content to validate
 * @param options - Validation options
 * @returns Comprehensive validation result
 */
export function validateContent(
  content: ContentType,
  options: ContentValidationOptions = {}
): ContentValidationResult {
  const {
    enforceSEOFallbacks = true,
    strictLengthValidation = true,
    allowEmptyContent = false,
    validateSlugConflicts = true,
    validateMDXSyntax = true
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const seoFallbacks = {
    title: null as string | null,
    description: null as string | null,
    canonical: null as string | null
  };

  // Step 1: Basic schema validation
  const schemaResult = validateContentSchema(content);
  errors.push(...schemaResult.errors);
  warnings.push(...schemaResult.warnings);

  // Step 2: Front-matter validation
  const frontMatterResult = validateFrontMatter(content);
  errors.push(...frontMatterResult.errors);
  warnings.push(...frontMatterResult.warnings);

  // Step 3: SEO fallback validation and generation
  if (enforceSEOFallbacks) {
    const seoResult = validateAndGenerateSEOFallbacks(content);
    errors.push(...seoResult.errors);
    warnings.push(...seoResult.warnings);
    Object.assign(seoFallbacks, seoResult.fallbacks);
  }

  // Step 4: Field length validation
  if (strictLengthValidation) {
    const lengthResult = validateFieldLengths(content);
    errors.push(...lengthResult.errors);
    warnings.push(...lengthResult.warnings);
  }

  // Step 5: Content validation
  if (content.content && validateMDXSyntax) {
    const mdxResult = validateMDXContent(content.content);
    errors.push(...mdxResult.errors);
    warnings.push(...mdxResult.warnings);
  }

  // Step 6: Check for empty content
  if (!allowEmptyContent && (!content.content || content.content.trim() === '')) {
    errors.push('Content body is empty');
  }

  // Step 7: Slug conflict validation (if multiple items provided)
  if (validateSlugConflicts && Array.isArray(content)) {
    const slugResult = validateSlugs(content);
    errors.push(...slugResult.errors);
    warnings.push(...slugResult.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    seoFallbacks,
    fieldLengths: calculateFieldLengths(content)
  };
}

/**
 * Validates and generates SEO fallbacks
 */
function validateAndGenerateSEOFallbacks(content: ContentType): {
  errors: string[];
  warnings: string[];
  fallbacks: {
    title: string | null;
    description: string | null;
    canonical: string | null;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fallbacks = {
    title: null as string | null,
    description: null as string | null,
    canonical: null as string | null
  };

  // Generate SEO title fallback
  if (!content.seo?.title || content.seo.title.trim() === '') {
    fallbacks.title = content.title;
    warnings.push('SEO title is missing, using content title as fallback');
  } else {
    fallbacks.title = content.seo.title;
  }

  // Generate SEO description fallback
  if (!content.seo?.description || content.seo.description.trim() === '') {
    // Try to extract description from content
    const extractedDescription = extractDescriptionFromContent(content.content);
    if (extractedDescription) {
      fallbacks.description = extractedDescription;
      warnings.push('SEO description is missing, extracted from content');
    } else {
      fallbacks.description = `Learn more about ${content.title}`;
      warnings.push('SEO description is missing, using generic fallback');
    }
  } else {
    fallbacks.description = content.seo.description;
  }

  // Generate canonical URL fallback
  if (!content.seo?.canonical || content.seo.canonical.trim() === '') {
    const baseUrl = getBaseUrlForContentType(content.type);
    fallbacks.canonical = `${baseUrl}/${content.slug}`;
    warnings.push('SEO canonical URL is missing, using generated fallback');
  } else {
    fallbacks.canonical = content.seo.canonical;
  }

  // Validate SEO field lengths
  if (fallbacks.title && fallbacks.title.length > 60) {
    warnings.push(`SEO title (${fallbacks.title.length} chars) exceeds recommended 60 characters`);
  }

  if (fallbacks.description && fallbacks.description.length > 160) {
    warnings.push(`SEO description (${fallbacks.description.length} chars) exceeds recommended 160 characters`);
  }

  if (fallbacks.description && fallbacks.description.length < 120) {
    warnings.push(`SEO description (${fallbacks.description.length} chars) is shorter than recommended 120 characters`);
  }

  return { errors, warnings, fallbacks };
}

/**
 * Validates field lengths according to best practices
 */
function validateFieldLengths(content: ContentType): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title length validation
  if (content.title) {
    if (content.title.length > 60) {
      warnings.push(`Title (${content.title.length} chars) is longer than recommended 60 characters`);
    }
  }

  // Content length validation
  if (content.content) {
    const wordCount = content.content.split(/\s+/).length;
    if (wordCount < 100) {
      warnings.push(`Content is short (${wordCount} words), consider adding more detail`);
    } else if (wordCount > 3000) {
      warnings.push(`Content is very long (${wordCount} words), consider breaking into multiple posts`);
    }
  }

  // Hero section validation
  if (content.hero) {
    if (content.hero.title && content.hero.title.length > 80) {
      warnings.push(`Hero title (${content.hero.title.length} chars) is longer than recommended 80 characters`);
    }
    
    if (content.hero.subtitle && content.hero.subtitle.length > 200) {
      warnings.push(`Hero subtitle (${content.hero.subtitle.length} chars) is longer than recommended 200 characters`);
    }
  }

  // Project links validation
  if (content.type === 'project' && (content as ProjectContent).links) {
    const links = (content as ProjectContent).links;
    for (const [key, url] of Object.entries(links)) {
      if (url && typeof url === 'string' && url.length > 200) {
        warnings.push(`Project link ${key} URL is very long (${url.length} chars)`);
      }
    }
  }

  return { errors, warnings };
}

/**
 * Calculates field lengths for reporting
 */
function calculateFieldLengths(content: ContentType): {
  title: number;
  seoTitle: number;
  seoDescription: number;
  content: number;
} {
  return {
    title: content.title?.length || 0,
    seoTitle: content.seo?.title?.length || 0,
    seoDescription: content.seo?.description?.length || 0,
    content: content.content?.length || 0
  };
}

/**
 * Extracts description from content body
 */
function extractDescriptionFromContent(content: string | undefined): string | null {
  if (!content) return null;

  // Remove HTML tags and get first paragraph
  const textContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  // Get first sentence or first 150 characters
  const firstSentence = textContent.split(/[.!?]/)[0];
  if (firstSentence && firstSentence.length >= 50 && firstSentence.length <= 160) {
    return firstSentence.trim();
  }

  // Fallback to first 150 characters
  if (textContent.length >= 50) {
    return textContent.substring(0, 150).trim() + (textContent.length > 150 ? '...' : '');
  }

  return null;
}

/**
 * Gets base URL for content type
 */
function getBaseUrlForContentType(type: string): string {
  const baseUrl = 'https://polything.co.uk';
  
  switch (type) {
    case 'post':
      return `${baseUrl}/blog`;
    case 'project':
      return `${baseUrl}/projects`;
    case 'page':
      return baseUrl;
    default:
      return baseUrl;
  }
}

/**
 * Validates multiple content items for batch processing
 */
export function validateContentBatch(
  contents: ContentType[],
  options: ContentValidationOptions = {}
): {
  valid: boolean;
  results: ContentValidationResult[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    totalErrors: number;
    totalWarnings: number;
  };
} {
  const results = contents.map(content => validateContent(content, options));
  
  const valid = results.filter(r => r.valid).length;
  const invalid = results.length - valid;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  return {
    valid: invalid === 0,
    results,
    summary: {
      total: contents.length,
      valid,
      invalid,
      totalErrors,
      totalWarnings
    }
  };
}

/**
 * Applies SEO fallbacks to content
 */
export function applySEOFallbacks(content: ContentType): ContentType {
  const result = { ...content };
  
  // Ensure SEO section exists
  if (!result.seo) {
    result.seo = {};
  }

  // Apply title fallback
  if (!result.seo.title || result.seo.title.trim() === '') {
    result.seo.title = result.title;
  }

  // Apply description fallback
  if (!result.seo.description || result.seo.description.trim() === '') {
    const extractedDescription = extractDescriptionFromContent(result.content);
    result.seo.description = extractedDescription || `Learn more about ${result.title}`;
  }

  // Apply canonical fallback
  if (!result.seo.canonical || result.seo.canonical.trim() === '') {
    const baseUrl = getBaseUrlForContentType(result.type);
    result.seo.canonical = `${baseUrl}/${result.slug}`;
  }

  return result;
}

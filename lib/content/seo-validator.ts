/**
 * SEO Content Validation Utilities
 * Ensures SEO title/description fallbacks work and validates field lengths
 */

import { ContentType, SEOSchema } from './schema'

export interface SEOValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  fallbacks: {
    title: string | null
    description: string | null
    canonical: string | null
  }
}

export interface SEOValidationOptions {
  enforceFallbacks?: boolean
  strictLengthValidation?: boolean
  maxTitleLength?: number
  minTitleLength?: number
  maxDescriptionLength?: number
  minDescriptionLength?: number
}

/**
 * Validates and generates SEO fallbacks for content
 */
export function validateAndGenerateSEOFallbacks(
  content: ContentType,
  options: SEOValidationOptions = {}
): SEOValidationResult {
  const {
    enforceFallbacks = true,
    strictLengthValidation = true,
    maxTitleLength = 60,
    minTitleLength = 30,
    maxDescriptionLength = 160,
    minDescriptionLength = 120
  } = options

  const errors: string[] = []
  const warnings: string[] = []
  const fallbacks = {
    title: null as string | null,
    description: null as string | null,
    canonical: null as string | null
  }

  // Generate title fallback
  fallbacks.title = generateTitleFallback(content)
  if (!fallbacks.title) {
    errors.push('No title available for SEO fallback')
  }

  // Generate description fallback
  fallbacks.description = generateDescriptionFallback(content)
  if (!fallbacks.description && enforceFallbacks) {
    warnings.push('No description available for SEO fallback')
  }

  // Generate canonical fallback
  fallbacks.canonical = generateCanonicalFallback(content)

  // Validate SEO title length
  if (strictLengthValidation && fallbacks.title) {
    if (fallbacks.title.length > maxTitleLength) {
      warnings.push(`SEO title too long: ${fallbacks.title.length} characters. Recommended max: ${maxTitleLength}.`)
    }
    if (fallbacks.title.length < minTitleLength) {
      warnings.push(`SEO title too short: ${fallbacks.title.length} characters. Recommended min: ${minTitleLength}.`)
    }
  }

  // Validate SEO description length
  if (strictLengthValidation && fallbacks.description) {
    if (fallbacks.description.length > maxDescriptionLength) {
      warnings.push(`SEO description too long: ${fallbacks.description.length} characters. Recommended max: ${maxDescriptionLength}.`)
    }
    if (fallbacks.description.length < minDescriptionLength) {
      warnings.push(`SEO description too short: ${fallbacks.description.length} characters. Recommended min: ${minDescriptionLength}.`)
    }
  }

  // Validate custom SEO fields if present
  if (content.seo) {
    validateCustomSEOFields(content.seo, errors, warnings, {
      maxTitleLength,
      minTitleLength,
      maxDescriptionLength,
      minDescriptionLength
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fallbacks
  }
}

/**
 * Generates title fallback from content
 */
function generateTitleFallback(content: ContentType): string | null {
  // Priority: seo.title > hero.title > title
  if (content.seo?.title) {
    return content.seo.title
  }
  
  if (content.hero?.title) {
    return content.hero.title
  }
  
  if (content.title) {
    return content.title
  }
  
  return null
}

/**
 * Generates description fallback from content
 */
function generateDescriptionFallback(content: ContentType): string | null {
  // Priority: seo.description > excerpt > hero.subtitle > truncated content
  if (content.seo?.description) {
    return content.seo.description
  }
  
  // Note: excerpt would come from WordPress content, not in our current schema
  // This would be added during the transformation process
  
  if (content.hero?.subtitle) {
    return content.hero.subtitle
  }
  
  // If we had content body, we could truncate it
  // This would be implemented during the MDX transformation
  
  return null
}

/**
 * Generates canonical URL fallback
 */
function generateCanonicalFallback(content: ContentType): string | null {
  if (content.seo?.canonical) {
    return content.seo.canonical
  }
  
  // Generate based on content type and slug
  const baseUrl = 'https://polything.co.uk'
  const path = content.type === 'project' ? `/work/${content.slug}` :
               content.type === 'post' ? `/blog/${content.slug}` :
               `/${content.slug}`
  
  return `${baseUrl}${path}`
}

/**
 * Validates custom SEO fields
 */
function validateCustomSEOFields(
  seo: SEOSchema,
  errors: string[],
  warnings: string[],
  options: {
    maxTitleLength: number
    minTitleLength: number
    maxDescriptionLength: number
    minDescriptionLength: number
  }
): void {
  const { maxTitleLength, minTitleLength, maxDescriptionLength, minDescriptionLength } = options

  // Validate title
  if (seo.title) {
    if (seo.title.length > maxTitleLength) {
      warnings.push(`Custom SEO title too long: ${seo.title.length} characters. Recommended max: ${maxTitleLength}.`)
    }
    if (seo.title.length < minTitleLength) {
      warnings.push(`Custom SEO title too short: ${seo.title.length} characters. Recommended min: ${minTitleLength}.`)
    }
  }

  // Validate description
  if (seo.description) {
    if (seo.description.length > maxDescriptionLength) {
      warnings.push(`Custom SEO description too long: ${seo.description.length} characters. Recommended max: ${maxDescriptionLength}.`)
    }
    if (seo.description.length < minDescriptionLength) {
      warnings.push(`Custom SEO description too short: ${seo.description.length} characters. Recommended min: ${minDescriptionLength}.`)
    }
  }

  // Validate canonical URL
  if (seo.canonical && !isValidURL(seo.canonical)) {
    errors.push(`Invalid canonical URL format: ${seo.canonical}`)
  }

  // Validate schema fields
  if (seo.schema) {
    validateSchemaFields(seo.schema, errors, warnings)
  }
}

/**
 * Validates schema fields
 */
function validateSchemaFields(
  schema: SEOSchema['schema'],
  errors: string[],
  warnings: string[]
): void {
  if (!schema) return

  // Validate schema type
  const validTypes = ['WebPage', 'Article', 'BlogPosting', 'CreativeWork']
  if (schema.type && !validTypes.includes(schema.type)) {
    errors.push(`Invalid schema type: ${schema.type}. Must be one of: ${validTypes.join(', ')}`)
  }

  // Validate dates
  if (schema.publishDate && !isValidISODate(schema.publishDate)) {
    errors.push(`Invalid publishDate format: ${schema.publishDate}. Must be ISO 8601 format.`)
  }

  if (schema.modifiedDate && !isValidISODate(schema.modifiedDate)) {
    errors.push(`Invalid modifiedDate format: ${schema.modifiedDate}. Must be ISO 8601 format.`)
  }

  // Validate image URL
  if (schema.image && !isValidImagePath(schema.image)) {
    warnings.push(`Invalid schema image path: ${schema.image}. Expected /images/* path or full URL.`)
  }

  // Validate breadcrumbs
  if (schema.breadcrumbs) {
    validateBreadcrumbs(schema.breadcrumbs, errors, warnings)
  }
}

/**
 * Validates breadcrumbs structure
 */
function validateBreadcrumbs(
  breadcrumbs: Array<{ name: string; url: string }>,
  errors: string[],
  warnings: string[]
): void {
  if (!Array.isArray(breadcrumbs)) {
    errors.push('Breadcrumbs must be an array')
    return
  }

  for (let i = 0; i < breadcrumbs.length; i++) {
    const crumb = breadcrumbs[i]
    
    if (!crumb.name || !crumb.url) {
      errors.push(`Breadcrumb ${i + 1} missing name or url`)
    }
    
    if (crumb.url && !isValidURL(crumb.url)) {
      warnings.push(`Invalid breadcrumb URL: ${crumb.url}`)
    }
  }
}

/**
 * Enforces schema type defaults based on content type
 */
export function enforceSchemaTypeDefaults(content: ContentType): ContentType {
  const result = { ...content }

  // Ensure SEO section exists
  if (!result.seo) {
    result.seo = {}
  }

  // Ensure schema section exists
  if (!result.seo.schema) {
    result.seo.schema = {}
  }

  // Set default schema type if not specified
  if (!result.seo.schema.type) {
    result.seo.schema.type = getDefaultSchemaType(result.type)
  }

  return result
}

/**
 * Gets default schema type for content type
 */
function getDefaultSchemaType(contentType: string): 'WebPage' | 'Article' | 'BlogPosting' | 'CreativeWork' {
  switch (contentType) {
    case 'project':
      return 'CreativeWork'
    case 'post':
      return 'BlogPosting'
    case 'page':
    default:
      return 'WebPage'
  }
}

// Utility functions
function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

function isValidImagePath(path: string): boolean {
  return path.startsWith('/images/') || path.startsWith('http')
}

/**
 * Comprehensive validation runner for WordPress to Next.js migration
 * Orchestrates all validation functions and provides detailed reporting
 */

import { ContentType } from './schema';
import { validateContent, ContentValidationOptions } from './content-validator';
import { validateMDXContent } from './html-to-mdx';
import { validateContentSchema } from './schema-validator';
import { validateFrontMatter } from './front-matter-writer';
import { validateSlugs } from './slug-manager';
import { validateSchemaTypeConsistency } from './schema-defaults-enforcer';
import { sanitizeHTMLContent, SanitizationOptions } from './html-sanitizer';

export interface ValidationRunnerOptions {
  // Content validation options
  contentValidation?: ContentValidationOptions;
  
  // Sanitization options
  sanitization?: SanitizationOptions;
  
  // Validation flags
  validateSchema?: boolean;
  validateFrontMatter?: boolean;
  validateMDX?: boolean;
  validateSlugs?: boolean;
  validateSchemaTypes?: boolean;
  sanitizeHTML?: boolean;
  
  // Reporting options
  includeWarnings?: boolean;
  includeMetadata?: boolean;
  stopOnFirstError?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata: {
    contentType: string;
    slug: string;
    title: string;
    validationTime: number;
    checksPerformed: string[];
  };
}

export interface BatchValidationResult {
  valid: boolean;
  results: ValidationResult[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    totalErrors: number;
    totalWarnings: number;
    validationTime: number;
    checksPerformed: string[];
  };
}

/**
 * Runs comprehensive validation on a single content item
 * @param content - Content to validate
 * @param options - Validation options
 * @returns Detailed validation result
 */
export function runContentValidation(
  content: ContentType,
  options: ValidationRunnerOptions = {}
): ValidationResult {
  const startTime = Date.now();
  const {
    contentValidation = {},
    sanitization = {},
    validateSchema = true,
    validateFrontMatter: shouldValidateFrontMatter = true,
    validateMDX = true,
    validateSlugs = false, // Usually done in batch
    validateSchemaTypes = true,
    sanitizeHTML = false,
    includeWarnings = true,
    includeMetadata = true,
    stopOnFirstError = false
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const checksPerformed: string[] = [];

  try {
    // Step 1: Sanitize HTML content if requested
    if (sanitizeHTML && content.content) {
      checksPerformed.push('HTML sanitization');
      const sanitizationResult = sanitizeHTMLContent(content.content, sanitization);
      if (sanitizationResult.errors.length > 0) {
        errors.push(...sanitizationResult.errors);
        if (stopOnFirstError) {
          return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
        }
      }
      if (includeWarnings) {
        warnings.push(...sanitizationResult.warnings);
      }
    }

    // Step 2: Schema validation
    if (validateSchema) {
      checksPerformed.push('Schema validation');
      const schemaResult = validateContentSchema(content);
      if (schemaResult.errors.length > 0) {
        errors.push(...schemaResult.errors);
        if (stopOnFirstError) {
          return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
        }
      }
      if (includeWarnings) {
        warnings.push(...schemaResult.warnings);
      }
    }

    // Step 3: Front-matter validation
    if (shouldValidateFrontMatter) {
      checksPerformed.push('Front-matter validation');
      const frontMatterResult = validateFrontMatter(content);
      if (frontMatterResult.errors.length > 0) {
        errors.push(...frontMatterResult.errors);
        if (stopOnFirstError) {
          return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
        }
      }
      if (includeWarnings) {
        warnings.push(...frontMatterResult.warnings);
      }
    }

    // Step 4: Schema type consistency validation
    if (validateSchemaTypes) {
      checksPerformed.push('Schema type validation');
      const schemaTypeResult = validateSchemaTypeConsistency(content);
      if (schemaTypeResult.errors.length > 0) {
        errors.push(...schemaTypeResult.errors);
        if (stopOnFirstError) {
          return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
        }
      }
      if (includeWarnings) {
        warnings.push(...schemaTypeResult.warnings);
      }
    }

    // Step 5: MDX validation
    if (validateMDX && content.content) {
      checksPerformed.push('MDX validation');
      const mdxResult = validateMDXContent(content.content);
      if (mdxResult.errors.length > 0) {
        errors.push(...mdxResult.errors);
        if (stopOnFirstError) {
          return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
        }
      }
      if (includeWarnings) {
        warnings.push(...mdxResult.warnings);
      }
    }

    // Step 6: Comprehensive content validation
    checksPerformed.push('Comprehensive content validation');
    const contentResult = validateContent(content, contentValidation);
    if (contentResult.errors.length > 0) {
      errors.push(...contentResult.errors);
      if (stopOnFirstError) {
        return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
      }
    }
    if (includeWarnings) {
      warnings.push(...contentResult.warnings);
    }

    // Step 7: Slug validation (if multiple items provided)
    if (validateSlugs && Array.isArray(content)) {
      checksPerformed.push('Slug conflict validation');
      const slugResult = validateSlugs(content);
      if (slugResult.errors.length > 0) {
        errors.push(...slugResult.errors);
        if (stopOnFirstError) {
          return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
        }
      }
      if (includeWarnings) {
        warnings.push(...slugResult.warnings);
      }
    }

  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
}

/**
 * Runs validation on multiple content items
 * @param contents - Array of content items to validate
 * @param options - Validation options
 * @returns Batch validation result
 */
export function runBatchValidation(
  contents: ContentType[],
  options: ValidationRunnerOptions = {}
): BatchValidationResult {
  const startTime = Date.now();
  const results: ValidationResult[] = [];
  
  // First, run individual validations
  for (const content of contents) {
    const result = runContentValidation(content, options);
    results.push(result);
  }

  // Then, run slug conflict validation if requested
  if (options.validateSlugs !== false) {
    const slugResult = validateSlugs(contents);
    // Add slug validation results to all items
    results.forEach(result => {
      result.errors.push(...slugResult.errors);
      if (options.includeWarnings !== false) {
        result.warnings.push(...slugResult.warnings);
      }
      result.metadata.checksPerformed.push('Slug conflict validation');
    });
  }

  // Calculate summary
  const valid = results.filter(r => r.valid).length;
  const invalid = results.length - valid;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const validationTime = Date.now() - startTime;

  // Get all unique checks performed
  const allChecks = new Set<string>();
  results.forEach(result => {
    result.metadata.checksPerformed.forEach(check => allChecks.add(check));
  });

  return {
    valid: invalid === 0,
    results,
    summary: {
      total: contents.length,
      valid,
      invalid,
      totalErrors,
      totalWarnings,
      validationTime,
      checksPerformed: Array.from(allChecks)
    }
  };
}

/**
 * Validates YAML front-matter syntax
 * @param yamlContent - YAML content to validate
 * @returns Validation result
 */
export function validateYAMLSyntax(yamlContent: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!yamlContent || typeof yamlContent !== 'string') {
    errors.push('YAML content is empty or invalid');
    return { valid: false, errors, warnings };
  }

  try {
    // Basic YAML syntax checks
    const lines = yamlContent.split('\n');
    
    // Check for proper YAML front-matter delimiters
    if (!yamlContent.startsWith('---')) {
      errors.push('YAML front-matter must start with ---');
    }
    
    if (!yamlContent.includes('\n---\n') && !yamlContent.endsWith('\n---')) {
      errors.push('YAML front-matter must end with ---');
    }

    // Check for common YAML issues
    let indentLevel = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Skip empty lines and comments
      if (line.trim() === '' || line.trim().startsWith('#')) {
        continue;
      }

      // Skip YAML delimiters
      if (line.trim() === '---') {
        continue;
      }

      // Check for proper indentation
      const currentIndent = line.match(/^(\s*)/)?.[1]?.length || 0;
      
      if (currentIndent > 0 && currentIndent % 2 !== 0) {
        warnings.push(`Line ${lineNumber}: YAML should use 2-space indentation`);
      }

      // Check for common YAML syntax issues
      if (line.includes(':') && !line.includes('"') && !line.includes("'")) {
        const colonIndex = line.indexOf(':');
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        // Check for unquoted strings that might need quotes
        if (value && !value.match(/^[a-zA-Z0-9\-_]+$/) && !value.startsWith('[') && !value.startsWith('{')) {
          if (value.includes(' ') || value.includes(':') || value.includes('#')) {
            warnings.push(`Line ${lineNumber}: Consider quoting value for key "${key}"`);
          }
        }
      }

      // Check for duplicate keys (basic check)
      const keyMatch = line.match(/^(\s*)([^:]+):/);
      if (keyMatch) {
        const key = keyMatch[2].trim();
        const otherLines = lines.slice(0, i).filter(l => l.includes(`${key}:`));
        if (otherLines.length > 0) {
          warnings.push(`Line ${lineNumber}: Potential duplicate key "${key}"`);
        }
      }
    }

  } catch (error) {
    errors.push(`YAML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Creates a validation result object
 */
function createValidationResult(
  content: ContentType,
  errors: string[],
  warnings: string[],
  checksPerformed: string[],
  startTime: number,
  includeWarnings: boolean,
  includeMetadata: boolean
): ValidationResult {
  const validationTime = Date.now() - startTime;
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: includeWarnings ? warnings : [],
    metadata: includeMetadata ? {
      contentType: content.type,
      slug: content.slug,
      title: content.title,
      validationTime,
      checksPerformed
    } : {
      contentType: content.type,
      slug: content.slug,
      title: content.title,
      validationTime: 0,
      checksPerformed: []
    }
  };
}

/**
 * Generates a detailed validation report
 * @param result - Validation result
 * @returns Formatted report string
 */
export function generateValidationReport(result: ValidationResult | BatchValidationResult): string {
  if ('results' in result) {
    // Batch validation result
    const batchResult = result as BatchValidationResult;
    const report = [
      '=== BATCH VALIDATION REPORT ===',
      `Total Items: ${batchResult.summary.total}`,
      `Valid: ${batchResult.summary.valid}`,
      `Invalid: ${batchResult.summary.invalid}`,
      `Total Errors: ${batchResult.summary.totalErrors}`,
      `Total Warnings: ${batchResult.summary.totalWarnings}`,
      `Validation Time: ${batchResult.summary.validationTime}ms`,
      `Checks Performed: ${batchResult.summary.checksPerformed.join(', ')}`,
      '',
      '=== DETAILED RESULTS ==='
    ];

    batchResult.results.forEach((itemResult, index) => {
      report.push(`\n${index + 1}. ${itemResult.metadata.title} (${itemResult.metadata.contentType})`);
      report.push(`   Slug: ${itemResult.metadata.slug}`);
      report.push(`   Valid: ${itemResult.valid ? 'Yes' : 'No'}`);
      report.push(`   Validation Time: ${itemResult.metadata.validationTime}ms`);
      
      if (itemResult.errors.length > 0) {
        report.push(`   Errors (${itemResult.errors.length}):`);
        itemResult.errors.forEach(error => report.push(`     - ${error}`));
      }
      
      if (itemResult.warnings.length > 0) {
        report.push(`   Warnings (${itemResult.warnings.length}):`);
        itemResult.warnings.forEach(warning => report.push(`     - ${warning}`));
      }
    });

    return report.join('\n');
  } else {
    // Single validation result
    const singleResult = result as ValidationResult;
    const report = [
      '=== VALIDATION REPORT ===',
      `Title: ${singleResult.metadata.title}`,
      `Type: ${singleResult.metadata.contentType}`,
      `Slug: ${singleResult.metadata.slug}`,
      `Valid: ${singleResult.valid ? 'Yes' : 'No'}`,
      `Validation Time: ${singleResult.metadata.validationTime}ms`,
      `Checks Performed: ${singleResult.metadata.checksPerformed.join(', ')}`,
      ''
    ];

    if (singleResult.errors.length > 0) {
      report.push(`Errors (${singleResult.errors.length}):`);
      singleResult.errors.forEach(error => report.push(`  - ${error}`));
      report.push('');
    }

    if (singleResult.warnings.length > 0) {
      report.push(`Warnings (${singleResult.warnings.length}):`);
      singleResult.warnings.forEach(warning => report.push(`  - ${warning}`));
    }

    return report.join('\n');
  }
}

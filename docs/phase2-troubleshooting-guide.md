# Phase 2: Field Mapping vs Design System - Troubleshooting Guide

**Date:** 2025-01-27  
**Status:** Completed  
**Agent:** Agent A (Exporter/Backend)  

## Common Issues and Solutions

### 1. Schema Validation Issues

#### Problem: "Missing or empty required field" errors
**Symptoms:**
- Validation fails with missing field errors
- Content appears incomplete

**Solutions:**
```typescript
// Check if fields are properly mapped from WordPress
const content = {
  title: wpPost.title?.rendered || 'Untitled',
  slug: wpPost.slug || generateSlugFromTitle(wpPost.title?.rendered),
  type: determineContentType(wpPost.type),
  // Ensure all required fields are present
};

// Use schema defaults enforcer
import { enforceSchemaDefaults } from './lib/content/schema-defaults-enforcer';
const processedContent = enforceSchemaDefaults(content);
```

#### Problem: "Invalid date format" errors
**Symptoms:**
- Date validation fails
- ISO 8601 format errors

**Solutions:**
```typescript
// Ensure dates are in proper ISO format
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toISOString();
  } catch (error) {
    console.warn(`Invalid date: ${dateString}`);
    return new Date().toISOString();
  }
};

// Use in content processing
const content = {
  date: formatDate(wpPost.date),
  updated: formatDate(wpPost.modified),
  // ... other fields
};
```

### 2. Field Mapping Issues

#### Problem: themerain_* fields not mapping correctly
**Symptoms:**
- Custom fields missing from output
- Incorrect field values

**Solutions:**
```javascript
// Check WordPress REST API response
const response = await fetch(`${wpApiUrl}/posts/${postId}`);
const post = await response.json();

// Verify themerain_* fields are present
console.log('Meta fields:', post.meta);

// Use field mapper with proper options
import { mapThemerainFields } from './lib/content/field-mapper.js';

const mappedFields = mapThemerainFields(post.meta, {
  includeThemeMeta: true,
  seoDefaults: {
    title: post.title?.rendered,
    description: extractDescription(post.content?.rendered)
  }
});
```

#### Problem: SEO fields not generating
**Symptoms:**
- Missing SEO metadata
- Empty SEO blocks

**Solutions:**
```typescript
// Ensure SEO defaults are provided
const seoDefaults = {
  title: content.title,
  description: extractDescription(content.content),
  canonical: generateCanonicalUrl(content.type, content.slug)
};

// Use content validator with SEO fallbacks
import { validateContent } from './lib/content/content-validator';

const result = validateContent(content, {
  enforceSEOFallbacks: true,
  strictLengthValidation: true
});
```

### 3. Media Resolution Issues

#### Problem: Media URLs not resolving
**Symptoms:**
- Broken image links
- Media not found errors

**Solutions:**
```typescript
// Check media resolution
import { resolveMediaIds } from './lib/content/media-resolver';

const mediaResult = await resolveMediaIds(mediaIds, {
  baseUrl: 'https://polything.co.uk',
  localPath: '/images'
});

// Verify media URLs are accessible
const checkMediaUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};
```

#### Problem: Media IDs not extracting from content
**Symptoms:**
- Images not converted to local paths
- WordPress URLs still present

**Solutions:**
```typescript
// Use media resolver to extract and convert
import { extractMediaIdsFromContent, updateContentWithResolvedMedia } from './lib/content/media-resolver';

const mediaIds = extractMediaIdsFromContent(content);
const resolvedMedia = await resolveMediaIds(mediaIds);
const updatedContent = updateContentWithResolvedMedia(content, resolvedMedia);
```

### 4. Slug Management Issues

#### Problem: Slug conflicts not resolved
**Symptoms:**
- Duplicate slugs
- URL conflicts

**Solutions:**
```typescript
// Use slug manager for conflict resolution
import { resolveSlugConflicts } from './lib/content/slug-manager';

const resolvedSlugs = resolveSlugConflicts(contentItems);
console.log('Slug resolution report:', resolvedSlugs.report);
```

#### Problem: Invalid slug formats
**Symptoms:**
- Slug validation errors
- Special characters in slugs

**Solutions:**
```typescript
// Normalize slugs properly
import { normalizeSlug, generateSlugFromTitle } from './lib/content/slug-manager';

const normalizedSlug = normalizeSlug(wpPost.slug);
const generatedSlug = generateSlugFromTitle(wpPost.title?.rendered);
```

### 5. HTML to MDX Conversion Issues

#### Problem: HTML not converting to MDX
**Symptoms:**
- HTML tags remaining in output
- MDX syntax errors

**Solutions:**
```typescript
// Use HTML to MDX converter with proper options
import { convertHTMLToMDX } from './lib/content/html-to-mdx';

const mdxResult = convertHTMLToMDX(htmlContent, {
  preserveEmbeds: true,
  preserveImages: true,
  preserveHeadings: true,
  removeWordPressClasses: true,
  convertToMDX: true
});

// Check for conversion errors
if (mdxResult.errors.length > 0) {
  console.error('MDX conversion errors:', mdxResult.errors);
}
```

#### Problem: WordPress artifacts not removed
**Symptoms:**
- WordPress classes still present
- Block comments remaining

**Solutions:**
```typescript
// Use HTML sanitizer
import { sanitizeHTMLContent } from './lib/content/html-sanitizer';

const sanitizedContent = sanitizeHTMLContent(htmlContent, {
  removeWordPressClasses: true,
  fixBrokenLinks: true,
  removeEmptyElements: true,
  normalizeWhitespace: true
});
```

### 6. Validation Runner Issues

#### Problem: "validateFrontMatter is not a function" error
**Symptoms:**
- Import/export errors
- Function not found

**Solutions:**
```typescript
// Check import statements
import { validateFrontMatter } from './lib/content/front-matter-writer';

// Verify function is exported
console.log(typeof validateFrontMatter); // Should be 'function'

// Check for naming conflicts in validation runner
const {
  validateFrontMatter: shouldValidateFrontMatter = true, // Rename to avoid conflict
  // ... other options
} = options;
```

#### Problem: Validation not stopping on first error
**Symptoms:**
- Multiple errors when stopOnFirstError is true
- Validation continues after errors

**Solutions:**
```typescript
// Check validation logic
if (stopOnFirstError && errors.length > 0) {
  return createValidationResult(content, errors, warnings, checksPerformed, startTime, includeWarnings, includeMetadata);
}

// Ensure early returns are properly implemented
```

### 7. Export Reporting Issues

#### Problem: Report generation fails
**Symptoms:**
- Export report not generated
- Missing statistics

**Solutions:**
```typescript
// Check validation results
const report = generateExportReport(validationResults);
if (!report) {
  console.error('Failed to generate report');
  return;
}

// Verify report structure
console.log('Report summary:', report.summary);
console.log('Report details:', report.details);
```

#### Problem: Report formatting issues
**Symptoms:**
- Malformed text/markdown output
- Missing sections

**Solutions:**
```typescript
// Use proper formatting functions
const textReport = formatReportAsText(report);
const markdownReport = formatReportAsMarkdown(report);

// Check for empty results
if (report.details.successful.length === 0 && report.details.failed.length === 0) {
  console.warn('No content items to report on');
}
```

## Debugging Techniques

### 1. Enable Debug Logging

```typescript
// Add debug logging to validation
const result = runContentValidation(content, {
  includeWarnings: true,
  includeMetadata: true
});

console.log('Validation result:', JSON.stringify(result, null, 2));
```

### 2. Check Intermediate Results

```typescript
// Check each step of the transformation pipeline
const mappedFields = mapThemerainFields(wpMeta);
console.log('Mapped fields:', mappedFields);

const resolvedMedia = await resolveMediaIds(mediaIds);
console.log('Resolved media:', resolvedMedia);

const sanitizedHTML = sanitizeHTMLContent(htmlContent);
console.log('Sanitized HTML:', sanitizedHTML);
```

### 3. Validate Schema Manually

```typescript
// Test schema validation independently
import { validateContentSchema } from './lib/content/schema-validator';

const schemaResult = validateContentSchema(content);
console.log('Schema validation:', schemaResult);
```

### 4. Test Individual Components

```typescript
// Test each component separately
import { convertHTMLToMDX } from './lib/content/html-to-mdx';
import { validateMDXContent } from './lib/content/html-to-mdx';

const mdxResult = convertHTMLToMDX(htmlContent);
const mdxValidation = validateMDXContent(mdxResult.content);
console.log('MDX conversion:', mdxResult);
console.log('MDX validation:', mdxValidation);
```

## Performance Issues

### 1. Large Content Sets

**Problem:** Slow processing with many content items

**Solutions:**
```typescript
// Use batch processing with limits
const batchSize = 10;
const batches = chunkArray(contentItems, batchSize);

for (const batch of batches) {
  const result = runBatchValidation(batch);
  // Process results
}

// Use streaming for large datasets
const processContentStream = async function* (contentStream) {
  for await (const content of contentStream) {
    yield runContentValidation(content);
  }
};
```

### 2. Memory Issues

**Problem:** High memory usage with large content

**Solutions:**
```typescript
// Process content in smaller chunks
const processInChunks = (items, chunkSize = 5) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
};

// Clear references after processing
const processContent = (content) => {
  const result = runContentValidation(content);
  // Clear large objects
  content.content = null;
  return result;
};
```

## Testing Issues

### 1. Test Failures

**Problem:** Tests failing unexpectedly

**Solutions:**
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test lib/content/schema-validator.test.ts

# Run tests with coverage
npm test -- --coverage
```

### 2. Mock Data Issues

**Problem:** Tests failing due to mock data

**Solutions:**
```typescript
// Use realistic mock data
const mockContent = {
  title: 'Test Content',
  slug: 'test-content',
  type: 'project',
  date: '2024-01-01T00:00:00Z',
  updated: '2024-01-02T00:00:00Z',
  categories: [1],
  tags: [1, 2],
  featured: true,
  hero: {
    title: 'Hero Title'
  },
  links: {
    url: 'https://example.com'
  },
  content: 'Test content with **bold** and *italic* formatting.',
  seo: {
    title: 'SEO Title',
    description: 'SEO Description',
    canonical: 'https://example.com/test-content'
  }
};
```

## Getting Help

### 1. Check Logs

```bash
# Check application logs
tail -f logs/application.log

# Check error logs
tail -f logs/error.log
```

### 2. Enable Debug Mode

```typescript
// Set debug environment variable
process.env.DEBUG = 'content:*';

// Or enable specific debug namespaces
process.env.DEBUG = 'content:validation,content:mapping';
```

### 3. Use Development Tools

```bash
# Run with Node.js debugger
node --inspect scripts/wp-export.mjs

# Use VS Code debugger
# Set breakpoints in validation functions
```

### 4. Check Documentation

- `docs/phase2-implementation-guide.md` - Implementation details
- `docs/wordpress-migration-technical-spec.md` - Technical specifications
- `docs/field-mapping-guide.md` - Field mapping reference

## Common Error Messages

### Schema Validation Errors
- `"Missing or empty required field: title"` - Title field is missing or empty
- `"Invalid slug format"` - Slug contains invalid characters
- `"Invalid date format"` - Date is not in ISO 8601 format
- `"SEO description too short"` - SEO description is below minimum length

### Field Mapping Errors
- `"Failed to map themerain fields"` - WordPress meta fields not found
- `"Invalid field type"` - Field type doesn't match expected schema
- `"Missing required field mapping"` - Required field not mapped

### Media Resolution Errors
- `"Media ID not found"` - Media ID doesn't exist in WordPress
- `"Failed to resolve media URL"` - Media URL is inaccessible
- `"Invalid media path"` - Generated local path is invalid

### Validation Errors
- `"Unclosed code block detected"` - MDX has unclosed code blocks
- `"Invalid YAML syntax"` - Front-matter YAML is malformed
- `"Slug conflict detected"` - Multiple items have the same slug

## Best Practices

### 1. Error Handling
- Always wrap validation in try-catch blocks
- Provide meaningful error messages
- Log errors for debugging

### 2. Performance
- Use batch processing for large datasets
- Implement caching for repeated operations
- Monitor memory usage

### 3. Testing
- Write comprehensive tests for all components
- Use realistic mock data
- Test edge cases and error conditions

### 4. Documentation
- Document all configuration options
- Provide usage examples
- Keep troubleshooting guides updated

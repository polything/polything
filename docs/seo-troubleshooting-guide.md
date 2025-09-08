# SEO Troubleshooting Guide

**Date:** 2025-01-08  
**Status:** Complete  
**Phase:** 3 - SEO & Content Implementation  

## Common Issues and Solutions

### JSON-LD Structured Data Issues

#### Issue: Missing JSON-LD on Pages
**Symptoms:**
- No structured data appears in page source
- Google Rich Results Test shows no structured data
- Schema validation tools report missing data

**Causes:**
- `generateAllJsonLd` not called in page component
- Missing required content fields
- Incorrect schema type assignment

**Solutions:**
```typescript
// Ensure generateAllJsonLd is called
const jsonLdArray = generateAllJsonLd('https://polything.co.uk', page)

// Check required fields are present
if (!page.title || !page.url) {
  console.error('Missing required fields for JSON-LD generation')
}

// Verify schema type is assigned
const schemaType = page.seo?.schema?.type || getDefaultSchemaType(page.type)
```

#### Issue: Invalid JSON-LD Structure
**Symptoms:**
- JSON-LD validation errors
- Malformed structured data
- Missing required schema fields

**Causes:**
- Missing required fields for schema type
- Incorrect field mapping
- Invalid data types

**Solutions:**
```typescript
// Validate required fields before generation
const requiredFields = {
  'WebPage': ['name', 'url'],
  'BlogPosting': ['headline', 'url', 'datePublished'],
  'CreativeWork': ['name', 'url', 'creator']
}

// Check field presence
const missingFields = requiredFields[schemaType].filter(field => !page[field])
if (missingFields.length > 0) {
  console.warn(`Missing required fields for ${schemaType}:`, missingFields)
}
```

#### Issue: BreadcrumbList Not Rendering
**Symptoms:**
- Breadcrumbs not appearing in search results
- BreadcrumbList JSON-LD missing
- Navigation structure not reflected

**Causes:**
- Missing `seo.schema.breadcrumbs` in content
- Invalid breadcrumb structure
- BreadcrumbList not included in JSON-LD generation

**Solutions:**
```typescript
// Ensure breadcrumbs are present and valid
if (page.seo?.schema?.breadcrumbs) {
  const breadcrumbs = page.seo.schema.breadcrumbs
  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    const breadcrumbJsonLd = breadcrumbsJsonLd('https://polything.co.uk', breadcrumbs)
    jsonLdArray.push(breadcrumbJsonLd)
  }
}
```

### Metadata Generation Issues

#### Issue: Missing Meta Tags
**Symptoms:**
- No title or description in page head
- Missing OpenGraph tags
- No Twitter Card metadata

**Causes:**
- `generateMetadata` not called or exported
- Missing required parameters
- Invalid metadata configuration

**Solutions:**
```typescript
// Ensure generateMetadata is properly exported
export async function generateMetadata({ params }) {
  const page = await getPage(params.slug)
  return generatePageMetadata(page, {
    baseUrl: 'https://polything.co.uk',
    siteName: 'Polything',
    defaultDescription: 'Strategic Marketing for Visionary Brands'
  })
}

// Check metadata configuration
const metadata = generatePageMetadata(page, options)
console.log('Generated metadata:', metadata)
```

#### Issue: Title/Description Too Long
**Symptoms:**
- Titles truncated in search results
- Descriptions cut off
- SEO validation warnings

**Causes:**
- Content exceeds optimal lengths
- No length validation
- Missing fallback truncation

**Solutions:**
```typescript
// Implement length validation
const validateMetadata = (metadata) => {
  const warnings = []
  
  if (metadata.title && metadata.title.length > 60) {
    warnings.push(`Title too long: ${metadata.title.length} characters`)
  }
  
  if (metadata.description && metadata.description.length > 160) {
    warnings.push(`Description too long: ${metadata.description.length} characters`)
  }
  
  return warnings
}

// Truncate if necessary
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text
}
```

#### Issue: Canonical URL Problems
**Symptoms:**
- Duplicate content issues
- Incorrect canonical URLs
- SEO ranking problems

**Causes:**
- Missing canonical URL generation
- Incorrect base URL configuration
- URL format issues

**Solutions:**
```typescript
// Ensure canonical URL is generated
const generateCanonicalUrl = (baseUrl, path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

// Include in metadata
const metadata = {
  title: page.title,
  description: page.description,
  canonical: generateCanonicalUrl(options.baseUrl, page.url)
}
```

### Content Validation Issues

#### Issue: SEO Validation Failures
**Symptoms:**
- Content validation errors
- Missing required SEO fields
- Schema validation warnings

**Causes:**
- Missing content fields
- Invalid field formats
- Schema type mismatches

**Solutions:**
```typescript
// Run content validation
const validationResult = validateSEOContent(page, {
  enforceDefaults: true,
  validateLengths: true,
  warnOnMissing: true
})

// Handle validation results
if (validationResult.errors.length > 0) {
  console.error('SEO validation errors:', validationResult.errors)
}

if (validationResult.warnings.length > 0) {
  console.warn('SEO validation warnings:', validationResult.warnings)
}
```

#### Issue: Schema Type Defaults Not Applied
**Symptoms:**
- Incorrect schema types
- Missing schema type assignments
- Validation errors for schema types

**Causes:**
- Default schema types not enforced
- Content type mapping issues
- Missing schema type configuration

**Solutions:**
```typescript
// Ensure schema defaults are applied
const enforceSchemaDefaults = (content) => {
  const schemaDefaults = {
    'Project': 'CreativeWork',
    'Post': 'BlogPosting',
    'Page': 'WebPage'
  }
  
  if (!content.seo?.schema?.type) {
    content.seo = content.seo || {}
    content.seo.schema = content.seo.schema || {}
    content.seo.schema.type = schemaDefaults[content.type] || 'WebPage'
  }
  
  return content
}
```

### Test Suite Issues

#### Issue: SEO Tests Failing
**Symptoms:**
- Unit tests failing
- Snapshot tests outdated
- Integration tests errors

**Causes:**
- Test data inconsistencies
- Updated implementation breaking tests
- Missing test dependencies

**Solutions:**
```bash
# Update snapshots if implementation changed
pnpm test -- --updateSnapshot

# Run specific SEO tests
pnpm test -- --testPathPattern="lib/seo|tests/seo"

# Check test data consistency
pnpm test -- --verbose lib/seo/structured-data.test.ts
```

#### Issue: Test Environment Problems
**Symptoms:**
- Tests not running
- Module resolution errors
- Environment configuration issues

**Causes:**
- Jest configuration problems
- Missing dependencies
- Environment variable issues

**Solutions:**
```bash
# Clear Jest cache
pnpm test -- --clearCache

# Check Jest configuration
cat jest.config.js

# Verify dependencies
pnpm install
```

## Debug Tools and Commands

### Validation Tools
```bash
# Run SEO validation tests
pnpm test -- --testPathPattern="seo"

# Check JSON-LD snapshots
pnpm test -- --testPathPattern="json-ld-snapshots"

# Validate content schema
pnpm test -- --testPathPattern="schema-validator"
```

### Debug Logging
```typescript
// Enable debug logging
const debugSEO = process.env.NODE_ENV === 'development'

if (debugSEO) {
  console.log('SEO Debug:', {
    content: page,
    metadata: generatedMetadata,
    jsonLd: jsonLdArray
  })
}
```

### External Validation
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Markup Validator**: https://validator.schema.org/
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator

## Performance Optimization

### JSON-LD Optimization
```typescript
// Minimize JSON-LD size
const optimizeJsonLd = (jsonLd) => {
  // Remove empty fields
  const cleaned = Object.fromEntries(
    Object.entries(jsonLd).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    )
  )
  
  return cleaned
}
```

### Metadata Caching
```typescript
// Implement metadata caching
const metadataCache = new Map()

const getCachedMetadata = (key, generator) => {
  if (metadataCache.has(key)) {
    return metadataCache.get(key)
  }
  
  const metadata = generator()
  metadataCache.set(key, metadata)
  return metadata
}
```

## Monitoring and Alerts

### SEO Monitoring
```typescript
// Track SEO metrics
const trackSEOMetrics = (page, metadata) => {
  const metrics = {
    titleLength: metadata.title?.length || 0,
    descriptionLength: metadata.description?.length || 0,
    hasCanonical: !!metadata.canonical,
    hasJsonLd: !!page.jsonLd,
    schemaType: page.seo?.schema?.type
  }
  
  // Send to analytics
  analytics.track('seo_metrics', metrics)
}
```

### Error Tracking
```typescript
// Track SEO errors
const trackSEOError = (error, context) => {
  console.error('SEO Error:', error, context)
  
  // Send to error tracking service
  errorTracker.captureException(error, {
    tags: { component: 'seo' },
    extra: context
  })
}
```

## Best Practices

### Content Guidelines
1. **Always provide fallbacks** for title and description
2. **Validate field lengths** before generation
3. **Use consistent schema types** for content categories
4. **Include canonical URLs** for all pages
5. **Test with external tools** regularly

### Code Guidelines
1. **Handle errors gracefully** in SEO generation
2. **Provide meaningful warnings** for validation issues
3. **Use TypeScript** for type safety
4. **Write comprehensive tests** for all SEO functionality
5. **Document configuration options** clearly

### Performance Guidelines
1. **Minimize JSON-LD size** by removing empty fields
2. **Cache metadata** when possible
3. **Use lazy loading** for non-critical SEO features
4. **Monitor performance impact** of SEO implementation
5. **Optimize for Core Web Vitals**

## Support and Resources

### Documentation
- [SEO Implementation Guide](./seo-implementation-guide.md)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org Documentation](https://schema.org/)

### Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Lighthouse SEO Audit](https://developers.google.com/web/tools/lighthouse)

### Community
- [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
- [Schema.org Community](https://github.com/schemaorg/schemaorg)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)
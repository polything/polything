# Troubleshooting Guide

**Date:** 2025-01-27  
**Status:** Active  
**Project:** WordPress to Next.js Migration

## Common Issues and Solutions

### 1. Contentlayer Issues

#### Problem: `contentlayer2/generated` module not found

**Error**: `Cannot find module 'contentlayer2/generated'`

**Causes**:

- Contentlayer hasn't generated types yet
- Build process not run
- Configuration issues

**Solutions**:

```bash
# Generate contentlayer types
pnpm contentlayer build

# Or run full build
pnpm build

# Check contentlayer config
pnpm contentlayer validate
```

**Prevention**: Add to package.json scripts:

```json
{
  "scripts": {
    "contentlayer": "contentlayer build",
    "dev": "contentlayer build && next dev",
    "build": "contentlayer build && next build"
  }
}
```

#### Problem: MDX files not being processed

**Error**: Content not appearing in generated types

**Causes**:

- Incorrect file paths in contentlayer config
- Missing front-matter
- Invalid MDX syntax

**Solutions**:

1. Check file paths match `filePathPattern` in config
2. Ensure all MDX files have valid front-matter
3. Validate MDX syntax

**Debug**:

```bash
# Check contentlayer processing
pnpm contentlayer build --verbose

# Validate specific file
pnpm contentlayer validate content/posts/example.mdx
```

### 2. Testing Issues

#### Problem: Jest tests failing with ES modules

**Error**: `SyntaxError: Unexpected token 'export'`

**Causes**:

- Contentlayer uses ES modules
- Jest configuration not handling ES modules properly

**Solutions**:

1. Update Jest config with transform patterns:

```javascript
transformIgnorePatterns: [
  'node_modules/(?!(contentlayer2|@contentlayer2)/)'
]
```

2.Use dynamic imports in tests:

```javascript
const config = await import('./contentlayer.config')
```

#### Problem: React Testing Library not rendering `<head>` content

**Error**: JSON-LD scripts not found in tests

**Causes**:

- React Testing Library doesn't render head content
- Testing approach not suitable for layout components

**Solutions**:

1. Test component structure instead of head content
2. Use integration tests for full page rendering
3. Mock head content for unit tests

**Example**:

```javascript
// Instead of testing head content
const scripts = container.querySelectorAll('script[type="application/ld+json"]')

// Test component structure
expect(container.firstChild).toBeInTheDocument()
```

#### Problem: Next.js Image component tests failing

**Error**: Image src attribute doesn't match expected value

**Causes**:

- Next.js transforms image URLs for optimization
- Tests expecting original URL instead of transformed

**Solutions**:

```javascript
// Instead of exact match
expect(heroImage).toHaveAttribute('src', '/images/hero.jpg')

// Use contains check
expect(heroImage.getAttribute('src')).toContain('%2Fimages%2Fhero.jpg')
```

### 3. Build and Deployment Issues

#### Problem: Build failing with TypeScript errors

**Error**: Type errors in generated contentlayer types

**Causes**:

- Contentlayer types not generated
- TypeScript configuration issues
- Missing type definitions

**Solutions**:

1. Generate contentlayer types first:

```bash
pnpm contentlayer build
```

2.Check TypeScript configuration:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

3.Add type declarations if needed:

```typescript
declare module 'contentlayer2/generated' {
  export const allPosts: Post[]
  export const allProjects: Project[]
  export const allPages: Page[]
}
```

#### Problem: Images not loading in production

**Error**: 404 errors for image assets

**Causes**:

- Images not properly copied to public directory
- Incorrect image paths in content
- Next.js image optimization issues

**Solutions**:

1. Verify image paths in content:

```yaml
hero:
  image: "/images/hero.jpg"  # Must start with /
```

2.Check public directory structure:

```
public/
└── images/
    ├── hero.jpg
    └── projects/
        └── project-hero.jpg
```

3.Use Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
/>
```

### 4. Content Issues

#### Problem: MDX content not rendering

**Error**: Content appears as raw MDX instead of rendered HTML

**Causes**:

- Missing MDXContent component
- Incorrect content structure
- Contentlayer not processing content

**Solutions**:

1. Import and use MDXContent:

```tsx
import { MDXContent } from 'next-contentlayer2/hooks'

<MDXContent code={post.body.code} />
```

2.Check content structure:

```yaml
---
title: "Post Title"
# ... other front-matter
---

# Post Content

This is the post content.
```

3.Verify contentlayer processing:

```bash
pnpm contentlayer build
```

#### Problem: Front-matter validation errors

**Error**: Invalid front-matter structure

**Causes**:

- Missing required fields
- Incorrect data types
- Invalid YAML syntax

**Solutions**:

1. Check required fields:

```yaml
---
title: "Required"  # Must be string
slug: "required"   # Must be string
date: "2024-01-01T00:00:00.000Z"  # Must be valid date
---
```

2.Validate YAML syntax:

```bash
# Use online YAML validator
# Or check with contentlayer
pnpm contentlayer validate
```

3.Use correct data types:

```yaml
categories: ["Category 1", "Category 2"]  # Array of strings
tags: ["tag1", "tag2"]                   # Array of strings
featured: true                           # Boolean
```

### 5. Media Fetcher Issues

#### Problem: Media download failures

**Error**: `Failed to download media: 403 Forbidden` or `404 Not Found`

**Causes**:

- WordPress access restrictions on certain files
- Files no longer exist on WordPress
- Network connectivity issues
- Timeout errors

**Solutions**:

1. Check WordPress file permissions:

```bash
# Test WordPress REST API access
curl -I https://polything.co.uk/wp-json/wp/v2/media
```

2.Handle protected files gracefully:

```javascript
// The media fetcher already handles these errors
// Check the generated report for details
cat media-fetch-report.md
```

3.Increase timeout for large files:

```javascript
const results = await fetchAndMirrorMedia(siteUrl, {
  timeout: 60000 // 60 seconds
});
```

#### Problem: Memory issues with large media collections

**Error**: Out of memory errors during processing

**Causes**:

- Processing too many files simultaneously
- Large file sizes
- Insufficient system memory

**Solutions**:

1. Reduce batch size:

```javascript
const results = await fetchAndMirrorMedia(siteUrl, {
  batchSize: 5 // Smaller batches
});
```

2.Process in smaller chunks:

```bash
# Process specific date ranges
node scripts/wp-media-fetcher.js https://polything.co.uk --date-range=2024
```

3.Monitor system resources:

```bash
# Check memory usage
top -p $(pgrep node)
```

#### Problem: Directory permission errors

**Error**: `EACCES: permission denied, mkdir`

**Causes**:

- Insufficient permissions to create directories
- Read-only file system
- Incorrect ownership

**Solutions**:

1. Fix directory permissions:

```bash
# Ensure write permissions
chmod -R 755 public/images/
sudo chown -R $USER:$USER public/images/
```

2.Check available disk space:

```bash
df -h public/images/
```

3.Verify output directory:

```javascript
// Use absolute path
const results = await fetchAndMirrorMedia(siteUrl, {
  outputDir: path.resolve('./public/images')
});
```

#### Problem: Incomplete downloads

**Error**: Some files downloaded but others failed

**Causes**:

- Network interruptions
- WordPress server issues
- File access restrictions

**Solutions**:

1. Re-run the fetcher (it skips existing files):

```bash
node scripts/wp-media-fetcher.js https://polything.co.uk
```

2.Check the report for specific errors:

```bash
grep "Errors:" media-fetch-report.md
```

3.Manual retry for specific files:

```javascript
// Download specific media item
const { downloadMediaFile } = require('./scripts/wp-media-fetcher.js');
await downloadMediaFile(
  'https://polything.co.uk/wp-content/uploads/2024/01/image.jpg',
  './public/images/2024/01/image.jpg'
);
```

### 6. Error Boundary and Loading Issues

#### Problem: Error boundary not catching errors
**Error**: Errors not being caught by error boundary

**Causes**:
- Error boundary not wrapping the component that throws
- Error thrown outside of React component lifecycle
- Error boundary not properly configured

**Solutions**:
1. Ensure error boundary wraps the component:
```tsx
<ErrorBoundary>
  <ComponentThatMightThrow />
</ErrorBoundary>
```

2. Check error boundary placement in component tree:
```tsx
// Good: Error boundary at appropriate level
<ErrorBoundary>
  <PageContent />
</ErrorBoundary>

// Bad: Error boundary too high in tree
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

3. Verify error boundary configuration:
```tsx
<ErrorBoundary
  onRetry={() => window.location.reload()}
  errorMessage="Custom error message"
>
  <Component />
</ErrorBoundary>
```

#### Problem: Loading component not showing
**Error**: Loading state not appearing

**Causes**:
- Loading component not properly imported
- Loading state not triggered
- CSS classes not applied correctly

**Solutions**:
1. Check loading component import:
```tsx
import { Loading, PageLoading } from '@/components/loading'
```

2. Verify loading state usage:
```tsx
// For page loading
<PageLoading message="Loading page..." />

// For inline loading
<Loading inline size="sm" />

// For button loading
<Loading size="sm" showMessage={false} />
```

3. Check CSS classes:
```bash
# Verify Tailwind classes are applied
# Check for animate-spin, proper sizing classes
```

#### Problem: Error boundary showing on every render
**Error**: Error boundary appears even when no error occurs

**Causes**:
- Error boundary state not reset properly
- Component throwing error on every render
- Error boundary logic issue

**Solutions**:
1. Check error boundary state management:
```tsx
// Ensure proper state reset
handleRetry = () => {
  this.setState({ hasError: false, error: null })
}
```

2. Verify component error handling:
```tsx
// Check for proper error handling in components
try {
  // Risky operation
} catch (error) {
  // Handle error appropriately
}
```

3. Test error boundary in isolation:
```tsx
// Create test component that throws
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error('Test error')
  return <div>No error</div>
}
```

### 7. Sitemap and Robots Issues

#### Problem: Sitemap not generating
**Error**: Sitemap.xml not found or empty

**Causes**:
- Contentlayer not generating types
- Sitemap function not properly exported
- Build process not running

**Solutions**:
1. Generate contentlayer types:
```bash
pnpm contentlayer build
```

2. Check sitemap function export:
```tsx
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  // Implementation
}
```

3. Verify build process:
```bash
pnpm build
# Check .next/server/app/sitemap.xml
```

#### Problem: Robots.txt not accessible
**Error**: 404 for /robots.txt

**Causes**:
- Robots function not properly exported
- Next.js not recognizing robots.ts
- Build issues

**Solutions**:
1. Check robots function export:
```tsx
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  // Implementation
}
```

2. Verify file location:
```
app/robots.ts  # Correct location
```

3. Test robots.txt generation:
```bash
pnpm build
# Check .next/server/app/robots.txt
```

#### Problem: Sitemap missing dynamic content
**Error**: Sitemap only shows static routes

**Causes**:
- Contentlayer data not available
- Dynamic route generation failing
- Import issues

**Solutions**:
1. Check contentlayer integration:
```tsx
import { allPosts, allProjects, allPages } from 'contentlayer2/generated'
```

2. Verify content directory structure:
```
content/
├── posts/
├── projects/
└── pages/
```

3. Test with simplified sitemap:
```tsx
// Use sitemap-simple.ts for testing
export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes only
}
```

#### Problem: AI bots not blocked
**Error**: AI crawlers still accessing site

**Causes**:
- Robots.txt not properly configured
- Bot user agents not recognized
- Caching issues

**Solutions**:
1. Check robots.txt configuration:
```tsx
{
  userAgent: 'GPTBot',
  disallow: '/',
}
```

2. Verify bot user agents:
```tsx
const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'anthropic-ai',
  'Claude-Web',
]
```

3. Test robots.txt output:
```bash
curl https://polything.co.uk/robots.txt
```

### 8. Performance Issues

#### Problem: Slow build times

**Causes**:

- Large number of content files
- Inefficient content processing
- Missing optimizations

**Solutions**:

1. Optimize contentlayer config:

```typescript
export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post, Project, Page],
  // Add optimizations
  disableImportAliasWarning: true,
})
```

Use incremental builds:

```bash
# Development mode
pnpm dev

# Production build
pnpm build
```

3.Optimize images:

```bash
# Use image optimization tools
npx @squoosh/cli --webp content/images/
```

#### Problem: Large bundle sizes

**Causes**:

- Unused dependencies
- Large images
- Inefficient code splitting

**Solutions**:
1.Analyze bundle:

```bash
pnpm build
npx @next/bundle-analyzer
```

2.Optimize imports:

```tsx
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

3.Optimize images:

```tsx
// Use Next.js Image component
<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority={false}  // Only for above-the-fold images
/>
```

## Debug Commands

### Contentlayer Debugging

```bash
# Build with verbose output
pnpm contentlayer build --verbose

# Validate configuration
pnpm contentlayer validate

# Check generated types
ls .contentlayer/generated/
```

### Next.js Debugging

```bash
# Development with debug info
DEBUG=* pnpm dev

# Build with debug info
DEBUG=* pnpm build

# Check build output
pnpm build && ls .next/
```

### Testing Debugging

```bash
# Run tests with verbose output
pnpm test --verbose

# Run specific test file
pnpm test components/hero.test.tsx

# Run tests in watch mode
pnpm test --watch
```

## Getting Help

### Logs and Debugging

1. Check browser console for client-side errors
2. Check terminal output for build errors
3. Use Next.js debug mode for detailed information
4. Check contentlayer logs for content processing issues

### Common Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentlayer Documentation](https://www.contentlayer.dev/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Project-Specific Help

- Check `docs/nextjs-contentlayer-implementation.md` for implementation details
- Review `contentlayer.config.ts` for configuration
- Check `jest.config.js` for testing setup
- Review component tests for usage examples

---

**Last Updated**: 2025-01-27  
**Maintained By**: Development Team  
**Next Review**: After Task 1.0 completion

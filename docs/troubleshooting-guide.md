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

2. Use dynamic imports in tests:
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

2. Check TypeScript configuration:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

3. Add type declarations if needed:
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

2. Check public directory structure:
```
public/
└── images/
    ├── hero.jpg
    └── projects/
        └── project-hero.jpg
```

3. Use Next.js Image component:
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

2. Check content structure:
```yaml
---
title: "Post Title"
# ... other front-matter
---

# Post Content

This is the post content.
```

3. Verify contentlayer processing:
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

2. Validate YAML syntax:
```bash
# Use online YAML validator
# Or check with contentlayer
pnpm contentlayer validate
```

3. Use correct data types:
```yaml
categories: ["Category 1", "Category 2"]  # Array of strings
tags: ["tag1", "tag2"]                   # Array of strings
featured: true                           # Boolean
```

### 5. Performance Issues

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

2. Use incremental builds:
```bash
# Development mode
pnpm dev

# Production build
pnpm build
```

3. Optimize images:
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
1. Analyze bundle:
```bash
pnpm build
npx @next/bundle-analyzer
```

2. Optimize imports:
```tsx
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

3. Optimize images:
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
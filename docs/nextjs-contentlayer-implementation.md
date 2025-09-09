# Next.js Contentlayer Implementation Guide

**Date** 2025-01-27  
**Status** Complete  
**Author** Agent B (Frontend/Next.js)

## Overview

This document outlines the implementation of the Next.js application skeleton with Contentlayer integration for the WordPress to Next.js migration project.

## Architecture

### Content Management

- **Contentlayer2** Modern content management system for MDX files
- **MDX Support** Rich content with React components
- **Type Safety** Full TypeScript integration with generated types

### Content Types

#### 1. Posts (Blog Articles)

- **Path** `/content/posts/[slug]/index.mdx`
- **Route** `/blog/[slug]`
- **Schema** BlogPosting with author, publish date, categories, tags
- **Features** Featured posts, hero sections, SEO metadata

#### 2. Projects (Case Studies)

- **Path** `/content/projects/[slug]/index.mdx`
- **Route** `/work/[slug]`
- **Schema** CreativeWork with project links, client information
- **Features** Project URLs, hero sections, case study content

#### 3. Pages (Static Content)

- **Path** `/content/pages/[slug]/index.mdx`
- **Route** `/[slug]`
- **Schema** WebPage for general content
- **Features** Hero sections, flexible content layout

## File Structure

```
app/
├── layout.tsx                 # Root layout with JSON-LD structured data
├── page.tsx                   # Homepage
├── loading.tsx                # Root loading state
├── error.tsx                  # Root error boundary
├── sitemap.ts                 # Dynamic sitemap generation
├── robots.ts                  # Robots.txt configuration
├── work/[slug]/
│   ├── page.tsx               # Project detail pages
│   ├── loading.tsx            # Project loading state
│   └── error.tsx              # Project error boundary
├── blog/[slug]/
│   ├── page.tsx               # Blog post pages
│   ├── loading.tsx            # Blog loading state
│   └── error.tsx              # Blog error boundary
└── [slug]/
    ├── page.tsx               # Static pages
    ├── loading.tsx            # Page loading state
    └── error.tsx              # Page error boundary

components/
├── hero.tsx                   # Reusable hero component
├── hero.test.tsx             # Hero component tests
├── error-boundary.tsx        # Error boundary with retry functionality
├── error-boundary.test.tsx   # Error boundary tests
├── loading.tsx               # Loading component with variants
└── loading.test.tsx          # Loading component tests

content/
├── posts/                    # Blog posts (MDX)
├── pages/                    # Static pages (MDX)
└── projects/                 # Project case studies (MDX)

contentlayer.config.ts        # Contentlayer configuration
```

## Key Components

### Hero Component

**Location** `components/hero.tsx`

**Features**

- Image and video background support
- Custom text and background colors
- Responsive design with mobile optimization
- Next.js Image optimization
- Accessibility features

**Props**

```typescript
interface HeroData {
  title?: string
  subtitle?: string
  image?: string
  video?: string
  text_color?: string
  background_color?: string
}
```

**Usage**

```tsx
<Hero hero={page.hero} />
```

### Error Boundary Component

**Location** `components/error-boundary.tsx`

**Features**
- Catches JavaScript errors in component tree
- Custom fallback UI with retry functionality
- Development error logging
- Accessibility-compliant error messages
- Custom error messages and fallback components

**Props**
```typescript
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (props: { error: Error; retry: () => void }) => ReactNode
  errorMessage?: string
  onRetry?: () => void
}
```

**Usage**
```tsx
<ErrorBoundary onRetry={reset}>
  <ComponentThatMightThrow />
</ErrorBoundary>
```

### Loading Component

**Location** `components/loading.tsx`

**Features**
- Multiple size variants (sm, md, lg)
- Layout options (full screen, inline, button)
- Custom loading messages
- Accessibility support with screen readers
- Specialized components for common use cases

**Props**
```typescript
interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  inline?: boolean
  showMessage?: boolean
  className?: string
}
```

**Usage**
```tsx
// Page loading
<PageLoading message="Loading page..." />

// Inline loading
<InlineLoading />

// Button loading
<ButtonLoading />
```

### Page Templates

All page templates follow a consistent pattern:

1. **Static Generation**: `generateStaticParams()` for all content
2. **SEO Metadata**: `generateMetadata()` with OpenGraph support
3. **JSON-LD**: Structured data for search engines
4. **Hero Section**: Optional hero with custom styling
5. **Content Rendering**: MDX content with prose styling

## SEO Implementation

### Site-wide Structured Data

**Location** `app/layout.tsx`

- **Organization** Company information, contact details, social media
- **Website** Site-wide metadata and publisher information

### Per-page Structured Data

Each page template includes:

- **BlogPosting** For blog posts with author and publish dates
- **CreativeWork** For projects with client information
- **WebPage** For static pages

### Metadata API

Using Next.js 14 App Router Metadata API:

- Dynamic title and description generation
- OpenGraph tags for social sharing
- Canonical URLs for SEO
- Twitter Card support

### Sitemap Generation

**Location** `app/sitemap.ts`

**Features**
- Dynamic sitemap with static and contentlayer routes
- Priority hierarchy: Homepage (1.0) → Work/Blog (0.8) → Projects (0.7) → Posts (0.6) → Pages (0.5)
- Change frequencies: Weekly for main sections, monthly for content
- Last modified dates from contentlayer data

**Usage**
```tsx
// Automatically generates /sitemap.xml
export default function sitemap(): MetadataRoute.Sitemap {
  // Implementation with contentlayer integration
}
```

### Robots.txt Configuration

**Location** `app/robots.ts`

**Features**
- Comprehensive crawler rules
- AI bot blocking (GPTBot, ChatGPT-User, CCBot, anthropic-ai, Claude-Web)
- Directory restrictions (API, Next.js internals, admin, private)
- Sitemap reference

**Usage**
```tsx
// Automatically generates /robots.txt
export default function robots(): MetadataRoute.Robots {
  // Implementation with AI bot protection
}
```

## Testing Strategy

### Unit Tests

- **Jest** Testing framework with React Testing Library
- **Component Tests** Hero component with full test coverage
- **Page Tests** Template structure validation

### Test Coverage

- Hero component: 7 test cases covering all features
- Error boundary: 7 test cases for error handling and retry functionality
- Loading component: 9 test cases for all variants and configurations
- Sitemap: 8 test cases for structure and content validation
- Robots: 7 test cases for crawler rules and configuration
- Page templates: Structure and export validation
- Layout: JSON-LD structured data verification

## Performance Optimizations

### Image Optimization

- Next.js Image component with WebP/AVIF support
- Automatic responsive images
- Lazy loading for better performance

### Code Splitting

- Automatic route-based code splitting
- Dynamic imports for heavy components
- Optimized bundle sizes

### SEO Performance

- Static generation for all content
- Pre-rendered pages for instant loading
- Optimized meta tags and structured data

## Development Workflow

### TDD Approach

1. **Red Phase**: Write failing tests first
2. **Green Phase**: Implement minimum code to pass tests
3. **Refactor Phase**: Improve code while maintaining test coverage

### Testing Commands

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test components/hero.test.tsx

# Run tests in watch mode
pnpm test --watch
```

## Content Schema

### Front-matter Structure

```yaml
---
title: "Page Title"
slug: "page-slug"
date: "2024-01-01T00:00:00.000Z"
updated: "2024-01-01T00:00:00.000Z"
categories: ["Category 1", "Category 2"]
tags: ["tag1", "tag2"]
featured: true  # Only for posts

hero:
  title: "Hero Title"
  subtitle: "Hero Subtitle"
  image: "/images/hero.jpg"
  video: "/images/hero.mp4"
  text_color: "#ffffff"
  background_color: "#000000"

links:  # Only for projects
  url: "https://project-url.com"
  image: "/images/project-link.jpg"
  video: "/images/project-video.mp4"

seo:
  title: "SEO Title Override"
  description: "SEO description"
  canonical: "https://polything.co.uk/page-url"
  schema:
    type: "BlogPosting"  # BlogPosting | CreativeWork | WebPage
    image: "/images/schema-image.jpg"
    author: "Polything Ltd"
    publishDate: "2024-01-01T00:00:00.000Z"
    modifiedDate: "2024-01-01T00:00:00.000Z"
    breadcrumbs:  # Optional
      - { name: "Home", url: "/" }
      - { name: "Page", url: "/page" }
---
```

## Troubleshooting

### Common Issues

#### 1. Contentlayer Not Generating Types

**Problem** `contentlayer2/generated` module not found
**Solution** Run `pnpm build` to generate types, or add to package.json scripts

#### 2. Jest Tests Failing with ES Modules

**Problem** Contentlayer uses ES modules
**Solution** Updated Jest config with proper transform patterns

#### 3. Hero Component Images Not Loading

**Problem** Next.js Image component transforms URLs
**Solution** Use `toContain()` in tests instead of exact URL matching

#### 4. JSON-LD Not Appearing in Tests

**Problem** React Testing Library doesn't render `<head>` content
**Solution** Test component structure instead of head content

### Debug Commands

```bash
# Check contentlayer configuration
pnpm contentlayer build

# Validate MDX files
pnpm contentlayer validate

# Run tests with verbose output
pnpm test --verbose

# Check build output
pnpm build
```

## Next Steps

### Immediate Tasks

1. **Content Migration** Implement WordPress export scripts (Task 1.0)
2. **Field Mapping** Create transformation utilities (Task 2.0)
3. **Error Boundaries** Add loading states and error handling (Task 3.16)

### Future Enhancements

1. **CMS Integration** Prepare for KeyStatic/Contentful migration
2. **Performance Monitoring** Add real-time performance tracking
3. **Analytics** Implement Google Analytics 4
4. **Search** Add full-text search functionality

## Dependencies

### Core Dependencies

- `next`: 15.2.4
- `react`: ^19
- `contentlayer2`: 0.5.8
- `next-contentlayer2`: 0.5.8

### Development Dependencies

- `jest`: 30.1.3
- `@testing-library/react`: 16.3.0
- `@testing-library/jest-dom`: 6.8.0
- `ts-jest`: 29.4.1

### Styling

- `tailwindcss`: 3.4.17
- `@tailwindcss/typography`: For prose styling
- Custom design system with brand colors

## Configuration Files

### Jest Configuration

- **File** `jest.config.js`
- **Features** Next.js integration, TypeScript support, ES modules
- **Test Environment** jsdom for React components

### Contentlayer Configuration

- **File** `contentlayer.config.ts`
- **Features** Document type definitions, computed fields, content directory

### Next.js Configuration

- **File** `next.config.mjs`
- **Features** Image optimization, TypeScript support, ESLint integration

---

**Status** ✅ Complete  
**Last Updated** 2025-01-27  
**Next Phase** WordPress Content Export Infrastructure (Task 1.0)

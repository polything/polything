# Contentlayer Integration Fix Brief

**Date:** 2025-01-27  
**Priority:** CRITICAL  
**Status:** Ready for Implementation

## Overview

Fix the contentlayer integration to enable dynamic page generation for all exported content. The current issue is that contentlayer is not properly integrated, causing all dynamic routes to return 404 errors.

## Current State Analysis

### ✅ What's Working
- **Homepage**: Loads correctly at `/` (DO NOT CHANGE)
- **Design System Demo**: Working at `/design-system-demo` (DO NOT CHANGE)
- **Content Export**: 77 content items successfully exported to `/content/` directory
- **Contentlayer Config**: Properly configured with Post, Project, and Page document types

### ❌ What's Broken
- **Dynamic Routes**: All dynamic pages return 404 errors
- **Content Access**: 77 exported content items are inaccessible
- **Routing**: Missing dynamic route implementations

## Required URL Structure & Redirects

### 1. Case Studies (Projects) - `/work/[slug]`
**Current WordPress URLs:**
- https://polything.co.uk/case-studies/

**New Next.js URLs:**
- `/work/blackriver`
- `/work/bluefort-security`
- `/work/wolf-the-worlds-online-festival`
- etc.

**Required 301 Redirects:**
```
/case-studies/blackriver → /work/blackriver
/case-studies/bluefort-security → /work/bluefort-security
/case-studies/wolf-the-worlds-online-festival → /work/wolf-the-worlds-online-festival
```

### 2. Blog Articles - `/blog/[slug]`
**Current WordPress URLs:**
- https://polything.co.uk/the-marketing-brief/

**New Next.js URLs:**
- `/blog/strategic-marketing-consultancy`
- `/blog/marketing-consultancy-in-london`
- `/blog/enhancing-your-seo-for-better-online-visibility`
- etc.

**Required 301 Redirects:**
```
/the-marketing-brief/strategic-marketing-consultancy → /blog/strategic-marketing-consultancy
/the-marketing-brief/marketing-consultancy-in-london → /blog/marketing-consultancy-in-london
```

### 3. Services Pages - `/services/[slug]`
**Current WordPress URLs:**
- https://polything.co.uk/services/
- https://polything.co.uk/marketing-strategy/
- https://polything.co.uk/marketing-services/
- https://polything.co.uk/business-mentoring/

**New Next.js URLs:**
- `/services/` (main services page)
- `/services/marketing-strategy/`
- `/services/marketing-services/`
- `/services/business-mentoring/`

**Required 301 Redirects:**
```
/marketing-strategy/ → /services/marketing-strategy/
/marketing-services/ → /services/marketing-services/
/business-mentoring/ → /services/business-mentoring/
```

## Implementation Tasks

### Task 1: Fix Contentlayer Configuration
**File:** `contentlayer.config.ts`

**Issues to Fix:**
1. **File Path Patterns**: Update to match actual content directory structure
2. **Document Types**: Ensure all three types (Post, Project, Page) are properly configured
3. **Computed Fields**: Verify URL generation is correct

**Current Issues:**
- `filePathPattern: 'posts/**/*.mdx'` but content is in `/content/post/`
- `filePathPattern: 'projects/**/*.mdx'` but content is in `/content/project/`
- `filePathPattern: 'pages/**/*.mdx'` but content is in `/content/page/`

**Required Changes:**
```typescript
// Fix file path patterns
filePathPattern: 'post/**/*.mdx',    // for posts
filePathPattern: 'project/**/*.mdx', // for projects  
filePathPattern: 'page/**/*.mdx',    // for pages
```

### Task 2: Create Dynamic Route Components

#### 2.1 Project Pages - `/app/work/[slug]/page.tsx`
**Purpose:** Display case studies and project content
**Wireframe Reference:** `docs/wireframe-examples-and-copy-relume/polything-co-uk_ts_version/blackriver/`
**Design System:** Use existing components from `@/components/design-system`

**Required Components:**
- Hero section with project title and subtitle
- Project content with images and text
- Project links and CTAs
- Related projects section
- SEO metadata and structured data

#### 2.2 Blog Pages - `/app/blog/[slug]/page.tsx`
**Purpose:** Display blog articles and insights
**Wireframe Reference:** `docs/wireframe-examples-and-copy-relume/polything-co-uk_ts_version/benefits-of-mentoring/`
**Design System:** Use existing components from `@/components/design-system`

**Required Components:**
- Article header with title, date, author
- Article content with proper typography
- Social sharing buttons
- Related articles section
- SEO metadata and structured data

#### 2.3 Static Pages - `/app/[slug]/page.tsx`
**Purpose:** Display static pages (About, Contact, Services, etc.)
**Wireframe Reference:** Various wireframes in `docs/wireframe-examples-and-copy-relume/`
**Design System:** Use existing components from `@/components/design-system`

**Required Components:**
- Page-specific layouts based on content type
- Hero sections for key pages
- Content sections with proper spacing
- SEO metadata and structured data

#### 2.4 Services Pages - `/app/services/[slug]/page.tsx`
**Purpose:** Display service-specific pages
**Wireframe Reference:** `docs/wireframe-examples-and-copy-relume/polything-co-uk_ts_version/marketing-strategy/`
**Design System:** Use existing components from `@/components/design-system`

**Required Components:**
- Service hero section
- Service description and features
- Pricing or CTA sections
- Related services
- SEO metadata and structured data

### Task 3: Create Index Pages

#### 3.1 Blog Index - `/app/blog/page.tsx`
**Purpose:** Display list of all blog articles
**Wireframe Reference:** `docs/wireframe-examples-and-copy-relume/polything-co-uk_ts_version/the-marketing-brief/`

#### 3.2 Work Index - `/app/work/page.tsx`
**Purpose:** Display list of all case studies
**Wireframe Reference:** `docs/wireframe-examples-and-copy-relume/polything-co-uk_ts_version/case-studies/`

#### 3.3 Services Index - `/app/services/page.tsx`
**Purpose:** Display main services page
**Wireframe Reference:** `docs/wireframe-examples-and-copy-relume/polything-co-uk_ts_version/services/`

### Task 4: Implement 301 Redirects
**File:** `next.config.mjs`

**Required Redirects:**
```javascript
async redirects() {
  return [
    // Case studies redirects
    {
      source: '/case-studies/:slug',
      destination: '/work/:slug',
      permanent: true,
    },
    
    // Blog redirects
    {
      source: '/the-marketing-brief/:slug',
      destination: '/blog/:slug',
      permanent: true,
    },
    
    // Services redirects
    {
      source: '/marketing-strategy',
      destination: '/services/marketing-strategy',
      permanent: true,
    },
    {
      source: '/marketing-services',
      destination: '/services/marketing-services',
      permanent: true,
    },
    {
      source: '/business-mentoring',
      destination: '/services/business-mentoring',
      permanent: true,
    },
  ]
}
```

### Task 5: Create Page Components Using Design System

#### 5.1 Project Detail Component
**File:** `components/project-detail.tsx`
**Purpose:** Reusable component for displaying project case studies
**Design System Components to Use:**
- `Container`, `Section`, `Grid`
- `Heading`, `Text`, `Button`
- `Card`, `GlassContainer`
- `HeroContent` or `HeroDesignSystem`

#### 5.2 Blog Post Component
**File:** `components/blog-post.tsx`
**Purpose:** Reusable component for displaying blog articles
**Design System Components to Use:**
- `Container`, `Section`
- `Heading`, `Text`, `SmallText`
- `Button`, `Card`

#### 5.3 Service Page Component
**File:** `components/service-page.tsx`
**Purpose:** Reusable component for displaying service pages
**Design System Components to Use:**
- `Container`, `Section`, `Grid`
- `Heading`, `Text`, `Button`
- `Card`, `GlassContainer`

## Content Analysis

### Exported Content Structure
Based on the content directory analysis:

**Projects (5 items):**
- `/content/project/blackriver/index.mdx`
- `/content/project/blackriver-ramps-xmas/index.mdx`
- `/content/project/bluefort-security/index.mdx`
- `/content/project/bluefort-security-strategy/index.mdx`
- `/content/project/wolf-the-worlds-online-festival/index.mdx`

**Posts (45 items):**
- `/content/post/strategic-marketing-consultancy/index.mdx`
- `/content/post/marketing-consultancy-in-london/index.mdx`
- `/content/post/enhancing-your-seo-for-better-online-visibility/index.mdx`
- And 42 more...

**Pages (27 items):**
- `/content/page/about-us/index.mdx`
- `/content/page/contact/index.mdx`
- `/content/page/services/index.mdx`
- `/content/page/marketing-strategy/index.mdx`
- `/content/page/marketing-services/index.mdx`
- `/content/page/business-mentoring/index.mdx`
- And 21 more...

## Wireframe Component Mapping

### Key Wireframe Components to Implement

#### For Project Pages (`/work/[slug]`):
- **Hero Section**: Use `HeroContent` with project-specific data
- **Content Sections**: Use `Section` and `Container` for layout
- **Project Details**: Use `Card` components for features/results
- **CTAs**: Use `Button` components with proper variants

#### For Blog Pages (`/blog/[slug]`):
- **Article Header**: Use `Heading` and `Text` components
- **Content**: Use `Section` and `Container` for proper spacing
- **Social Sharing**: Use `Button` components
- **Related Articles**: Use `Card` components in a `Grid`

#### For Service Pages (`/services/[slug]`):
- **Service Hero**: Use `HeroContent` or `HeroDesignSystem`
- **Service Features**: Use `Grid` with `Card` components
- **Pricing/CTA**: Use `Section` with `Button` components
- **Testimonials**: Use `Card` components with proper styling

## Implementation Priority

### Phase 1: Critical Fixes (Immediate)
1. **Fix contentlayer.config.ts** - Update file path patterns
2. **Create basic dynamic routes** - `/app/work/[slug]/page.tsx`, `/app/blog/[slug]/page.tsx`, `/app/[slug]/page.tsx`
3. **Test content access** - Verify all 77 content items are accessible

### Phase 2: URL Structure (High Priority)
1. **Implement 301 redirects** - Add redirects to next.config.mjs
2. **Create services routing** - `/app/services/[slug]/page.tsx`
3. **Create index pages** - Blog, work, and services index pages

### Phase 3: Component Development (Medium Priority)
1. **Create reusable components** - Project, blog, and service page components
2. **Implement wireframe designs** - Use design system components
3. **Add SEO metadata** - Ensure proper meta tags and structured data

## Success Criteria

### Technical Requirements
- ✅ All 77 exported content items accessible via URLs
- ✅ No 404 errors on dynamic routes
- ✅ Proper 301 redirects from old WordPress URLs
- ✅ SEO metadata and structured data working

### Content Requirements
- ✅ Project pages display at `/work/[slug]`
- ✅ Blog posts display at `/blog/[slug]`
- ✅ Static pages display at `/[slug]`
- ✅ Service pages display at `/services/[slug]`

### Design Requirements
- ✅ Use existing design system components only
- ✅ Follow wireframe layouts from `docs/wireframe-examples-and-copy-relume/`
- ✅ Maintain brand consistency with existing homepage
- ✅ Responsive design across all devices

## Constraints & Requirements

### DO NOT CHANGE
- ❌ **Homepage** (`/` and `/design-system-demo`) - These are working correctly
- ❌ **Design System Components** - Use existing components only, don't modify
- ❌ **Existing CSS** - Don't modify any existing styles
- ❌ **Content Export** - Don't change the exported content structure

### MUST USE
- ✅ **Design System Components** - Use components from `@/components/design-system`
- ✅ **Wireframe References** - Follow layouts from `docs/wireframe-examples-and-copy-relume/`
- ✅ **Existing Content** - Use the 77 exported content items in `/content/`
- ✅ **Brand Guidelines** - Maintain Polything brand identity

## Testing Requirements

### After Implementation
1. **Re-run QA Script** - Use `scripts/qa-side-by-side.js` to verify fixes
2. **Test All Routes** - Verify all 77 content items are accessible
3. **Test Redirects** - Verify 301 redirects work correctly
4. **Test SEO** - Verify meta tags and structured data
5. **Test Responsive** - Verify design works on all devices

### Success Metrics
- ✅ 0% 404 errors on dynamic routes
- ✅ 100% of exported content accessible
- ✅ All 301 redirects working correctly
- ✅ SEO metadata properly implemented
- ✅ Design system components used consistently

---

**Next Steps:** Begin with Phase 1 (Critical Fixes) to restore basic functionality, then proceed through Phase 2 and Phase 3 to complete the implementation.

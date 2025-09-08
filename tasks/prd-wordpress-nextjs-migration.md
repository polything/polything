# Product Requirements Document (PRD)

**Project:** Polything WordPress Multisite → Next.js Migration  
**Author:** Polything Ltd  
**Date:** 2025-01-27  
**Status:** Draft  
**Technical Reference:** `docs/wordpress-migration-technical-spec.md`  

## 1. Introduction/Overview

This PRD outlines the migration of Polything's WordPress Multisite (polything.co.uk) to a modern Next.js 14 application with App Router. The migration will transform WordPress content into a clean, developer-friendly MDX-based system using contentlayer, enabling better performance, SEO, and future extensibility.

**Problem Statement:** The current WordPress site has performance limitations, complex theme dependencies, and lacks the flexibility needed for modern web development practices and client site migrations.

**Goal:** Create a fast, SEO-optimized Next.js site with clean content architecture that can serve as a template for future client site migrations.

## 2. Goals

- **Performance:** Achieve sub-3-second page load times and excellent Core Web Vitals scores
- **SEO Preservation:** Maintain all current SEO rankings and improve where possible
- **Content Migration:** Successfully migrate 49 indexed pages + 200 additional pages (249 total)
- **Developer Experience:** Create a clean, maintainable codebase using TDD methodology
- **Extensibility:** Build a reusable architecture for future client site migrations
- **Media Optimization:** Efficiently handle 200-500MB of media assets including video files

## 3. User Stories

- **As a developer**, I want to export WordPress content into structured MDX files so I can build a static Next.js site
- **As a content editor**, I want clean front-matter fields (hero.title, hero.subtitle) instead of WordPress's themerain_* keys
- **As a project owner**, I want full traceability of raw WordPress meta data for reference if needed

### Performance & SEO

- **As a site visitor**, I want pages to load quickly (under 3 seconds) so I can access content efficiently
- **As an SEO manager**, I want all current rankings preserved and improved through better technical SEO
- **As a mobile user**, I want the site to perform well on all devices with excellent Core Web Vitals

### Future Development

- **As a developer**, I want a clean architecture that can be easily adapted for client site migrations
- **As a content manager**, I want the system to be ready for future CMS integration (KeyStatic, Contentful, etc.)

## 4. Functional Requirements

### 4.1 Migration Priority & Content Types

1. **Phase 1:** Key static pages in navigation (Homepage, Services, About, Contact, Book a Call)
2. **Phase 2:** Projects (Custom Post Type: project) - Case studies and portfolio items
3. **Phase 3:** Secondary pages (Legal pages, Terms, Privacy, etc.)
4. **Phase 4:** Posts (Blog articles and insights)

### 4.2 Content Export & Transformation

1. **WordPress API Integration:** System must fetch content via WP REST API endpoints
2. **Field Mapping:** Transform themerain_* meta fields into clean front-matter schema
3. **Media Resolution:** Convert WordPress media IDs to local /images/* paths
4. **Content Validation:** Ensure all exported content maintains data integrity
5. **Slug Management:** Handle potential slug collisions between content types

### 4.3 MDX Content Structure

#### 4.3.1 SEO Schema Migration

**Schema Markup Detection & Generation:**

- **Detect and extract** any existing schema markup from WordPress (Yoast/RankMath plugin output, or theme JSON-LD)
- **Map schema types** to Next.js rendering:
  - **Posts:** Article, BlogPosting
  - **Projects (Case Studies):** CreativeWork or Portfolio
  - **Pages (About, Contact):** WebPage
  - **Site-wide:** Organization, Website, BreadcrumbList
- **Regenerate dynamically** from front-matter values during Next.js build (cleaner, future-proof approach)
- **Ensure JSON-LD** is injected into `<head>` via Next.js metadata API

**Enhanced Front-matter Schema:**

```yaml
seo:
  title: "Optional override for <title>"
  description: "155–160 char meta description"
  canonical: "https://polything.co.uk/work/bluefort-security"
  schema:
    type: "WebPage" # WebPage | Article | BlogPosting | CreativeWork
    # Optional enrichments:
    image: "/images/2024/03/hero.jpg"
    author: "Polything Ltd"
    publishDate: "2024-05-06T10:00:00Z"
    modifiedDate: "2024-06-01T10:00:00Z"
    breadcrumbs:                   # for hierarchical pages / posts (optional)
      - { name: "Work", url: "/work" }
      - { name: "Bluefort Security", url: "/work/bluefort-security" }
```

**Schema Type Defaults:**

- **Project** → CreativeWork
- **Post** → BlogPosting  
- **Page** → WebPage

**Generation Rules:**

| Content Type | JSON-LD @type | Required Fields | Optional Enrichments |
|--------------|---------------|-----------------|---------------------|
| Page | WebPage | headline, url, dateModified | image, description |
| Post | BlogPosting | headline, url, datePublished, dateModified | image, author, description |
| Project | CreativeWork | name, url, dateModified | image, author, about |
| Site-wide | Organization, Website | name, url, logo | sameAs profiles |
| Breadcrumbs | BreadcrumbList | itemListElement | — |

#### 4.3.2 Explicit Field Mapping

**Hero Fields (All Content Types):**

```yaml
hero:
  title: themerain_hero_title | themerain_page_title
  subtitle: themerain_hero_subtitle | themerain_page_subtitle
  image: themerain_hero_image (media ID → URL → /images/*)
  video: themerain_hero_video (media ID → URL → /images/*)
  text_color: themerain_hero_text_color | themerain_page_text_color
  background_color: themerain_hero_bg_color | themerain_page_bg_color
```

**Project-Specific Fields:**

```yaml
links:
  url: themerain_project_link_url
  image: themerain_project_link_image (media ID → URL → /images/*)
  video: themerain_project_link_video (media ID → URL → /images/*)
```

**Post-Specific Fields:**

```yaml
featured: featured (boolean toggle)
```

#### 4.3.2 Complete Front-matter Schema

```yaml
---
title: string
slug: string
type: "project" | "post" | "page"
date: ISODate
updated: ISODate
categories: [string]
tags: [string]
featured: boolean   # only posts

hero:
  title: string
  subtitle: string
  image: string   # /images/*
  video: string   # /images/*
  text_color: string
  background_color: string

links:              # only projects
  url: string
  image: string
  video: string

# Optional: full raw export of WP meta
theme_meta: { ... }
---
```

#### 4.3.3 Media Mirroring Rules

- **Source:** All `/wp-content/uploads/**` assets mirrored to `/public/images/**`
- **Resolution:** Media IDs resolved via `/wp/v2/media/:id` endpoint
- **Non-upload assets:** Left as absolute URLs (external references)
- **Optimization:** Images automatically optimized during mirror process

#### 4.3.4 Slug & Routing Rules

- **Projects:** `/work/[slug]` (Custom Post Type: project)
- **Posts:** `/blog/[slug]` (Standard posts)
- **Pages:** `/[slug]` (Static pages, fallback)
- **Conflict Resolution:** Page > Project > Post (precedence order)
- **Validation:** Ensure no duplicate slugs across content types

### 4.4 Next.js Implementation

1. **App Router:** Use Next.js 14 App Router for all routing
2. **Static Generation:** Implement static site generation for optimal performance
3. **Contentlayer Integration:** Use contentlayer for MDX content management
4. **SEO Optimization:** Implement proper meta tags, structured data, and sitemaps
5. **Performance Optimization:** Implement image optimization, lazy loading, and code splitting

### 4.5 Content Validation Checklist

Each exported MDX file must:

1. **Front-matter Validation:** Contain valid YAML front-matter matching schema
2. **Content Preservation:** Include body content with headings/images preserved
3. **Media Resolution:** Validate all media URLs resolve (log broken links)
4. **Code Quality:** Pass Prettier/MDX linting standards
5. **Schema Compliance:** Match the defined front-matter schema exactly

### 4.6 Testing Requirements (TDD)

1. **Unit Tests:** Write tests for all content transformation functions
2. **Integration Tests:** Test WordPress API integration and content export
3. **Component Tests:** Test all React components with proper test coverage
4. **E2E Tests:** Test critical user journeys and page functionality
5. **Performance Tests:** Validate page load times and Core Web Vitals
6. **Content Validation Tests:** Automated checks for MDX file integrity

## 5. Non-Goals (Out of Scope)

- **Exact Theme Replication:** Not replicating WordPress theme presentation exactly
- **Multisite Structure:** Not maintaining WordPress multisite architecture
- **Mightybooth Migration:** Not migrating mightybooth.com content (future test case)
- **Real-time Content Updates:** Not implementing live content synchronization
- **WordPress Admin Interface:** Not recreating WordPress admin functionality
- **Over-caching:** Avoiding excessive caching that might impact content freshness

## 6. Design Considerations

### 6.1 Brand Consistency

- Maintain Polything's visual identity and brand guidelines
- Preserve existing color scheme and typography (Raleway MT Bold, Inter)
- Keep Bauhaus-inspired design elements and geometric patterns

### 6.2 Responsive Design

- Mobile-first approach for all components
- Ensure excellent performance across all device sizes
- Maintain accessibility standards (WCAG 2.1)

### 6.3 Content Layout

- Clean, readable typography hierarchy
- Consistent spacing and grid system
- Optimized image and video presentation

## 7. Technical Considerations

### 7.1 Architecture

- **Framework:** Next.js 14 with App Router
- **Content Management:** contentlayer for MDX processing
- **Styling:** Tailwind CSS with custom design system
- **Testing:** Jest + React Testing Library + Playwright
- **Deployment:** Vercel (recommended) or similar static hosting

### 7.2 Content Migration Tools

- **Export Script:** Custom Node.js script for WordPress content extraction
- **Media Processing:** Automated image optimization and video compression
- **Content Validation:** Automated checks for data integrity and completeness

### 7.3 Performance Optimization

- **Image Optimization:** Next.js Image component with WebP/AVIF support
- **Code Splitting:** Automatic code splitting and lazy loading
- **CDN Integration:** Global content delivery for media assets
- **Caching Strategy:** Appropriate caching headers without over-caching

### 7.4 SEO Implementation

- **Meta Tags:** Dynamic meta tag generation for all pages
- **Structured Data:** JSON-LD implementation for rich snippets
- **Sitemap:** Automated XML sitemap generation
- **Redirects:** 301 redirect implementation from current redirect file
- **Core Web Vitals:** Optimization for LCP, FID, and CLS metrics

## 8. Staging & QA Process

### 8.1 Staging Deployment

1. **Pre-deployment:** Deploy staging build on Vercel before DNS cutover
2. **Side-by-side Comparison:** Run comparison against current WP pages (text, hero, media)
3. **Content Validation:** Verify all 49 indexed pages render correctly
4. **Performance Testing:** Validate Core Web Vitals and page load times
5. **Approval Process:** Stakeholder approval required before live switch

### 8.2 Content Validation

- **Visual Comparison:** Screenshot comparison between WP and Next.js versions
- **Content Accuracy:** Text, images, and metadata match exactly
- **Link Validation:** All internal and external links function correctly
- **Media Quality:** Images and videos display properly and load quickly

## 9. Success Metrics

### 9.1 Performance Metrics

- **Page Load Time:** < 3 seconds for all pages
- **Core Web Vitals:** All green scores in PageSpeed Insights
- **Lighthouse Score:** > 90 for Performance, Accessibility, Best Practices, SEO

### 9.2 Content Migration Metrics

- **Content Completeness:** 100% of 49 indexed pages successfully migrated
- **Data Integrity:** 0% data loss during migration process
- **Media Assets:** 100% of media files successfully processed and optimized

### 9.3 SEO Metrics

- **Ranking Preservation:** Maintain current search engine rankings
- **Technical SEO:** Improve technical SEO scores by 20%
- **Index Coverage:** Maintain or improve current indexing status

### 9.4 Development Metrics

- **Test Coverage:** > 80% code coverage for all critical functions
- **Build Time:** < 5 minutes for full site build
- **Deployment Time:** < 2 minutes for production deployment

## 10. Acceptance Criteria (Gherkin Style)

### 10.1 Content Export Scenarios

```gherkin
Scenario: Exporting a project with hero image and subtitle
  Given a WordPress project with themerain_hero_title = "Blackriver"
  And themerain_hero_subtitle = "Case study"
  And themerain_hero_image = 10681 (media ID)
  When I run the exporter
  Then the MDX file front-matter contains hero.title = "Blackriver"
  And hero.subtitle = "Case study"
  And hero.image = "/images/2023/11/hero.jpg"

Scenario: Handling slug conflicts between content types
  Given a WordPress page with slug "about"
  And a WordPress project with slug "about"
  When I run the exporter
  Then the page is exported to /about/index.mdx
  And the project is exported to /work/about/index.mdx
  And no slug collision error occurs

Scenario: Media mirroring with broken links
  Given a WordPress post with themerain_hero_image = 99999 (non-existent media ID)
  When I run the exporter
  Then the MDX file contains hero.image = ""
  And a warning is logged for the broken media reference
  And the export process continues without failure
```

### 10.2 Performance Scenarios

```gherkin
Scenario: Page load time validation
  Given a migrated Next.js page
  When I measure the page load time
  Then the load time should be less than 3 seconds
  And the Core Web Vitals should be green

Scenario: Image optimization validation
  Given a WordPress image at /wp-content/uploads/2023/11/hero.jpg
  When the image is mirrored to /public/images/2023/11/hero.jpg
  Then the image should be optimized for web delivery
  And the file size should be reduced by at least 20%
```

## 11. Future CMS Consideration

### 11.1 Schema Design for CMS Migration

- **Clean Schema:** The MDX schema should map cleanly to future headless CMS (Contentful/KeyStatic)
- **Avoid WordPress Quirks:** No WP-specific field names or structures in the final schema
- **Future-proof Fields:** Design fields that work across multiple CMS platforms
- **Migration Path:** Clear documentation for moving from MDX to headless CMS

### 11.2 Analytics & Tracking

- **GA4 Integration:** Google Analytics 4 integrated at launch
- **Event Preservation:** Maintain existing event tracking (if any)
- **Performance Monitoring:** Real-time performance tracking and alerting
- **SEO Monitoring:** Track ranking changes and technical SEO improvements

## 12. Dependencies & References

### 12.1 Technical Implementation Reference

- **Complete Technical Specification:** `docs/wordpress-migration-technical-spec.md`
  - Detailed field mapping tables and implementation code
  - WordPress REST API testing and discovery methods
  - Ready-to-use JavaScript functions for content transformation
  - Troubleshooting solutions and official documentation links

### 12.2 Official Documentation

- **WordPress REST API:** [https://developer.wordpress.org/rest-api/reference/](https://developer.wordpress.org/rest-api/reference/)
- **Contentlayer:** [https://www.contentlayer.dev/docs/](https://www.contentlayer.dev/docs/)
- **Next.js App Router:** [https://nextjs.org/docs/app](https://nextjs.org/docs/app)

### 12.3 Technical Dependencies

- **Next.js 14+** with App Router
- **contentlayer** for MDX content management
- **WordPress REST API** (core + media endpoints)
- **ACF to REST API plugin** (if meta is hidden from core API)

## 13. Open Questions

1. **CMS Integration Timeline:** When do you plan to integrate KeyStatic/Contentful? Should the architecture be prepared for this transition?

2. **Client Migration Strategy:** For future client site migrations (like Mightybooth), should we create a separate build process or a multi-tenant architecture?

3. **Content Editor Training:** Who will be responsible for training content editors on the new MDX-based system?

4. **Analytics Integration:** Should we implement Google Analytics 4 during the migration or as a separate phase?

5. **Backup Strategy:** What backup and rollback procedures should be in place during the migration process?

6. **Third-party Integrations:** Are there any current WordPress plugins or integrations that need to be replicated in Next.js?

7. **Content Approval Workflow:** Do you need any content approval or review processes in the new system?

8. **Raw Meta Preservation:** Should raw WordPress meta always be preserved in theme_meta blocks, or only when debugging?

## 14. Final Project Structure

Upon completion of the migration, the project will have the following file structure:

```
polything-nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Homepage
│   ├── work/[slug]/page.tsx     # Project detail pages
│   ├── blog/[slug]/page.tsx     # Blog post pages
│   ├── [slug]/page.tsx          # Static pages
│   ├── globals.css              # Global styles
│   └── lib/                     # Utility functions
│       ├── content/             # Content transformation utilities
│       │   ├── schema.ts        # TypeScript interfaces
│       │   ├── field-mapper.ts  # Field mapping logic
│       │   ├── media-resolver.ts # Media ID resolution
│       │   └── slug-manager.ts  # Slug collision handling
│       └── seo/                 # SEO utilities
│           ├── metadata.ts      # Meta tag generation
│           ├── sitemap.ts       # XML sitemap
│           └── structured-data.ts # JSON-LD
├── components/                   # React components
│   ├── hero.tsx                 # Hero component
│   ├── project-detail.tsx       # Project layout
│   ├── blog-post.tsx            # Blog layout
│   ├── navbar.tsx               # Navigation
│   ├── footer.tsx               # Footer
│   └── ui/                      # Reusable UI components
├── content/                      # Exported MDX content
│   ├── projects/                # Project case studies
│   │   └── [slug]/
│   │       └── index.mdx
│   ├── posts/                   # Blog articles
│   │   └── [slug]/
│   │       └── index.mdx
│   └── pages/                   # Static pages
│       └── [slug]/
│           └── index.mdx
├── public/                       # Static assets
│   └── images/                  # Mirrored WordPress media
│       └── [year]/[month]/      # Organized by upload date
├── scripts/                      # Migration tools
│   ├── wp-export.mjs            # Main export script
│   ├── media-fetcher.mjs        # Media mirroring
│   └── peek-project-acf.mjs     # Field discovery
├── tests/                        # Test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   ├── e2e/                     # End-to-end tests
│   └── performance/             # Performance tests
├── docs/                         # Documentation
│   └── wordpress-migration-technical-spec.md
├── tasks/                        # Project documentation
│   ├── prd-wordpress-nextjs-migration.md
│   └── tasks-prd-wordpress-nextjs-migration.md
├── contentlayer.config.ts        # Contentlayer configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS config
├── package.json                 # Dependencies and scripts
├── jest.config.js               # Jest testing config
├── playwright.config.ts         # E2E testing config
└── vercel.json                  # Deployment configuration
```

### Key Directories Explained

- **`app/`** - Next.js 14 App Router structure with dynamic routes
- **`content/`** - Exported MDX files organized by content type
- **`public/images/`** - Mirrored WordPress media assets
- **`scripts/`** - Reusable migration tools for future projects
- **`lib/content/`** - Content transformation and validation utilities
- **`tests/`** - Comprehensive test suite following TDD methodology
- **`docs/`** - Technical documentation and specifications

### Content Organization

- **Projects:** `/content/projects/[slug]/index.mdx` → `/work/[slug]`
- **Posts:** `/content/posts/[slug]/index.mdx` → `/blog/[slug]`
- **Pages:** `/content/pages/[slug]/index.mdx` → `/[slug]`

### Media Organization

- **Source:** WordPress `/wp-content/uploads/2024/03/image.jpg`
- **Destination:** `/public/images/2024/03/image.jpg`
- **Usage:** `/images/2024/03/image.jpg` in MDX content

---

**Next Steps:** Upon approval of this PRD, we will begin with Phase 1 (key static pages) using TDD methodology, starting with test creation for the content export functionality.

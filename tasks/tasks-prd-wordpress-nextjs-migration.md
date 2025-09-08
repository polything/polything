# Task List: WordPress to Next.js Migration

**Based on:** `prd-wordpress-nextjs-migration.md`  
**Date:** 2025-01-27  
**Status:** Draft  
**Technical Reference:** `docs/wordpress-migration-technical-spec.md`  

## Relevant Files

- `scripts/wp-audit.js` - WordPress site audit and discovery script
- `scripts/wp-audit.test.js` - Unit tests for WordPress audit functionality
- `scripts/test-diagnostic-endpoint.js` - Test script for themerain_* field diagnostic endpoint
- `scripts/test-themerain-fields.js` - Test script for themerain field detection
- `scripts/compare-sites.js` - Comparison script for polything vs mightybooth sites
- `scripts/wp-export.mjs` - Main WordPress content export script (ES modules)
- `scripts/wp-export.js` - WordPress content export script (CommonJS for testing)
- `scripts/wp-export.test.js` - Unit tests for export functionality (21 tests)
- `scripts/wp-media-fetcher.js` - Media download and mirroring script (CommonJS for testing)
- `scripts/wp-media-fetcher.test.js` - Unit tests for media handling (11 tests, 9 passing)
- `lib/logging/error-logger.js` - Comprehensive error logging system
- `lib/logging/error-logger.test.js` - Unit tests for error logging (19 tests, all passing)
- `scripts/test-logging-integration.js` - Integration test for logging system
- `lib/config/config-manager.js` - Configuration management system
- `lib/config/config-manager.test.js` - Unit tests for configuration management (21 tests, all passing)
- `scripts/test-config-integration.js` - Integration test for configuration system
- `lib/content/transformers.js` - Content transformation utilities
- `lib/content/transformers.test.js` - Unit tests for transformation functions
- `lib/content/schema.ts` - TypeScript definitions for content schema
- `lib/content/field-mapper.js` - Field mapping logic (themerain_* → clean schema)
- `lib/content/field-mapper.test.js` - Unit tests for field mapping
- `config/wordpress.json` - WordPress API endpoints and field mapping configuration
- `docs/nextjs-contentlayer-implementation.md` - Complete Next.js implementation guide
- `docs/troubleshooting-guide.md` - Common issues and solutions guide
- `docs/development-workflow.md` - TDD methodology and development process
- `docs/field-mapping-guide.md` - Complete themerain field mapping reference
- `docs/api-endpoints-reference.md` - WordPress API endpoints documentation
- `docs/implementation-status.md` - Current implementation status and progress
- `wordpress-plugin-fix.php` - WordPress plugin to expose themerain_* fields via REST API
- `lib/content/media-resolver.ts` - Media ID to URL resolution
- `lib/content/media-resolver.test.ts` - Unit tests for media resolution
- `lib/content/slug-manager.ts` - Slug collision handling
- `lib/content/slug-manager.test.ts` - Unit tests for slug management
- `contentlayer.config.ts` - Contentlayer configuration
- `contentlayer.config.test.ts` - Tests for contentlayer configuration
- `app/layout.tsx` - Root layout with JSON-LD structured data
- `app/layout.test.tsx` - Tests for root layout
- `app/page.tsx` - Homepage component
- `app/work/[slug]/page.tsx` - Project detail page template
- `app/work/[slug]/page.test.tsx` - Tests for project detail page
- `app/blog/[slug]/page.tsx` - Blog post template
- `app/blog/[slug]/page.test.tsx` - Tests for blog post page
- `app/[slug]/page.tsx` - Static page template
- `app/[slug]/page.test.tsx` - Tests for static page
- `components/hero.tsx` - Hero component for consuming hero.* fields
- `components/hero.test.tsx` - Unit tests for hero component (7 test cases)
- `components/project-detail.tsx` - Project detail layout component
- `components/project-detail.test.tsx` - Unit tests for project detail
- `components/blog-post.tsx` - Blog post layout component
- `components/blog-post.test.tsx` - Unit tests for blog post
- `lib/seo/metadata.ts` - SEO metadata generation utilities
- `lib/seo/metadata.test.ts` - Unit tests for SEO functions
- `lib/seo/sitemap.ts` - XML sitemap generation
- `lib/seo/sitemap.test.ts` - Unit tests for sitemap
- `lib/seo/structured-data.ts` - JSON-LD structured data
- `lib/seo/structured-data.test.ts` - Unit tests for structured data
- `public/images/` - Directory for mirrored media assets
- `content/posts/` - Directory for exported blog posts (MDX)
- `content/pages/` - Directory for exported static pages (MDX)
- `content/projects/` - Directory for exported projects (MDX)
- `tests/e2e/critical-journeys.spec.ts` - E2E tests for user journeys
- `tests/performance/lighthouse.test.js` - Performance testing
- `tests/seo/seo-validation.test.js` - SEO validation tests
- `vercel.json` - Vercel deployment configuration
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `package.json` - Dependencies and scripts
- `jest.config.js` - Jest testing configuration with Next.js integration
- `jest.setup.js` - Jest setup file for global test configuration
- `.babelrc` - Babel configuration for Jest with React support
- `playwright.config.ts` - Playwright E2E testing configuration
- `audit-report.json` - Generated WordPress site audit report

### Notes

- Unit tests should be placed alongside the code files they are testing
- Use `npm test` to run all tests, `npm run test:unit` for unit tests, `npm run test:e2e` for E2E tests
- Media assets will be mirrored from WordPress to `/public/images/` during export
- Content will be exported to `/content/` directory structure for Contentlayer processing
- **For detailed implementation guidance, see:** `docs/wordpress-migration-technical-spec.md`
  - Complete field mapping tables and transformation logic
  - WordPress REST API testing and discovery methods
  - Ready-to-use JavaScript functions for content export
  - Troubleshooting solutions and configuration examples

## Tasks

- [ ] 1.0 Set up WordPress Content Export Infrastructure
  - [x] 1.1 Audit WordPress sites and confirm which subsites to migrate (polything.co.uk only for this phase)
  - [x] 1.2 Enable/confirm WP REST API access for posts, pages, and projects
  - [x] 1.3 Ensure themerain_* meta is exposed via REST (register_post_meta or ACF to REST API plugin)
  - [x] 1.4 Create project directory structure (scripts/, lib/content/, content/, public/images/)
  - [x] 1.5 Implement Node.js exporter script (scripts/wp-export.mjs)
  - [x] 1.6 Add media fetcher to download /wp-content/uploads/** and mirror under /public/images/**
  - [x] 1.7 Set up logging for broken/missing media or content errors
  - [x] 1.8 Create configuration file for WordPress API endpoints and credentials
  - [ ] 1.9 Add error handling and retry logic for API calls

- [ ] 2.0 Implement Content Transformation and Field Mapping
  - [ ] 2.1 Define normalised front-matter schema (hero, links, featured, etc.)
  - [ ] 2.2 Create TypeScript interfaces for content types (Post, Page, Project)
  - [ ] 2.3 Implement field mapping logic (themerain_* → clean schema)
  - [ ] 2.4 Resolve media IDs → URLs → /images/** paths
  - [ ] 2.5 Handle slug collisions (define precedence: page > project > post)
  - [ ] 2.6 Add raw theme_meta block for traceability (optional toggle)
  - [ ] 2.7 Convert WP HTML content body → MDX (preserve embeds, headings, images)
  - [ ] 2.8 Extend front-matter writer to include seo block (defaults + overrides)
  - [ ] 2.9 Add content validator to ensure seo.title/description fallbacks work and lengths are sane
  - [ ] 2.10 Enforce schema type defaults by content type when unspecified
  - [ ] 2.11 Sanitize and clean HTML content (remove WP-specific classes, fix broken links)
  - [ ] 2.12 Run content validation (lint MDX, check YAML schema)
  - [ ] 2.13 Generate content export report (success/failure counts, error summary)

- [x] 3.0 Build Next.js Application with Contentlayer Integration
  - [x] 3.1 Initialise Next.js 14 App Router project
  - [x] 3.2 Install and configure contentlayer
  - [x] 3.3 Define contentlayer document types for posts, pages, projects
  - [x] 3.4 Set up Tailwind CSS with custom design system (colors, fonts, spacing)
  - [x] 3.5 Create hero component to consume hero.* fields
  - [x] 3.6 Create project detail template (/work/[slug])
  - [x] 3.7 Create blog post template (/blog/[slug])
  - [x] 3.8 Create static page template (/[slug])
  - [x] 3.9 Implement global navigation, footer, and site metadata
  - [x] 3.10 Add site-wide JSON-LD for Organization and Website in app/layout.tsx
  - [x] 3.11 Generate per-page JSON-LD in route components based on doc.type and doc.seo
  - [ ] 3.12 Optional: render BreadcrumbList when seo.schema.breadcrumbs present
  - [x] 3.13 Implement canonical URLs using the App Router Metadata API
  - [x] 3.14 Add responsive design and mobile optimization
  - [x] 3.15 Implement image optimization with Next.js Image component
  - [ ] 3.16 Add loading states and error boundaries

- [ ] 4.0 Create Content Validation and Testing Framework
  - [x] 4.1 Set up testing infrastructure (Jest, React Testing Library, Playwright)
  - [ ] 4.2 Unit tests for transformation functions (field mapping, media resolution)
  - [ ] 4.3 Integration tests for WP API → MDX export
  - [x] 4.4 Component tests for hero, project, blog post layouts
  - [ ] 4.5 E2E tests (critical journeys: homepage → project → blog → contact)
  - [ ] 4.6 Performance tests (PageSpeed, Lighthouse, Core Web Vitals)
  - [ ] 4.7 Unit tests for JSON builders (Page/Post/Project)
  - [ ] 4.8 Snapshot tests for JSON-LD output
  - [ ] 4.9 CI step: crawl built pages and validate JSON-LD presence (basic shape)
  - [ ] 4.10 Manual check in Rich Results Test for a sample of each type
  - [ ] 4.11 SEO validation (meta tags, structured data, sitemap)
  - [ ] 4.12 Accessibility testing (WCAG 2.1 compliance)
  - [ ] 4.13 Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - [ ] 4.14 Set up CI/CD pipeline with automated testing

- [ ] 5.0 Deploy and Validate Migration
  - [ ] 5.1 Set up staging environment (Vercel recommended)
  - [ ] 5.2 Configure environment variables and secrets
  - [ ] 5.3 Deploy exported content and validate build
  - [ ] 5.4 Side-by-side QA: Compare WP site vs Next.js site for each migrated page
  - [ ] 5.5 Validate redirects (301 from old WP slugs to new Next.js routes)
  - [ ] 5.6 Run media checks (all hero images, project links load correctly)
  - [ ] 5.7 Final SEO crawl and index validation
  - [ ] 5.8 Compare old vs new pages for schema coverage (type, required fields, canonical)
  - [ ] 5.9 Re-crawl with a lightweight bot to confirm canonical & JSON-LD on all routes
  - [ ] 5.10 Set up monitoring and alerting (error tracking, performance monitoring)
  - [ ] 5.11 Create rollback plan and backup procedures
  - [ ] 5.12 Production deployment
  - [ ] 5.13 Monitor analytics and error logs post-launch
  - [ ] 5.14 Update DNS and domain configuration

- [ ] 6.0 (Optional/Future) Extensibility & Client Rollout
  - [ ] 6.1 Document schema and exporter for reuse in client site migrations
  - [ ] 6.2 Create reusable migration templates and scripts
  - [ ] 6.3 Add CMS integration (KeyStatic, Contentful, etc.) if required
  - [ ] 6.4 Create boilerplate migration guide for future projects (inc. Mightybooth)
  - [ ] 6.5 Set up version control and release management for migration tools
  - [ ] 6.6 Create client onboarding documentation and training materials

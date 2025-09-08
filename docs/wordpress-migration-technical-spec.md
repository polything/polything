# WordPress to Next.js Migration - Technical Specification

**Project:** Polything WordPress Multisite → Next.js Migration  
**Date:** 2025-01-27  
**Status:** Technical Reference  

## Overview

This document provides detailed technical specifications for migrating WordPress content to Next.js with MDX, including field mapping, API integration, and implementation examples.

## 1. Content Types & API Endpoints

### 1.1 Projects (Custom Post Type: project)
- **Source:** `/wp-json/wp/v2/projects/:id` (+ ACF/Meta)
- **Destination:** `/content/projects/[slug]/index.mdx`

### 1.2 Posts
- **Source:** `/wp-json/wp/v2/posts/:id`
- **Destination:** `/content/posts/[slug]/index.mdx`

### 1.3 Pages
- **Source:** `/wp-json/wp/v2/pages/:id`
- **Destination:** `/content/pages/[slug]/index.mdx`

## 2. Field Mapping Specifications

### 2.1 Projects Field Mapping

| WP Meta Key | Normalised Field | Notes |
|-------------|------------------|-------|
| `themerain_hero_title` | `hero.title` | String |
| `themerain_hero_subtitle` | `hero.subtitle` | String |
| `themerain_hero_image` | `hero.image` | Resolve ID → URL |
| `themerain_hero_video` | `hero.video` | Resolve ID → URL |
| `themerain_project_link_url` | `links.url` | String |
| `themerain_project_link_image` | `links.image` | Resolve ID → URL |
| `themerain_project_link_video` | `links.video` | Resolve ID → URL |
| `themerain_hero_text_color` | `hero.text_color` | Optional |
| `themerain_hero_bg_color` | `hero.background_color` | Optional |

### 2.2 Posts Field Mapping

| WP Meta Key | Normalised Field | Notes |
|-------------|------------------|-------|
| `featured toggle` | `featured` | Boolean |
| `themerain_hero_title` | `hero.title` | String |
| `themerain_hero_subtitle` | `hero.subtitle` | String |
| `themerain_hero_image` | `hero.image` | Resolve ID → URL |
| `themerain_hero_video` | `hero.video` | Resolve ID → URL |
| `themerain_hero_text_color` | `hero.text_color` | Optional |
| `themerain_hero_bg_color` | `hero.background_color` | Optional |

### 2.3 Pages Field Mapping

| WP Meta Key | Normalised Field | Notes |
|-------------|------------------|-------|
| `themerain_page_title` / `themerain_hero_title` | `hero.title` | Fallback priority |
| `themerain_page_subtitle` / `themerain_hero_subtitle` | `hero.subtitle` | String |
| `themerain_hero_image` | `hero.image` | Resolve ID → URL |
| `themerain_hero_video` | `hero.video` | Resolve ID → URL |
| `themerain_page_text_color` / `themerain_hero_text_color` | `hero.text_color` | Optional |
| `themerain_page_bg_color` / `themerain_hero_bg_color` | `hero.background_color` | Optional |

## 3. Normalised Front-Matter Schema

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

### 3.1 Example Front-Matter

```yaml
---
title: "Blackriver's 297% Sales Surge"
slug: blackriver
type: project           # 'project' | 'post' | 'page' | other CPT
date: 2024-03-01
updated: 2024-06-10
categories: ["Work"]
tags: ["eCommerce","Strategy"]
featured: false         # posts only (if present)

hero:
  title: "Blackriver's 297% Sales Surge"
  subtitle: "Read more about their Christmas strategy success"
  image: "/images/2023/11/hero.jpg"   # local path after mirroring
  video: "/images/2023/11/hero.mp4"   # or keep remote until mirrored
  text_color: "#ffffff"               # optional
  background_color: "#000000"         # optional

links:                  # projects only (if present)
  url: "https://example.com/case-study"
  image: "/images/2024/02/thumb.jpg"
  video: "/images/2024/02/teaser.mp4"

# keep raw for full traceability (optional toggle)
theme_meta:
  themerain_hero_title_alignment: "center"
  themerain_hero_title_size: "large"
  ...
---
```

## 4. Exporter Workflow

### 4.1 Content Fetching Process

1. **Fetch content via WP REST API:**
   - `wp/v2/posts`
   - `wp/v2/pages` 
   - `wp/v2/projects`
   - Include `_embed` for author/terms

2. **Resolve media:**
   - Call `/wp/v2/media/:id` for each attachment
   - Convert to `/images/...` path

3. **Transform meta:**
   - Map `themerain_*` fields → hero and links
   - Optional: include `theme_meta` for traceability

4. **Write files:**
   - Each content item → `/content/{type}/{slug}/index.mdx`
   - Front-matter + body

5. **Mirror media:**
   - Download `/wp-content/uploads/**`
   - Save under `/public/images/**`

## 5. Implementation Code

### 5.1 WordPress Meta Mapping Implementation

```javascript
/* =======================
 * THEMERAIN META MAPPING
 * =======================
 */

// Resolve WP attachment ID -> direct source URL via /wp/v2/media/:id
async function resolveMediaUrl(siteBase, id) {
  if (!id || String(id).trim() === '') return null;
  const res = await fetch(`${siteBase}wp-json/wp/v2/media/${id}`, { 
    headers: { Accept: 'application/json' } 
  });
  if (!res.ok) return null;
  const m = await res.json();
  // Prefer 'source_url' (standard WP field)
  return m?.source_url || null;
}

// Converts absolute WP upload URL to local /images path we mirror to public/images/**
function toLocalImagesPath(absUrl) {
  if (!absUrl) return null;
  const m = absUrl.match(/wp-content\/uploads\/(.+)$/);
  return m ? `/images/${m[1]}` : absUrl; // leave untouched if not in uploads
}

// Extract themerain_* fields from a WP item
function extractThemeRainMeta(item) {
  const meta = {};
  // item may contain meta in several ways; many themes copy them into 'meta' array or as postmeta REST fields.
  // We'll sweep known prefixes from top-level (some hosts expose them) and from 'meta' object if present.
  const candidates = Object.assign({}, item, item?.meta || {});
  for (const [k, v] of Object.entries(candidates)) {
    if (k.startsWith('themerain_')) meta[k] = v;
  }
  return meta;
}

// Build normalised structure from themerain_* keys + type
async function buildNormalisedFromThemeRain(siteBase, item, typeSlug) {
  const tr = extractThemeRainMeta(item);

  // Helper to pick first non-empty value
  const pick = (...keys) => {
    for (const k of keys) {
      const val = tr[k];
      if (val !== undefined && val !== null && String(val).trim() !== '') return val;
    }
    return null;
  };

  // Resolve hero media (IDs -> URLs -> /images path)
  const heroImageId = pick('themerain_hero_image');
  const heroVideoId = pick('themerain_hero_video');

  const heroImageUrlRemote = await resolveMediaUrl(siteBase, heroImageId);
  const heroVideoUrlRemote = await resolveMediaUrl(siteBase, heroVideoId);

  const heroImage = toLocalImagesPath(heroImageUrlRemote);
  const heroVideo = toLocalImagesPath(heroVideoUrlRemote);

  const hero = {
    title: pick('themerain_hero_title', 'themerain_page_title'),
    subtitle: pick('themerain_hero_subtitle', 'themerain_page_subtitle'),
    image: heroImage,
    video: heroVideo,
    text_color: pick('themerain_hero_text_color', 'themerain_page_text_color'),
    background_color: pick('themerain_hero_bg_color', 'themerain_page_bg_color'),
  };

  // Project links
  const links = (typeSlug === 'project') ? {
    url: pick('themerain_project_link_url'),
    image: toLocalImagesPath(await resolveMediaUrl(siteBase, pick('themerain_project_link_image'))),
    video: toLocalImagesPath(await resolveMediaUrl(siteBase, pick('themerain_project_link_video'))),
  } : null;

  // Featured (posts)
  const featured = (typeSlug === 'post')
    ? (String(pick('themerain_featured', 'featured')).toLowerCase() === '1' ||
       String(pick('themerain_featured', 'featured')).toLowerCase() === 'on')
    : undefined;

  return { hero, links, featured, theme_meta: tr };
}
```

### 5.2 Integration in Export Loop

```javascript
/* =======================
 * INTEGRATE IN YOUR LOOP
 * =======================
 * Inside your export loop (for each item), call:
 */

const norm = await buildNormalisedFromThemeRain(SITE, item, t.slug);
const extraFm = {
  hero: norm.hero,
  ...(norm.links ? { links: norm.links } : {}),
  ...(typeof norm.featured === 'boolean' ? { featured: norm.featured } : {}),
  // keep raw meta only if you want full parity (optional)
  // theme_meta: norm.theme_meta
};
const fm = toFrontmatter(item, extraFm);
await fs.writeFile(path.join(slugDir, 'index.mdx'), fm + body, 'utf8');
```

## 6. Next.js Rendering Implementation

### 6.1 Project Detail Page Template

```typescript
// app/work/[slug]/page.tsx
import { allDocuments } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer/hooks';

const projects = allDocuments.filter(d => d.type === 'project');

export async function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const doc = projects.find(d => d.slug === params.slug);
  if (!doc) return notFound();
  const MDX = useMDXComponent(doc.body.code);

  const hero = (doc.hero ?? {}) as any;
  const links = (doc.links ?? {}) as any;

  return (
    <article>
      <header>
        <h1>{hero.title || doc.title}</h1>
        {hero.subtitle && <p>{hero.subtitle}</p>}
        {hero.image && <img src={hero.image} alt={hero.title || doc.title} />}
      </header>

      <MDX />

      {links?.url && (
        <p><a href={links.url}>View project link</a></p>
      )}
    </article>
  );
}
```

### 6.2 Rendering Requirements

- Use contentlayer to load front-matter + body
- Define collections: Projects, Posts, Pages
- Build static routes:
  - `/work/[slug]` → Project detail
  - `/blog/[slug]` → Post detail
  - `/[slug]` → Page detail
- Hero component should read from hero block
- Project templates should display links if present

## 7. WordPress REST API Configuration & Testing

### 7.1 REST API Discovery and Testing

#### 7.1.1 Find Your REST Base for Custom Post Types

```bash
# Discover available post types and their REST endpoints
curl -s https://polything.co.uk/wp-json/wp/v2/types | jq '.project'
```

Look for `rest_base` (often "projects"). This tells you the endpoint structure.

#### 7.1.2 Fetch Sample Project and Inspect ACF

**If ACF is exposed natively (ACF 5.11+ and "Show in REST" enabled):**

```bash
# Replace REST base and ID with real values
curl -s "https://polything.co.uk/wp-json/wp/v2/projects/123?_embed=author,wp:term" | jq '.acf'
```

Expected response:
```json
{
  "client_name": "Bluefort Security",
  "sector": "Cybersecurity",
  "hero_image": {
    "url": "https://polything.co.uk/wp-content/uploads/2024/03/hero.jpg",
    "alt": "Hero"
  },
  "cta_text": "See the work",
  "cta_url": "https://polything.co.uk/work/bluefort-security/"
}
```

**If not exposed natively, use ACF-to-REST API plugin:**

```bash
# Using the plural rest base discovered above
curl -s "https://polything.co.uk/wp-json/acf/v3/projects/123" | jq '.acf'
```

Same outcome, different endpoint.

#### 7.1.3 Quick Node Script for Field Discovery

```javascript
// node scripts/peek-project-acf.mjs
const SITE = 'https://polything.co.uk/';
const REST_BASE = 'projects'; // adjust after checking /wp/v2/types

const url = `${SITE}wp-json/wp/v2/${REST_BASE}?per_page=1&_embed=1`;
const res = await fetch(url); 
const [item] = await res.json();

if (!item) { 
  console.log('No projects found'); 
  process.exit(0); 
}

let acf = item.acf;
if (!acf) {
  const alt = await fetch(`${SITE}wp-json/acf/v3/${REST_BASE}/${item.id}`)
    .then(r => r.ok ? r.json() : null);
  acf = alt?.acf;
}

if (!acf) { 
  console.log('No ACF visible via REST'); 
  process.exit(0); 
}

console.log('Field names:', Object.keys(acf));
```

This script uses the core posts endpoint first, then falls back to `acf/v3`.

### 7.2 Export ACF JSON (Definitive Field List)

#### 7.2.1 WordPress Admin Export

1. **Tools → Export Field Groups:** Export the group(s) used on projects to JSON
2. **Inspect for name (machine name) and key** in the exported JSON

#### 7.2.2 Local JSON (if enabled)

Check `/wp-content/acf-json/` for `*.json` files of your field groups.

Both methods give you a full, versionable specification of fields (great for the repository).

### 7.3 PHP Snippet for Field Discovery

If you can render a single project, drop this in a safe template temporarily:

```php
<?php
$post_id = get_queried_object_id(); // current project
$fields = get_field_objects($post_id);

if ($fields) {
  foreach ($fields as $name => $field) {
    echo esc_html($name) . ': ';
    if (is_array($field['value'])) {
      echo '<pre>' . esc_html(json_encode($field['value'], JSON_PRETTY_PRINT)) . '</pre>';
    } else {
      echo esc_html((string)$field['value']);
    }
    echo '<hr />';
  }
}
?>
```

This prints field names (keys you'll use) with values. See also `acf_get_field_groups()` if you want to list groups bound to the current post.

### 7.4 Database Peek (Last Resort)

Query `wp_postmeta` for one known project post ID:

```sql
SELECT meta_key, LEFT(meta_value, 120) AS preview
FROM wp_postmeta
WHERE post_id = 123
AND meta_key NOT LIKE '\_%'
ORDER BY meta_key;
```

**Important Notes:**
- ACF stores the value under `meta_key = <field_name>`
- It also stores the field key under an underscored meta key like `_<field_name>` (e.g., `_client_name`), whose value is something like `field_abc123`
- This helps confirm the exact field names you'll see in REST (field name vs field key background)

### 7.5 Exposing Custom Meta Fields

If your theme doesn't expose post meta via REST by default, you can:

1. **Enable with register_post_meta:**
   ```php
   register_post_meta('project', 'themerain_hero_title', [
     'show_in_rest' => true
   ]);
   ```

2. **Use ACF to REST API plugin** if fields are registered via ACF

3. **Add custom endpoint** to return `get_post_meta()` (least preferred)

## 8. Why This Approach is Robust

1. **Content Preservation:** Keeps all content while dropping theme cruft by default
2. **Traceability:** Access everything via `theme_meta` if needed for debugging
3. **Media Resolution:** Uses official Media endpoint (`/wp/v2/media/:id`) for reliable asset handling
4. **Future-Proof:** Normalised schema independent of WordPress theme naming
5. **Clean Architecture:** Separates content from presentation concerns
6. **Extensible:** Easy to adapt for future CMS integrations or client migrations

## 9. Troubleshooting

### 9.1 ACF Integration Issues

**No ACF object in the core endpoint:**
- Ensure ACF ≥ 5.11 and "Show in REST API" is enabled for that field group
- Install the ACF to REST API plugin as an alternative
- Reference: [ACF REST API Integration](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/)

**404 on /acf/v3/...:**
- The ACF to REST API plugin isn't active or is blocked
- Use the native ACF REST support or admin UI methods instead
- Check plugin activation and server configuration

**Nested Group fields look odd:**
- Remember the concatenation rule (group_subfield) for nested fields
- Reference: [ACF Group Field Documentation](https://www.advancedcustomfields.com/resources/group/)

### 9.2 Common Migration Issues

**Media resolution failures:**
- Verify WordPress Media endpoint is accessible: `/wp-json/wp/v2/media/`
- Check media file permissions and server configuration
- Ensure media files exist and are not corrupted

**Meta field exposure issues:**
- Verify `register_post_meta` with `show_in_rest => true`
- Check if custom post types have REST API support enabled
- Test endpoint accessibility: `/wp-json/wp/v2/projects/` (for custom post types)

**Content transformation errors:**
- Validate WordPress content structure before transformation
- Check for malformed HTML or special characters
- Ensure proper encoding (UTF-8) throughout the process

## 10. Official Documentation References

### 10.1 ACF (Advanced Custom Fields)
- **ACF WP REST API Integration (native support):** [https://www.advancedcustomfields.com/resources/wp-rest-api-integration/](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/)
- **ACF 5.11 Release (REST support):** [https://www.advancedcustomfields.com/blog/acf-5-11-release-rest-api/](https://www.advancedcustomfields.com/blog/acf-5-11-release-rest-api/)
- **ACF to REST API Plugin:** [https://wordpress.org/plugins/acf-to-rest-api/](https://wordpress.org/plugins/acf-to-rest-api/)
- **ACF to REST API GitHub:** [https://github.com/airesvsg/acf-to-rest-api](https://github.com/airesvsg/acf-to-rest-api)
- **ACF Group Field (naming rule):** [https://www.advancedcustomfields.com/resources/group/](https://www.advancedcustomfields.com/resources/group/)

### 10.2 WordPress REST API
- **WP REST API Posts (pattern applies to CPTs):** [https://developer.wordpress.org/rest-api/reference/posts/](https://developer.wordpress.org/rest-api/reference/posts/)
- **WP REST API Reference Index:** [https://developer.wordpress.org/rest-api/reference/](https://developer.wordpress.org/rest-api/reference/)
- **WP REST API Media Endpoint:** [https://developer.wordpress.org/rest-api/reference/media/](https://developer.wordpress.org/rest-api/reference/media/)
- **Extending the REST API:** [https://developer.wordpress.org/rest-api/extending-the-rest-api/](https://developer.wordpress.org/rest-api/extending-the-rest-api/)

### 10.3 Next.js & Contentlayer
- **Next.js App Router:** [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
- **Contentlayer Documentation:** [https://www.contentlayer.dev/docs/](https://www.contentlayer.dev/docs/)
- **Next.js Image Optimization:** [https://nextjs.org/docs/app/api-reference/components/image](https://nextjs.org/docs/app/api-reference/components/image)

## 11. SEO Schema Markup Implementation

### 11.1 JSON-LD Generation Utilities

```typescript
// lib/seo/jsonld.ts
type Doc = {
  type: 'page' | 'post' | 'project' | string;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  updated?: string;
  hero?: { image?: string };
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    schema?: {
      type?: 'WebPage' | 'Article' | 'BlogPosting' | 'CreativeWork';
      image?: string;
      author?: string;
      publishDate?: string;
      modifiedDate?: string;
      breadcrumbs?: { name: string; url: string }[];
    };
  };
};

export function absoluteUrl(base: string, path: string) {
  if (!path.startsWith('/')) return path;
  return base.replace(/\/$/, '') + path;
}

export function canonicalFor(base: string, doc: Doc) {
  if (doc?.seo?.canonical) return doc.seo.canonical;
  const path =
    doc.type === 'project' ? `/work/${doc.slug}` :
    doc.type === 'post'    ? `/blog/${doc.slug}` :
    `/${doc.slug}`;
  return absoluteUrl(base, path);
}

export function pickSeoTitle(doc: Doc) {
  return doc?.seo?.title || doc.title;
}

export function pickSeoDesc(doc: Doc) {
  const d = doc?.seo?.description || doc.excerpt || '';
  return d.length > 0 ? (d.length > 160 ? (d.slice(0,157) + '…') : d) : undefined;
}

export function pickSchemaType(doc: Doc) {
  const manual = doc?.seo?.schema?.type;
  if (manual) return manual;
  if (doc.type === 'project') return 'CreativeWork';
  if (doc.type === 'post') return 'BlogPosting';
  return 'WebPage';
}

export function pickImage(doc: Doc, base: string) {
  const img = doc?.seo?.schema?.image || doc?.hero?.image;
  return img ? absoluteUrl(base, img) : undefined;
}

export function articleDates(doc: Doc) {
  return {
    datePublished: doc?.seo?.schema?.publishDate || doc?.date,
    dateModified: doc?.seo?.schema?.modifiedDate || doc?.updated || doc?.date,
  };
}

export function breadcrumbsJsonLd(base: string, crumbs: {name:string; url:string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: absoluteUrl(base, c.url),
    })),
  };
}

export function orgJsonLd(base: string, opts: { name: string; logo?: string; sameAs?: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: opts.name,
    url: base,
    ...(opts.logo ? { logo: absoluteUrl(base, opts.logo) } : {}),
    ...(opts.sameAs?.length ? { sameAs: opts.sameAs } : {}),
  };
}

export function websiteJsonLd(base: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: base,
  };
}

export function pageJsonLd(base: string, doc: Doc) {
  const url = canonicalFor(base, doc);
  const name = pickSeoTitle(doc);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    headline: name,
    url,
    ...(pickSeoDesc(doc) ? { description: pickSeoDesc(doc) } : {}),
    ...(doc.updated || doc.date ? { dateModified: articleDates(doc).dateModified } : {}),
    ...(pickImage(doc, base) ? { image: pickImage(doc, base) } : {}),
  };
}

export function articleJsonLd(base: string, doc: Doc) {
  const url = canonicalFor(base, doc);
  const name = pickSeoTitle(doc);
  const { datePublished, dateModified } = articleDates(doc);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: name,
    url,
    ...(pickSeoDesc(doc) ? { description: pickSeoDesc(doc) } : {}),
    ...(pickImage(doc, base) ? { image: [pickImage(doc, base)!] } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(doc?.seo?.schema?.author ? { author: { '@type': 'Organization', name: doc.seo.schema.author } } : {}),
    mainEntityOfPage: url,
  };
}

export function creativeWorkJsonLd(base: string, doc: Doc) {
  const url = canonicalFor(base, doc);
  const name = pickSeoTitle(doc);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    url,
    ...(pickSeoDesc(doc) ? { description: pickSeoDesc(doc) } : {}),
    ...(pickImage(doc, base) ? { image: [pickImage(doc, base)!] } : {}),
    ...(doc.updated || doc.date ? { dateModified: articleDates(doc).dateModified } : {}),
  };
}
```

### 11.2 Site-wide Schema Implementation

```typescript
// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { orgJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';

const BASE_URL = 'https://polything.co.uk';
const ORG = { 
  name: 'Polything Ltd', 
  logo: '/images/logo.png', 
  sameAs: [
    'https://www.linkedin.com/company/polything',
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: 'Polything', template: '%s | Polything' },
  description: 'Strategy, GTM and story-driven growth.',
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = orgJsonLd(BASE_URL, ORG);
  const site = websiteJsonLd(BASE_URL, 'Polything');

  return (
    <html lang="en">
      <body>{children}</body>
      <Script id="ld-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <Script id="ld-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
    </html>
  );
}
```

### 11.3 Per-Page Schema Implementation

```typescript
// app/work/[slug]/page.tsx - Project pages
import { allDocuments } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { canonicalFor, creativeWorkJsonLd } from '@/lib/seo/jsonld';

const BASE_URL = 'https://polything.co.uk';

export async function generateStaticParams() {
  return allDocuments.filter(d => d.type === 'project').map(d => ({ slug: d.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const doc = allDocuments.find(d => d.type === 'project' && d.slug === params.slug);
  if (!doc) return notFound();
  const MDX = useMDXComponent(doc.body.code);

  const jsonld = creativeWorkJsonLd(BASE_URL, doc as any);
  const canonical = canonicalFor(BASE_URL, doc as any);

  return (
    <article>
      <Script id="ld-project" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <link rel="canonical" href={canonical} />
      <h1>{(doc as any).hero?.title || doc.title}</h1>
      <MDX />
    </article>
  );
}
```

```typescript
// app/blog/[slug]/page.tsx - Blog posts
import { allDocuments } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { articleJsonLd, canonicalFor } from '@/lib/seo/jsonld';

const BASE_URL = 'https://polything.co.uk';

export async function generateStaticParams() {
  return allDocuments.filter(d => d.type === 'post').map(d => ({ slug: d.slug }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const doc = allDocuments.find(d => d.type === 'post' && d.slug === params.slug);
  if (!doc) return notFound();
  const MDX = useMDXComponent(doc.body.code);

  const jsonld = articleJsonLd(BASE_URL, doc as any);
  const canonical = canonicalFor(BASE_URL, doc as any);

  return (
    <article>
      <Script id="ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <link rel="canonical" href={canonical} />
      <h1>{(doc as any).hero?.title || doc.title}</h1>
      <MDX />
    </article>
  );
}
```

### 11.4 Testing & Validation

```typescript
// tests/seo/jsonld.test.ts
import { pageJsonLd, articleJsonLd, creativeWorkJsonLd } from '@/lib/seo/jsonld';

describe('JSON-LD Generation', () => {
  const baseUrl = 'https://polything.co.uk';
  
  test('generates correct WebPage schema', () => {
    const doc = {
      type: 'page',
      slug: 'about',
      title: 'About Us',
      excerpt: 'Learn about our company',
      updated: '2024-01-15'
    };
    
    const result = pageJsonLd(baseUrl, doc);
    
    expect(result['@type']).toBe('WebPage');
    expect(result.headline).toBe('About Us');
    expect(result.url).toBe('https://polything.co.uk/about');
  });
  
  test('generates correct BlogPosting schema', () => {
    const doc = {
      type: 'post',
      slug: 'marketing-tips',
      title: 'Marketing Tips',
      date: '2024-01-01',
      updated: '2024-01-15'
    };
    
    const result = articleJsonLd(baseUrl, doc);
    
    expect(result['@type']).toBe('BlogPosting');
    expect(result.headline).toBe('Marketing Tips');
    expect(result.datePublished).toBe('2024-01-01');
  });
  
  test('generates correct CreativeWork schema', () => {
    const doc = {
      type: 'project',
      slug: 'client-case-study',
      title: 'Client Case Study',
      updated: '2024-01-15'
    };
    
    const result = creativeWorkJsonLd(baseUrl, doc);
    
    expect(result['@type']).toBe('CreativeWork');
    expect(result.name).toBe('Client Case Study');
    expect(result.url).toBe('https://polything.co.uk/work/client-case-study');
  });
});
```

### 11.5 Validation Tools & References

- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org Validator:** https://validator.schema.org/
- **JSON-LD Playground:** https://json-ld.org/playground/
- **Schema.org Types:** https://schema.org/
- **Google Structured Data Guidelines:** https://developers.google.com/search/docs/appearance/structured-data

## 12. Implementation Notes

- Ensure image mirroring step grabs `/wp-content/uploads/**` so hero/links assets resolve locally
- All media IDs are resolved to URLs using the official WordPress Media endpoint
- Fallback logic handles missing or empty meta fields gracefully
- Raw theme meta is preserved for full traceability when needed
- The schema is designed to be CMS-agnostic for future migrations
- Test all endpoints before running the full migration
- Implement proper error handling and logging throughout the export process
- Validate content integrity after transformation and before deployment

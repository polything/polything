/**
 * TypeScript interfaces for content schema
 * Based on the PRD front-matter schema specification
 */

export interface HeroFields {
  title: string;
  subtitle: string;
  image: string;   // /images/* path
  video: string;   // /images/* path
  text_color: string;
  background_color: string;
}

export interface ProjectLinks {
  url: string;
  image: string;   // /images/* path
  video: string;   // /images/* path
}

export interface SEOSchema {
  title?: string;
  description?: string;
  canonical?: string;
  schema?: {
    type: 'WebPage' | 'Article' | 'BlogPosting' | 'CreativeWork';
    image?: string;
    author?: string;
    publishDate?: string;
    modifiedDate?: string;
    breadcrumbs?: Array<{
      name: string;
      url: string;
    }>;
  };
}

export interface BaseContent {
  title: string;
  slug: string;
  type: 'project' | 'post' | 'page';
  date: string;        // ISO date
  updated: string;     // ISO date
  categories: number[];
  tags: number[];
  hero: HeroFields;
  seo: SEOSchema;
}

export interface ProjectContent extends BaseContent {
  type: 'project';
  links: ProjectLinks;
}

export interface PostContent extends BaseContent {
  type: 'post';
  featured: boolean;
}

export interface PageContent extends BaseContent {
  type: 'page';
}

export type ContentType = ProjectContent | PostContent | PageContent;

export interface WordPressPost {
  id: number;
  title: { rendered: string };
  slug: string;
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  categories: number[];
  tags: number[];
  featured_media: number;
  meta: Record<string, any>;
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  media_type: 'image' | 'video';
  mime_type: string;
  alt_text?: string;
  caption?: { rendered: string };
}

export interface MediaReference {
  id: string;
  originalUrl: string;
  localPath: string;
  mediaType?: string;
  error?: string;
}

export interface TransformedContent {
  frontMatter: ContentType;
  content: string;
  mediaReferences: Record<string, MediaReference>;
}

export interface ExportConfig {
  wordpressUrl: string;
  outputDir: string;
  mediaDir: string;
  contentTypes: string[];
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface ExportResult {
  success: boolean;
  exported: number;
  failed: number;
  errors: Array<{
    type: 'content' | 'media';
    id: string;
    error: string;
  }>;
  duration: number;
}

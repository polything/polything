/**
 * Content transformation utilities for converting WordPress content to MDX
 */

const { mapThemerainFields } = require('./field-mapper.js');

/**
 * Transforms WordPress content to MDX-ready format
 * @param {Object} wpPost - WordPress post object from REST API
 * @param {string} contentType - Content type: 'project', 'post', or 'page'
 * @param {Object} mediaData - Media ID to URL mapping
 * @returns {Object} Transformed content with frontMatter, content, and mediaReferences
 */
function transformWordPressContent(wpPost, contentType, mediaData = {}) {
  // Extract basic post data
  const frontMatter = {
    title: wpPost.title?.rendered || "",
    slug: wpPost.slug || "",
    type: contentType,
    date: wpPost.date || "",
    updated: wpPost.modified || wpPost.date || "",
    categories: wpPost.categories || [],
    tags: wpPost.tags || []
  };

  // Add featured flag for posts
  if (contentType === 'post') {
    frontMatter.featured = wpPost.featured_media ? true : false;
  }

  // Transform themerain fields
  const themerainFields = mapThemerainFields(wpPost.meta || {}, contentType);
  Object.assign(frontMatter, themerainFields);

  // Add SEO fields (will be enhanced later)
  frontMatter.seo = {
    title: frontMatter.title,
    description: extractExcerpt(wpPost.excerpt?.rendered || ""),
    canonical: `https://polything.co.uk/${getCanonicalPath(contentType, frontMatter.slug)}`
  };

  // Sanitize and prepare content
  const content = sanitizeHTMLContent(wpPost.content?.rendered || "");
  
  // Extract media references
  const mediaReferences = extractMediaReferences(content, mediaData);

  return {
    frontMatter,
    content,
    mediaReferences
  };
}

/**
 * Resolves media IDs to local paths
 * @param {Array<string>} mediaIds - Array of media IDs
 * @param {Object} mediaData - Media ID to data mapping
 * @returns {Object} Media ID to resolved data mapping
 */
function resolveMediaIds(mediaIds, mediaData) {
  const resolved = {};
  
  for (const mediaId of mediaIds) {
    if (mediaData[mediaId]) {
      const media = mediaData[mediaId];
      resolved[mediaId] = {
        id: mediaId,
        originalUrl: media.source_url,
        localPath: convertToLocalPath(media.source_url),
        mediaType: media.media_type || 'image'
      };
    } else {
      resolved[mediaId] = {
        id: mediaId,
        error: 'Media not found'
      };
    }
  }
  
  return resolved;
}

/**
 * Generates YAML front-matter string for MDX
 * @param {Object} frontMatter - Front-matter object
 * @returns {string} YAML front-matter string
 */
function generateMDXFrontMatter(frontMatter) {
  const yamlLines = ['---'];
  
  // Add basic fields
  const basicFields = ['title', 'slug', 'type', 'date', 'updated', 'categories', 'tags', 'featured'];
  for (const field of basicFields) {
    if (frontMatter[field] !== undefined) {
      const value = typeof frontMatter[field] === 'string' ? `"${frontMatter[field]}"` : frontMatter[field];
      yamlLines.push(`${field}: ${value}`);
    }
  }
  
  // Add hero section
  if (frontMatter.hero) {
    yamlLines.push('hero:');
    for (const [key, value] of Object.entries(frontMatter.hero)) {
      const yamlValue = typeof value === 'string' ? `"${value}"` : value;
      yamlLines.push(`  ${key}: ${yamlValue}`);
    }
  }
  
  // Add links section (for projects)
  if (frontMatter.links) {
    yamlLines.push('links:');
    for (const [key, value] of Object.entries(frontMatter.links)) {
      const yamlValue = typeof value === 'string' ? `"${value}"` : value;
      yamlLines.push(`  ${key}: ${yamlValue}`);
    }
  }
  
  // Add SEO section
  if (frontMatter.seo) {
    yamlLines.push('seo:');
    for (const [key, value] of Object.entries(frontMatter.seo)) {
      const yamlValue = typeof value === 'string' ? `"${value}"` : value;
      yamlLines.push(`  ${key}: ${yamlValue}`);
    }
  }
  
  yamlLines.push('---');
  return yamlLines.join('\n');
}

/**
 * Sanitizes HTML content by removing WordPress-specific classes and attributes
 * @param {string} html - Raw HTML content
 * @returns {string} Sanitized HTML content
 */
function sanitizeHTMLContent(html) {
  if (!html) return "";
  
  // Remove WordPress-specific classes
  let sanitized = html
    .replace(/class="[^"]*wp-[^"]*"/g, '') // Remove wp-* classes
    .replace(/class="[^"]*has-[^"]*"/g, '') // Remove has-* classes
    .replace(/class="[^"]*align[^"]*"/g, '') // Remove align classes
    .replace(/class="[^"]*size-[^"]*"/g, '') // Remove size classes
    .replace(/class=""/g, '') // Remove empty class attributes
    .replace(/class="\s*"/g, '') // Remove whitespace-only class attributes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\s+>/g, '>') // Remove spaces before closing tags
    .trim();
  
  // Clean up any remaining WordPress artifacts
  sanitized = sanitized
    .replace(/<!-- wp:[^>]*-->/g, '') // Remove WordPress block comments
    .replace(/<!-- \/wp:[^>]*-->/g, '') // Remove WordPress block end comments
    .replace(/data-[^=]*="[^"]*"/g, '') // Remove data attributes
    .replace(/\s+/g, ' ') // Normalize whitespace again
    .trim();
  
  return sanitized;
}

/**
 * Extracts media references from content
 * @param {string} content - HTML content
 * @param {Object} mediaData - Media ID to data mapping
 * @returns {Object} Media references found in content
 */
function extractMediaReferences(content, mediaData) {
  const references = {};
  
  // Find media IDs in content (this is a simplified version)
  const mediaIdRegex = /media[_-]?id[=:]\s*(\d+)/gi;
  let match;
  
  while ((match = mediaIdRegex.exec(content)) !== null) {
    const mediaId = match[1];
    if (mediaData[mediaId]) {
      references[mediaId] = {
        id: mediaId,
        originalUrl: mediaData[mediaId].source_url,
        localPath: convertToLocalPath(mediaData[mediaId].source_url)
      };
    }
  }
  
  return references;
}

/**
 * Converts WordPress media URL to local path
 * @param {string} mediaUrl - WordPress media URL
 * @returns {string} Local path for the media file
 */
function convertToLocalPath(mediaUrl) {
  if (!mediaUrl) return "";
  
  // Extract path from WordPress uploads URL
  const uploadsMatch = mediaUrl.match(/\/wp-content\/uploads\/(.+)$/);
  if (uploadsMatch) {
    return `/images/${uploadsMatch[1]}`;
  }
  
  // If not a WordPress upload, return as-is (external URL)
  return mediaUrl;
}

/**
 * Extracts clean excerpt from WordPress excerpt
 * @param {string} excerpt - WordPress excerpt HTML
 * @returns {string} Clean excerpt text
 */
function extractExcerpt(excerpt) {
  if (!excerpt) return "";
  
  // Remove HTML tags and decode entities
  return excerpt
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 160); // Limit to 160 characters for SEO
}

/**
 * Generates canonical path for content
 * @param {string} contentType - Content type
 * @param {string} slug - Content slug
 * @returns {string} Canonical path
 */
function getCanonicalPath(contentType, slug) {
  switch (contentType) {
    case 'project':
      return `work/${slug}`;
    case 'post':
      return `blog/${slug}`;
    case 'page':
      return slug;
    default:
      return slug;
  }
}

module.exports = {
  transformWordPressContent,
  resolveMediaIds,
  generateMDXFrontMatter,
  sanitizeHTMLContent,
  extractMediaReferences,
  convertToLocalPath,
  extractExcerpt,
  getCanonicalPath
};

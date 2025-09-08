/**
 * Media resolution utilities for converting WordPress media IDs to local paths
 * Handles media ID → URL → /images/** path conversion
 */

export interface MediaData {
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
  altText?: string;
  caption?: string;
  error?: string;
}

export interface MediaResolutionResult {
  resolved: Record<string, MediaReference>;
  errors: Array<{
    mediaId: string;
    error: string;
  }>;
  stats: {
    total: number;
    resolved: number;
    failed: number;
  };
}

/**
 * Resolves media IDs to local paths using media data mapping
 * @param mediaIds - Array of media IDs to resolve
 * @param mediaData - Media ID to data mapping
 * @returns Media resolution result with resolved references and errors
 */
export function resolveMediaIds(
  mediaIds: string[], 
  mediaData: Record<string, MediaData>
): MediaResolutionResult {
  const resolved: Record<string, MediaReference> = {};
  const errors: Array<{ mediaId: string; error: string }> = [];
  
  for (const mediaId of mediaIds) {
    try {
      if (mediaData[mediaId]) {
        const media = mediaData[mediaId];
        resolved[mediaId] = {
          id: mediaId,
          originalUrl: media.source_url,
          localPath: convertToLocalPath(media.source_url),
          mediaType: media.media_type,
          altText: media.alt_text,
          caption: media.caption?.rendered
        };
      } else {
        errors.push({
          mediaId,
          error: 'Media not found in media data'
        });
      }
    } catch (error) {
      errors.push({
        mediaId,
        error: `Failed to resolve media: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }
  
  return {
    resolved,
    errors,
    stats: {
      total: mediaIds.length,
      resolved: Object.keys(resolved).length,
      failed: errors.length
    }
  };
}

/**
 * Resolves a single media ID to local path
 * @param mediaId - Media ID to resolve
 * @param mediaData - Media data mapping
 * @returns Media reference or null if not found
 */
export function resolveSingleMediaId(
  mediaId: string, 
  mediaData: Record<string, MediaData>
): MediaReference | null {
  if (!mediaId || !mediaData[mediaId]) {
    return null;
  }
  
  const media = mediaData[mediaId];
  return {
    id: mediaId,
    originalUrl: media.source_url,
    localPath: convertToLocalPath(media.source_url),
    mediaType: media.media_type,
    altText: media.alt_text,
    caption: media.caption?.rendered
  };
}

/**
 * Converts WordPress media URL to local path
 * @param mediaUrl - WordPress media URL
 * @returns Local path for the media file
 */
export function convertToLocalPath(mediaUrl: string): string {
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
 * Extracts media IDs from content fields
 * @param content - Content object with potential media references
 * @returns Array of unique media IDs found
 */
export function extractMediaIdsFromContent(content: any): string[] {
  const mediaIds = new Set<string>();
  
  // Extract from hero fields
  if (content.hero) {
    if (content.hero.image && isValidMediaId(content.hero.image)) {
      mediaIds.add(content.hero.image);
    }
    if (content.hero.video && isValidMediaId(content.hero.video)) {
      mediaIds.add(content.hero.video);
    }
  }
  
  // Extract from links fields (projects)
  if (content.links) {
    if (content.links.image && isValidMediaId(content.links.image)) {
      mediaIds.add(content.links.image);
    }
    if (content.links.video && isValidMediaId(content.links.video)) {
      mediaIds.add(content.links.video);
    }
  }
  
  // Extract from SEO fields
  if (content.seo?.schema?.image && isValidMediaId(content.seo.schema.image)) {
    mediaIds.add(content.seo.schema.image);
  }
  
  return Array.from(mediaIds);
}

/**
 * Updates content with resolved media paths
 * @param content - Content object to update
 * @param resolvedMedia - Resolved media references
 * @returns Updated content with local paths
 */
export function updateContentWithResolvedMedia(
  content: any, 
  resolvedMedia: Record<string, MediaReference>
): any {
  // Create a deep copy to avoid modifying the original
  const updatedContent = JSON.parse(JSON.stringify(content));
  
  // Update hero fields
  if (updatedContent.hero) {
    if (updatedContent.hero.image && resolvedMedia[updatedContent.hero.image]) {
      updatedContent.hero.image = resolvedMedia[updatedContent.hero.image].localPath;
    }
    if (updatedContent.hero.video && resolvedMedia[updatedContent.hero.video]) {
      updatedContent.hero.video = resolvedMedia[updatedContent.hero.video].localPath;
    }
  }
  
  // Update links fields (projects)
  if (updatedContent.links) {
    if (updatedContent.links.image && resolvedMedia[updatedContent.links.image]) {
      updatedContent.links.image = resolvedMedia[updatedContent.links.image].localPath;
    }
    if (updatedContent.links.video && resolvedMedia[updatedContent.links.video]) {
      updatedContent.links.video = resolvedMedia[updatedContent.links.video].localPath;
    }
  }
  
  // Update SEO fields
  if (updatedContent.seo?.schema?.image && resolvedMedia[updatedContent.seo.schema.image]) {
    updatedContent.seo.schema.image = resolvedMedia[updatedContent.seo.schema.image].localPath;
  }
  
  return updatedContent;
}

/**
 * Validates if a string is a valid media ID
 * @param value - Value to check
 * @returns True if valid media ID
 */
export function isValidMediaId(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  
  // Check if it's a numeric string (WordPress media ID)
  // Must be all digits, no letters or special characters
  if (!/^\d+$/.test(value)) return false;
  
  const numericId = parseInt(value, 10);
  return !isNaN(numericId) && numericId > 0;
}

/**
 * Generates media resolution report
 * @param result - Media resolution result
 * @returns Formatted report string
 */
export function generateMediaResolutionReport(result: MediaResolutionResult): string {
  const { stats, errors } = result;
  
  let report = `Media Resolution Report:\n`;
  report += `Total media IDs: ${stats.total}\n`;
  report += `Successfully resolved: ${stats.resolved}\n`;
  report += `Failed: ${stats.failed}\n`;
  report += `Success rate: ${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%\n\n`;
  
  if (errors.length > 0) {
    report += `Errors:\n`;
    errors.forEach(error => {
      report += `- Media ID ${error.mediaId}: ${error.error}\n`;
    });
  }
  
  return report;
}

/**
 * Batch resolves media IDs with progress tracking
 * @param mediaIds - Array of media IDs to resolve
 * @param mediaData - Media data mapping
 * @param onProgress - Optional progress callback
 * @returns Promise with media resolution result
 */
export async function batchResolveMediaIds(
  mediaIds: string[],
  mediaData: Record<string, MediaData>,
  onProgress?: (current: number, total: number) => void
): Promise<MediaResolutionResult> {
  const result: MediaResolutionResult = {
    resolved: {},
    errors: [],
    stats: { total: mediaIds.length, resolved: 0, failed: 0 }
  };
  
  for (let i = 0; i < mediaIds.length; i++) {
    const mediaId = mediaIds[i];
    
    try {
      if (mediaData[mediaId]) {
        const media = mediaData[mediaId];
        result.resolved[mediaId] = {
          id: mediaId,
          originalUrl: media.source_url,
          localPath: convertToLocalPath(media.source_url),
          mediaType: media.media_type,
          altText: media.alt_text,
          caption: media.caption?.rendered
        };
        result.stats.resolved++;
      } else {
        result.errors.push({
          mediaId,
          error: 'Media not found in media data'
        });
        result.stats.failed++;
      }
    } catch (error) {
      result.errors.push({
        mediaId,
        error: `Failed to resolve media: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      result.stats.failed++;
    }
    
    // Call progress callback if provided
    if (onProgress) {
      onProgress(i + 1, mediaIds.length);
    }
  }
  
  return result;
}

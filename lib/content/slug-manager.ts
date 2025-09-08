/**
 * Slug collision management utilities
 * Handles slug conflicts with precedence: page > project > post
 */

export interface ContentItem {
  id: string;
  slug: string;
  type: 'page' | 'project' | 'post';
  title: string;
}

export interface SlugConflict {
  slug: string;
  items: ContentItem[];
  resolution: {
    primary: ContentItem;
    conflicts: ContentItem[];
  };
}

export interface SlugResolutionResult {
  resolved: Record<string, ContentItem>;
  conflicts: SlugConflict[];
  stats: {
    total: number;
    resolved: number;
    conflicts: number;
  };
}

/**
 * Resolves slug conflicts with defined precedence
 * @param contentItems - Array of content items with potential slug conflicts
 * @returns Slug resolution result with resolved items and conflicts
 */
export function resolveSlugConflicts(contentItems: ContentItem[]): SlugResolutionResult {
  const resolved: Record<string, ContentItem> = {};
  const conflicts: SlugConflict[] = [];
  
  // Group items by slug
  const slugGroups = groupBySlug(contentItems);
  
  for (const [slug, items] of Object.entries(slugGroups)) {
    if (items.length === 1) {
      // No conflict, add directly
      resolved[slug] = items[0];
    } else {
      // Conflict detected, resolve with precedence
      const conflict = resolveSlugConflict(slug, items);
      conflicts.push(conflict);
      
      // Add the primary item to resolved
      resolved[slug] = conflict.resolution.primary;
      
      // Add conflicted items with modified slugs
      for (const conflictedItem of conflict.resolution.conflicts) {
        const newSlug = generateUniqueSlug(conflictedItem, resolved);
        resolved[newSlug] = { ...conflictedItem, slug: newSlug };
      }
    }
  }
  
  return {
    resolved,
    conflicts,
    stats: {
      total: contentItems.length,
      resolved: Object.keys(resolved).length,
      conflicts: conflicts.length
    }
  };
}

/**
 * Groups content items by their slug
 * @param items - Content items to group
 * @returns Object with slug as key and array of items as value
 */
function groupBySlug(items: ContentItem[]): Record<string, ContentItem[]> {
  const groups: Record<string, ContentItem[]> = {};
  
  for (const item of items) {
    if (!groups[item.slug]) {
      groups[item.slug] = [];
    }
    groups[item.slug].push(item);
  }
  
  return groups;
}

/**
 * Resolves a single slug conflict using precedence rules
 * @param slug - The conflicting slug
 * @param items - Items with the same slug
 * @returns Resolved conflict with primary and conflicted items
 */
function resolveSlugConflict(slug: string, items: ContentItem[]): SlugConflict {
  // Sort by precedence: page > project > post
  const sortedItems = [...items].sort((a, b) => {
    const precedence = { page: 3, project: 2, post: 1 };
    return precedence[b.type] - precedence[a.type];
  });
  
  const primary = sortedItems[0];
  const conflicts = sortedItems.slice(1);
  
  return {
    slug,
    items,
    resolution: {
      primary,
      conflicts
    }
  };
}

/**
 * Generates a unique slug for a conflicted item
 * @param item - The item that needs a new slug
 * @param existingSlugs - Already resolved slugs
 * @returns Unique slug
 */
function generateUniqueSlug(item: ContentItem, existingSlugs: Record<string, ContentItem>): string {
  const baseSlug = item.slug;
  let counter = 1;
  let newSlug = `${baseSlug}-${item.type}`;
  
  // Keep trying until we find a unique slug
  while (existingSlugs[newSlug]) {
    counter++;
    newSlug = `${baseSlug}-${item.type}-${counter}`;
  }
  
  return newSlug;
}

/**
 * Validates slug format
 * @param slug - Slug to validate
 * @returns True if valid slug format
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  
  // Slug should contain only lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  // Should not contain consecutive hyphens
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * Normalizes a slug to valid format
 * @param slug - Slug to normalize
 * @returns Normalized slug
 */
export function normalizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generates slug from title
 * @param title - Title to convert to slug
 * @returns Generated slug
 */
export function generateSlugFromTitle(title: string): string {
  if (!title || typeof title !== 'string') return '';
  
  return normalizeSlug(title);
}

/**
 * Validates content items for slug conflicts
 * @param items - Content items to validate
 * @returns Validation result with conflicts
 */
export function validateSlugs(items: ContentItem[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for invalid slug formats
  for (const item of items) {
    if (!isValidSlug(item.slug)) {
      errors.push(`Invalid slug format for ${item.type} "${item.title}": "${item.slug}"`);
    }
  }
  
  // Check for conflicts
  const slugGroups = groupBySlug(items);
  for (const [slug, itemsWithSlug] of Object.entries(slugGroups)) {
    if (itemsWithSlug.length > 1) {
      const types = itemsWithSlug.map(item => item.type).join(', ');
      warnings.push(`Slug conflict for "${slug}": ${types}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generates slug resolution report
 * @param result - Slug resolution result
 * @returns Formatted report string
 */
export function generateSlugResolutionReport(result: SlugResolutionResult): string {
  const { stats, conflicts } = result;
  
  let report = `Slug Resolution Report:\n`;
  report += `Total items: ${stats.total}\n`;
  report += `Resolved slugs: ${stats.resolved}\n`;
  report += `Conflicts found: ${stats.conflicts}\n\n`;
  
  if (conflicts.length > 0) {
    report += `Conflicts resolved:\n`;
    for (const conflict of conflicts) {
      report += `\nSlug: "${conflict.slug}"\n`;
      report += `Primary (keeps slug): ${conflict.resolution.primary.type} - "${conflict.resolution.primary.title}"\n`;
      
      if (conflict.resolution.conflicts.length > 0) {
        report += `Modified slugs:\n`;
        for (const conflictedItem of conflict.resolution.conflicts) {
          const newSlug = result.resolved[Object.keys(result.resolved).find(key => 
            result.resolved[key].id === conflictedItem.id
          )!]?.slug;
          report += `  - ${conflictedItem.type} "${conflictedItem.title}": "${conflictedItem.slug}" → "${newSlug}"\n`;
        }
      }
    }
  }
  
  return report;
}

/**
 * Gets canonical path for content item
 * @param item - Content item
 * @returns Canonical path based on content type
 */
export function getCanonicalPath(item: ContentItem): string {
  switch (item.type) {
    case 'project':
      return `/work/${item.slug}`;
    case 'post':
      return `/blog/${item.slug}`;
    case 'page':
      return `/${item.slug}`;
    default:
      return `/${item.slug}`;
  }
}

/**
 * Gets content type from canonical path
 * @param path - Canonical path
 * @returns Content type or null if not recognized
 */
export function getContentTypeFromPath(path: string): 'page' | 'project' | 'post' | null {
  if (path.startsWith('/work/')) return 'project';
  if (path.startsWith('/blog/')) return 'post';
  if (path.startsWith('/')) return 'page';
  return null;
}

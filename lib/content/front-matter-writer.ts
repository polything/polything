/**
 * Enhanced front-matter writer for MDX files
 * Supports the new SEO schema structure with nested objects
 */

export interface FrontMatterWriterOptions {
  includeThemeMeta?: boolean;
  seoDefaults?: {
    title?: string;
    description?: string;
    canonical?: string;
    schemaType?: string;
    image?: string;
    author?: string;
    publishedDate?: string;
    modifiedDate?: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
  };
}

/**
 * Generates YAML front-matter string for MDX with enhanced SEO support
 * @param frontMatter - Front-matter object
 * @param options - Writer options
 * @returns YAML front-matter string
 */
export function generateMDXFrontMatter(frontMatter: any, options: FrontMatterWriterOptions = {}): string {
  const yamlLines = ['---'];
  
  // Add basic fields
  const basicFields = ['title', 'slug', 'type', 'date', 'updated', 'categories', 'tags', 'featured'];
  for (const field of basicFields) {
    if (frontMatter[field] !== undefined) {
      const value = formatYAMLValue(frontMatter[field]);
      yamlLines.push(`${field}: ${value}`);
    }
  }
  
  // Add any additional fields that aren't in basic fields or special sections
  const specialSections = ['hero', 'links', 'seo', 'theme_meta'];
  for (const [key, value] of Object.entries(frontMatter)) {
    if (!basicFields.includes(key) && !specialSections.includes(key) && value !== undefined) {
      const yamlValue = formatYAMLValue(value);
      yamlLines.push(`${key}: ${yamlValue}`);
    }
  }
  
  // Add hero section
  if (frontMatter.hero) {
    yamlLines.push('hero:');
    yamlLines.push(...generateNestedYAML(frontMatter.hero, 2));
  }
  
  // Add links section (for projects)
  if (frontMatter.links) {
    yamlLines.push('links:');
    yamlLines.push(...generateNestedYAML(frontMatter.links, 2));
  }
  
  // Add enhanced SEO section
  if (frontMatter.seo) {
    yamlLines.push('seo:');
    yamlLines.push(...generateNestedYAML(frontMatter.seo, 2));
  }
  
  // Add theme_meta section if requested
  if (options.includeThemeMeta && frontMatter.theme_meta) {
    yamlLines.push('theme_meta:');
    yamlLines.push(...generateNestedYAML(frontMatter.theme_meta, 2));
  }
  
  yamlLines.push('---');
  return yamlLines.join('\n');
}

/**
 * Generates nested YAML structure with proper indentation
 * @param obj - Object to convert to YAML
 * @param indent - Indentation level
 * @returns Array of YAML lines
 */
function generateNestedYAML(obj: any, indent: number = 0): string[] {
  const lines: string[] = [];
  const indentStr = ' '.repeat(indent);
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue;
    }
    
    if (Array.isArray(value)) {
      lines.push(`${indentStr}${key}:`);
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          lines.push(`${indentStr}  -`);
          lines.push(...generateNestedYAML(item, indent + 4));
        } else {
          lines.push(`${indentStr}  - ${formatYAMLValue(item)}`);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${indentStr}${key}:`);
      lines.push(...generateNestedYAML(value, indent + 2));
    } else {
      lines.push(`${indentStr}${key}: ${formatYAMLValue(value)}`);
    }
  }
  
  return lines;
}

/**
 * Formats a value for YAML output
 * @param value - Value to format
 * @returns Formatted YAML value
 */
function formatYAMLValue(value: any): string {
  if (value === null || value === undefined) {
    return 'null';
  }
  
  if (typeof value === 'string') {
    // Escape quotes and wrap in quotes if needed
    if (value.includes('"') || value.includes("'") || value.includes('\n') || value.includes(':')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return `"${value}"`;
  }
  
  if (typeof value === 'boolean') {
    return value.toString();
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  if (Array.isArray(value)) {
    return `[${value.map(formatYAMLValue).join(', ')}]`;
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Generates MDX content from transformed content object
 * @param content - Transformed content object
 * @param options - Writer options
 * @returns MDX content string
 */
export function generateMDXContent(content: any, options: FrontMatterWriterOptions = {}): string {
  const frontMatter = generateMDXFrontMatter(content.frontMatter || content, options);
  const body = content.content || content.body || '';
  
  return `${frontMatter}\n\n${body}`;
}

/**
 * Validates front-matter structure
 * @param frontMatter - Front-matter object to validate
 * @returns Validation result with errors and warnings
 */
export function validateFrontMatter(frontMatter: any): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (!frontMatter.title) {
    errors.push('Title is required');
  }
  
  if (!frontMatter.slug) {
    errors.push('Slug is required');
  }
  
  if (!frontMatter.type) {
    errors.push('Type is required');
  }
  
  // Validate slug format
  if (frontMatter.slug && !/^[a-z0-9-]+$/.test(frontMatter.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  // Validate type
  const validTypes = ['post', 'page', 'project'];
  if (frontMatter.type && !validTypes.includes(frontMatter.type)) {
    errors.push(`Type must be one of: ${validTypes.join(', ')}`);
  }
  
  // Check SEO fields
  if (frontMatter.seo) {
    if (frontMatter.seo.title && frontMatter.seo.title.length > 60) {
      warnings.push('SEO title is longer than recommended 60 characters');
    }
    
    if (frontMatter.seo.description && frontMatter.seo.description.length > 160) {
      warnings.push('SEO description is longer than recommended 160 characters');
    }
    
    if (frontMatter.seo.description && frontMatter.seo.description.length < 120) {
      warnings.push('SEO description is shorter than recommended 120 characters');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Applies SEO defaults to front-matter
 * @param frontMatter - Front-matter object
 * @param defaults - SEO defaults to apply
 * @returns Front-matter with defaults applied
 */
export function applySEODefaults(frontMatter: any, defaults: FrontMatterWriterOptions['seoDefaults'] = {}): any {
  if (!defaults || Object.keys(defaults).length === 0) {
    return frontMatter;
  }
  
  const result = { ...frontMatter };
  
  // Ensure SEO section exists
  if (!result.seo) {
    result.seo = {};
  }
  
  // Apply defaults for missing fields
  for (const [key, value] of Object.entries(defaults)) {
    if (result.seo[key] === undefined || result.seo[key] === null || result.seo[key] === '') {
      result.seo[key] = value;
    }
  }
  
  return result;
}

/**
 * HTML to MDX conversion utilities
 * Converts WordPress HTML content to clean MDX format
 */

export interface ConversionOptions {
  preserveEmbeds?: boolean;
  preserveImages?: boolean;
  preserveHeadings?: boolean;
  removeWordPressClasses?: boolean;
  convertToMDX?: boolean;
}

export interface ConversionResult {
  content: string;
  mediaReferences: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Converts WordPress HTML content to MDX format
 * @param htmlContent - Raw HTML content from WordPress
 * @param options - Conversion options
 * @returns Conversion result with MDX content and metadata
 */
export function convertHTMLToMDX(htmlContent: string, options: ConversionOptions = {}): ConversionResult {
  const {
    preserveEmbeds = true,
    preserveImages = true,
    preserveHeadings = true,
    removeWordPressClasses = true,
    convertToMDX = true
  } = options;

  const mediaReferences: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (htmlContent === null || htmlContent === undefined) {
    return {
      content: '',
      mediaReferences,
      errors: ['Invalid HTML content provided'],
      warnings
    };
  }

  if (typeof htmlContent !== 'string') {
    return {
      content: '',
      mediaReferences,
      errors: ['Invalid HTML content provided'],
      warnings
    };
  }

  let processedContent = htmlContent;

  try {
    // Step 1: Remove WordPress-specific artifacts
    if (removeWordPressClasses) {
      processedContent = removeWordPressArtifacts(processedContent);
    }

    // Step 2: Extract and process media references
    if (preserveImages) {
      const mediaResult = processMediaReferences(processedContent);
      processedContent = mediaResult.content;
      mediaReferences.push(...mediaResult.mediaReferences);
      warnings.push(...mediaResult.warnings);
    }

    // Step 3: Process embeds
    if (preserveEmbeds) {
      processedContent = processEmbeds(processedContent);
    }

    // Step 4: Clean up HTML structure
    processedContent = cleanHTMLStructure(processedContent);

    // Step 5: Convert to MDX if requested
    if (convertToMDX) {
      processedContent = convertToMDXFormat(processedContent, preserveEmbeds);
    }

    // Step 6: Final cleanup
    processedContent = finalCleanup(processedContent, convertToMDX, removeWordPressClasses, preserveEmbeds);

  } catch (error) {
    errors.push(`Conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    content: processedContent,
    mediaReferences,
    errors,
    warnings
  };
}

/**
 * Removes WordPress-specific artifacts from HTML
 * @param content - HTML content
 * @returns Cleaned HTML content
 */
function removeWordPressArtifacts(content: string): string {
  return content
    // Remove WordPress block comments
    .replace(/<!-- wp:[^>]*-->/g, '')
    .replace(/<!-- \/wp:[^>]*-->/g, '')
    
    // Remove WordPress-specific classes
    .replace(/class="[^"]*wp-[^"]*"/g, '')
    .replace(/class="[^"]*has-[^"]*"/g, '')
    .replace(/class="[^"]*align[^"]*"/g, '')
    .replace(/class="[^"]*size-[^"]*"/g, '')
    .replace(/class="[^"]*gutenberg[^"]*"/g, '')
    .replace(/class="[^"]*block-editor[^"]*"/g, '')
    
    // Remove empty class attributes
    .replace(/class=""/g, '')
    .replace(/class="\s*"/g, '')
    
    // Remove WordPress-specific data attributes
    .replace(/data-[^=]*="[^"]*"/g, '')
    
    // Remove WordPress-specific IDs
    .replace(/id="[^"]*wp-[^"]*"/g, '')
    
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .replace(/\s+>/g, '>')
    .trim();
}

/**
 * Processes media references in HTML content
 * @param content - HTML content
 * @returns Object with processed content and media references
 */
function processMediaReferences(content: string): {
  content: string;
  mediaReferences: string[];
  warnings: string[];
} {
  const mediaReferences: string[] = [];
  const warnings: string[] = [];

  // Find all img tags and extract src attributes
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    const alt = match[2] || '';
    if (src) {
      mediaReferences.push(src);
      
      // Convert WordPress uploads URLs to local paths
      let localPath = src;
      if (src.includes('/wp-content/uploads/')) {
        localPath = convertToLocalPath(src);
      }
      
      // Convert img tag to MDX format
      const mdxImage = `![${alt}](${localPath})`;
      content = content.replace(match[0], mdxImage);
    }
  }

  // Find all video tags and extract src attributes
  const videoRegex = /<video[^>]+src="([^"]+)"[^>]*>/gi;
  while ((match = videoRegex.exec(content)) !== null) {
    const src = match[1];
    if (src) {
      mediaReferences.push(src);
      
      // Convert WordPress uploads URLs to local paths
      if (src.includes('/wp-content/uploads/')) {
        const localPath = convertToLocalPath(src);
        content = content.replace(src, localPath);
      }
    }
  }

  // Find all source tags within video/audio elements
  const sourceRegex = /<source[^>]+src="([^"]+)"[^>]*>/gi;
  while ((match = sourceRegex.exec(content)) !== null) {
    const src = match[1];
    if (src) {
      mediaReferences.push(src);
      
      // Convert WordPress uploads URLs to local paths
      if (src.includes('/wp-content/uploads/')) {
        const localPath = convertToLocalPath(src);
        content = content.replace(src, localPath);
      }
    }
  }

  return {
    content,
    mediaReferences,
    warnings
  };
}

/**
 * Processes embedded content (iframes, embeds)
 * @param content - HTML content
 * @returns Processed content with preserved embeds
 */
function processEmbeds(content: string): string {
  // Preserve iframe embeds (YouTube, Vimeo, etc.)
  const iframeRegex = /<iframe[^>]*src="([^"]+)"[^>]*><\/iframe>/gi;
  content = content.replace(iframeRegex, (match, src) => {
    // Keep iframe but clean up attributes
    return `<iframe src="${src}" allowfullscreen></iframe>`;
  });

  // Preserve embed tags
  const embedRegex = /<embed[^>]*>/gi;
  content = content.replace(embedRegex, (match) => {
    // Keep embed but clean up attributes
    return match.replace(/[^>]*class="[^"]*"/g, '');
  });

  return content;
}

/**
 * Cleans up HTML structure
 * @param content - HTML content
 * @returns Cleaned HTML content
 */
function cleanHTMLStructure(content: string): string {
  return content
    // Remove empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p><br\s*\/?><\/p>/g, '')
    
    // Remove empty divs
    .replace(/<div>\s*<\/div>/g, '')
    
    // Remove empty spans
    .replace(/<span>\s*<\/span>/g, '')
    
    // Normalize line breaks
    .replace(/<br\s*\/?>/g, '\n')
    
    // Clean up multiple consecutive line breaks
    .replace(/\n{3,}/g, '\n\n')
    
    // Remove trailing whitespace from lines
    .replace(/[ \t]+$/gm, '')
    
    .trim();
}

/**
 * Converts HTML to MDX format
 * @param content - HTML content
 * @param preserveEmbeds - Whether to preserve embeds
 * @returns MDX-formatted content
 */
function convertToMDXFormat(content: string, preserveEmbeds: boolean = false): string {
  // If preserving embeds, temporarily replace iframe and embed tags with placeholders
  const embedPlaceholders: { [key: string]: string } = {};
  let placeholderIndex = 0;
  
  if (preserveEmbeds) {
    content = content.replace(/<iframe[^>]*>.*?<\/iframe>/gi, (match) => {
      const placeholder = `__EMBED_IFRAME_${placeholderIndex}__`;
      embedPlaceholders[placeholder] = match;
      placeholderIndex++;
      return placeholder;
    });
    
    content = content.replace(/<embed[^>]*\/?>/gi, (match) => {
      const placeholder = `__EMBED_EMBED_${placeholderIndex}__`;
      embedPlaceholders[placeholder] = match;
      placeholderIndex++;
      return placeholder;
    });
  }

  // Convert headings to MDX format
  content = content
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n')
    
    // Convert unordered lists
    .replace(/<ul[^>]*>/g, '\n')
    .replace(/<\/ul>/g, '\n')
    .replace(/<li[^>]*>/g, '- ')
    .replace(/<\/li>/g, '\n')
    
    // Convert ordered lists
    .replace(/<ol[^>]*>/g, '\n')
    .replace(/<\/ol>/g, '\n')
    .replace(/<li[^>]*>/g, '1. ')
    .replace(/<\/li>/g, '\n')
    
    // Convert blockquotes (before paragraphs to avoid conflicts)
    .replace(/<blockquote[^>]*>\s*<p[^>]*>(.*?)<\/p>\s*<\/blockquote>/g, (match, content) => {
      return `\n> ${content.trim()}\n`;
    })
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, (match, content) => {
      return `\n> ${content.trim()}\n`;
    })
    
    // Convert code blocks
    .replace(/<pre[^>]*><code[^>]*>/g, '\n```\n')
    .replace(/<\/code><\/pre>/g, '\n```\n')
    
    // Convert inline code
    .replace(/<code[^>]*>/g, '`')
    .replace(/<\/code>/g, '`')
    
    // Convert strong/bold
    .replace(/<strong[^>]*>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<b[^>]*>/g, '**')
    .replace(/<\/b>/g, '**')
    
    // Convert emphasis/italic
    .replace(/<em[^>]*>/g, '*')
    .replace(/<\/em>/g, '*')
    .replace(/<i[^>]*>/g, '*')
    .replace(/<\/i>/g, '*')
    
    // Convert links
    .replace(/<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g, '[$2]($1)')
    
    // Convert paragraphs (after blockquotes to avoid conflicts)
    .replace(/<p[^>]*>/g, '\n\n')
    .replace(/<\/p>/g, '\n')
    
    // Convert divs to line breaks
    .replace(/<div[^>]*>/g, '\n')
    .replace(/<\/div>/g, '\n');

  // Restore iframe and embed tags if preserving embeds
  if (preserveEmbeds) {
    Object.entries(embedPlaceholders).forEach(([placeholder, original]) => {
      content = content.replace(placeholder, original);
    });
  }

  return content;
}

/**
 * Performs final cleanup on the content
 * @param content - Content to clean up
 * @param convertToMDX - Whether content was converted to MDX
 * @param removeWordPressClasses - Whether WordPress classes were removed
 * @returns Final cleaned content
 */
function finalCleanup(content: string, convertToMDX: boolean = true, removeWordPressClasses: boolean = true, preserveEmbeds: boolean = false): string {
  if (convertToMDX) {
    // Determine which tags to preserve based on preserveEmbeds option
    const preserveTags = preserveEmbeds ? 'img|iframe|embed|source' : 'img|source';
    
    return content
      // Remove remaining HTML tags that weren't converted (but preserve specified tags)
      .replace(new RegExp(`<(?!${preserveTags})[^>]*>`, 'g'), '')
      
      // Decode HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      
      // Clean up multiple consecutive line breaks
      .replace(/\n{3,}/g, '\n\n')
      
      // Remove trailing whitespace
      .replace(/[ \t]+$/gm, '')
      
      // Remove leading/trailing whitespace
      .trim();
  } else {
    return content
      // Decode HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      
      // Clean up multiple consecutive line breaks
      .replace(/\n{3,}/g, '\n\n')
      
      // Remove trailing whitespace
      .replace(/[ \t]+$/gm, '')
      
      // Remove leading/trailing whitespace
      .trim();
  }
}

/**
 * Converts WordPress media URL to local path
 * @param mediaUrl - WordPress media URL
 * @returns Local path for the media file
 */
function convertToLocalPath(mediaUrl: string): string {
  if (!mediaUrl) return '';
  
  // Extract path from WordPress uploads URL
  const uploadsMatch = mediaUrl.match(/\/wp-content\/uploads\/(.+)$/);
  if (uploadsMatch) {
    return `/images/${uploadsMatch[1]}`;
  }
  
  // If not a WordPress upload, return as-is (external URL)
  return mediaUrl;
}

/**
 * Validates MDX content
 * @param content - MDX content to validate
 * @returns Validation result
 */
export function validateMDXContent(content: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content || typeof content !== 'string') {
    errors.push('Content is empty or invalid');
    return { valid: false, errors, warnings };
  }

  // Check for unclosed code blocks
  const codeBlockCount = (content.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    errors.push('Unclosed code block detected');
  }

  // Check for unclosed inline code
  const inlineCodeCount = (content.match(/`/g) || []).length;
  if (inlineCodeCount % 2 !== 0) {
    errors.push('Unclosed inline code detected');
  }

  // Check for unclosed bold/italic
  const boldCount = (content.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) {
    warnings.push('Unclosed bold formatting detected');
  }

  const italicCount = (content.match(/\*/g) || []).length;
  if (italicCount % 2 !== 0) {
    warnings.push('Unclosed italic formatting detected');
  }

  // Check for excessive line breaks
  const excessiveLineBreaks = content.match(/\n{4,}/g);
  if (excessiveLineBreaks) {
    warnings.push('Excessive line breaks detected');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

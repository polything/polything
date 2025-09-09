/**
 * Enhanced HTML sanitizer for WordPress to Next.js migration
 * Removes WordPress-specific classes, fixes broken links, and cleans HTML structure
 */

export interface SanitizationOptions {
  removeWordPressClasses?: boolean;
  fixBrokenLinks?: boolean;
  removeEmptyElements?: boolean;
  normalizeWhitespace?: boolean;
  preserveEmbeds?: boolean;
  preserveImages?: boolean;
  baseUrl?: string;
}

export interface SanitizationResult {
  content: string;
  removedClasses: string[];
  fixedLinks: string[];
  removedElements: string[];
  warnings: string[];
  errors: string[];
}

/**
 * Sanitizes HTML content by removing WordPress artifacts and fixing issues
 * @param html - Raw HTML content from WordPress
 * @param options - Sanitization options
 * @returns Sanitization result with cleaned content and metadata
 */
export function sanitizeHTMLContent(html: string, options: SanitizationOptions = {}): SanitizationResult {
  const {
    removeWordPressClasses = true,
    fixBrokenLinks = true,
    removeEmptyElements = true,
    normalizeWhitespace = true,
    preserveEmbeds = true,
    preserveImages = true,
    baseUrl = 'https://polything.co.uk'
  } = options;

  const removedClasses: string[] = [];
  const fixedLinks: string[] = [];
  const removedElements: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!html || typeof html !== 'string') {
    return {
      content: '',
      removedClasses,
      fixedLinks,
      removedElements,
      warnings: ['Invalid HTML content provided'],
      errors
    };
  }

  let processedContent = html;

  try {
    // Step 1: Remove WordPress-specific artifacts
    if (removeWordPressClasses) {
      const classResult = removeWordPressClassesAndArtifacts(processedContent);
      processedContent = classResult.content;
      removedClasses.push(...classResult.removedClasses);
      warnings.push(...classResult.warnings);
    }

    // Step 2: Fix broken links
    if (fixBrokenLinks) {
      const linkResult = fixBrokenLinksInContent(processedContent, baseUrl);
      processedContent = linkResult.content;
      fixedLinks.push(...linkResult.fixedLinks);
      warnings.push(...linkResult.warnings);
    }

    // Step 3: Remove empty elements
    if (removeEmptyElements) {
      const elementResult = removeEmptyElementsFromContent(processedContent);
      processedContent = elementResult.content;
      removedElements.push(...elementResult.removedElements);
    }

    // Step 4: Normalize whitespace
    if (normalizeWhitespace) {
      processedContent = normalizeWhitespaceInContent(processedContent);
    }

    // Step 5: Final cleanup
    processedContent = performFinalCleanup(processedContent, preserveEmbeds, preserveImages);

  } catch (error) {
    errors.push(`Sanitization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    content: processedContent,
    removedClasses,
    fixedLinks,
    removedElements,
    warnings,
    errors
  };
}

/**
 * Removes WordPress-specific classes and artifacts
 */
function removeWordPressClassesAndArtifacts(content: string): {
  content: string;
  removedClasses: string[];
  warnings: string[];
} {
  const removedClasses: string[] = [];
  const warnings: string[] = [];

  let processedContent = content;

  // WordPress block comments
  processedContent = processedContent
    .replace(/<!-- wp:[^>]*-->/g, '')
    .replace(/<!-- \/wp:[^>]*-->/g, '')
    .replace(/<!-- wp:.*?-->/g, '');

  // WordPress-specific classes
  const wpClassPatterns = [
    /class="[^"]*wp-[^"]*"/g,
    /class="[^"]*has-[^"]*"/g,
    /class="[^"]*align[^"]*"/g,
    /class="[^"]*size-[^"]*"/g,
    /class="[^"]*gutenberg[^"]*"/g,
    /class="[^"]*block-editor[^"]*"/g,
    /class="[^"]*wp-block[^"]*"/g,
    /class="[^"]*wp-image[^"]*"/g,
    /class="[^"]*wp-caption[^"]*"/g,
    /class="[^"]*wp-gallery[^"]*"/g,
    /class="[^"]*attachment[^"]*"/g,
    /class="[^"]*post-[^"]*"/g,
    /class="[^"]*page-[^"]*"/g,
    /class="[^"]*category-[^"]*"/g,
    /class="[^"]*tag-[^"]*"/g
  ];

  wpClassPatterns.forEach(pattern => {
    const matches = processedContent.match(pattern);
    if (matches) {
      removedClasses.push(...matches);
    }
    processedContent = processedContent.replace(pattern, '');
  });

  // WordPress-specific data attributes
  processedContent = processedContent
    .replace(/data-[^=]*="[^"]*"/g, '')
    .replace(/data-wp-[^=]*="[^"]*"/g, '')
    .replace(/data-block-[^=]*="[^"]*"/g, '');

  // WordPress-specific IDs
  processedContent = processedContent
    .replace(/id="[^"]*wp-[^"]*"/g, '')
    .replace(/id="[^"]*block-[^"]*"/g, '');

  // Remove empty class attributes
  processedContent = processedContent
    .replace(/class=""/g, '')
    .replace(/class="\s*"/g, '')
    .replace(/class="\s+"/g, '');

  // Remove WordPress-specific style attributes
  processedContent = processedContent
    .replace(/style="[^"]*wp-[^"]*"/g, '')
    .replace(/style="[^"]*gutenberg[^"]*"/g, '');

  if (removedClasses.length > 0) {
    warnings.push(`Removed ${removedClasses.length} WordPress-specific classes and attributes`);
  }

  return {
    content: processedContent,
    removedClasses,
    warnings
  };
}

/**
 * Fixes broken links in content
 */
function fixBrokenLinksInContent(content: string, baseUrl: string): {
  content: string;
  fixedLinks: string[];
  warnings: string[];
} {
  const fixedLinks: string[] = [];
  const warnings: string[] = [];

  let processedContent = content;

  // Fix relative URLs that should be absolute
  processedContent = processedContent.replace(
    /href="\/([^"]*)"/g,
    (match, path) => {
      const fullUrl = `${baseUrl}/${path}`;
      fixedLinks.push(fullUrl);
      return `href="${fullUrl}"`;
    }
  );

  // Fix WordPress internal links that might be broken
  processedContent = processedContent.replace(
    /href="https?:\/\/[^\/]*\/wp-content\/uploads\/([^"]*)"/g,
    (match, path) => {
      const newPath = `/images/${path}`;
      fixedLinks.push(newPath);
      return `href="${newPath}"`;
    }
  );

  // Fix broken WordPress admin links
  processedContent = processedContent.replace(
    /href="https?:\/\/[^\/]*\/wp-admin[^"]*"/g,
    (match) => {
      warnings.push('Removed WordPress admin link');
      return 'href="#"';
    }
  );

  // Fix broken WordPress login links
  processedContent = processedContent.replace(
    /href="https?:\/\/[^\/]*\/wp-login[^"]*"/g,
    (match) => {
      warnings.push('Removed WordPress login link');
      return 'href="#"';
    }
  );

  // Fix mailto links with invalid email addresses
  processedContent = processedContent.replace(
    /href="mailto:([^"]*)"/g,
    (match, email) => {
      if (!isValidEmail(email)) {
        warnings.push(`Fixed invalid email link: ${email}`);
        return 'href="#"';
      }
      return match;
    }
  );

  // Fix tel links with invalid phone numbers
  processedContent = processedContent.replace(
    /href="tel:([^"]*)"/g,
    (match, phone) => {
      if (!isValidPhoneNumber(phone)) {
        warnings.push(`Fixed invalid phone link: ${phone}`);
        return 'href="#"';
      }
      return match;
    }
  );

  if (fixedLinks.length > 0) {
    warnings.push(`Fixed ${fixedLinks.length} broken or relative links`);
  }

  return {
    content: processedContent,
    fixedLinks,
    warnings
  };
}

/**
 * Removes empty elements from content
 */
function removeEmptyElementsFromContent(content: string): {
  content: string;
  removedElements: string[];
} {
  const removedElements: string[] = [];
  let processedContent = content;

  // Empty paragraphs
  const emptyParagraphs = processedContent.match(/<p[^>]*>\s*<\/p>/g);
  if (emptyParagraphs) {
    removedElements.push(...emptyParagraphs);
    processedContent = processedContent.replace(/<p[^>]*>\s*<\/p>/g, '');
  }

  // Empty divs
  const emptyDivs = processedContent.match(/<div[^>]*>\s*<\/div>/g);
  if (emptyDivs) {
    removedElements.push(...emptyDivs);
    processedContent = processedContent.replace(/<div[^>]*>\s*<\/div>/g, '');
  }

  // Empty spans
  const emptySpans = processedContent.match(/<span[^>]*>\s*<\/span>/g);
  if (emptySpans) {
    removedElements.push(...emptySpans);
    processedContent = processedContent.replace(/<span[^>]*>\s*<\/span>/g, '');
  }

  // Paragraphs with only line breaks
  processedContent = processedContent.replace(/<p[^>]*><br\s*\/?><\/p>/g, '');

  // Empty headings
  processedContent = processedContent.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/g, '');

  // Empty lists
  processedContent = processedContent.replace(/<ul[^>]*>\s*<\/ul>/g, '');
  processedContent = processedContent.replace(/<ol[^>]*>\s*<\/ol>/g, '');

  return {
    content: processedContent,
    removedElements
  };
}

/**
 * Normalizes whitespace in content
 */
function normalizeWhitespaceInContent(content: string): string {
  return content
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    
    // Remove excessive whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    
    // Remove spaces before closing tags
    .replace(/\s+>/g, '>')
    
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Performs final cleanup on the content
 */
function performFinalCleanup(content: string, preserveEmbeds: boolean, preserveImages: boolean): string {
  let processedContent = content;

  // Decode HTML entities
  processedContent = processedContent
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Remove any remaining WordPress artifacts
  processedContent = processedContent
    .replace(/<!--.*?-->/g, '') // Remove all comments
    .replace(/data-[^=]*="[^"]*"/g, '') // Remove any remaining data attributes
    .replace(/style="[^"]*"/g, '') // Remove style attributes
    .replace(/on\w+="[^"]*"/g, ''); // Remove event handlers

  // Clean up empty attributes
  processedContent = processedContent
    .replace(/\s+class=""/g, '')
    .replace(/\s+id=""/g, '')
    .replace(/\s+title=""/g, '');

  return processedContent.trim();
}

/**
 * Validates email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format
 */
function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Sanitizes multiple HTML content items in batch
 */
export function sanitizeHTMLContentBatch(
  htmlContents: string[],
  options: SanitizationOptions = {}
): {
  results: SanitizationResult[];
  summary: {
    total: number;
    processed: number;
    totalWarnings: number;
    totalErrors: number;
    totalRemovedClasses: number;
    totalFixedLinks: number;
    totalRemovedElements: number;
  };
} {
  const results = htmlContents.map(html => sanitizeHTMLContent(html, options));
  
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalRemovedClasses = results.reduce((sum, r) => sum + r.removedClasses.length, 0);
  const totalFixedLinks = results.reduce((sum, r) => sum + r.fixedLinks.length, 0);
  const totalRemovedElements = results.reduce((sum, r) => sum + r.removedElements.length, 0);

  return {
    results,
    summary: {
      total: htmlContents.length,
      processed: results.length,
      totalWarnings,
      totalErrors,
      totalRemovedClasses,
      totalFixedLinks,
      totalRemovedElements
    }
  };
}

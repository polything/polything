#!/usr/bin/env node

/**
 * WordPress Content Exporter
 * 
 * Exports WordPress content to MDX files for Next.js migration
 * Uses TDD methodology with comprehensive error handling
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { mapThemerainFields } from '../lib/content/field-mapper.js';
import { transformWordPressContent } from '../lib/content/transformers.js';
import config from '../config/wordpress.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_TIMEOUT = 30000;

/**
 * Fetch WordPress content with pagination support
 * @param {string} siteUrl - WordPress site URL
 * @param {string} contentType - Content type (posts, pages, project)
 * @param {number} batchSize - Number of items per batch
 * @returns {Promise<Array>} Array of WordPress content items
 */
export async function fetchWordPressContent(siteUrl, contentType, batchSize = DEFAULT_BATCH_SIZE) {
  const apiBase = `${siteUrl}/wp-json/wp/v2`;
  const endpoint = `${apiBase}/${contentType}`;
  const allItems = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const url = `${endpoint}?per_page=${batchSize}&page=${page}`;
      console.log(`Fetching ${contentType} page ${page}...`);
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const items = await response.json();
      
      if (items.length === 0) {
        hasMore = false;
      } else {
        allItems.push(...items);
        page++;
        
        // If we got fewer items than requested, we've reached the end
        if (items.length < batchSize) {
          hasMore = false;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${contentType} page ${page}:`, error.message);
      throw error;
    }
  }

  console.log(`Fetched ${allItems.length} ${contentType} items`);
  return allItems;
}

/**
 * Process a batch of content items in parallel
 * @param {Array} items - Array of WordPress content items
 * @param {string} contentType - Content type
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Processing results
 */
export async function processContentBatch(items, contentType, options = {}) {
  const results = {
    success: [],
    errors: [],
    total: items.length
  };

  console.log(`Processing ${items.length} ${contentType} items...`);

  // Process items in parallel with concurrency limit
  const concurrency = options.concurrency || 5;
  const chunks = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    chunks.push(items.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (item) => {
      try {
        const result = await processContentItem(item, contentType, options);
        results.success.push(result);
        console.log(`✓ Processed ${contentType} ${item.id}: ${item.slug}`);
      } catch (error) {
        results.errors.push({
          item: item.id,
          slug: item.slug,
          error: error.message
        });
        console.error(`✗ Failed to process ${contentType} ${item.id}: ${error.message}`);
      }
    });

    await Promise.all(promises);
  }

  return results;
}

/**
 * Process a single content item
 * @param {Object} item - WordPress content item
 * @param {string} contentType - Content type
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Processed content
 */
async function processContentItem(item, contentType, options = {}) {
  try {
    // Transform WordPress content to clean schema
    const transformed = transformWordPressContent(item, contentType);
    
    // Save to MDX file
    const filePath = await saveMDXFile(transformed, contentType, options);
    
    return {
      id: item.id,
      slug: item.slug,
      title: item.title?.rendered || 'Untitled',
      filePath,
      success: true
    };
  } catch (error) {
    throw new Error(`Failed to process item ${item.id}: ${error.message}`);
  }
}

/**
 * Save content to MDX file
 * @param {Object} content - Transformed content object
 * @param {string} contentType - Content type
 * @param {Object} options - Save options
 * @returns {Promise<string>} File path
 */
export async function saveMDXFile(content, contentType, options = {}) {
  const outputDir = options.outputDir || config.export.outputDir;
  const contentDir = path.join(outputDir, contentType);
  const filePath = path.join(contentDir, content.slug, 'index.mdx');

  try {
    // Create directory if it doesn't exist
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Generate MDX content
    const mdxContent = generateMDXContent(content);

    // Write file
    await fs.writeFile(filePath, mdxContent, 'utf8');

    return filePath;
  } catch (error) {
    throw new Error(`Failed to save MDX file: ${error.message}`);
  }
}

/**
 * Generate MDX content from transformed content object
 * @param {Object} content - Transformed content object
 * @returns {string} MDX content string
 */
function generateMDXContent(content) {
  const frontMatter = generateFrontMatter(content.frontMatter);
  const body = content.content || '';
  
  return `${frontMatter}\n\n${body}`;
}

/**
 * Generate YAML front-matter from content object
 * @param {Object} frontMatter - Front-matter object
 * @returns {string} YAML front-matter string
 */
function generateFrontMatter(frontMatter) {
  const yaml = Object.entries(frontMatter)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return `${key}:\n${generateNestedYAML(value, 2)}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    })
    .join('\n');

  return `---\n${yaml}\n---`;
}

/**
 * Generate nested YAML structure
 * @param {Object} obj - Object to convert to YAML
 * @param {number} indent - Indentation level
 * @returns {string} Nested YAML string
 */
function generateNestedYAML(obj, indent = 0) {
  const spaces = ' '.repeat(indent);
  
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return `${spaces}${key}:\n${generateNestedYAML(value, indent + 2)}`;
      }
      if (Array.isArray(value)) {
        return `${spaces}${key}: ${JSON.stringify(value)}`;
      }
      return `${spaces}${key}: ${JSON.stringify(value)}`;
    })
    .join('\n');
}

/**
 * Export content for a specific site
 * @param {string} siteUrl - WordPress site URL
 * @param {Object} options - Export options
 * @returns {Promise<Object>} Export results
 */
export async function exportContent(siteUrl, options = {}) {
  const startTime = Date.now();
  const results = {
    site: siteUrl,
    contentTypes: {},
    summary: {
      total: 0,
      success: 0,
      errors: 0,
      duration: 0
    }
  };

  try {
    console.log(`Starting export for ${siteUrl}...`);
    
    // Get site configuration
    const siteConfig = config.sites[siteUrl];
    if (!siteConfig) {
      throw new Error(`No configuration found for site: ${siteUrl}`);
    }

    // Export each content type
    for (const contentType of siteConfig.contentTypes) {
      console.log(`\nExporting ${contentType}...`);
      
      try {
        // Fetch content
        const items = await fetchWordPressContent(siteUrl, contentType, options.batchSize);
        
        if (items.length === 0) {
          console.log(`No ${contentType} found`);
          results.contentTypes[contentType] = { total: 0, success: 0, errors: 0 };
          continue;
        }

        // Process content
        const batchResults = await processContentBatch(items, contentType, options);
        
        results.contentTypes[contentType] = {
          total: batchResults.total,
          success: batchResults.success.length,
          errors: batchResults.errors.length,
          items: batchResults.success,
          errors: batchResults.errors
        };

        results.summary.total += batchResults.total;
        results.summary.success += batchResults.success.length;
        results.summary.errors += batchResults.errors.length;

      } catch (error) {
        console.error(`Error exporting ${contentType}:`, error.message);
        results.contentTypes[contentType] = {
          total: 0,
          success: 0,
          errors: 1,
          errors: [{ error: error.message }]
        };
        results.summary.errors++;
      }
    }

    // Calculate duration
    results.summary.duration = Date.now() - startTime;

    // Generate report
    await generateExportReport(results, options);

    console.log(`\nExport completed in ${(results.summary.duration / 1000).toFixed(2)}s`);
    console.log(`Total: ${results.summary.total}, Success: ${results.summary.success}, Errors: ${results.summary.errors}`);

    return results;

  } catch (error) {
    console.error('Export failed:', error.message);
    throw error;
  }
}

/**
 * Generate export report
 * @param {Object} results - Export results
 * @param {Object} options - Report options
 */
export async function generateExportReport(results, options = {}) {
  const reportPath = options.reportPath || path.join(process.cwd(), 'export-report.json');
  
  try {
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Export report saved to: ${reportPath}`);
  } catch (error) {
    console.error('Failed to save export report:', error.message);
  }
}

/**
 * Main export function
 * @param {Array} args - Command line arguments
 */
async function main(args = []) {
  try {
    const siteUrl = args[0] || 'https://polything.co.uk';
    const options = {
      batchSize: config.export.batchSize,
      outputDir: config.export.outputDir,
      concurrency: 5
    };

    console.log('WordPress Content Exporter');
    console.log('==========================');
    console.log(`Site: ${siteUrl}`);
    console.log(`Output: ${options.outputDir}`);
    console.log(`Batch Size: ${options.batchSize}`);
    console.log('');

    const results = await exportContent(siteUrl, options);
    
    if (results.summary.errors > 0) {
      console.log(`\n⚠️  Export completed with ${results.summary.errors} errors`);
      process.exit(1);
    } else {
      console.log('\n✅ Export completed successfully');
      process.exit(0);
    }

  } catch (error) {
    console.error('Export failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2));
}

export default {
  fetchWordPressContent,
  processContentBatch,
  saveMDXFile,
  exportContent,
  generateExportReport
};

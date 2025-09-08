/**
 * WordPress Media Fetcher
 * Task 1.6: Add media fetcher to download /wp-content/uploads/** and mirror under /public/images/**
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Fetch media list from WordPress API
 * @param {string} siteUrl - WordPress site URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Array>} Array of media items
 */
async function fetchMediaList(siteUrl, options = {}) {
  const { perPage = 100, timeout = 30000 } = options;
  const apiUrl = `${siteUrl}/wp-json/wp/v2/media`;
  const allMedia = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const url = `${apiUrl}?per_page=${perPage}&page=${page}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Polything-Media-Fetcher/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch media list: ${response.status} ${response.statusText}`);
      }

      const media = await response.json();
      allMedia.push(...media);

      // Get total pages from headers
      const totalPagesHeader = response.headers.get('x-wp-totalpages');
      if (totalPagesHeader) {
        totalPages = parseInt(totalPagesHeader, 10);
      } else {
        // If no header, assume single page
        totalPages = 1;
      }

      page++;
    } while (page <= totalPages);

    return allMedia;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Download a media file and save to local directory
 * @param {string} mediaUrl - URL of the media file
 * @param {string} localPath - Local path to save the file
 * @param {Object} options - Download options
 * @returns {Promise<string>} Local path of saved file
 */
async function downloadMediaFile(mediaUrl, localPath, options = {}) {
  const { skipExisting = true, timeout = 30000 } = options;

  try {
    // Check if file already exists
    if (skipExisting) {
      try {
        await fs.access(localPath);
        return localPath; // File exists, skip download
      } catch (error) {
        // File doesn't exist, continue with download
      }
    }

    // Create directory if it doesn't exist
    const dir = path.dirname(localPath);
    await fs.mkdir(dir, { recursive: true });

    // Download the file
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(mediaUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Polything-Media-Fetcher/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to download media: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the file
    await fs.writeFile(localPath, buffer);

    return localPath;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Download timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Process a single media item
 * @param {Object} mediaItem - WordPress media item
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Processing result
 */
async function processMediaItem(mediaItem, options = {}) {
  const { outputDir = './public/images', skipExisting = true } = options;
  
  try {
    const sourceUrl = mediaItem.source_url;
    const fileName = path.basename(sourceUrl);
    
    // Determine local path based on media_details.file if available
    let relativePath = fileName;
    if (mediaItem.media_details && mediaItem.media_details.file) {
      relativePath = mediaItem.media_details.file;
    } else {
      // Fallback: extract path from URL
      const urlPath = new URL(sourceUrl).pathname;
      const uploadsIndex = urlPath.indexOf('/wp-content/uploads/');
      if (uploadsIndex !== -1) {
        relativePath = urlPath.substring(uploadsIndex + '/wp-content/uploads/'.length);
      }
    }

    const localPath = path.join(outputDir, relativePath);

    const downloadedPath = await downloadMediaFile(sourceUrl, localPath, {
      skipExisting
    });

    return {
      id: mediaItem.id,
      originalUrl: sourceUrl,
      localPath: path.resolve(downloadedPath),
      downloaded: true
    };
  } catch (error) {
    return {
      id: mediaItem.id,
      originalUrl: mediaItem.source_url,
      localPath: path.resolve(path.join(outputDir, path.basename(mediaItem.source_url))),
      downloaded: false,
      error: error.message
    };
  }
}

/**
 * Fetch and mirror all media from WordPress site
 * @param {string} siteUrl - WordPress site URL
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Processing results
 */
async function fetchAndMirrorMedia(siteUrl, options = {}) {
  const {
    outputDir = './public/images',
    batchSize = 10,
    skipExisting = true,
    timeout = 30000
  } = options;

  console.log(`Starting media fetch for ${siteUrl}...`);
  
  try {
    // Fetch all media
    const mediaList = await fetchMediaList(siteUrl, { timeout });
    console.log(`Found ${mediaList.length} media items`);

    const results = [];
    let downloaded = 0;
    let skipped = 0;
    let errors = 0;

    // Process media in batches
    for (let i = 0; i < mediaList.length; i += batchSize) {
      const batch = mediaList.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mediaList.length / batchSize)}`);

      const batchPromises = batch.map(mediaItem => 
        processMediaItem(mediaItem, { outputDir, skipExisting })
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Update counters
      batchResults.forEach(result => {
        if (result.downloaded) {
          downloaded++;
        } else if (result.error && result.error.includes('File exists')) {
          skipped++;
        } else {
          errors++;
        }
      });
    }

    const summary = {
      total: mediaList.length,
      downloaded,
      skipped,
      errors,
      results
    };

    console.log(`Media fetch complete: ${downloaded} downloaded, ${skipped} skipped, ${errors} errors`);
    return summary;

  } catch (error) {
    console.error('Media fetch failed:', error.message);
    throw error;
  }
}

/**
 * Generate a media fetch report
 * @param {Object} results - Processing results
 * @returns {string} Formatted report
 */
function generateMediaReport(results) {
  const { total, downloaded, skipped, errors, results: items } = results;
  
  let report = `# Media Fetch Report\n\n`;
  report += `## Summary\n`;
  report += `- **Total**: ${total}\n`;
  report += `- **Downloaded**: ${downloaded}\n`;
  report += `- **Skipped**: ${skipped}\n`;
  report += `- **Errors**: ${errors}\n\n`;

  if (errors > 0) {
    report += `## Errors\n`;
    items
      .filter(item => !item.downloaded && item.error)
      .forEach(item => {
        report += `- **ID ${item.id}**: ${item.error}\n`;
        report += `  - URL: ${item.originalUrl}\n`;
      });
    report += `\n`;
  }

  if (downloaded > 0) {
    report += `## Downloaded Files\n`;
    items
      .filter(item => item.downloaded)
      .slice(0, 10) // Show first 10
      .forEach(item => {
        report += `- **ID ${item.id}**: ${item.localPath}\n`;
      });
    
    if (downloaded > 10) {
      report += `- ... and ${downloaded - 10} more files\n`;
    }
  }

  return report;
}

/**
 * Main function for CLI usage
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node wp-media-fetcher.js <site-url> [options]');
    console.log('Example: node wp-media-fetcher.js https://polything.co.uk');
    process.exit(1);
  }

  const siteUrl = args[0];
  const options = {
    outputDir: './public/images',
    batchSize: 10,
    skipExisting: true,
    timeout: 30000
  };

  try {
    const results = await fetchAndMirrorMedia(siteUrl, options);
    
    // Generate and save report
    const report = generateMediaReport(results);
    const reportPath = './media-fetch-report.md';
    await fs.writeFile(reportPath, report, 'utf8');
    
    console.log(`\nReport saved to: ${reportPath}`);
    console.log(report);
    
  } catch (error) {
    console.error('Media fetch failed:', error.message);
    process.exit(1);
  }
}

// Export functions for testing
module.exports = {
  fetchMediaList,
  downloadMediaFile,
  processMediaItem,
  fetchAndMirrorMedia,
  generateMediaReport,
  main
};

// Run main function if called directly
if (require.main === module) {
  main();
}

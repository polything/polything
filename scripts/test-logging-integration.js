/**
 * Test script to demonstrate error logging integration
 * Task 1.7: Set up logging for broken/missing media or content errors
 */

const { createLogger, createContentLogger, createMediaLogger } = require('../lib/logging/error-logger.js');

async function testLoggingIntegration() {
  console.log('🧪 Testing Error Logging Integration...\n');

  // Create specialized loggers
  const contentLogger = createContentLogger({ 
    logDir: './logs/content',
    enableConsole: true,
    enableFile: true
  });
  
  const mediaLogger = createMediaLogger({ 
    logDir: './logs/media',
    enableConsole: true,
    enableFile: true
  });

  const apiLogger = createLogger({ 
    logDir: './logs/api',
    enableConsole: true,
    enableFile: true
  });

  // Initialize all loggers
  await contentLogger.initialize();
  await mediaLogger.initialize();
  await apiLogger.initialize();

  console.log('✅ Loggers initialized\n');

  // Test content export error logging
  console.log('📝 Testing content export error logging...');
  await contentLogger.logContentError({
    type: 'content_export',
    postId: 123,
    postType: 'project',
    slug: 'test-project',
    error: 'Failed to transform content',
    details: { field: 'content', issue: 'invalid_html' }
  });

  await contentLogger.logContentError({
    type: 'content_export',
    postId: 124,
    postType: 'post',
    slug: 'test-post',
    error: 'Failed to save MDX file',
    details: { filePath: './content/posts/test-post/index.mdx', issue: 'permission_denied' }
  });

  // Test media download error logging
  console.log('🖼️  Testing media download error logging...');
  await mediaLogger.logMediaError({
    type: 'media_download',
    mediaId: 456,
    mediaUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/image.jpg',
    localPath: './public/images/2024/01/image.jpg',
    error: 'Failed to download media: 403 Forbidden',
    details: { status: 403, statusText: 'Forbidden' }
  });

  await mediaLogger.logMediaError({
    type: 'media_download',
    mediaId: 457,
    mediaUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/video.mp4',
    localPath: './public/images/2024/01/video.mp4',
    error: 'Failed to download media: 404 Not Found',
    details: { status: 404, statusText: 'Not Found' }
  });

  // Test field mapping error logging
  console.log('🔧 Testing field mapping error logging...');
  await contentLogger.logFieldError({
    type: 'field_mapping',
    postId: 125,
    field: 'themerain_hero_title',
    error: 'Field mapping failed',
    details: { originalValue: null, expectedType: 'string' }
  });

  // Test API request error logging
  console.log('🌐 Testing API request error logging...');
  await apiLogger.logApiError({
    type: 'api_request',
    endpoint: '/wp-json/wp/v2/posts',
    method: 'GET',
    error: 'API request failed: 500 Internal Server Error',
    details: { status: 500, statusText: 'Internal Server Error' }
  });

  // Generate and display error summaries
  console.log('\n📊 Error Summary Reports:');
  console.log('=' .repeat(50));
  
  const contentSummary = contentLogger.generateErrorSummary();
  console.log('\n📝 Content Export Errors:');
  console.log(contentSummary);

  const mediaSummary = mediaLogger.generateErrorSummary();
  console.log('\n🖼️  Media Download Errors:');
  console.log(mediaSummary);

  const apiSummary = apiLogger.generateErrorSummary();
  console.log('\n🌐 API Request Errors:');
  console.log(apiSummary);

  // Save error summaries to files
  await contentLogger.saveErrorSummary('./logs/content-error-summary.md');
  await mediaLogger.saveErrorSummary('./logs/media-error-summary.md');
  await apiLogger.saveErrorSummary('./logs/api-error-summary.md');

  console.log('\n💾 Error summaries saved to:');
  console.log('  - ./logs/content-error-summary.md');
  console.log('  - ./logs/media-error-summary.md');
  console.log('  - ./logs/api-error-summary.md');

  console.log('\n✅ Error logging integration test completed!');
  console.log('\n📁 Check the logs directory for detailed error logs:');
  console.log('  - ./logs/content/');
  console.log('  - ./logs/media/');
  console.log('  - ./logs/api/');
}

// Run the test
if (require.main === module) {
  testLoggingIntegration().catch(console.error);
}

module.exports = { testLoggingIntegration };

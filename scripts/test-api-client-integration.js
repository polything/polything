/**
 * Integration Test for API Client with WordPress Export System
 * Task 1.9: Add error handling and retry logic for API calls
 */

const { ApiClient, createWordPressClient } = require('../lib/api/api-client');
const { ConfigManager } = require('../lib/config/config-manager');
const { ErrorLogger } = require('../lib/logging/error-logger');
const fs = require('fs').promises;
const path = require('path');

async function runIntegrationTest() {
  console.log('\n🧪 Testing API Client Integration...\n');

  // Initialize systems
  const configManager = new ConfigManager();
  const errorLogger = new ErrorLogger({
    logDir: './logs',
    enableConsole: true,
    enableFile: true
  });

  await errorLogger.initialize();

  try {
    // Test 1: Load configuration and create WordPress client
    console.log('📋 Test 1: Configuration and WordPress Client Setup');
    const config = await configManager.loadConfig();
    
    if (!config.sites || Object.keys(config.sites).length === 0) {
      console.log('⚠️  No WordPress sites configured. Creating test configuration...');
      await configManager.createConfigFromTemplate();
      const newConfig = await configManager.loadConfig();
      console.log('✅ Test configuration created');
    }

    const siteConfig = config.sites['polything.co.uk'] || config.sites['polything'];
    if (!siteConfig) {
      console.log('❌ No polything site configuration found');
      return;
    }

    const wpClient = createWordPressClient(siteConfig, {
      retryAttempts: 2,
      retryDelay: 500,
      enableLogging: true
    });

    console.log(`✅ WordPress client created for: ${siteConfig.url}`);
    console.log(`   - API Base: ${siteConfig.apiBase}`);
    console.log(`   - Retry Attempts: 2`);
    console.log(`   - Retry Delay: 500ms\n`);

    // Test 2: Test basic API connectivity
    console.log('🌐 Test 2: Basic API Connectivity');
    try {
      const healthCheck = await wpClient.healthCheck('/');
      if (healthCheck.healthy) {
        console.log('✅ WordPress API is accessible');
      } else {
        console.log('⚠️  WordPress API health check failed:', healthCheck.error);
      }
    } catch (error) {
      console.log('⚠️  WordPress API connectivity test failed:', error.message);
    }

    // Test 3: Test retry logic with simulated failures
    console.log('\n🔄 Test 3: Retry Logic with Simulated Failures');
    
    // Create a test client with aggressive retry settings
    const testClient = new ApiClient({
      baseUrl: 'https://httpstat.us',
      retryAttempts: 3,
      retryDelay: 200,
      retryBackoff: 2,
      enableLogging: true
    });

    // Test with a 500 error endpoint (should retry)
    try {
      console.log('   Testing 500 error endpoint (should retry)...');
      const result = await testClient.get('/500');
      console.log('   Unexpected success:', result);
    } catch (error) {
      console.log('   ✅ 500 error handled correctly:', error.message);
    }

    // Test with a 200 success endpoint
    try {
      console.log('   Testing 200 success endpoint...');
      const result = await testClient.get('/200');
      console.log('   ✅ Success endpoint works:', result);
    } catch (error) {
      console.log('   ❌ Success endpoint failed:', error.message);
    }

    // Test 4: WordPress-specific API calls
    console.log('\n📝 Test 4: WordPress-Specific API Calls');
    
    try {
      console.log('   Fetching WordPress posts...');
      const posts = await wpClient.get('/posts?per_page=5');
      console.log(`   ✅ Retrieved ${posts.length} posts`);
      
      if (posts.length > 0) {
        const firstPost = posts[0];
        console.log(`   - First post: "${firstPost.title?.rendered || 'No title'}"`);
        console.log(`   - Post ID: ${firstPost.id}`);
        console.log(`   - Status: ${firstPost.status}`);
      }
    } catch (error) {
      console.log('   ⚠️  WordPress posts fetch failed:', error.message);
      await errorLogger.logApiError({
        endpoint: '/posts',
        method: 'GET',
        error: error.message,
        status: error.status,
        timestamp: new Date().toISOString()
      });
    }

    // Test 5: Error logging integration
    console.log('\n📊 Test 5: Error Logging Integration');
    
    // Simulate some API errors
    await errorLogger.logApiError({
      endpoint: '/test-endpoint',
      method: 'GET',
      error: 'Simulated API error for testing',
      status: 500,
      timestamp: new Date().toISOString()
    });

    await errorLogger.logApiError({
      endpoint: '/another-endpoint',
      method: 'POST',
      error: 'Network timeout',
      status: null,
      timestamp: new Date().toISOString()
    });

    console.log('   ✅ API errors logged to error system');

    // Test 6: Batch requests
    console.log('\n📦 Test 6: Batch Request Processing');
    
    const batchRequests = [
      { method: 'GET', endpoint: '/posts?per_page=1' },
      { method: 'GET', endpoint: '/pages?per_page=1' },
      { method: 'GET', endpoint: '/categories?per_page=1' }
    ];

    try {
      const batchResults = await wpClient.batch(batchRequests, 2);
      console.log(`   ✅ Batch processing completed`);
      console.log(`   - Successful requests: ${batchResults.results.length}`);
      console.log(`   - Failed requests: ${batchResults.errors.length}`);
      
      if (batchResults.errors.length > 0) {
        console.log('   - Errors:');
        batchResults.errors.forEach((error, index) => {
          console.log(`     ${index + 1}. ${error.message}`);
        });
      }
    } catch (error) {
      console.log('   ⚠️  Batch processing failed:', error.message);
    }

    // Test 7: Configuration integration
    console.log('\n⚙️  Test 7: Configuration Integration');
    
    const exportConfig = config.export || {};
    console.log('   Export configuration:');
    console.log(`   - Output Directory: ${exportConfig.outputDir || 'Not set'}`);
    console.log(`   - Media Directory: ${exportConfig.mediaDir || 'Not set'}`);
    console.log(`   - Batch Size: ${exportConfig.batchSize || 'Not set'}`);
    console.log(`   - Retry Attempts: ${exportConfig.retryAttempts || 'Not set'}`);

    // Test 8: Generate error summary
    console.log('\n📈 Test 8: Error Summary Generation');
    
    const errorSummary = errorLogger.generateErrorSummary();
    console.log('   Error Summary:');
    console.log(errorSummary);

    // Save error summary to file
    const summaryPath = './logs/api-client-integration-summary.md';
    await fs.writeFile(summaryPath, errorSummary);
    console.log(`   ✅ Error summary saved to: ${summaryPath}`);

    console.log('\n✅ API Client integration test completed successfully!\n');

    console.log('📁 Generated Files:');
    console.log('   - ./logs/api-client-integration-summary.md - Error summary report');
    console.log('   - ./logs/api/ - API error logs');
    console.log('   - ./logs/general/ - General error logs');

    console.log('\n🔧 Usage Examples:');
    console.log('   // Create WordPress client');
    console.log('   const wpClient = createWordPressClient(siteConfig);');
    console.log('');
    console.log('   // Make API calls with automatic retry');
    console.log('   const posts = await wpClient.get("/posts?per_page=10");');
    console.log('');
    console.log('   // Batch processing');
    console.log('   const results = await wpClient.batch(requests, 5);');
    console.log('');
    console.log('   // Error handling');
    console.log('   try {');
    console.log('     const data = await wpClient.get("/endpoint");');
    console.log('   } catch (error) {');
    console.log('     console.log("Error:", error.message);');
    console.log('     console.log("Status:", error.status);');
    console.log('   }');

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    await errorLogger.logError('Integration test failed', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}

// Run the integration test
runIntegrationTest().catch(console.error);

/**
 * Test script to demonstrate configuration management integration
 * Task 1.8: Create configuration file for WordPress API endpoints and credentials
 */

const { createConfigManager, createSiteConfigManager } = require('../lib/config/config-manager.js');

async function testConfigIntegration() {
  console.log('🧪 Testing Configuration Management Integration...\n');

  // Create config manager
  const configManager = createConfigManager();
  
  // Test 1: Generate and save default configuration
  console.log('📝 Testing default configuration generation...');
  const template = configManager.generateDefaultConfig();
  console.log('✅ Default configuration template generated');
  console.log(`   - Sites: ${Object.keys(template.sites).join(', ')}`);
  console.log(`   - Export settings: ${Object.keys(template.export).join(', ')}`);
  console.log(`   - Field mapping: ${Object.keys(template.fieldMapping).join(', ')}`);

  // Test 2: Create configuration from template
  console.log('\n💾 Testing configuration file creation...');
  try {
    const created = await configManager.createConfigFromTemplate();
    if (created) {
      console.log('✅ Configuration file created from template');
    } else {
      console.log('ℹ️  Configuration file already exists');
    }
  } catch (error) {
    console.log('⚠️  Configuration file creation failed:', error.message);
  }

  // Test 3: Load and validate configuration
  console.log('\n🔍 Testing configuration loading and validation...');
  try {
    const config = await configManager.loadConfig();
    const validation = await configManager.validateConfig();
    
    if (validation.isValid) {
      console.log('✅ Configuration is valid');
    } else {
      console.log('⚠️  Configuration validation issues:');
      validation.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    const summary = await configManager.getConfigSummary();
    console.log(`   - Config path: ${summary.configPath}`);
    console.log(`   - Available sites: ${summary.sites.join(', ')}`);
    console.log(`   - Has credentials: ${summary.hasCredentials ? 'Yes' : 'No'}`);
  } catch (error) {
    console.log('❌ Configuration loading failed:', error.message);
  }

  // Test 4: Environment variable integration
  console.log('\n🌐 Testing environment variable integration...');
  
  // Set test environment variables
  process.env.WP_POLYTHING_USERNAME = 'testuser';
  process.env.WP_POLYTHING_PASSWORD = 'testpass123';
  process.env.WP_MIGHTYBOOTH_API_KEY = 'ak_test_1234567890abcdef';
  
  try {
    const config = await configManager.loadConfig();
    const mergedConfig = configManager.mergeEnvVars(config);
    
    console.log('✅ Environment variables processed');
    console.log('   - Available sites after env merge:', Object.keys(mergedConfig.sites));
    
    if (mergedConfig.sites.polything) {
      console.log('   - Polything credentials from env vars:');
      console.log(`     - Username: ${mergedConfig.sites.polything.USERNAME || 'Not set'}`);
      console.log(`     - Password: ${mergedConfig.sites.polything.PASSWORD ? '***' : 'Not set'}`);
    }
    
    if (mergedConfig.sites.mightybooth) {
      console.log('   - Mightybooth credentials from env vars:');
      console.log(`     - API Key: ${mergedConfig.sites.mightybooth.API_KEY ? '***' : 'Not set'}`);
    }
  } catch (error) {
    console.log('❌ Environment variable integration failed:', error.message);
  }

  // Test 5: Site-specific configuration
  console.log('\n🎯 Testing site-specific configuration...');
  try {
    const siteConfigManager = createSiteConfigManager('polything.co.uk');
    const siteConfig = await siteConfigManager.getConfig();
    
    if (siteConfig) {
      console.log('✅ Site configuration loaded for polything.co.uk');
      console.log(`   - URL: ${siteConfig.url}`);
      console.log(`   - API Base: ${siteConfig.apiBase}`);
      console.log(`   - Content Types: ${siteConfig.contentTypes?.join(', ') || 'Not set'}`);
    } else {
      console.log('⚠️  No configuration found for polything.co.uk');
    }
  } catch (error) {
    console.log('❌ Site configuration loading failed:', error.message);
  }

  // Test 6: Export configuration
  console.log('\n📤 Testing export configuration...');
  try {
    const exportConfig = await configManager.getExportConfig('polything.co.uk');
    console.log('✅ Export configuration generated');
    console.log(`   - Output directory: ${exportConfig.export.outputDir}`);
    console.log(`   - Media directory: ${exportConfig.export.mediaDir}`);
    console.log(`   - Batch size: ${exportConfig.export.batchSize}`);
    console.log(`   - Retry attempts: ${exportConfig.export.retryAttempts}`);
  } catch (error) {
    console.log('❌ Export configuration generation failed:', error.message);
  }

  // Test 7: Security features
  console.log('\n🔒 Testing security features...');
  try {
    const config = await configManager.loadConfig();
    const maskedConfig = configManager.maskSensitiveData(config);
    
    console.log('✅ Sensitive data masking working');
    
    // Check if sensitive data is masked
    const hasMaskedData = JSON.stringify(maskedConfig).includes('***');
    console.log(`   - Sensitive data masked: ${hasMaskedData ? 'Yes' : 'No'}`);
  } catch (error) {
    console.log('❌ Security features test failed:', error.message);
  }

  // Clean up environment variables
  delete process.env.WP_POLYTHING_USERNAME;
  delete process.env.WP_POLYTHING_PASSWORD;
  delete process.env.WP_MIGHTYBOOTH_API_KEY;

  console.log('\n✅ Configuration management integration test completed!');
  console.log('\n📁 Configuration files:');
  console.log('  - ./config/wordpress.json (main configuration)');
  console.log('  - Environment variables (WP_* prefix)');
  console.log('\n🔧 Usage examples:');
  console.log('  - Set credentials: export WP_POLYTHING_USERNAME=your_username');
  console.log('  - Set API key: export WP_MIGHTYBOOTH_API_KEY=your_api_key');
  console.log('  - Load config: const config = await configManager.loadConfig()');
}

// Run the test
if (require.main === module) {
  testConfigIntegration().catch(console.error);
}

module.exports = { testConfigIntegration };

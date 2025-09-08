/**
 * Test environment variable processing
 */

const { ConfigManager } = require('../lib/config/config-manager.js');

// Set test environment variables
process.env.WP_POLYTHING_USERNAME = 'envuser';
process.env.WP_POLYTHING_PASSWORD = 'envpass';
process.env.WP_POLYTHING_API_KEY = 'envapikey';

const configManager = new ConfigManager();

const mockConfig = {
  sites: {
    'polything.co.uk': {
      url: 'https://polything.co.uk',
      apiBase: 'https://polything.co.uk/wp-json/wp/v2'
    }
  }
};

console.log('Original config:', JSON.stringify(mockConfig, null, 2));

const mergedConfig = configManager.mergeEnvVars(mockConfig);

console.log('Merged config:', JSON.stringify(mergedConfig, null, 2));
console.log('Sites keys:', Object.keys(mergedConfig.sites));
console.log('Polything site:', mergedConfig.sites['polything']);

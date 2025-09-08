/**
 * Debug script for environment variable parsing
 */

// Set test environment variables
process.env.WP_POLYTHING_USERNAME = 'envuser';
process.env.WP_POLYTHING_PASSWORD = 'envpass';
process.env.WP_POLYTHING_API_KEY = 'envapikey';

const envPrefix = 'WP_';

console.log('Environment variables:');
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith(envPrefix)) {
    console.log(`  ${key} = ${value}`);
    const siteKey = key.substring(envPrefix.length);
    console.log(`  siteKey: ${siteKey}`);
    
    const siteMatch = siteKey.match(/^([^_]+)_(.+)$/);
    if (siteMatch) {
      const [, siteName, fieldName] = siteMatch;
      const normalizedSiteName = siteName.toLowerCase().replace(/_/g, '.');
      console.log(`  siteName: ${siteName}, fieldName: ${fieldName}, normalized: ${normalizedSiteName}`);
    } else {
      console.log(`  No match for: ${siteKey}`);
    }
  }
}

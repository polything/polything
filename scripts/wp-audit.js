/**
 * WordPress Site Audit Utilities
 * 
 * Functions to audit WordPress sites and discover available content types,
 * REST API endpoints, and meta field exposure for migration planning.
 */

const fs = require('fs/promises');
const path = require('path');

/**
 * Audits a WordPress site to determine migration readiness
 * @param {string} siteUrl - The WordPress site URL to audit
 * @returns {Promise<Object>} Audit results including content types and API availability
 */
async function auditWordPressSite(siteUrl) {
  const result = {
    siteUrl,
    isWordPress: false,
    restApiAvailable: false,
    contentTypes: {},
    metaFields: {},
    themerainFields: {},
    mediaEndpoint: null,
    error: null,
    timestamp: new Date().toISOString()
  };

  try {
    // Normalise URL
    const baseUrl = siteUrl.replace(/\/$/, '');
    
    // Test if it's a WordPress site
    result.isWordPress = await isWordPressSite(baseUrl);
    
    if (!result.isWordPress) {
      result.error = 'Site does not appear to be WordPress';
      return result;
    }

    // Test REST API availability
    result.restApiAvailable = await testRESTApi(baseUrl);
    
    if (!result.restApiAvailable) {
      result.error = 'WordPress REST API not available';
      return result;
    }

    // Discover content types
    result.contentTypes = await discoverContentTypes(baseUrl);
    
    // Validate REST endpoints
    const endpointValidation = await validateRESTEndpoints(baseUrl, result.contentTypes);
    result.metaFields = endpointValidation;
    
    // Test media endpoint
    result.mediaEndpoint = await testMediaEndpoint(baseUrl);
    
    // Discover themerain fields via diagnostic endpoint
    result.themerainFields = await discoverThemerainFieldsForSite(baseUrl, result.contentTypes);

  } catch (error) {
    result.error = error.message;
    console.error('Audit error:', error);
  }

  return result;
}

/**
 * Tests if a site is WordPress by checking for WordPress-specific headers/endpoints
 * @param {string} baseUrl - The site base URL
 * @returns {Promise<boolean>} True if WordPress detected
 */
async function isWordPressSite(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/wp-json/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return !!(data && data.name && data.description); // Basic WordPress REST API response check
  } catch (error) {
    return false;
  }
}

/**
 * Tests if WordPress REST API is available
 * @param {string} baseUrl - The site base URL
 * @returns {Promise<boolean>} True if REST API is accessible
 */
async function testRESTApi(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Discovers available content types via WordPress REST API
 * @param {string} baseUrl - The site base URL
 * @returns {Promise<Object>} Content types with their REST endpoints
 */
async function discoverContentTypes(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/types`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content types: ${response.status}`);
    }
    
    const types = await response.json();
    
    // Filter to only include public content types with REST support
    const publicTypes = {};
    for (const [key, type] of Object.entries(types)) {
      // Include types that have REST support, even if not explicitly marked as public
      // This includes custom post types like 'project'
      if (type.rest_base) {
        publicTypes[key] = {
          name: type.name,
          rest_base: type.rest_base,
          description: type.description,
          public: type.public || false
        };
      }
    }
    
    return publicTypes;
  } catch (error) {
    console.error('Error discovering content types:', error);
    return {};
  }
}

/**
 * Validates REST endpoints and discovers meta field exposure
 * @param {string} baseUrl - The site base URL
 * @param {Object} contentTypes - Available content types
 * @returns {Promise<Object>} Endpoint validation results with meta field info
 */
async function validateRESTEndpoints(baseUrl, contentTypes) {
  const results = {};
  
  for (const [typeKey, typeInfo] of Object.entries(contentTypes)) {
    const endpoint = `${baseUrl}/wp-json/wp/v2/${typeInfo.rest_base}`;
    
    try {
      // Test basic endpoint availability
      const response = await fetch(`${endpoint}?per_page=1`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });
      
      results[typeInfo.rest_base] = {
        available: response.ok,
        endpoint,
        metaFields: {}
      };
      
      if (response.ok) {
        // Try to get a sample item to check meta field exposure
        const data = await response.json();
        if (data && data.length > 0) {
          const sampleItem = data[0];
          results[typeInfo.rest_base].metaFields = await discoverMetaFields(baseUrl, typeInfo.rest_base, sampleItem.id);
        }
      }
      
    } catch (error) {
      results[typeInfo.rest_base] = {
        available: false,
        endpoint,
        error: error.message,
        metaFields: {}
      };
    }
  }
  
  return results;
}

/**
 * Discovers meta fields exposed via REST API for a specific content type
 * @param {string} baseUrl - The site base URL
 * @param {string} restBase - The REST endpoint base (e.g., 'posts', 'projects')
 * @param {number} itemId - Sample item ID to check
 * @returns {Promise<Object>} Available meta fields
 */
async function discoverMetaFields(baseUrl, restBase, itemId) {
  try {
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/${restBase}/${itemId}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) return {};
    
    const item = await response.json();
    const metaFields = {};
    
    // Check for themerain_* fields in various locations
    const candidates = { 
      ...item, 
      ...(item.meta || {}), 
      ...(item.acf || {}) // Also check ACF object
    };
    
    for (const [key, value] of Object.entries(candidates)) {
      if (key.startsWith('themerain_')) {
        metaFields[key] = {
          value: value,
          type: typeof value,
          available: true,
          source: item.acf && item.acf[key] !== undefined ? 'acf' : 'meta'
        };
      }
    }
    
    // Check if ACF is available but empty
    if (item.acf && Object.keys(item.acf).length === 0) {
      metaFields._acf_available_but_empty = {
        value: true,
        type: 'boolean',
        available: true,
        source: 'acf'
      };
    }
    
    return metaFields;
  } catch (error) {
    console.error(`Error discovering meta fields for ${restBase}:`, error);
    return {};
  }
}

/**
 * Tests WordPress media endpoint availability
 * @param {string} baseUrl - The site base URL
 * @returns {Promise<string|null>} Media endpoint URL if available
 */
async function testMediaEndpoint(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/media?per_page=1`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    
    if (response.ok) {
      return `${baseUrl}/wp-json/wp/v2/media`;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Discovers themerain fields for a specific post via diagnostic endpoint
 * @param {string} baseUrl - The site base URL
 * @param {string} contentType - The content type (e.g., 'project')
 * @param {number} postId - The post ID to check
 * @returns {Promise<Object>} Themerain fields data
 */
async function discoverThemerainFields(baseUrl, contentType, postId) {
  try {
    const response = await fetch(`${baseUrl}/wp-json/polything/v1/themerain-meta/${postId}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Discovers themerain fields for all content types on a site
 * @param {string} baseUrl - The site base URL
 * @param {Object} contentTypes - Available content types
 * @returns {Promise<Object>} Themerain fields for each content type
 */
async function discoverThemerainFieldsForSite(baseUrl, contentTypes) {
  const themerainFields = {};
  const siteKey = baseUrl;
  themerainFields[siteKey] = {};
  
  // Test key content types with known post IDs
  const testPosts = {
    project: 10680, // Known project ID from polything.co.uk
    post: null,     // We'll need to find a post ID
    page: null      // We'll need to find a page ID
  };
  
  for (const [contentType, postId] of Object.entries(testPosts)) {
    if (contentTypes[contentType] && postId) {
      try {
        const fields = await discoverThemerainFields(baseUrl, contentType, postId);
        themerainFields[siteKey][contentType] = fields;
      } catch (error) {
        themerainFields[siteKey][contentType] = { error: error.message };
      }
    }
  }
  
  return themerainFields;
}

/**
 * Generates an audit report and saves it to file
 * @param {Object} auditResult - The audit result from auditWordPressSite
 * @param {string} outputPath - Path to save the report
 */
async function generateAuditReport(auditResult, outputPath = './audit-report.json') {
  const report = {
    ...auditResult,
    summary: {
      totalContentTypes: Object.keys(auditResult.contentTypes).length,
      availableEndpoints: Object.values(auditResult.metaFields).filter(e => e.available).length,
      themerainFieldsFound: Object.values(auditResult.metaFields)
        .reduce((count, endpoint) => count + Object.keys(endpoint.metaFields).length, 0),
      migrationReady: auditResult.isWordPress && auditResult.restApiAvailable
    },
    recommendations: generateRecommendations(auditResult)
  };
  
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
  console.log(`Audit report saved to: ${outputPath}`);
  
  return report;
}

/**
 * Generates migration recommendations based on audit results
 * @param {Object} auditResult - The audit result
 * @returns {Array} List of recommendations
 */
function generateRecommendations(auditResult) {
  const recommendations = [];
  
  if (!auditResult.isWordPress) {
    recommendations.push('Site is not WordPress - migration not applicable');
    return recommendations;
  }
  
  if (!auditResult.restApiAvailable) {
    recommendations.push('Enable WordPress REST API for content export');
  }
  
  if (!auditResult.mediaEndpoint) {
    recommendations.push('WordPress media endpoint not accessible - check media permissions');
  }
  
  const themerainFields = Object.values(auditResult.metaFields)
    .reduce((fields, endpoint) => ({ ...fields, ...endpoint.metaFields }), {});
  
  if (Object.keys(themerainFields).length === 0) {
    recommendations.push('No themerain_* meta fields found - may need ACF to REST API plugin');
  }
  
  if (!auditResult.contentTypes.project) {
    recommendations.push('Project custom post type not found - verify custom post type registration');
  }
  
  return recommendations;
}

// Export functions for testing
module.exports = {
  auditWordPressSite,
  discoverContentTypes,
  validateRESTEndpoints,
  discoverThemerainFields,
  generateAuditReport
};

// CLI usage
if (require.main === module) {
  const siteUrl = process.argv[2] || 'https://polything.co.uk';
  
  console.log(`Auditing WordPress site: ${siteUrl}`);
  
  auditWordPressSite(siteUrl)
    .then(async (result) => {
      console.log('\n=== AUDIT RESULTS ===');
      console.log(`Site: ${result.siteUrl}`);
      console.log(`WordPress: ${result.isWordPress}`);
      console.log(`REST API: ${result.restApiAvailable}`);
      console.log(`Content Types: ${Object.keys(result.contentTypes).join(', ')}`);
      console.log(`Media Endpoint: ${result.mediaEndpoint ? 'Available' : 'Not Available'}`);
      
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
      
      // Generate detailed report
      const report = await generateAuditReport(result);
      console.log('\n=== RECOMMENDATIONS ===');
      report.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
      
      process.exit(result.isWordPress && result.restApiAvailable ? 0 : 1);
    })
    .catch((error) => {
      console.error('Audit failed:', error);
      process.exit(1);
    });
}

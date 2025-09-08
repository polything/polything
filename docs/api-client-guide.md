# API Client Guide

## Overview

The API Client provides a robust HTTP client with retry logic, error handling, and authentication support for WordPress API interactions. It's designed to handle network issues, server errors, and rate limiting gracefully.

## Features

- **Retry Logic**: Exponential backoff with configurable attempts and delays
- **Authentication**: Support for basic auth and API key authentication
- **Error Handling**: Comprehensive error information with status codes and data
- **Batch Processing**: Concurrent request handling with configurable limits
- **WordPress Integration**: Specialized client factory for WordPress APIs
- **Logging Integration**: Seamless integration with error logging system
- **Configuration Integration**: Works with existing configuration management

## Quick Start

### Basic Usage

```javascript
const { ApiClient, createWordPressClient } = require('./lib/api/api-client');

// Create a basic API client
const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  timeout: 30000,
  retryAttempts: 3
});

// Make a GET request
const data = await client.get('/endpoint');

// Make a POST request with data
const result = await client.post('/endpoint', { key: 'value' });
```

### WordPress Client

```javascript
const { createWordPressClient } = require('./lib/api/api-client');
const { ConfigManager } = require('./lib/config/config-manager');

// Load configuration
const configManager = new ConfigManager();
const config = await configManager.loadConfig();
const siteConfig = config.sites['polything.co.uk'];

// Create WordPress client
const wpClient = createWordPressClient(siteConfig, {
  retryAttempts: 3,
  retryDelay: 1000
});

// Fetch WordPress posts
const posts = await wpClient.get('/posts?per_page=10');
```

## Configuration Options

### ApiClient Options

```javascript
const client = new ApiClient({
  baseUrl: 'https://api.example.com',        // Base URL for requests
  timeout: 30000,                           // Request timeout in ms
  retryAttempts: 3,                         // Number of retry attempts
  retryDelay: 1000,                         // Initial retry delay in ms
  retryBackoff: 2,                          // Exponential backoff multiplier
  maxRetryDelay: 10000,                     // Maximum retry delay in ms
  retryOnStatus: [408, 429, 500, 502, 503, 504], // HTTP status codes to retry
  retryOnNetworkError: true,                // Retry on network errors
  enableLogging: true                       // Enable request/response logging
});
```

### WordPress Client Options

```javascript
const wpClient = createWordPressClient(siteConfig, {
  // All ApiClient options plus WordPress-specific defaults
  retryAttempts: 3,
  retryDelay: 1000,
  retryBackoff: 2,
  maxRetryDelay: 10000,
  retryOnStatus: [408, 429, 500, 502, 503, 504],
  retryOnNetworkError: true,
  enableLogging: true
});
```

## Authentication

### Basic Authentication

```javascript
const client = new ApiClient({
  baseUrl: 'https://api.example.com'
});

// Set basic authentication
client.setAuth('username', 'password');

// Make authenticated request
const data = await client.get('/protected-endpoint');
```

### API Key Authentication

```javascript
const client = new ApiClient({
  baseUrl: 'https://api.example.com'
});

// Set API key
client.setApiKey('your-api-key-here');

// Make authenticated request
const data = await client.get('/protected-endpoint');
```

### WordPress Authentication

```javascript
// WordPress client automatically uses credentials from site config
const wpClient = createWordPressClient(siteConfig);

// Credentials are automatically included in requests
const posts = await wpClient.get('/posts');
```

## HTTP Methods

### GET Request

```javascript
const data = await client.get('/endpoint');
const dataWithParams = await client.get('/endpoint?param=value');
```

### POST Request

```javascript
const result = await client.post('/endpoint', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### PUT Request

```javascript
const result = await client.put('/endpoint/123', {
  name: 'Updated Name'
});
```

### DELETE Request

```javascript
const result = await client.delete('/endpoint/123');
```

### Custom Headers

```javascript
const data = await client.get('/endpoint', {
  'Custom-Header': 'value',
  'Another-Header': 'another-value'
});
```

## Error Handling

### Basic Error Handling

```javascript
try {
  const data = await client.get('/endpoint');
  console.log('Success:', data);
} catch (error) {
  console.error('Request failed:', error.message);
  console.error('Status:', error.status);
  console.error('Status Text:', error.statusText);
  console.error('Response Data:', error.data);
}
```

### Retry Logic

The client automatically retries failed requests based on configuration:

```javascript
const client = new ApiClient({
  retryAttempts: 3,           // Retry up to 3 times
  retryDelay: 1000,           // Start with 1 second delay
  retryBackoff: 2,            // Double delay each retry
  maxRetryDelay: 10000,       // Cap at 10 seconds
  retryOnStatus: [500, 502, 503, 504], // Retry on these status codes
  retryOnNetworkError: true   // Retry on network errors
});
```

### Custom Retry Logic

```javascript
// Check if error should be retried
if (error.status === 429) {
  // Rate limited - wait longer
  await new Promise(resolve => setTimeout(resolve, 5000));
  // Retry the request
}
```

## Batch Processing

### Basic Batch Requests

```javascript
const requests = [
  { method: 'GET', endpoint: '/posts?per_page=5' },
  { method: 'GET', endpoint: '/pages?per_page=5' },
  { method: 'GET', endpoint: '/categories?per_page=5' }
];

const results = await client.batch(requests, 2); // Concurrency of 2
console.log('Successful requests:', results.results.length);
console.log('Failed requests:', results.errors.length);
```

### Batch with Error Handling

```javascript
const requests = [
  { method: 'GET', endpoint: '/posts' },
  { method: 'GET', endpoint: '/pages' },
  { method: 'GET', endpoint: '/categories' }
];

const results = await client.batch(requests, 3);

// Process successful results
results.results.forEach((data, index) => {
  console.log(`Request ${index + 1} succeeded:`, data.length, 'items');
});

// Handle errors
results.errors.forEach((error, index) => {
  console.error(`Request ${index + 1} failed:`, error.message);
});
```

## WordPress-Specific Usage

### Fetching Content

```javascript
// Fetch posts with pagination
const posts = await wpClient.get('/posts?per_page=10&page=1');

// Fetch specific post
const post = await wpClient.get('/posts/123');

// Fetch posts by category
const categoryPosts = await wpClient.get('/posts?categories=5');

// Fetch media
const media = await wpClient.get('/media?per_page=20');
```

### Creating Content

```javascript
// Create a new post
const newPost = await wpClient.post('/posts', {
  title: 'New Post Title',
  content: 'Post content here',
  status: 'draft'
});

// Update existing post
const updatedPost = await wpClient.put('/posts/123', {
  title: 'Updated Title',
  content: 'Updated content'
});
```

### Media Operations

```javascript
// Upload media file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', 'My Image');

const uploadedMedia = await wpClient.upload('/media', formData);

// Get media details
const mediaDetails = await wpClient.get('/media/456');
```

## Integration with Other Systems

### Error Logging Integration

```javascript
const { ErrorLogger } = require('./lib/logging/error-logger');

const errorLogger = new ErrorLogger();
await errorLogger.initialize();

const client = new ApiClient({
  baseUrl: 'https://api.example.com'
});

try {
  const data = await client.get('/endpoint');
} catch (error) {
  // Log API error
  await errorLogger.logApiError({
    endpoint: '/endpoint',
    method: 'GET',
    error: error.message,
    status: error.status,
    timestamp: new Date().toISOString()
  });
}
```

### Configuration Integration

```javascript
const { ConfigManager } = require('./lib/config/config-manager');

const configManager = new ConfigManager();
const config = await configManager.loadConfig();

// Use configuration for API client
const client = new ApiClient({
  baseUrl: config.sites['polything.co.uk'].apiBase,
  timeout: config.export.timeout,
  retryAttempts: config.export.retryAttempts
});
```

## Advanced Features

### Health Checks

```javascript
// Check if API is healthy
const health = await client.healthCheck('/health');
if (health.healthy) {
  console.log('API is healthy');
} else {
  console.log('API is unhealthy:', health.error);
}
```

### Custom Request Options

```javascript
// Override default options for specific request
const data = await client.get('/endpoint', {
  'Custom-Header': 'value'
}, {
  timeout: 60000,  // Override timeout for this request
  retryAttempts: 1 // Override retry attempts for this request
});
```

### File Upload

```javascript
// Upload file with additional data
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'Document Title');
formData.append('description', 'Document description');

const result = await client.upload('/upload', formData, {
  category: 'documents',
  tags: 'important,archive'
});
```

## Best Practices

### 1. Configure Retry Logic Appropriately

```javascript
// For WordPress APIs
const wpClient = createWordPressClient(siteConfig, {
  retryAttempts: 3,        // Good for temporary server issues
  retryDelay: 1000,        // Start with 1 second
  retryBackoff: 2,         // Exponential backoff
  maxRetryDelay: 10000     // Cap at 10 seconds
});
```

### 2. Handle Rate Limiting

```javascript
// Check for rate limiting headers
const response = await client.get('/endpoint');
const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');

if (rateLimitRemaining && parseInt(rateLimitRemaining) < 10) {
  // Slow down requests
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

### 3. Use Batch Processing for Multiple Requests

```javascript
// Instead of sequential requests
const posts = await client.get('/posts');
const pages = await client.get('/pages');
const categories = await client.get('/categories');

// Use batch processing
const requests = [
  { method: 'GET', endpoint: '/posts' },
  { method: 'GET', endpoint: '/pages' },
  { method: 'GET', endpoint: '/categories' }
];

const results = await client.batch(requests, 3);
```

### 4. Monitor and Log Errors

```javascript
const { ErrorLogger } = require('./lib/logging/error-logger');
const errorLogger = new ErrorLogger();

// Log all API errors
try {
  const data = await client.get('/endpoint');
} catch (error) {
  await errorLogger.logApiError({
    endpoint: '/endpoint',
    method: 'GET',
    error: error.message,
    status: error.status,
    timestamp: new Date().toISOString()
  });
  throw error; // Re-throw if needed
}
```

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase timeout or check network connectivity
2. **Authentication Failures**: Verify credentials and authentication method
3. **Retry Logic Not Working**: Check retry configuration and status codes
4. **Batch Request Failures**: Reduce concurrency or add delays
5. **Memory Issues**: Process requests in smaller batches

### Debug Mode

```javascript
const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  enableLogging: true  // Enable detailed logging
});

// All requests will be logged with timestamps and details
```

### Testing

```javascript
// Run integration tests
node scripts/test-api-client-integration.js

// Run unit tests
npm test lib/api/api-client.test.js
```

## Examples

### Complete WordPress Export Example

```javascript
const { createWordPressClient } = require('./lib/api/api-client');
const { ConfigManager } = require('./lib/config/config-manager');
const { ErrorLogger } = require('./lib/logging/error-logger');

async function exportWordPressContent() {
  // Initialize systems
  const configManager = new ConfigManager();
  const errorLogger = new ErrorLogger();
  await errorLogger.initialize();
  
  const config = await configManager.loadConfig();
  const siteConfig = config.sites['polything.co.uk'];
  
  // Create WordPress client
  const wpClient = createWordPressClient(siteConfig, {
    retryAttempts: 3,
    retryDelay: 1000
  });
  
  try {
    // Fetch all content types
    const requests = [
      { method: 'GET', endpoint: '/posts?per_page=100' },
      { method: 'GET', endpoint: '/pages?per_page=100' },
      { method: 'GET', endpoint: '/projects?per_page=100' }
    ];
    
    const results = await wpClient.batch(requests, 2);
    
    console.log(`Exported ${results.results[0].length} posts`);
    console.log(`Exported ${results.results[1].length} pages`);
    console.log(`Exported ${results.results[2].length} projects`);
    
    // Log any errors
    if (results.errors.length > 0) {
      for (const error of results.errors) {
        await errorLogger.logApiError({
          endpoint: error.endpoint,
          method: error.method,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
  } catch (error) {
    await errorLogger.logError('Export failed', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

exportWordPressContent().catch(console.error);
```

---

**Last Updated**: 2025-01-27  
**Maintained By**: Development Team  
**Next Review**: After Task 2.0 completion

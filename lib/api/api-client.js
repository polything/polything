/**
 * API Client with Retry Logic and Error Handling
 * Task 1.9: Add error handling and retry logic for API calls
 */

/**
 * API Client Class
 * Provides robust HTTP client with retry logic, error handling, and authentication
 */
class ApiClient {
  constructor(options = {}) {
    this.options = {
      baseUrl: '',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      retryBackoff: 2,
      maxRetryDelay: 10000,
      retryOnStatus: [408, 429, 500, 502, 503, 504],
      retryOnNetworkError: true,
      enableLogging: true,
      ...options
    };

    this.auth = null;
    this.apiKey = null;
  }

  /**
   * Set basic authentication
   */
  setAuth(username, password) {
    this.auth = { username, password };
  }

  /**
   * Set API key authentication
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Build request headers
   */
  buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    // Add authentication headers
    if (this.auth) {
      const credentials = Buffer.from(`${this.auth.username}:${this.auth.password}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    return headers;
  }

  /**
   * Build full URL
   */
  buildUrl(endpoint) {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    const baseUrl = this.options.baseUrl.endsWith('/') 
      ? this.options.baseUrl.slice(0, -1) 
      : this.options.baseUrl;
    
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Create AbortController for timeout
   */
  createAbortController() {
    const controller = new AbortController();
    
    if (this.options.timeout > 0) {
      setTimeout(() => {
        controller.abort();
      }, this.options.timeout);
    }
    
    return controller;
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if error should trigger retry
   */
  shouldRetry(error, response, attempt) {
    if (attempt >= this.options.retryAttempts) {
      return false;
    }

    // Network errors
    if (this.options.retryOnNetworkError && error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        return true;
      }
    }

    // HTTP status codes
    if (response && this.options.retryOnStatus.includes(response.status)) {
      return true;
    }

    return false;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  calculateRetryDelay(attempt) {
    const delay = this.options.retryDelay * Math.pow(this.options.retryBackoff, attempt - 1);
    return Math.min(delay, this.options.maxRetryDelay);
  }

  /**
   * Log request/response for debugging
   */
  log(level, message, data = null) {
    if (!this.options.enableLogging) return;
    
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] API ${level}: ${message}`;
    
    if (data) {
      console[level](logMessage, data);
    } else {
      console[level](logMessage);
    }
  }

  /**
   * Make HTTP request with retry logic
   */
  async request(method, endpoint, data = null, customHeaders = {}) {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(customHeaders);
    
    let lastError = null;
    let lastResponse = null;

    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        this.log('log', `${method} ${url} (attempt ${attempt}/${this.options.retryAttempts})`);

        const controller = this.createAbortController();
        const requestOptions = {
          method: method.toUpperCase(),
          headers,
          signal: controller.signal
        };

        if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
          requestOptions.body = JSON.stringify(data);
        }

        const response = await fetch(url, requestOptions);
        lastResponse = response;

        // Handle successful response
        if (response.ok) {
          this.log('log', `${method} ${url} - Success (${response.status})`);
          
          // Handle different content types
          const contentType = response.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            try {
              return await response.json();
            } catch (jsonError) {
              throw new Error(`JSON parsing error: ${jsonError.message}`);
            }
          } else {
            // Check if response has text method before calling it
            if (typeof response.text === 'function') {
              return await response.text();
            } else {
              return null; // For 204 No Content responses
            }
          }
        }

        // Handle error response
        const errorData = await this.parseErrorResponse(response);
        const error = new Error(`Request failed: ${response.status} ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;

        // Check if we should retry
        if (this.shouldRetry(null, response, attempt)) {
          const delay = this.calculateRetryDelay(attempt);
          this.log('warn', `${method} ${url} - Retrying in ${delay}ms (${response.status})`);
          await this.sleep(delay);
          continue;
        }

        // If we shouldn't retry, store the error and break to final error handling
        lastError = error;
        break;

      } catch (error) {
        lastError = error;

        // Handle network errors
        if (error.name === 'AbortError') {
          const timeoutError = new Error('Request timeout');
          timeoutError.name = 'AbortError';
          throw timeoutError;
        }

        // Check if we should retry
        if (this.shouldRetry(error, lastResponse, attempt)) {
          const delay = this.calculateRetryDelay(attempt);
          this.log('warn', `${method} ${url} - Retrying in ${delay}ms (${error.message})`);
          await this.sleep(delay);
          continue;
        }

        throw error;
      }
    }

    // If we get here, all retries failed
    const finalError = new Error(`Request failed after ${this.options.retryAttempts} attempts`);
    if (lastError) {
      finalError.originalError = lastError;
      // Copy error properties from the last error
      if (lastError.status) finalError.status = lastError.status;
      if (lastError.statusText) finalError.statusText = lastError.statusText;
      if (lastError.data) finalError.data = lastError.data;
    }
    if (lastResponse) {
      finalError.status = lastResponse.status;
      finalError.statusText = lastResponse.statusText;
    }
    
    throw finalError;
  }

  /**
   * Parse error response
   */
  async parseErrorResponse(response) {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      return { error: 'Failed to parse error response' };
    }
  }

  /**
   * GET request
   */
  async get(endpoint, customHeaders = {}) {
    return this.request('GET', endpoint, null, customHeaders);
  }

  /**
   * POST request
   */
  async post(endpoint, data = null, customHeaders = {}) {
    return this.request('POST', endpoint, data, customHeaders);
  }

  /**
   * PUT request
   */
  async put(endpoint, data = null, customHeaders = {}) {
    return this.request('PUT', endpoint, data, customHeaders);
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = null, customHeaders = {}) {
    return this.request('PATCH', endpoint, data, customHeaders);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, customHeaders = {}) {
    return this.request('DELETE', endpoint, null, customHeaders);
  }

  /**
   * Upload file
   */
  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional form data
    for (const [key, value] of Object.entries(additionalData)) {
      formData.append(key, value);
    }

    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders();
    
    // Remove Content-Type header for FormData (browser will set it with boundary)
    delete headers['Content-Type'];

    let lastError = null;
    let lastResponse = null;

    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        this.log('log', `UPLOAD ${url} (attempt ${attempt}/${this.options.retryAttempts})`);

        const controller = this.createAbortController();
        const requestOptions = {
          method: 'POST',
          headers,
          body: formData,
          signal: controller.signal
        };

        const response = await fetch(url, requestOptions);
        lastResponse = response;

        if (response.ok) {
          this.log('log', `UPLOAD ${url} - Success (${response.status})`);
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          } else {
            return await response.text();
          }
        }

        const errorData = await this.parseErrorResponse(response);
        const error = new Error(`Upload failed: ${response.status} ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;

        if (this.shouldRetry(null, response, attempt)) {
          const delay = this.calculateRetryDelay(attempt);
          this.log('warn', `UPLOAD ${url} - Retrying in ${delay}ms (${response.status})`);
          await this.sleep(delay);
          continue;
        }

        throw error;

      } catch (error) {
        lastError = error;

        if (error.name === 'AbortError') {
          const timeoutError = new Error('Upload timeout');
          timeoutError.name = 'AbortError';
          throw timeoutError;
        }

        if (this.shouldRetry(error, lastResponse, attempt)) {
          const delay = this.calculateRetryDelay(attempt);
          this.log('warn', `UPLOAD ${url} - Retrying in ${delay}ms (${error.message})`);
          await this.sleep(delay);
          continue;
        }

        throw error;
      }
    }

    const finalError = new Error(`Upload failed after ${this.options.retryAttempts} attempts`);
    if (lastError) {
      finalError.originalError = lastError;
    }
    if (lastResponse) {
      finalError.status = lastResponse.status;
      finalError.statusText = lastResponse.statusText;
    }
    
    throw finalError;
  }

  /**
   * Batch requests with concurrency control
   */
  async batch(requests, concurrency = 5) {
    const results = [];
    const errors = [];

    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      
      const batchPromises = batch.map(async (request, index) => {
        try {
          const result = await this.request(
            request.method,
            request.endpoint,
            request.data,
            request.headers
          );
          return { index: i + index, result, error: null };
        } catch (error) {
          return { index: i + index, result: null, error };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      
      for (const batchResult of batchResults) {
        if (batchResult.error) {
          errors.push(batchResult.error);
        } else {
          results.push(batchResult.result);
        }
      }
    }

    return { results, errors };
  }

  /**
   * Health check endpoint
   */
  async healthCheck(endpoint = '/health') {
    try {
      const result = await this.get(endpoint);
      return { healthy: true, data: result };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

/**
 * Create a WordPress API client
 */
function createWordPressClient(siteConfig, options = {}) {
  const client = new ApiClient({
    baseUrl: siteConfig.apiBase,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    retryBackoff: 2,
    maxRetryDelay: 10000,
    retryOnStatus: [408, 429, 500, 502, 503, 504],
    retryOnNetworkError: true,
    enableLogging: true,
    ...options
  });

  // Set authentication if provided
  if (siteConfig.username && siteConfig.password) {
    client.setAuth(siteConfig.username, siteConfig.password);
  }

  if (siteConfig.apiKey) {
    client.setApiKey(siteConfig.apiKey);
  }

  return client;
}

/**
 * Create a generic API client
 */
function createApiClient(baseUrl, options = {}) {
  return new ApiClient({
    baseUrl,
    ...options
  });
}

module.exports = {
  ApiClient,
  createWordPressClient,
  createApiClient
};

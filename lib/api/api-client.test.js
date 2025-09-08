/**
 * Tests for API Client with Retry Logic and Error Handling
 * Task 1.9: Add error handling and retry logic for API calls
 */

const fs = require('fs').promises;

// Mock fetch
global.fetch = jest.fn();

// Mock console methods
jest.spyOn(console, 'log').mockImplementation();
jest.spyOn(console, 'error').mockImplementation();
jest.spyOn(console, 'warn').mockImplementation();

describe('API Client with Retry Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ApiClient', () => {
    test('should create API client instance with default options', async () => {
      const { ApiClient } = require('./api-client.js');
      
      const client = new ApiClient();
      
      expect(client).toBeDefined();
      expect(client.options).toEqual({
        baseUrl: '',
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000,
        retryBackoff: 2,
        maxRetryDelay: 10000,
        retryOnStatus: [408, 429, 500, 502, 503, 504],
        retryOnNetworkError: true,
        enableLogging: true
      });
    });

    test('should create API client with custom options', async () => {
      const { ApiClient } = require('./api-client.js');
      
      const customOptions = {
        baseUrl: 'https://api.example.com',
        timeout: 60000,
        retryAttempts: 5,
        retryDelay: 2000,
        retryBackoff: 1.5,
        maxRetryDelay: 15000,
        retryOnStatus: [500, 502, 503],
        retryOnNetworkError: false,
        enableLogging: false
      };
      
      const client = new ApiClient(customOptions);
      
      expect(client.options).toEqual(customOptions);
    });

    test('should set authentication headers', async () => {
      const { ApiClient } = require('./api-client.js');
      
      const client = new ApiClient();
      client.setAuth('testuser', 'testpass');
      
      expect(client.auth).toEqual({
        username: 'testuser',
        password: 'testpass'
      });
    });

    test('should set API key authentication', async () => {
      const { ApiClient } = require('./api-client.js');
      
      const client = new ApiClient();
      client.setApiKey('ak_test_1234567890abcdef');
      
      expect(client.apiKey).toBe('ak_test_1234567890abcdef');
    });
  });

  describe('HTTP Methods', () => {
    let client;

    beforeEach(async () => {
      const { ApiClient } = require('./api-client.js');
      client = new ApiClient({
        baseUrl: 'https://api.example.com',
        timeout: 5000
      });
    });

    test('should make successful GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ data: 'test' })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await client.get('/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should make successful POST request with data', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ id: 123, created: true })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await client.post('/test', { name: 'test' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual({ id: 123, created: true });
    });

    test('should make successful PUT request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ id: 123, updated: true })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await client.put('/test/123', { name: 'updated' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test/123',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'updated' })
        })
      );
      expect(result).toEqual({ id: 123, updated: true });
    });

    test('should make successful DELETE request', async () => {
      const mockResponse = {
        ok: true,
        status: 204,
        statusText: 'No Content',
        headers: new Map(),
        json: jest.fn().mockResolvedValue(null)
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await client.delete('/test/123');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test/123',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toBeNull();
    });
  });

  describe('Retry Logic', () => {
    let client;

    beforeEach(async () => {
      const { ApiClient } = require('./api-client.js');
      client = new ApiClient({
        baseUrl: 'https://api.example.com',
        retryAttempts: 3,
        retryDelay: 100,
        retryBackoff: 2
      });
    });

    test('should retry on 500 error and eventually succeed', async () => {
      const errorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map(),
        json: jest.fn().mockResolvedValue({ error: 'Server error' })
      };
      
      const successResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ data: 'success' })
      };
      
      global.fetch
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(successResponse);
      
      const result = await client.get('/test');
      
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ data: 'success' });
    });

    test('should retry on network error and eventually succeed', async () => {
      const networkError = new Error('Network error');
      networkError.name = 'TypeError';
      
      const successResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ data: 'success' })
      };
      
      global.fetch
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(successResponse);
      
      const result = await client.get('/test');
      
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ data: 'success' });
    });

    test('should fail after max retry attempts', async () => {
      const errorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map(),
        json: jest.fn().mockResolvedValue({ error: 'Server error' })
      };
      
      global.fetch.mockResolvedValue(errorResponse);
      
      await expect(client.get('/test')).rejects.toThrow('Request failed after 3 attempts');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    test('should not retry on 400 error', async () => {
      const errorResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map(),
        json: jest.fn().mockResolvedValue({ error: 'Bad request' })
      };
      
      global.fetch.mockResolvedValue(errorResponse);
      
      await expect(client.get('/test')).rejects.toThrow('Request failed');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('should use exponential backoff for retry delays', async () => {
      const errorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map(),
        json: jest.fn().mockResolvedValue({ error: 'Server error' })
      };
      
      global.fetch.mockResolvedValue(errorResponse);
      
      const startTime = Date.now();
      
      try {
        await client.get('/test');
      } catch (error) {
        // Expected to fail
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should have waited at least 100ms + 200ms = 300ms (with some tolerance)
      expect(totalTime).toBeGreaterThanOrEqual(250);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Authentication', () => {
    let client;

    beforeEach(async () => {
      const { ApiClient } = require('./api-client.js');
      client = new ApiClient({
        baseUrl: 'https://api.example.com'
      });
    });

    test('should include basic authentication headers', async () => {
      client.setAuth('testuser', 'testpass');
      
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ data: 'test' })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      await client.get('/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Basic ' + Buffer.from('testuser:testpass').toString('base64')
          })
        })
      );
    });

    test('should include API key in headers', async () => {
      client.setApiKey('ak_test_1234567890abcdef');
      
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ data: 'test' })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      await client.get('/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'ak_test_1234567890abcdef'
          })
        })
      );
    });
  });

  describe('Error Handling', () => {
    let client;

    beforeEach(async () => {
      const { ApiClient } = require('./api-client.js');
      client = new ApiClient({
        baseUrl: 'https://api.example.com',
        retryAttempts: 1
      });
    });

    test('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'AbortError';
      
      global.fetch.mockRejectedValue(timeoutError);
      
      await expect(client.get('/test')).rejects.toThrow('Request timeout');
    });

    test('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      await expect(client.get('/test')).rejects.toThrow('Invalid JSON');
    });

    test('should handle non-JSON responses', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'text/plain']]),
        text: jest.fn().mockResolvedValue('Plain text response')
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await client.get('/test');
      
      expect(result).toBe('Plain text response');
    });

    test('should provide detailed error information', async () => {
      const errorResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ error: 'Resource not found' })
      };
      
      global.fetch.mockResolvedValue(errorResponse);
      
      try {
        await client.get('/test');
      } catch (error) {
        expect(error.message).toContain('Request failed');
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.data).toEqual({ error: 'Resource not found' });
      }
    });
  });

  describe('WordPress API Integration', () => {
    let client;

    beforeEach(async () => {
      const { ApiClient } = require('./api-client.js');
      client = new ApiClient({
        baseUrl: 'https://polything.co.uk/wp-json/wp/v2',
        retryAttempts: 3,
        retryDelay: 1000
      });
    });

    test('should fetch WordPress posts with pagination', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([
          ['content-type', 'application/json'],
          ['x-wp-total', '25'],
          ['x-wp-totalpages', '3']
        ]),
        json: jest.fn().mockResolvedValue([
          { id: 1, title: { rendered: 'Post 1' } },
          { id: 2, title: { rendered: 'Post 2' } }
        ])
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await client.get('/posts?per_page=10&page=1');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://polything.co.uk/wp-json/wp/v2/posts?per_page=10&page=1',
        expect.any(Object)
      );
      expect(result).toHaveLength(2);
      expect(result[0].title.rendered).toBe('Post 1');
    });

    test('should handle WordPress authentication', async () => {
      client.setAuth('admin', 'password123');
      
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ id: 1, title: 'Protected Post' })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      await client.get('/posts/1');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://polything.co.uk/wp-json/wp/v2/posts/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Basic ' + Buffer.from('admin:password123').toString('base64')
          })
        })
      );
    });

    test('should retry on WordPress server errors', async () => {
      const errorResponse = {
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
        headers: new Map(),
        json: jest.fn().mockResolvedValue({ error: 'WordPress server error' })
      };
      
      const successResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ id: 1, title: 'Success' })
      };
      
      global.fetch
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(successResponse);
      
      const result = await client.get('/posts/1');
      
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result.title).toBe('Success');
    });
  });

  describe('Rate Limiting', () => {
    let client;

    beforeEach(async () => {
      const { ApiClient } = require('./api-client.js');
      client = new ApiClient({
        baseUrl: 'https://api.example.com',
        retryAttempts: 3,
        retryDelay: 100
      });
    });

    test('should handle rate limiting (429) with retry', async () => {
      const rateLimitResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Map([
          ['retry-after', '2']
        ]),
        json: jest.fn().mockResolvedValue({ error: 'Rate limit exceeded' })
      };
      
      const successResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ data: 'success' })
      };
      
      global.fetch
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(successResponse);
      
      const result = await client.get('/test');
      
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: 'success' });
    });
  });
});

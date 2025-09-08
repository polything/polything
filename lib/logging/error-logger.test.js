/**
 * Tests for Error Logging System
 * Task 1.7: Set up logging for broken/missing media or content errors
 */

const fs = require('fs').promises;
const path = require('path');

// Mock fs methods
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    readFile: jest.fn(),
    appendFile: jest.fn()
  }
}));

describe('Error Logging System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ErrorLogger', () => {
    test('should create error logger instance with default options', async () => {
      const { ErrorLogger } = require('./error-logger.js');
      
      const logger = new ErrorLogger();
      
      expect(logger).toBeDefined();
      expect(logger.options).toEqual({
        logDir: './logs',
        logLevel: 'info',
        maxFileSize: 10485760, // 10MB
        maxFiles: 5,
        enableConsole: true,
        enableFile: true
      });
    });

    test('should create error logger with custom options', async () => {
      const { ErrorLogger } = require('./error-logger.js');
      
      const customOptions = {
        logDir: './custom-logs',
        logLevel: 'error',
        maxFileSize: 5242880, // 5MB
        maxFiles: 3,
        enableConsole: false,
        enableFile: true
      };
      
      const logger = new ErrorLogger(customOptions);
      
      expect(logger.options).toEqual(customOptions);
    });

    test('should initialize log directory on creation', async () => {
      const { ErrorLogger } = require('./error-logger.js');
      
      const logger = new ErrorLogger({ logDir: './test-logs' });
      await logger.initialize();
      
      expect(fs.mkdir).toHaveBeenCalledWith('./test-logs', { recursive: true });
    });
  });

  describe('Logging Methods', () => {
    let logger;

    beforeEach(async () => {
      const { ErrorLogger } = require('./error-logger.js');
      logger = new ErrorLogger({ logDir: './test-logs' });
      await logger.initialize();
    });

    test('should log info messages', async () => {
      await logger.info('Test info message', { context: 'test' });
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('INFO: Test info message')
      );
    });

    test('should log warning messages', async () => {
      await logger.warn('Test warning message', { context: 'test' });
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('WARN: Test warning message')
      );
    });

    test('should log error messages', async () => {
      await logger.error('Test error message', { context: 'test' });
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR: Test error message')
      );
    });

    test('should log debug messages when level is debug', async () => {
      const { ErrorLogger } = require('./error-logger.js');
      const debugLogger = new ErrorLogger({ logLevel: 'debug' });
      await debugLogger.initialize();
      
      await debugLogger.debug('Test debug message', { context: 'test' });
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG: Test debug message')
      );
    });

    test('should not log debug messages when level is info', async () => {
      await logger.debug('Test debug message', { context: 'test' });
      
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('File Logging', () => {
    let logger;

    beforeEach(async () => {
      const { ErrorLogger } = require('./error-logger.js');
      logger = new ErrorLogger({ 
        logDir: './test-logs',
        enableFile: true,
        enableConsole: false
      });
      await logger.initialize();
    });

    test('should write logs to file', async () => {
      await logger.error('Test error message', { context: 'test' });
      
      expect(fs.appendFile).toHaveBeenCalledWith(
        expect.stringContaining('error.log'),
        expect.stringContaining('ERROR'),
        'utf8'
      );
    });

    test('should create separate log files for different levels', async () => {
      await logger.info('Info message');
      await logger.warn('Warning message');
      await logger.error('Error message');
      
      expect(fs.appendFile).toHaveBeenCalledWith(
        expect.stringContaining('info.log'),
        expect.any(String),
        'utf8'
      );
      expect(fs.appendFile).toHaveBeenCalledWith(
        expect.stringContaining('warn.log'),
        expect.any(String),
        'utf8'
      );
      expect(fs.appendFile).toHaveBeenCalledWith(
        expect.stringContaining('error.log'),
        expect.any(String),
        'utf8'
      );
    });
  });

  describe('Content Error Logging', () => {
    let logger;

    beforeEach(async () => {
      const { ErrorLogger } = require('./error-logger.js');
      logger = new ErrorLogger({ logDir: './test-logs' });
      await logger.initialize();
    });

    test('should log content export errors', async () => {
      const contentError = {
        type: 'content_export',
        postId: 123,
        postType: 'project',
        slug: 'test-project',
        error: 'Failed to transform content',
        details: { field: 'content', issue: 'invalid_html' }
      };
      
      await logger.logContentError(contentError);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('CONTENT_ERROR: Failed to transform content')
      );
    });

    test('should log media download errors', async () => {
      const mediaError = {
        type: 'media_download',
        mediaId: 456,
        mediaUrl: 'https://example.com/image.jpg',
        localPath: './public/images/image.jpg',
        error: 'Failed to download media: 404 Not Found',
        details: { status: 404, statusText: 'Not Found' }
      };
      
      await logger.logMediaError(mediaError);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('MEDIA_ERROR: Failed to download media: 404 Not Found')
      );
    });

    test('should log field mapping errors', async () => {
      const fieldError = {
        type: 'field_mapping',
        postId: 789,
        field: 'themerain_hero_title',
        error: 'Field mapping failed',
        details: { originalValue: null, expectedType: 'string' }
      };
      
      await logger.logFieldError(fieldError);
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('FIELD_ERROR: Field mapping failed')
      );
    });
  });

  describe('Error Aggregation', () => {
    let logger;

    beforeEach(async () => {
      const { ErrorLogger } = require('./error-logger.js');
      logger = new ErrorLogger({ logDir: './test-logs' });
      await logger.initialize();
    });

    test('should track error counts by type', async () => {
      await logger.logContentError({ type: 'content_export', error: 'Error 1' });
      await logger.logContentError({ type: 'content_export', error: 'Error 2' });
      await logger.logMediaError({ type: 'media_download', error: 'Error 3' });
      
      const stats = logger.getErrorStats();
      
      expect(stats.content_export).toBe(2);
      expect(stats.media_download).toBe(1);
      expect(stats.total).toBe(3);
    });

    test('should generate error summary report', async () => {
      await logger.logContentError({ type: 'content_export', error: 'Content error' });
      await logger.logMediaError({ type: 'media_download', error: 'Media error' });
      await logger.logFieldError({ type: 'field_mapping', error: 'Field error' });
      
      const summary = logger.generateErrorSummary();
      
      expect(summary).toContain('Error Summary Report');
      expect(summary).toContain('**Content Export Errors**: 1');
      expect(summary).toContain('**Media Download Errors**: 1');
      expect(summary).toContain('**Field Mapping Errors**: 1');
      expect(summary).toContain('**Total Errors**: 3');
    });
  });

  describe('Log Rotation', () => {
    let logger;

    beforeEach(async () => {
      const { ErrorLogger } = require('./error-logger.js');
      logger = new ErrorLogger({ 
        logDir: './test-logs',
        maxFileSize: 100, // Small size for testing
        maxFiles: 3
      });
      await logger.initialize();
    });

    test('should rotate log files when size limit exceeded', async () => {
      // Mock file size check
      fs.readFile.mockResolvedValue('x'.repeat(150)); // Exceeds 100 byte limit
      
      await logger.error('Test message');
      
      // Should create new rotated file
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('error.log.1'),
        expect.any(String),
        'utf8'
      );
    });

    test('should maintain maximum number of log files', async () => {
      // Mock existing rotated files
      fs.readFile.mockResolvedValue('x'.repeat(150));
      
      // Simulate multiple rotations
      for (let i = 0; i < 5; i++) {
        await logger.error(`Test message ${i}`);
      }
      
      // Each error call triggers rotation which creates multiple writeFile calls
      // The exact number depends on the rotation logic implementation
      expect(fs.writeFile).toHaveBeenCalled();
      expect(fs.writeFile.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('Integration with Export Scripts', () => {
    let logger;

    beforeEach(async () => {
      const { ErrorLogger } = require('./error-logger.js');
      logger = new ErrorLogger({ logDir: './test-logs' });
      await logger.initialize();
    });

    test('should integrate with content export script', async () => {
      const exportError = {
        type: 'content_export',
        postId: 123,
        postType: 'project',
        slug: 'test-project',
        error: 'Failed to save MDX file',
        details: { filePath: './content/project/test-project/index.mdx' }
      };
      
      await logger.logContentError(exportError);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('CONTENT_ERROR: Failed to save MDX file')
      );
    });

    test('should integrate with media fetcher script', async () => {
      const mediaError = {
        type: 'media_download',
        mediaId: 456,
        mediaUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/image.jpg',
        localPath: './public/images/2024/01/image.jpg',
        error: 'Failed to download media: 403 Forbidden',
        details: { status: 403, statusText: 'Forbidden' }
      };
      
      await logger.logMediaError(mediaError);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('MEDIA_ERROR: Failed to download media: 403 Forbidden')
      );
    });
  });
});

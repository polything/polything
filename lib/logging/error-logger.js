/**
 * Error Logging System
 * Task 1.7: Set up logging for broken/missing media or content errors
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Error Logger Class
 * Provides comprehensive logging for WordPress migration errors
 */
class ErrorLogger {
  constructor(options = {}) {
    this.options = {
      logDir: './logs',
      logLevel: 'info',
      maxFileSize: 10485760, // 10MB
      maxFiles: 5,
      enableConsole: true,
      enableFile: true,
      ...options
    };

    this.errorCounts = {
      content_export: 0,
      media_download: 0,
      field_mapping: 0,
      api_request: 0,
      total: 0
    };

    this.logLevels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  /**
   * Initialize the logger
   */
  async initialize() {
    if (this.options.enableFile) {
      await fs.mkdir(this.options.logDir, { recursive: true });
    }
  }

  /**
   * Check if a log level should be processed
   */
  shouldLog(level) {
    return this.logLevels[level] >= this.logLevels[this.options.logLevel];
  }

  /**
   * Format log message with timestamp and level
   */
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  /**
   * Write log to file
   */
  async writeToFile(level, message, context) {
    if (!this.options.enableFile) return;

    const logFile = path.join(this.options.logDir, `${level}.log`);
    const formattedMessage = this.formatMessage(level, message, context) + '\n';

    try {
      await fs.appendFile(logFile, formattedMessage, 'utf8');
      await this.rotateLogIfNeeded(logFile);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  /**
   * Rotate log file if it exceeds size limit
   */
  async rotateLogIfNeeded(logFile) {
    try {
      const stats = await fs.readFile(logFile);
      if (stats.length > this.options.maxFileSize) {
        await this.rotateLogFile(logFile);
      }
    } catch (error) {
      // File doesn't exist or can't be read, skip rotation
    }
  }

  /**
   * Rotate log file by moving existing files
   */
  async rotateLogFile(logFile) {
    const baseName = path.basename(logFile, '.log');
    const dirName = path.dirname(logFile);

    // Move existing rotated files
    for (let i = this.options.maxFiles - 1; i > 0; i--) {
      const oldFile = path.join(dirName, `${baseName}.log.${i}`);
      const newFile = path.join(dirName, `${baseName}.log.${i + 1}`);
      
      try {
        await fs.readFile(oldFile);
        await fs.writeFile(newFile, await fs.readFile(oldFile), 'utf8');
        await fs.unlink(oldFile);
      } catch (error) {
        // File doesn't exist, continue
      }
    }

    // Move current log to .1
    try {
      const currentContent = await fs.readFile(logFile, 'utf8');
      await fs.writeFile(`${logFile}.1`, currentContent, 'utf8');
      await fs.writeFile(logFile, '', 'utf8'); // Clear current log
    } catch (error) {
      console.error('Failed to rotate log file:', error.message);
    }
  }

  /**
   * Log debug message
   */
  async debug(message, context = {}) {
    if (!this.shouldLog('debug')) return;

    const formattedMessage = this.formatMessage('debug', message, context);
    
    if (this.options.enableConsole) {
      console.log(formattedMessage);
    }
    
    await this.writeToFile('debug', message, context);
  }

  /**
   * Log info message
   */
  async info(message, context = {}) {
    if (!this.shouldLog('info')) return;

    const formattedMessage = this.formatMessage('info', message, context);
    
    if (this.options.enableConsole) {
      console.log(formattedMessage);
    }
    
    await this.writeToFile('info', message, context);
  }

  /**
   * Log warning message
   */
  async warn(message, context = {}) {
    if (!this.shouldLog('warn')) return;

    const formattedMessage = this.formatMessage('warn', message, context);
    
    if (this.options.enableConsole) {
      console.warn(formattedMessage);
    }
    
    await this.writeToFile('warn', message, context);
  }

  /**
   * Log error message
   */
  async error(message, context = {}) {
    if (!this.shouldLog('error')) return;

    const formattedMessage = this.formatMessage('error', message, context);
    
    if (this.options.enableConsole) {
      console.error(formattedMessage);
    }
    
    await this.writeToFile('error', message, context);
  }

  /**
   * Log content export error
   */
  async logContentError(errorData) {
    const { type = 'content_export', postId, postType, slug, error, details = {} } = errorData;
    
    this.errorCounts.content_export++;
    this.errorCounts.total++;

    const context = {
      type,
      postId,
      postType,
      slug,
      details
    };

    await this.error(`CONTENT_ERROR: ${error}`, context);
  }

  /**
   * Log media download error
   */
  async logMediaError(errorData) {
    const { type = 'media_download', mediaId, mediaUrl, localPath, error, details = {} } = errorData;
    
    this.errorCounts.media_download++;
    this.errorCounts.total++;

    const context = {
      type,
      mediaId,
      mediaUrl,
      localPath,
      details
    };

    await this.error(`MEDIA_ERROR: ${error}`, context);
  }

  /**
   * Log field mapping error
   */
  async logFieldError(errorData) {
    const { type = 'field_mapping', postId, field, error, details = {} } = errorData;
    
    this.errorCounts.field_mapping++;
    this.errorCounts.total++;

    const context = {
      type,
      postId,
      field,
      details
    };

    await this.warn(`FIELD_ERROR: ${error}`, context);
  }

  /**
   * Log API request error
   */
  async logApiError(errorData) {
    const { type = 'api_request', endpoint, method, error, details = {} } = errorData;
    
    this.errorCounts.api_request++;
    this.errorCounts.total++;

    const context = {
      type,
      endpoint,
      method,
      details
    };

    await this.error(`API_ERROR: ${error}`, context);
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return { ...this.errorCounts };
  }

  /**
   * Generate error summary report
   */
  generateErrorSummary() {
    const stats = this.getErrorStats();
    
    let summary = `# Error Summary Report\n\n`;
    summary += `## Statistics\n`;
    summary += `- **Content Export Errors**: ${stats.content_export}\n`;
    summary += `- **Media Download Errors**: ${stats.media_download}\n`;
    summary += `- **Field Mapping Errors**: ${stats.field_mapping}\n`;
    summary += `- **API Request Errors**: ${stats.api_request}\n`;
    summary += `- **Total Errors**: ${stats.total}\n\n`;

    if (stats.total === 0) {
      summary += `## Status\n✅ **No errors detected** - Migration completed successfully!\n`;
    } else {
      summary += `## Status\n⚠️ **${stats.total} errors detected** - Review logs for details\n`;
    }

    return summary;
  }

  /**
   * Save error summary to file
   */
  async saveErrorSummary(filePath = './error-summary.md') {
    const summary = this.generateErrorSummary();
    await fs.writeFile(filePath, summary, 'utf8');
    return filePath;
  }

  /**
   * Clear error counts (useful for testing)
   */
  clearErrorCounts() {
    this.errorCounts = {
      content_export: 0,
      media_download: 0,
      field_mapping: 0,
      api_request: 0,
      total: 0
    };
  }
}

/**
 * Create a default logger instance
 */
function createLogger(options = {}) {
  return new ErrorLogger(options);
}

/**
 * Create a logger for content export operations
 */
function createContentLogger(options = {}) {
  return new ErrorLogger({
    logDir: './logs/content',
    logLevel: 'info',
    ...options
  });
}

/**
 * Create a logger for media operations
 */
function createMediaLogger(options = {}) {
  return new ErrorLogger({
    logDir: './logs/media',
    logLevel: 'info',
    ...options
  });
}

/**
 * Create a logger for API operations
 */
function createApiLogger(options = {}) {
  return new ErrorLogger({
    logDir: './logs/api',
    logLevel: 'warn',
    ...options
  });
}

module.exports = {
  ErrorLogger,
  createLogger,
  createContentLogger,
  createMediaLogger,
  createApiLogger
};

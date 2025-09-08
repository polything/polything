/**
 * Configuration Management System
 * Task 1.8: Create configuration file for WordPress API endpoints and credentials
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Configuration Manager Class
 * Handles WordPress site configuration, environment variables, and credentials
 */
class ConfigManager {
  constructor(options = {}) {
    this.configPath = options.configPath || './config/wordpress.json';
    this.envPrefix = options.envPrefix || 'WP_';
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`Configuration file not found: ${this.configPath}`);
        return {};
      } else if (error instanceof SyntaxError) {
        console.error('Failed to parse configuration file:', error.message);
        return {};
      } else {
        console.error('Failed to load configuration:', error.message);
        return {};
      }
    }
  }

  /**
   * Save configuration to file
   */
  async saveConfig(configData) {
    try {
      // Ensure config directory exists
      const configDir = path.dirname(this.configPath);
      try {
        await fs.access(configDir);
      } catch (error) {
        if (error.code === 'ENOENT') {
          await fs.mkdir(configDir, { recursive: true });
        }
      }

      await fs.writeFile(
        this.configPath,
        JSON.stringify(configData, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Failed to save configuration:', error.message);
      throw error;
    }
  }

  /**
   * Merge environment variables with configuration
   */
  mergeEnvVars(config) {
    const mergedConfig = JSON.parse(JSON.stringify(config)); // Deep clone

    if (!mergedConfig.sites) {
      mergedConfig.sites = {};
    }

    // Process environment variables
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith(this.envPrefix)) {
        const siteKey = key.substring(this.envPrefix.length);
        
        // Handle site-specific environment variables
        // Format: WP_POLYTHING_USERNAME, WP_MIGHTYBOOTH_PASSWORD, etc.
        const siteMatch = siteKey.match(/^([^_]+)_(.+)$/);
        if (siteMatch) {
          const [, siteName, fieldName] = siteMatch;
          const normalizedSiteName = siteName.toLowerCase().replace(/_/g, '.');
          
          if (!mergedConfig.sites[normalizedSiteName]) {
            mergedConfig.sites[normalizedSiteName] = {};
          }
          
          // Only set if value is not empty
          if (value && value.trim() !== '') {
            mergedConfig.sites[normalizedSiteName][fieldName] = value;
          }
        }
      }
    }

    return mergedConfig;
  }

  /**
   * Get site configuration by domain
   */
  async getSiteConfig(domain) {
    const config = await this.loadConfig();
    const mergedConfig = this.mergeEnvVars(config);
    
    return mergedConfig.sites?.[domain] || null;
  }

  /**
   * List all available sites
   */
  async listSites() {
    const config = await this.loadConfig();
    return Object.keys(config.sites || {});
  }

  /**
   * Validate site configuration
   */
  validateSiteConfig(siteConfig) {
    const requiredFields = ['url', 'apiBase'];
    
    for (const field of requiredFields) {
      if (!siteConfig[field]) {
        return false;
      }
    }

    // Validate URL format
    try {
      new URL(siteConfig.url);
      new URL(siteConfig.apiBase);
    } catch (error) {
      return false;
    }

    return true;
  }

  /**
   * Generate default configuration template
   */
  generateDefaultConfig() {
    return {
      sites: {
        'polything.co.uk': {
          url: 'https://polything.co.uk',
          apiBase: 'https://polything.co.uk/wp-json/wp/v2',
          diagnosticEndpoint: 'https://polything.co.uk/wp-json/polything/v1',
          contentTypes: ['post', 'page', 'project'],
          testPostIds: {
            project: 10680,
            post: null,
            page: null
          },
          // Credentials can be set via environment variables:
          // WP_POLYTHING_USERNAME, WP_POLYTHING_PASSWORD, WP_POLYTHING_API_KEY
          username: '',
          password: '',
          apiKey: ''
        },
        'mightybooth.com': {
          url: 'https://mightybooth.com',
          apiBase: 'https://mightybooth.com/wp-json/wp/v2',
          diagnosticEndpoint: 'https://mightybooth.com/wp-json/polything/v1',
          contentTypes: ['post', 'page', 'project'],
          testPostIds: {
            project: 1615,
            post: null,
            page: null
          },
          // Credentials can be set via environment variables:
          // WP_MIGHTYBOOTH_USERNAME, WP_MIGHTYBOOTH_PASSWORD, WP_MIGHTYBOOTH_API_KEY
          username: '',
          password: '',
          apiKey: ''
        }
      },
      export: {
        outputDir: './content',
        mediaDir: './public/images',
        batchSize: 10,
        retryAttempts: 3,
        retryDelay: 1000,
        timeout: 30000
      },
      fieldMapping: {
        hero: {
          title: ['themerain_hero_title', 'themerain_page_title'],
          subtitle: ['themerain_hero_subtitle', 'themerain_page_subtitle'],
          image: ['themerain_hero_image'],
          video: ['themerain_hero_video'],
          text_color: ['themerain_hero_text_color', 'themerain_page_text_color'],
          background_color: ['themerain_hero_bg_color', 'themerain_page_bg_color']
        },
        links: {
          url: ['themerain_project_link_url'],
          image: ['themerain_project_link_image'],
          video: ['themerain_project_link_video']
        }
      },
      logging: {
        logDir: './logs',
        logLevel: 'info',
        enableConsole: true,
        enableFile: true,
        maxFileSize: 10485760, // 10MB
        maxFiles: 5
      }
    };
  }

  /**
   * Create configuration from template
   */
  async createConfigFromTemplate() {
    try {
      await fs.access(this.configPath);
      console.warn(`Configuration file already exists: ${this.configPath}`);
      return false;
    } catch (error) {
      if (error.code === 'ENOENT') {
        const template = this.generateDefaultConfig();
        await this.saveConfig(template);
        console.log(`Configuration template created: ${this.configPath}`);
        return true;
      } else {
        throw error;
      }
    }
  }

  /**
   * Mask sensitive data in configuration for logging
   */
  maskSensitiveData(config) {
    const maskedConfig = JSON.parse(JSON.stringify(config)); // Deep clone
    
    if (maskedConfig.sites) {
      for (const siteName in maskedConfig.sites) {
        const site = maskedConfig.sites[siteName];
        if (site.password) site.password = '***';
        if (site.apiKey) site.apiKey = '***';
        if (site.token) site.token = '***';
      }
    }
    
    return maskedConfig;
  }

  /**
   * Validate credentials format
   */
  validateCredentials(credentials) {
    const { username, password, apiKey } = credentials;
    
    // Username validation
    if (username && (typeof username !== 'string' || username.trim().length === 0)) {
      return false;
    }
    
    // Password validation
    if (password && (typeof password !== 'string' || password.length < 6)) {
      return false;
    }
    
    // API key validation (basic format check)
    if (apiKey && (typeof apiKey !== 'string' || apiKey.length < 10)) {
      return false;
    }
    
    return true;
  }

  /**
   * Get configuration for content export
   */
  async getExportConfig(domain) {
    const config = await this.loadConfig();
    const mergedConfig = this.mergeEnvVars(config);
    
    const siteConfig = mergedConfig.sites?.[domain];
    if (!siteConfig) {
      throw new Error(`Site configuration not found: ${domain}`);
    }
    
    return {
      site: siteConfig,
      export: mergedConfig.export || {},
      fieldMapping: mergedConfig.fieldMapping || {},
      logging: mergedConfig.logging || {}
    };
  }

  /**
   * Get configuration for media fetcher
   */
  async getMediaConfig(domain) {
    const config = await this.loadConfig();
    const mergedConfig = this.mergeEnvVars(config);
    
    const siteConfig = mergedConfig.sites?.[domain];
    if (!siteConfig) {
      throw new Error(`Site configuration not found: ${domain}`);
    }
    
    return {
      site: siteConfig,
      export: mergedConfig.export || {},
      logging: mergedConfig.logging || {}
    };
  }

  /**
   * Get logging configuration
   */
  async getLoggingConfig() {
    const config = await this.loadConfig();
    return config.logging || this.generateDefaultConfig().logging;
  }

  /**
   * Validate entire configuration
   */
  async validateConfig() {
    const config = await this.loadConfig();
    const errors = [];
    
    if (!config.sites || Object.keys(config.sites).length === 0) {
      errors.push('No sites configured');
    }
    
    for (const [domain, siteConfig] of Object.entries(config.sites || {})) {
      if (!this.validateSiteConfig(siteConfig)) {
        errors.push(`Invalid configuration for site: ${domain}`);
      }
      
      if (siteConfig.username || siteConfig.password || siteConfig.apiKey) {
        if (!this.validateCredentials(siteConfig)) {
          errors.push(`Invalid credentials for site: ${domain}`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get configuration summary for display
   */
  async getConfigSummary() {
    const config = await this.loadConfig();
    const mergedConfig = this.mergeEnvVars(config);
    const maskedConfig = this.maskSensitiveData(mergedConfig);
    
    return {
      configPath: this.configPath,
      sites: Object.keys(maskedConfig.sites || {}),
      hasCredentials: Object.values(maskedConfig.sites || {}).some(site => 
        site.username || site.password || site.apiKey
      ),
      exportSettings: maskedConfig.export || {},
      loggingSettings: maskedConfig.logging || {}
    };
  }
}

/**
 * Create a default config manager instance
 */
function createConfigManager(options = {}) {
  return new ConfigManager(options);
}

/**
 * Create a config manager for a specific site
 */
function createSiteConfigManager(domain, options = {}) {
  const configManager = new ConfigManager(options);
  return {
    async getConfig() {
      return await configManager.getSiteConfig(domain);
    },
    async getExportConfig() {
      return await configManager.getExportConfig(domain);
    },
    async getMediaConfig() {
      return await configManager.getMediaConfig(domain);
    }
  };
}

module.exports = {
  ConfigManager,
  createConfigManager,
  createSiteConfigManager
};

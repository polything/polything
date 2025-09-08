/**
 * Tests for Configuration Management System
 * Task 1.8: Create configuration file for WordPress API endpoints and credentials
 */

const fs = require('fs').promises;
const path = require('path');

// Mock fs methods
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn()
  }
}));

describe('Configuration Management System', () => {
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

  describe('ConfigManager', () => {
    test('should create config manager instance with default options', async () => {
      const { ConfigManager } = require('./config-manager.js');
      
      const configManager = new ConfigManager();
      
      expect(configManager).toBeDefined();
      expect(configManager.configPath).toBe('./config/wordpress.json');
      expect(configManager.envPrefix).toBe('WP_');
    });

    test('should create config manager with custom options', async () => {
      const { ConfigManager } = require('./config-manager.js');
      
      const customOptions = {
        configPath: './custom-config.json',
        envPrefix: 'CUSTOM_'
      };
      
      const configManager = new ConfigManager(customOptions);
      
      expect(configManager.configPath).toBe('./custom-config.json');
      expect(configManager.envPrefix).toBe('CUSTOM_');
    });

    test('should load configuration from file', async () => {
      const { ConfigManager } = require('./config-manager.js');
      
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk',
            apiBase: 'https://polything.co.uk/wp-json/wp/v2',
            username: 'testuser',
            password: 'testpass'
          }
        }
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const configManager = new ConfigManager();
      const config = await configManager.loadConfig();
      
      expect(fs.readFile).toHaveBeenCalledWith('./config/wordpress.json', 'utf8');
      expect(config).toEqual(mockConfig);
    });

    test('should handle missing configuration file gracefully', async () => {
      const { ConfigManager } = require('./config-manager.js');
      
      const error = new Error('ENOENT: no such file or directory');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);
      
      const configManager = new ConfigManager();
      const config = await configManager.loadConfig();
      
      expect(config).toEqual({});
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Configuration file not found')
      );
    });

    test('should handle invalid JSON in configuration file', async () => {
      const { ConfigManager } = require('./config-manager.js');
      
      fs.readFile.mockResolvedValue('invalid json content');
      
      const configManager = new ConfigManager();
      const config = await configManager.loadConfig();
      
      expect(config).toEqual({});
      expect(console.error).toHaveBeenCalledWith(
        'Failed to parse configuration file:',
        expect.any(String)
      );
    });

    test('should save configuration to file', async () => {
      const { ConfigManager } = require('./config-manager.js');
      
      const configData = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk',
            apiBase: 'https://polything.co.uk/wp-json/wp/v2'
          }
        }
      };
      
      const configManager = new ConfigManager();
      await configManager.saveConfig(configData);
      
      expect(fs.writeFile).toHaveBeenCalledWith(
        './config/wordpress.json',
        JSON.stringify(configData, null, 2),
        'utf8'
      );
    });

    test('should create config directory if it does not exist', async () => {
      const { ConfigManager } = require('./config-manager.js');
      
      const error = new Error('ENOENT');
      error.code = 'ENOENT';
      fs.access.mockRejectedValue(error);
      
      const configData = { sites: {} };
      const configManager = new ConfigManager();
      await configManager.saveConfig(configData);
      
      expect(fs.mkdir).toHaveBeenCalledWith('./config', { recursive: true });
    });
  });

  describe('Environment Variable Integration', () => {
    let configManager;

    beforeEach(async () => {
      const { ConfigManager } = require('./config-manager.js');
      configManager = new ConfigManager();
    });

    test('should merge environment variables with config', async () => {
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk',
            apiBase: 'https://polything.co.uk/wp-json/wp/v2'
          }
        }
      };
      
      // Mock environment variables
      process.env.WP_POLYTHING_USERNAME = 'envuser';
      process.env.WP_POLYTHING_PASSWORD = 'envpass';
      process.env.WP_POLYTHING_API_KEY = 'envapikey';
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const config = await configManager.loadConfig();
      const mergedConfig = configManager.mergeEnvVars(config);
      
      expect(mergedConfig.sites['polything']).toBeDefined();
      expect(mergedConfig.sites['polything'].USERNAME).toBe('envuser');
      expect(mergedConfig.sites['polything'].PASSWORD).toBe('envpass');
      expect(mergedConfig.sites['polything'].API_KEY).toBe('envapikey');
      
      // Clean up environment variables
      delete process.env.WP_POLYTHING_USERNAME;
      delete process.env.WP_POLYTHING_PASSWORD;
      delete process.env.WP_POLYTHING_API_KEY;
    });

    test('should handle environment variables with custom prefix', async () => {
      const { ConfigManager } = require('./config-manager.js');
      const customConfigManager = new ConfigManager({ envPrefix: 'CUSTOM_' });
      
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk'
          }
        }
      };
      
      process.env.CUSTOM_POLYTHING_USERNAME = 'customuser';
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const config = await customConfigManager.loadConfig();
      const mergedConfig = customConfigManager.mergeEnvVars(config);
      
      expect(mergedConfig.sites['polything']).toBeDefined();
      expect(mergedConfig.sites['polything'].USERNAME).toBe('customuser');
      
      // Clean up environment variables
      delete process.env.CUSTOM_POLYTHING_USERNAME;
    });

    test('should not override existing config values with empty env vars', async () => {
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk',
            username: 'configuser'
          }
        }
      };
      
      process.env.WP_POLYTHING_USERNAME = '';
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const config = await configManager.loadConfig();
      const mergedConfig = configManager.mergeEnvVars(config);
      
      expect(mergedConfig.sites['polything.co.uk'].username).toBe('configuser');
    });
  });

  describe('Site Configuration Management', () => {
    let configManager;

    beforeEach(async () => {
      const { ConfigManager } = require('./config-manager.js');
      configManager = new ConfigManager();
    });

    test('should get site configuration by domain', async () => {
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk',
            apiBase: 'https://polything.co.uk/wp-json/wp/v2',
            username: 'testuser',
            password: 'testpass'
          },
          'mightybooth.com': {
            url: 'https://mightybooth.com',
            apiBase: 'https://mightybooth.com/wp-json/wp/v2'
          }
        }
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const siteConfig = await configManager.getSiteConfig('polything.co.uk');
      
      expect(siteConfig).toEqual(mockConfig.sites['polything.co.uk']);
    });

    test('should return null for non-existent site', async () => {
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk'
          }
        }
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const siteConfig = await configManager.getSiteConfig('nonexistent.com');
      
      expect(siteConfig).toBeNull();
    });

    test('should list all available sites', async () => {
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk'
          },
          'mightybooth.com': {
            url: 'https://mightybooth.com'
          }
        }
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const sites = await configManager.listSites();
      
      expect(sites).toEqual(['polything.co.uk', 'mightybooth.com']);
    });

    test('should validate site configuration', async () => {
      const validConfig = {
        url: 'https://polything.co.uk',
        apiBase: 'https://polything.co.uk/wp-json/wp/v2',
        username: 'testuser',
        password: 'testpass'
      };
      
      const invalidConfig = {
        url: 'https://polything.co.uk'
        // Missing required fields
      };
      
      const isValid = configManager.validateSiteConfig(validConfig);
      const isInvalid = configManager.validateSiteConfig(invalidConfig);
      
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Configuration Templates', () => {
    let configManager;

    beforeEach(async () => {
      const { ConfigManager } = require('./config-manager.js');
      configManager = new ConfigManager();
    });

    test('should generate default configuration template', () => {
      const template = configManager.generateDefaultConfig();
      
      expect(template).toHaveProperty('sites');
      expect(template).toHaveProperty('export');
      expect(template).toHaveProperty('fieldMapping');
      expect(template.sites['polything.co.uk']).toBeDefined();
      expect(template.sites['mightybooth.com']).toBeDefined();
    });

    test('should create configuration from template', async () => {
      const template = configManager.generateDefaultConfig();
      
      fs.writeFile.mockResolvedValue();
      const error = new Error('ENOENT');
      error.code = 'ENOENT';
      fs.access.mockRejectedValue(error);
      
      await configManager.createConfigFromTemplate();
      
      expect(fs.writeFile).toHaveBeenCalledWith(
        './config/wordpress.json',
        JSON.stringify(template, null, 2),
        'utf8'
      );
    });

    test('should not overwrite existing configuration', async () => {
      fs.access.mockResolvedValue(); // File exists
      
      await configManager.createConfigFromTemplate();
      
      expect(fs.writeFile).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Configuration file already exists')
      );
    });
  });

  describe('Security and Credentials', () => {
    let configManager;

    beforeEach(async () => {
      const { ConfigManager } = require('./config-manager.js');
      configManager = new ConfigManager();
    });

    test('should mask sensitive data in logs', () => {
      const config = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk',
            username: 'testuser',
            password: 'secretpassword',
            apiKey: 'secretapikey'
          }
        }
      };
      
      const masked = configManager.maskSensitiveData(config);
      
      expect(masked.sites['polything.co.uk'].password).toBe('***');
      expect(masked.sites['polything.co.uk'].apiKey).toBe('***');
      expect(masked.sites['polything.co.uk'].username).toBe('testuser'); // Not masked
    });

    test('should validate credentials format', () => {
      const validCredentials = {
        username: 'testuser',
        password: 'testpass123',
        apiKey: 'ak_test_1234567890abcdef'
      };
      
      const invalidCredentials = {
        username: '',
        password: 'short',
        apiKey: 'invalid'
      };
      
      const isValid = configManager.validateCredentials(validCredentials);
      const isInvalid = configManager.validateCredentials(invalidCredentials);
      
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Integration with Export Scripts', () => {
    let configManager;

    beforeEach(async () => {
      const { ConfigManager } = require('./config-manager.js');
      configManager = new ConfigManager();
    });

    test('should provide configuration for content export', async () => {
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk',
            apiBase: 'https://polything.co.uk/wp-json/wp/v2',
            username: 'testuser',
            password: 'testpass',
            contentTypes: ['post', 'page', 'project']
          }
        },
        export: {
          outputDir: './content',
          batchSize: 10,
          retryAttempts: 3
        }
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const exportConfig = await configManager.getExportConfig('polything.co.uk');
      
      expect(exportConfig).toHaveProperty('site');
      expect(exportConfig).toHaveProperty('export');
      expect(exportConfig.site.url).toBe('https://polything.co.uk');
      expect(exportConfig.export.outputDir).toBe('./content');
    });

    test('should provide configuration for media fetcher', async () => {
      const mockConfig = {
        sites: {
          'polything.co.uk': {
            url: 'https://polything.co.uk',
            apiBase: 'https://polything.co.uk/wp-json/wp/v2'
          }
        },
        export: {
          mediaDir: './public/images',
          batchSize: 20,
          timeout: 30000
        }
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockConfig));
      
      const mediaConfig = await configManager.getMediaConfig('polything.co.uk');
      
      expect(mediaConfig).toHaveProperty('site');
      expect(mediaConfig).toHaveProperty('export');
      expect(mediaConfig.export.mediaDir).toBe('./public/images');
    });
  });
});

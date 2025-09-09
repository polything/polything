import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration with MCP Support
 * 
 * This configuration sets up comprehensive E2E testing for the WordPress to Next.js migration project.
 * It includes MCP (Multi-Context Proxy) support for advanced browser automation and testing scenarios.
 */

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Global timeout for each action
    actionTimeout: 10000,
    
    // Global timeout for navigation
    navigationTimeout: 30000,
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // MCP configuration for Chromium
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--enable-features=NetworkService,NetworkServiceLogging'
          ]
        }
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // MCP configuration for Firefox
        launchOptions: {
          firefoxUserPrefs: {
            'dom.webnotifications.enabled': false,
            'dom.push.enabled': false
          }
        }
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // MCP configuration for WebKit
        launchOptions: {
          args: ['--disable-web-security']
        }
      },
    },
    
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // MCP-specific project for advanced testing
    {
      name: 'mcp-chromium',
      use: {
        ...devices['Desktop Chrome'],
        // MCP server connection
        launchOptions: {
          args: [
            '--remote-debugging-port=9222',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
  ],
  
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes
    env: {
      NODE_ENV: 'test'
    }
  },
  
  // Global test timeout
  timeout: 60000, // 1 minute
  
  // Expect timeout
  expect: {
    timeout: 10000, // 10 seconds
  },
  
  // Output directory for test artifacts
  outputDir: 'test-results/',
  
  // Global setup and teardown
  globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),
})

# Playwright MCP Setup Guide

**Date:** 2025-01-27  
**Status:** Complete  
**Version:** 1.0  

## Overview

This guide provides comprehensive instructions for setting up and using Playwright MCP (Multi-Context Proxy) for advanced browser automation and testing in the WordPress to Next.js migration project.

## What is Playwright MCP?

Playwright MCP is a server that facilitates browser automation by managing multiple browser contexts. It provides:

- **Advanced browser automation:** with multiple context support
- **Enhanced debugging capabilities:** with persistent browser sessions
- **Improved test reliability:** through better resource management
- **Cross-browser testing:** with unified API
- **Performance optimization:** through connection pooling

## Installation

### 1. Install Dependencies

```bash
# Install Playwright and MCP
pnpm add -D @playwright/test @playwright/mcp

# Install browser dependencies
npx playwright install --with-deps
```

### 2. Verify Installation

```bash
# Check Playwright installation
npx playwright --version

# Check MCP installation
npx @playwright/mcp --version
```

## Configuration

### 1. Playwright Configuration (`playwright.config.ts`)

The main Playwright configuration includes MCP support:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
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
      name: 'mcp-chromium',
      use: {
        ...devices['Desktop Chrome'],
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
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'test'
    }
  },
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  outputDir: 'test-results/',
  globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),
})
```

### 2. MCP Configuration (`mcp-config.json`)

```json
{
  "name": "polything-mcp-server",
  "version": "1.0.0",
  "description": "MCP server configuration for Polything WordPress to Next.js migration testing",
  "browser": {
    "browserName": "chromium",
    "userDataDir": "./test-results/user-data",
    "launchOptions": {
      "headless": false,
      "args": [
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--enable-features=NetworkService,NetworkServiceLogging",
        "--remote-debugging-port=9222",
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    }
  },
  "server": {
    "port": 8080,
    "host": "localhost",
    "cors": {
      "origin": ["http://localhost:3000", "http://localhost:8080"],
      "credentials": true
    }
  },
  "testing": {
    "baseUrl": "http://localhost:3000",
    "timeout": 30000,
    "retries": 3,
    "screenshots": true,
    "videos": true,
    "traces": true
  },
  "environments": {
    "development": {
      "baseUrl": "http://localhost:3000",
      "apiUrl": "http://localhost:3000/api"
    },
    "staging": {
      "baseUrl": "https://staging.polything.co.uk",
      "apiUrl": "https://staging.polything.co.uk/api"
    },
    "production": {
      "baseUrl": "https://polything.co.uk",
      "apiUrl": "https://polything.co.uk/api"
    }
  },
  "features": {
    "accessibility": true,
    "performance": true,
    "seo": true,
    "crossBrowser": true,
    "mobile": true,
    "api": true
  }
}
```

## Usage

### 1. Starting the MCP Server

```bash
# Start MCP server
npm run mcp:start

# Or manually
npx @playwright/mcp --config=mcp-config.json
```

### 2. Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test tests/e2e/critical-journeys.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium

# Run tests for MCP project
npx playwright test --project=mcp-chromium
```

### 3. Viewing Test Results

```bash
# Show test report
npm run playwright:report

# Or manually
npx playwright show-report
```

## Test Structure

### 1. Page Object Model

The tests use the Page Object Model pattern for maintainability:

```
tests/e2e/
├── pages/
│   ├── base-page.ts          # Base page class
│   ├── homepage.ts           # Homepage page object
│   ├── project-page.ts       # Project page object
│   └── blog-page.ts          # Blog page object
├── utils/
│   └── test-helpers.ts       # Test utility functions
├── fixtures/
│   └── test-data.ts          # Test data and fixtures
├── critical-journeys.spec.ts # Critical user journey tests
├── accessibility.spec.ts     # Accessibility tests
├── performance.spec.ts       # Performance tests
├── seo.spec.ts              # SEO tests
├── global-setup.ts          # Global test setup
└── global-teardown.ts       # Global test teardown
```

### 2. Test Categories

#### Critical User Journeys
- Homepage navigation and validation
- Project page interactions
- Blog post reading
- Cross-page navigation
- Performance validation
- SEO compliance

#### Accessibility Tests
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- Color and contrast
- Responsive design

#### Performance Tests
- Core Web Vitals
- Page load performance
- Network performance
- JavaScript performance
- Mobile performance

#### SEO Tests
- Meta tags validation
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- URL structure
- Internal linking

## Advanced Features

### 1. MCP-Specific Testing

```typescript
// Connect to MCP server
const browser = await chromium.connectOverCDP('ws://localhost:8080');
const context = await browser.newContext();
const page = await context.newPage();

// Use MCP features
await page.goto('http://localhost:3000');
// ... test code ...
```

### 2. Cross-Browser Testing

```bash
# Run tests on all browsers
npx playwright test

# Run tests on specific browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### 3. Mobile Testing

```bash
# Run mobile tests
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### 4. Performance Testing

```typescript
// Measure Core Web Vitals
const vitals = await page.evaluate(() => {
  return new Promise((resolve) => {
    const vitals = { FCP: 0, LCP: 0, CLS: 0, FID: 0 };
    // ... measurement code ...
    setTimeout(() => resolve(vitals), 3000);
  });
});
```

## CI/CD Integration

### 1. GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      
      - name: Start MCP Server
        run: npm run mcp:start &
        
      - name: Run E2E Tests
        run: npm run test:e2e
        
      - name: Upload Test Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 2. Environment Variables

```bash
# Development
PLAYWRIGHT_BASE_URL=http://localhost:3000
MCP_SERVER_URL=ws://localhost:8080

# Staging
PLAYWRIGHT_BASE_URL=https://staging.polything.co.uk
MCP_SERVER_URL=ws://staging-mcp.polything.co.uk:8080

# Production
PLAYWRIGHT_BASE_URL=https://polything.co.uk
MCP_SERVER_URL=ws://mcp.polything.co.uk:8080
```

## Troubleshooting

### 1. Common Issues

#### MCP Server Not Starting
```bash
# Check if port is in use
lsof -i :8080

# Kill existing processes
npm run mcp:stop

# Start fresh
npm run mcp:start
```

#### Browser Connection Issues
```bash
# Check browser installation
npx playwright install --with-deps

# Verify MCP server is running
curl http://localhost:8080/health
```

#### Test Timeouts
```typescript
// Increase timeout in playwright.config.ts
export default defineConfig({
  timeout: 120000, // 2 minutes
  expect: {
    timeout: 30000, // 30 seconds
  },
})
```

### 2. Debug Mode

```bash
# Run tests in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/e2e/critical-journeys.spec.ts --debug

# Use browser dev tools
npx playwright test --headed --debug
```

### 3. Logging

```typescript
// Enable verbose logging
export default defineConfig({
  use: {
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
})
```

## Best Practices

### 1. Test Organization
- Use Page Object Model for maintainability
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests focused and atomic

### 2. Performance
- Use `waitForLoadState('networkidle')` for page loads
- Avoid hard-coded waits
- Use proper selectors (data-testid preferred)
- Run tests in parallel when possible

### 3. Reliability
- Use retries for flaky tests
- Implement proper error handling
- Use stable selectors
- Test on multiple browsers

### 4. Maintenance
- Keep test data up to date
- Regular review of test results
- Update selectors when UI changes
- Monitor test execution time

## Monitoring and Reporting

### 1. Test Reports
- **HTML reports:** with screenshots and videos
- **JSON reports:** for CI integration
- **JUnit reports:** for test management systems

### 2. Performance Monitoring
- **Core Web Vitals tracking**
- **Page load time monitoring**
- **Network performance analysis**

### 3. Accessibility Monitoring
- **WCAG compliance checking**
- **Screen reader compatibility**
- **Keyboard navigation testing**

## Conclusion

The Playwright MCP setup provides a robust foundation for comprehensive E2E testing of the WordPress to Next.js migration project. It enables:

- **Advanced browser automation:** with MCP server
- **Comprehensive test coverage:** across multiple dimensions
- **Reliable test execution:** with proper error handling
- **Performance monitoring:** with Core Web Vitals
- **Accessibility compliance:** with WCAG 2.1 testing
- **SEO validation:** with structured data testing

For additional support and troubleshooting, refer to the [Playwright documentation](https://playwright.dev/docs/intro) and [MCP documentation](https://playwright.dev/agents).

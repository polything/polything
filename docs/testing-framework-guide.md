# Testing Framework Guide

**Date:** 2025-01-27  
**Status:** Complete  
**Version:** 1.0  

## Overview

This document provides comprehensive guidance for the testing framework implemented for the WordPress to Next.js migration project. The framework includes unit tests, integration tests, E2E tests, performance tests, and SEO validation.

## Test Suite Architecture

### 1. Unit Tests
- **Framework:** Jest + React Testing Library
- **Coverage:** 510 tests across 34 test suites
- **Location:** Co-located with source files (`*.test.ts`, `*.test.tsx`, `*.test.js`)
- **Command:** `npm test`

#### Key Test Categories:
- **Content Transformation:** Field mapping, media resolution, HTML sanitization
- **Design System Components:** Typography, containers, hero components, buttons
- **API Client:** Retry logic, error handling, authentication
- **SEO Utilities:** Metadata generation, structured data, sitemap
- **Content Validation:** Schema validation, content validation, export reporting

### 2. Integration Tests
- **Framework:** Jest (Node.js environment)
- **Purpose:** Test WordPress API → MDX export workflow
- **Location:** `tests/integration/`
- **Command:** `npm run test:integration`

#### Test Coverage:
- WordPress content fetching
- Content transformation pipeline
- MDX file generation
- Error handling scenarios
- Media processing

### 3. End-to-End Tests
- **Framework:** Playwright
- **Purpose:** Critical user journeys and cross-browser testing
- **Location:** `tests/e2e/`
- **Command:** `npm run test:e2e`

#### Test Scenarios:
- Homepage navigation
- Project detail pages
- Blog post reading
- Contact form interaction
- SEO validation
- Performance checks

### 4. Performance Tests
- **Framework:** Lighthouse + Jest
- **Purpose:** Core Web Vitals and performance budgets
- **Location:** `tests/performance/`
- **Command:** `npm run test:performance`

#### Metrics Tracked:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Performance Score

### 5. SEO Tests
- **Framework:** Jest + Custom validators
- **Purpose:** Meta tags, structured data, sitemap validation
- **Location:** `tests/seo/`
- **Command:** `npm run test:seo`

#### Validation Areas:
- JSON-LD structured data
- Meta tag presence and content
- Sitemap generation
- Canonical URLs
- Open Graph tags

## Test Configuration

### Jest Configuration

#### Main Config (`jest.config.js`)
```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/contentlayer.config.test.ts',
    '<rootDir>/app/.*\\.disabled/.*',
    '<rootDir>/scripts/wp-media-fetcher.test.js'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(contentlayer2|@contentlayer2)/)'
  ]
}
```

#### Integration Config (`jest.integration.config.js`)
```javascript
module.exports = {
  displayName: 'Integration Tests',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.(js|jsx|ts|tsx)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(contentlayer2|@contentlayer2)/)'
  ],
  testTimeout: 60000
}
```

### Playwright Configuration (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Test Scripts

### Available Commands

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:unit": "jest --testPathPatterns='lib|components'",
  "test:integration": "jest --config=jest.integration.config.js",
  "test:e2e": "playwright test",
  "test:performance": "jest --testPathPatterns='tests/performance'",
  "test:seo": "jest --testPathPatterns='tests/seo'",
  "test:ci": "jest --testPathPatterns='tests/ci'",
  "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e && npm run test:performance && npm run test:seo",
  "playwright:install": "playwright install",
  "playwright:ui": "playwright test --ui"
}
```

## Test Data and Mocking

### Mock Data Structure

```typescript
// WordPress API Response Mock
const mockWordPressPost = {
  id: 1,
  title: { rendered: 'Test Post' },
  content: { rendered: '<p>Test content</p>' },
  excerpt: { rendered: 'Test excerpt' },
  slug: 'test-post',
  date: '2024-01-01T00:00:00',
  meta: {
    themerain_hero_title: 'Hero Title',
    themerain_hero_subtitle: 'Hero Subtitle',
    themerain_hero_image: '123',
    themerain_seo_title: 'SEO Title',
    themerain_seo_description: 'SEO Description'
  }
}

// Transformed Content Mock
const mockTransformedContent = {
  frontMatter: {
    title: 'Test Post',
    slug: 'test-post',
    type: 'post',
    hero: {
      title: 'Hero Title',
      subtitle: 'Hero Subtitle',
      image: '123'
    },
    seo: {
      title: 'SEO Title',
      description: 'SEO Description'
    }
  },
  content: 'Test content',
  mediaReferences: ['123']
}
```

### API Mocking

```javascript
// Mock fetch for API tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(mockData)
  })
)
```

## Performance Testing

### Lighthouse Configuration

```javascript
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const runLighthouse = async (url) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port
  }
  
  const runnerResult = await lighthouse(url, options)
  await chrome.kill()
  
  return runnerResult
}
```

### Performance Budgets

```javascript
const performanceBudgets = {
  'first-contentful-paint': 2000, // 2 seconds
  'largest-contentful-paint': 4000, // 4 seconds
  'cumulative-layout-shift': 0.1,
  'first-input-delay': 100, // 100ms
  'performance-score': 90
}
```

## SEO Testing

### JSON-LD Validation

```javascript
const validateJSONLD = (html) => {
  const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs
  const matches = html.match(jsonLdRegex)
  
  if (!matches) {
    throw new Error('No JSON-LD found')
  }
  
  matches.forEach(match => {
    const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')
    const parsed = JSON.parse(jsonContent)
    
    // Validate required fields
    if (!parsed['@type']) {
      throw new Error('JSON-LD missing @type')
    }
  })
}
```

### Meta Tag Validation

```javascript
const validateMetaTags = (html) => {
  const requiredTags = [
    'title',
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:type"]',
    'link[rel="canonical"]'
  ]
  
  requiredTags.forEach(selector => {
    if (!html.includes(selector)) {
      throw new Error(`Missing required meta tag: ${selector}`)
    }
  })
}
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Test Suite
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
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:seo
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - run: npm run test:e2e
      - run: npm run test:performance
```

## Best Practices

### 1. Test Organization
- Co-locate tests with source files
- Use descriptive test names
- Group related tests with `describe` blocks
- Keep tests focused and atomic

### 2. Mocking Strategy
- Mock external dependencies
- Use realistic test data
- Avoid over-mocking
- Test error scenarios

### 3. Performance Testing
- Set realistic performance budgets
- Test on representative devices
- Monitor Core Web Vitals
- Include accessibility testing

### 4. SEO Testing
- Validate structured data
- Check meta tag completeness
- Test canonical URLs
- Verify sitemap generation

## Troubleshooting

### Common Issues

#### 1. Jest Configuration Issues
**Problem:** ES modules not working with Jest
**Solution:** Use CommonJS versions or configure transformIgnorePatterns

#### 2. Playwright Installation
**Problem:** Browser dependencies missing
**Solution:** Run `npx playwright install --with-deps`

#### 3. Contentlayer Tests
**Problem:** Contentlayer config tests failing
**Solution:** Exclude from Jest config due to ES module dependencies

#### 4. Integration Test Timeouts
**Problem:** Tests timing out
**Solution:** Increase timeout in Jest config for integration tests

### Debug Commands

```bash
# Run specific test file
npm test -- --testNamePattern="specific test"

# Run tests in watch mode
npm run test:watch

# Run with verbose output
npm test -- --verbose

# Run E2E tests in headed mode
npx playwright test --headed

# Run performance tests with detailed output
npm run test:performance -- --verbose
```

## Test Coverage

### Current Coverage
- **Unit Tests:** 510 tests across 34 suites
- **Integration Tests:** 11 tests for WP API workflow
- **E2E Tests:** Critical user journeys
- **Performance Tests:** Core Web Vitals validation
- **SEO Tests:** Comprehensive SEO validation

### Coverage Goals
- Unit test coverage: >90%
- Integration test coverage: All critical workflows
- E2E test coverage: All user journeys
- Performance test coverage: All page types
- SEO test coverage: All content types

## Maintenance

### Regular Tasks
1. Update test dependencies
2. Review and update performance budgets
3. Validate SEO test coverage
4. Update mock data to match API changes
5. Review and update E2E test scenarios

### Monitoring
- Track test execution time
- Monitor test flakiness
- Review performance regression
- Validate SEO compliance
- Check accessibility compliance

## Conclusion

The testing framework provides comprehensive coverage for the WordPress to Next.js migration project, ensuring quality, performance, and SEO compliance. Regular maintenance and updates will keep the framework effective and reliable.

For specific implementation details, refer to the individual test files and configuration files in the project repository.

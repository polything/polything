# Testing Framework Troubleshooting Guide

**Date:** 2025-01-27  
**Status:** Complete  
**Version:** 1.0  

## Overview

This guide provides solutions to common issues encountered when working with the testing framework for the WordPress to Next.js migration project.

## Common Issues and Solutions

### 1. Jest Configuration Issues

#### Problem: ES Modules Not Working with Jest
**Error Message:**
```
SyntaxError: Cannot use import statement outside a module
```

**Root Cause:** Jest runs in Node.js environment by default, which doesn't support ES modules without configuration.

**Solutions:**

1. **Use CommonJS versions of modules:**
   ```javascript
   // Instead of:
   import { transformContent } from './transformers.mjs'
   
   // Use:
   const { transformContent } = require('./transformers.js')
   ```

2. **Configure transformIgnorePatterns:**
   ```javascript
   // jest.config.js
   transformIgnorePatterns: [
     'node_modules/(?!(contentlayer2|@contentlayer2)/)'
   ]
   ```

3. **Use separate Jest config for different environments:**
   ```javascript
   // jest.integration.config.js
   module.exports = {
     testEnvironment: 'node',
     // ... other config
   }
   ```

#### Problem: Regex Error in testPathIgnorePatterns
**Error Message:**
```
SyntaxError: Invalid regular expression: Nothing to repeat
```

**Root Cause:** Invalid regex pattern in Jest configuration.

**Solution:**
```javascript
// Wrong:
testPathIgnorePatterns: ['<rootDir>/app/**/*.disabled/**']

// Correct:
testPathIgnorePatterns: ['<rootDir>/app/.*\\.disabled/.*']
```

### 2. Playwright Issues

#### Problem: Browser Dependencies Missing
**Error Message:**
```
Error: Browser executable not found
```

**Solution:**
```bash
# Install Playwright browsers
npx playwright install --with-deps

# Or install specific browsers
npx playwright install chromium firefox webkit
```

#### Problem: Tests Timing Out
**Error Message:**
```
TimeoutError: Test timeout of 30000ms exceeded
```

**Solutions:**

1. **Increase timeout in Playwright config:**
   ```typescript
   // playwright.config.ts
   export default defineConfig({
     timeout: 60000, // 60 seconds
     // ...
   })
   ```

2. **Increase timeout for specific tests:**
   ```typescript
   test('slow test', async ({ page }) => {
     // test code
   }, { timeout: 120000 }) // 2 minutes
   ```

#### Problem: Web Server Not Starting
**Error Message:**
```
Error: Web server failed to start
```

**Solution:**
```typescript
// playwright.config.ts
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120000, // 2 minutes
}
```

### 3. Contentlayer Issues

#### Problem: Contentlayer Config Tests Failing
**Error Message:**
```
Cannot find module 'contentlayer2/generated'
```

**Root Cause:** Contentlayer generates files at build time, not available during testing.

**Solution:**
```javascript
// jest.config.js
testPathIgnorePatterns: [
  '<rootDir>/contentlayer.config.test.ts'
]
```

#### Problem: Contentlayer ES Module Issues
**Error Message:**
```
SyntaxError: Unexpected token 'export'
```

**Solution:**
```javascript
// jest.config.js
transformIgnorePatterns: [
  'node_modules/(?!(contentlayer2|@contentlayer2)/)'
]
```

### 4. Integration Test Issues

#### Problem: Integration Tests Not Running
**Error Message:**
```
Test environment node Integration tests cannot be found
```

**Solution:**
```javascript
// jest.integration.config.js
module.exports = {
  displayName: 'Integration Tests',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.(js|jsx|ts|tsx)'
  ],
  // ... other config
}
```

#### Problem: Integration Test Timeouts
**Error Message:**
```
TimeoutError: Test timeout exceeded
```

**Solution:**
```javascript
// jest.integration.config.js
module.exports = {
  testTimeout: 60000, // 60 seconds
  // ... other config
}
```

### 5. Mock and Test Data Issues

#### Problem: Mock Data Not Matching Real API
**Error Message:**
```
Expected: "expected value"
Received: "actual value"
```

**Solution:**
```javascript
// Update mock data to match actual API response
const mockWordPressPost = {
  id: 1,
  title: { rendered: 'Actual Title Format' },
  content: { rendered: '<p>Actual content format</p>' },
  // ... match actual API structure
}
```

#### Problem: Fetch Mock Not Working
**Error Message:**
```
TypeError: fetch is not defined
```

**Solution:**
```javascript
// jest.setup.js
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(mockData)
  })
)
```

### 6. Performance Test Issues

#### Problem: Lighthouse Tests Failing
**Error Message:**
```
Error: Lighthouse failed to run
```

**Solutions:**

1. **Install Chrome dependencies:**
   ```bash
   npm install --save-dev chrome-launcher
   ```

2. **Use headless Chrome:**
   ```javascript
   const chrome = await chromeLauncher.launch({ 
     chromeFlags: ['--headless', '--no-sandbox'] 
   })
   ```

3. **Increase timeout:**
   ```javascript
   const options = {
     timeout: 120000, // 2 minutes
     // ... other options
   }
   ```

#### Problem: Performance Budgets Too Strict
**Error Message:**
```
Performance budget exceeded
```

**Solution:**
```javascript
// Adjust performance budgets
const performanceBudgets = {
  'first-contentful-paint': 3000, // Increase from 2000
  'largest-contentful-paint': 5000, // Increase from 4000
  'performance-score': 85 // Decrease from 90
}
```

### 7. SEO Test Issues

#### Problem: JSON-LD Validation Failing
**Error Message:**
```
No JSON-LD found
```

**Solution:**
```javascript
// Check if JSON-LD is properly rendered
const validateJSONLD = (html) => {
  const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs
  const matches = html.match(jsonLdRegex)
  
  if (!matches) {
    console.log('HTML content:', html) // Debug output
    throw new Error('No JSON-LD found')
  }
}
```

#### Problem: Meta Tag Validation Failing
**Error Message:**
```
Missing required meta tag
```

**Solution:**
```javascript
// Use more flexible selectors
const validateMetaTags = (html) => {
  const requiredTags = [
    'title',
    'meta[name="description"]',
    'meta[property="og:title"]'
  ]
  
  requiredTags.forEach(selector => {
    const regex = new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    if (!regex.test(html)) {
      console.log('Missing tag:', selector)
      console.log('HTML content:', html)
      throw new Error(`Missing required meta tag: ${selector}`)
    }
  })
}
```

### 8. Component Test Issues

#### Problem: Component Import Errors
**Error Message:**
```
Cannot find module './component'
```

**Solution:**
```javascript
// Check file extensions and paths
import Component from './component.tsx' // Use correct extension
// or
import Component from './component' // If extension is configured
```

#### Problem: React Testing Library Issues
**Error Message:**
```
Element not found
```

**Solution:**
```javascript
// Use more specific queries
import { render, screen } from '@testing-library/react'

// Instead of:
screen.getByText('Button')

// Use:
screen.getByRole('button', { name: 'Button' })
```

### 9. Environment Issues

#### Problem: Node.js Version Mismatch
**Error Message:**
```
SyntaxError: Unexpected token
```

**Solution:**
```bash
# Check Node.js version
node --version

# Use correct Node.js version (18+)
nvm use 18
```

#### Problem: Package Manager Issues
**Error Message:**
```
Cannot read properties of null
```

**Solution:**
```bash
# Clear package manager cache
npm cache clean --force
# or
pnpm store prune

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 10. CI/CD Issues

#### Problem: Tests Failing in CI
**Error Message:**
```
Tests pass locally but fail in CI
```

**Solutions:**

1. **Use consistent Node.js version:**
   ```yaml
   # .github/workflows/test.yml
   - uses: actions/setup-node@v3
     with:
       node-version: '18'
   ```

2. **Install Playwright dependencies:**
   ```yaml
   - name: Install Playwright
     run: npx playwright install --with-deps
   ```

3. **Use headless mode:**
   ```yaml
   - name: Run E2E tests
     run: npx playwright test --reporter=github
   ```

## Debug Commands

### Jest Debugging
```bash
# Run specific test with verbose output
npm test -- --testNamePattern="specific test" --verbose

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.test.js
```

### Playwright Debugging
```bash
# Run tests in headed mode
npx playwright test --headed

# Run specific test
npx playwright test tests/e2e/specific.spec.ts

# Run with debug mode
npx playwright test --debug

# Run with UI mode
npx playwright test --ui
```

### Performance Testing
```bash
# Run Lighthouse manually
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json

# Run with specific options
npx lighthouse http://localhost:3000 --only-categories=performance --chrome-flags="--headless"
```

## Best Practices for Troubleshooting

### 1. Isolate the Problem
- Run tests individually
- Check specific test files
- Verify environment setup

### 2. Check Dependencies
- Ensure all packages are installed
- Verify version compatibility
- Check for peer dependency warnings

### 3. Review Configuration
- Validate Jest configuration
- Check Playwright setup
- Verify environment variables

### 4. Use Debug Tools
- Enable verbose logging
- Use browser dev tools
- Check network requests

### 5. Update Documentation
- Document new issues and solutions
- Update troubleshooting guide
- Share knowledge with team

## Getting Help

### Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

### Support Channels
- Project documentation
- Team knowledge base
- GitHub issues
- Community forums

## Conclusion

This troubleshooting guide covers the most common issues encountered with the testing framework. For issues not covered here, refer to the official documentation or seek help from the development team.

Remember to:
1. Keep this guide updated with new issues and solutions
2. Document any new problems encountered
3. Share solutions with the team
4. Test solutions before documenting them

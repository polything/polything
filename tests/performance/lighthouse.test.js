/**
 * Performance tests using Lighthouse
 * Task 4.6: Performance tests (PageSpeed, Lighthouse, Core Web Vitals)
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

/**
 * Performance test configuration
 */
const PERFORMANCE_BUDGET = {
  performance: 90,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
  'first-contentful-paint': 2000, // 2 seconds
  'largest-contentful-paint': 2500, // 2.5 seconds
  'cumulative-layout-shift': 0.1,
  'total-blocking-time': 300, // 300ms
  'speed-index': 3000 // 3 seconds
};

const TEST_URLS = [
  'http://localhost:3000',
  'http://localhost:3000/work/test-project',
  'http://localhost:3000/blog/test-post',
  'http://localhost:3000/contact'
];

/**
 * Run Lighthouse audit for a given URL
 */
async function runLighthouseAudit(url, options = {}) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const lighthouseOptions = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    ...options
  };

  try {
    const runnerResult = await lighthouse(url, lighthouseOptions);
    return runnerResult;
  } finally {
    await chrome.kill();
  }
}

/**
 * Extract Core Web Vitals from Lighthouse results
 */
function extractCoreWebVitals(lighthouseResult) {
  const audits = lighthouseResult.lhr.audits;
  
  return {
    'first-contentful-paint': audits['first-contentful-paint']?.numericValue,
    'largest-contentful-paint': audits['largest-contentful-paint']?.numericValue,
    'cumulative-layout-shift': audits['cumulative-layout-shift']?.numericValue,
    'total-blocking-time': audits['total-blocking-time']?.numericValue,
    'speed-index': audits['speed-index']?.numericValue
  };
}

/**
 * Check if performance metrics meet budget
 */
function checkPerformanceBudget(scores, coreWebVitals) {
  const failures = [];
  
  // Check category scores
  Object.entries(PERFORMANCE_BUDGET).forEach(([metric, budget]) => {
    if (metric.includes('-')) {
      // Core Web Vitals
      const value = coreWebVitals[metric];
      if (value !== undefined && value > budget) {
        failures.push({
          metric,
          value: Math.round(value),
          budget,
          type: 'core-web-vital'
        });
      }
    } else {
      // Category scores
      const score = scores[metric];
      if (score !== undefined && score < budget) {
        failures.push({
          metric,
          value: score,
          budget,
          type: 'category-score'
        });
      }
    }
  });
  
  return failures;
}

/**
 * Generate performance report
 */
function generatePerformanceReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalUrls: results.length,
      passed: 0,
      failed: 0,
      averagePerformance: 0,
      averageAccessibility: 0,
      averageBestPractices: 0,
      averageSEO: 0
    },
    results: [],
    recommendations: []
  };

  let totalPerformance = 0;
  let totalAccessibility = 0;
  let totalBestPractices = 0;
  let totalSEO = 0;

  results.forEach((result, index) => {
    const scores = result.lhr.categories;
    const coreWebVitals = extractCoreWebVitals(result);
    const failures = checkPerformanceBudget(scores, coreWebVitals);
    
    const urlResult = {
      url: result.lhr.finalUrl,
      scores: {
        performance: Math.round(scores.performance.score * 100),
        accessibility: Math.round(scores.accessibility.score * 100),
        'best-practices': Math.round(scores['best-practices'].score * 100),
        seo: Math.round(scores.seo.score * 100)
      },
      coreWebVitals,
      failures,
      passed: failures.length === 0
    };

    report.results.push(urlResult);
    
    if (urlResult.passed) {
      report.summary.passed++;
    } else {
      report.summary.failed++;
    }

    totalPerformance += urlResult.scores.performance;
    totalAccessibility += urlResult.scores.accessibility;
    totalBestPractices += urlResult.scores['best-practices'];
    totalSEO += urlResult.scores.seo;
  });

  report.summary.averagePerformance = Math.round(totalPerformance / results.length);
  report.summary.averageAccessibility = Math.round(totalAccessibility / results.length);
  report.summary.averageBestPractices = Math.round(totalBestPractices / results.length);
  report.summary.averageSEO = Math.round(totalSEO / results.length);

  // Generate recommendations
  if (report.summary.averagePerformance < 90) {
    report.recommendations.push('Consider optimizing images and implementing lazy loading');
  }
  if (report.summary.averageAccessibility < 90) {
    report.recommendations.push('Review accessibility issues and ensure proper ARIA labels');
  }
  if (report.summary.averageBestPractices < 90) {
    report.recommendations.push('Address security and best practice issues');
  }
  if (report.summary.averageSEO < 90) {
    report.recommendations.push('Improve SEO meta tags and structured data');
  }

  return report;
}

/**
 * Save performance report to file
 */
async function savePerformanceReport(report) {
  const reportDir = './test-results/performance';
  await fs.mkdir(reportDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `lighthouse-report-${timestamp}.json`);
  
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  return reportPath;
}

/**
 * Main performance test function
 */
async function runPerformanceTests() {
  console.log('🚀 Starting Lighthouse performance tests...\n');
  
  const results = [];
  
  for (const url of TEST_URLS) {
    console.log(`📊 Testing: ${url}`);
    
    try {
      const result = await runLighthouseAudit(url);
      results.push(result);
      
      const scores = result.lhr.categories;
      console.log(`   Performance: ${Math.round(scores.performance.score * 100)}`);
      console.log(`   Accessibility: ${Math.round(scores.accessibility.score * 100)}`);
      console.log(`   Best Practices: ${Math.round(scores['best-practices'].score * 100)}`);
      console.log(`   SEO: ${Math.round(scores.seo.score * 100)}`);
      
      const coreWebVitals = extractCoreWebVitals(result);
      console.log(`   LCP: ${Math.round(coreWebVitals['largest-contentful-paint'])}ms`);
      console.log(`   FCP: ${Math.round(coreWebVitals['first-contentful-paint'])}ms`);
      console.log(`   CLS: ${coreWebVitals['cumulative-layout-shift']?.toFixed(3)}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Failed to test ${url}:`, error.message);
    }
  }
  
  if (results.length === 0) {
    throw new Error('No successful Lighthouse audits completed');
  }
  
  // Generate and save report
  const report = generatePerformanceReport(results);
  const reportPath = await savePerformanceReport(report);
  
  console.log('📈 Performance Test Summary:');
  console.log(`   Total URLs tested: ${report.summary.totalUrls}`);
  console.log(`   Passed: ${report.summary.passed}`);
  console.log(`   Failed: ${report.summary.failed}`);
  console.log(`   Average Performance: ${report.summary.averagePerformance}`);
  console.log(`   Average Accessibility: ${report.summary.averageAccessibility}`);
  console.log(`   Average Best Practices: ${report.summary.averageBestPractices}`);
  console.log(`   Average SEO: ${report.summary.averageSEO}`);
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`   - ${rec}`));
  }
  
  return report;
}

// Jest test wrapper
describe('Performance Tests', () => {
  test('should meet performance budget for all pages', async () => {
    const report = await runPerformanceTests();
    
    // Check that at least some tests passed
    expect(report.summary.passed).toBeGreaterThan(0);
    
    // Check average scores meet minimum requirements
    expect(report.summary.averagePerformance).toBeGreaterThanOrEqual(80);
    expect(report.summary.averageAccessibility).toBeGreaterThanOrEqual(80);
    expect(report.summary.averageBestPractices).toBeGreaterThanOrEqual(80);
    expect(report.summary.averageSEO).toBeGreaterThanOrEqual(80);
    
    // Check individual page results
    report.results.forEach(result => {
      if (result.passed) {
        expect(result.scores.performance).toBeGreaterThanOrEqual(80);
        expect(result.scores.accessibility).toBeGreaterThanOrEqual(80);
        expect(result.scores['best-practices']).toBeGreaterThanOrEqual(80);
        expect(result.scores.seo).toBeGreaterThanOrEqual(80);
      }
    });
  }, 300000); // 5 minute timeout for performance tests
});

// Export for direct usage
module.exports = {
  runPerformanceTests,
  runLighthouseAudit,
  extractCoreWebVitals,
  checkPerformanceBudget,
  generatePerformanceReport,
  PERFORMANCE_BUDGET
};

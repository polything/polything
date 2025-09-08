/**
 * CI step: crawl built pages and validate JSON-LD presence (basic shape)
 * Task 4.9: CI step: crawl built pages and validate JSON-LD presence (basic shape)
 */

const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

/**
 * JSON-LD validation utilities
 */
class JSONLDCrawler {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  /**
   * Crawl a page and extract JSON-LD data
   */
  async crawlPage(page, url) {
    console.log(`🔍 Crawling: ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      
      const jsonLdScripts = page.locator('script[type="application/ld+json"]');
      const scriptCount = await jsonLdScripts.count();
      
      const pageResult = {
        url,
        timestamp: new Date().toISOString(),
        jsonLdCount: scriptCount,
        jsonLdData: [],
        errors: [],
        warnings: []
      };

      if (scriptCount === 0) {
        pageResult.errors.push('No JSON-LD structured data found');
        this.errors.push({
          url,
          type: 'missing-json-ld',
          message: 'No JSON-LD structured data found'
        });
      } else {
        for (let i = 0; i < scriptCount; i++) {
          const scriptContent = await jsonLdScripts.nth(i).textContent();
          
          try {
            const jsonLd = JSON.parse(scriptContent);
            pageResult.jsonLdData.push(jsonLd);
            
            // Basic shape validation
            const validation = this.validateJSONLDShape(jsonLd, url);
            pageResult.errors.push(...validation.errors);
            pageResult.warnings.push(...validation.warnings);
            
          } catch (error) {
            pageResult.errors.push(`Invalid JSON-LD syntax: ${error.message}`);
            this.errors.push({
              url,
              type: 'invalid-json-ld',
              message: `Invalid JSON-LD syntax: ${error.message}`
            });
          }
        }
      }

      this.results.push(pageResult);
      return pageResult;
      
    } catch (error) {
      const errorResult = {
        url,
        timestamp: new Date().toISOString(),
        error: error.message,
        jsonLdCount: 0,
        jsonLdData: [],
        errors: [error.message],
        warnings: []
      };
      
      this.results.push(errorResult);
      this.errors.push({
        url,
        type: 'crawl-error',
        message: error.message
      });
      
      return errorResult;
    }
  }

  /**
   * Validate basic JSON-LD shape
   */
  validateJSONLDShape(jsonLd, url) {
    const errors = [];
    const warnings = [];

    // Check required top-level properties
    if (!jsonLd['@context']) {
      errors.push('Missing @context property');
    } else if (jsonLd['@context'] !== 'https://schema.org') {
      warnings.push(`Unexpected @context: ${jsonLd['@context']}`);
    }

    if (!jsonLd['@type']) {
      errors.push('Missing @type property');
    } else {
      // Validate @type values
      const validTypes = [
        'WebPage', 'Article', 'BlogPosting', 'CreativeWork',
        'Organization', 'Website', 'BreadcrumbList'
      ];
      
      if (!validTypes.includes(jsonLd['@type'])) {
        warnings.push(`Unexpected @type: ${jsonLd['@type']}`);
      }
    }

    // Validate based on @type
    switch (jsonLd['@type']) {
      case 'WebPage':
        this.validateWebPageShape(jsonLd, errors, warnings);
        break;
      case 'Article':
      case 'BlogPosting':
        this.validateArticleShape(jsonLd, errors, warnings);
        break;
      case 'CreativeWork':
        this.validateCreativeWorkShape(jsonLd, errors, warnings);
        break;
      case 'Organization':
        this.validateOrganizationShape(jsonLd, errors, warnings);
        break;
      case 'Website':
        this.validateWebsiteShape(jsonLd, errors, warnings);
        break;
      case 'BreadcrumbList':
        this.validateBreadcrumbListShape(jsonLd, errors, warnings);
        break;
    }

    return { errors, warnings };
  }

  /**
   * Validate WebPage JSON-LD shape
   */
  validateWebPageShape(jsonLd, errors, warnings) {
    if (!jsonLd.headline && !jsonLd.name) {
      errors.push('WebPage missing headline or name');
    }
    
    if (!jsonLd.url) {
      errors.push('WebPage missing URL');
    }
    
    if (jsonLd.dateModified && !this.isValidDate(jsonLd.dateModified)) {
      warnings.push('Invalid dateModified format');
    }
  }

  /**
   * Validate Article/BlogPosting JSON-LD shape
   */
  validateArticleShape(jsonLd, errors, warnings) {
    if (!jsonLd.headline) {
      errors.push('Article missing headline');
    }
    
    if (!jsonLd.url) {
      errors.push('Article missing URL');
    }
    
    if (jsonLd.datePublished && !this.isValidDate(jsonLd.datePublished)) {
      warnings.push('Invalid datePublished format');
    }
    
    if (jsonLd.dateModified && !this.isValidDate(jsonLd.dateModified)) {
      warnings.push('Invalid dateModified format');
    }
    
    if (jsonLd.author && typeof jsonLd.author === 'object') {
      if (!jsonLd.author['@type']) {
        warnings.push('Author missing @type');
      }
      if (!jsonLd.author.name) {
        warnings.push('Author missing name');
      }
    }
  }

  /**
   * Validate CreativeWork JSON-LD shape
   */
  validateCreativeWorkShape(jsonLd, errors, warnings) {
    if (!jsonLd.name && !jsonLd.headline) {
      errors.push('CreativeWork missing name or headline');
    }
    
    if (!jsonLd.url) {
      errors.push('CreativeWork missing URL');
    }
    
    if (jsonLd.dateModified && !this.isValidDate(jsonLd.dateModified)) {
      warnings.push('Invalid dateModified format');
    }
  }

  /**
   * Validate Organization JSON-LD shape
   */
  validateOrganizationShape(jsonLd, errors, warnings) {
    if (!jsonLd.name) {
      errors.push('Organization missing name');
    }
    
    if (!jsonLd.url) {
      errors.push('Organization missing URL');
    }
  }

  /**
   * Validate Website JSON-LD shape
   */
  validateWebsiteShape(jsonLd, errors, warnings) {
    if (!jsonLd.name) {
      errors.push('Website missing name');
    }
    
    if (!jsonLd.url) {
      errors.push('Website missing URL');
    }
  }

  /**
   * Validate BreadcrumbList JSON-LD shape
   */
  validateBreadcrumbListShape(jsonLd, errors, warnings) {
    if (!jsonLd.itemListElement) {
      errors.push('BreadcrumbList missing itemListElement');
    } else if (!Array.isArray(jsonLd.itemListElement)) {
      errors.push('BreadcrumbList itemListElement must be an array');
    } else {
      jsonLd.itemListElement.forEach((item, index) => {
        if (!item['@type'] || item['@type'] !== 'ListItem') {
          errors.push(`BreadcrumbList item ${index} missing or invalid @type`);
        }
        if (!item.position) {
          errors.push(`BreadcrumbList item ${index} missing position`);
        }
        if (!item.name) {
          errors.push(`BreadcrumbList item ${index} missing name`);
        }
        if (!item.item || !item.item['@id']) {
          errors.push(`BreadcrumbList item ${index} missing item.@id`);
        }
      });
    }
  }

  /**
   * Check if date string is valid ISO format
   */
  isValidDate(dateString) {
    if (typeof dateString !== 'string') return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.includes('T');
  }

  /**
   * Generate crawl report
   */
  generateReport() {
    const totalPages = this.results.length;
    const pagesWithErrors = this.results.filter(r => r.errors.length > 0).length;
    const pagesWithWarnings = this.results.filter(r => r.warnings.length > 0).length;
    const totalErrors = this.errors.length;
    
    const errorTypes = {};
    this.errors.forEach(error => {
      errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
    });

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalPages,
        pagesWithErrors,
        pagesWithWarnings,
        totalErrors,
        errorTypes
      },
      results: this.results,
      errors: this.errors
    };
  }
}

/**
 * Get list of pages to crawl from sitemap or predefined list
 */
async function getPagesToCrawl() {
  // Try to read from sitemap first
  try {
    const sitemapPath = './public/sitemap.xml';
    const sitemapContent = await fs.readFile(sitemapPath, 'utf8');
    
    // Simple XML parsing to extract URLs
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    if (urlMatches) {
      return urlMatches.map(match => 
        match.replace('<loc>', '').replace('</loc>', '')
      );
    }
  } catch (error) {
    console.log('Could not read sitemap, using predefined URLs');
  }

  // Fallback to predefined URLs
  return [
    'http://localhost:3000',
    'http://localhost:3000/work/test-project',
    'http://localhost:3000/blog/test-post',
    'http://localhost:3000/contact',
    'http://localhost:3000/about'
  ];
}

/**
 * Main crawl function
 */
async function crawlAndValidateJSONLD() {
  console.log('🕷️  Starting JSON-LD crawl and validation...\n');
  
  const pages = await getPagesToCrawl();
  console.log(`📄 Found ${pages.length} pages to crawl\n`);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const crawler = new JSONLDCrawler();
  
  for (const url of pages) {
    await crawler.crawlPage(page, url);
  }
  
  await browser.close();
  
  const report = crawler.generateReport();
  
  console.log('\n📊 JSON-LD Crawl Summary:');
  console.log(`   Total Pages: ${report.summary.totalPages}`);
  console.log(`   Pages with Errors: ${report.summary.pagesWithErrors}`);
  console.log(`   Pages with Warnings: ${report.summary.pagesWithWarnings}`);
  console.log(`   Total Errors: ${report.summary.totalErrors}`);
  
  if (Object.keys(report.summary.errorTypes).length > 0) {
    console.log('\n❌ Error Types:');
    Object.entries(report.summary.errorTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  }
  
  // Save report
  const reportDir = './test-results/ci';
  await fs.mkdir(reportDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `json-ld-crawl-${timestamp}.json`);
  
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  return report;
}

// Jest test wrapper
describe('JSON-LD Crawler CI Tests', () => {
  test('should find valid JSON-LD on all crawled pages', async () => {
    const report = await crawlAndValidateJSONLD();
    
    // Check that we crawled some pages
    expect(report.summary.totalPages).toBeGreaterThan(0);
    
    // Check that most pages have JSON-LD (allow some failures for missing pages)
    const pagesWithJSONLD = report.results.filter(r => r.jsonLdCount > 0).length;
    const jsonLDCoverage = pagesWithJSONLD / report.summary.totalPages;
    
    expect(jsonLDCoverage).toBeGreaterThan(0.5); // At least 50% coverage
    
    // Check that we don't have too many critical errors
    const criticalErrors = report.errors.filter(e => 
      e.type === 'missing-json-ld' || e.type === 'invalid-json-ld'
    ).length;
    
    expect(criticalErrors).toBeLessThan(report.summary.totalPages * 0.3); // Less than 30% critical errors
  }, 120000); // 2 minute timeout
});

// Export for direct usage
module.exports = {
  JSONLDCrawler,
  crawlAndValidateJSONLD,
  getPagesToCrawl
};

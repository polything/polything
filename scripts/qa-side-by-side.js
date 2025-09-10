#!/usr/bin/env node

/**
 * Side-by-Side QA Testing Script
 * 
 * This script performs visual and functional QA comparison between
 * the migrated Next.js site and the live WordPress site.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  localUrl: 'http://localhost:3000',
  liveUrl: 'https://polything.co.uk',
  outputDir: './test-results/qa-comparison',
  viewport: { width: 1920, height: 1080 },
  timeout: 30000
};

// Pages to test based on PRD and exported content
const PAGES_TO_TEST = [
  // Core navigation pages
  { path: '/', name: 'Homepage', priority: 'critical' },
  { path: '/about', name: 'About Page', priority: 'high' },
  { path: '/contact', name: 'Contact Page', priority: 'high' },
  { path: '/services', name: 'Services Page', priority: 'high' },
  { path: '/book-a-call', name: 'Book a Call', priority: 'high' },
  
  // Project pages (from exported content)
  { path: '/work/blackriver', name: 'Blackriver Project', priority: 'high' },
  { path: '/work/bluefort-security', name: 'Bluefort Security Project', priority: 'high' },
  
  // Blog pages
  { path: '/blog', name: 'Blog Index', priority: 'medium' },
  
  // Static pages
  { path: '/privacy-policy', name: 'Privacy Policy', priority: 'medium' },
  { path: '/terms-of-service', name: 'Terms of Service', priority: 'medium' }
];

class QATester {
  constructor() {
    this.browser = null;
    this.results = [];
    this.issues = [];
  }

  async init() {
    console.log('🚀 Starting QA Testing...');
    console.log(`📱 Local URL: ${CONFIG.localUrl}`);
    console.log(`🌐 Live URL: ${CONFIG.liveUrl}`);
    
    // Create output directory
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Launch browser
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000 // Slow down for visual inspection
    });
  }

  async testPage(pageConfig) {
    const { path: pagePath, name, priority } = pageConfig;
    console.log(`\n🔍 Testing: ${name} (${pagePath})`);
    
    const context = await this.browser.newContext({
      viewport: CONFIG.viewport
    });

    try {
      // Test local version
      const localPage = await context.newPage();
      await localPage.goto(`${CONFIG.localUrl}${pagePath}`, { 
        waitUntil: 'networkidle',
        timeout: CONFIG.timeout 
      });
      
      // Test live version
      const livePage = await context.newPage();
      await livePage.goto(`${CONFIG.liveUrl}${pagePath}`, { 
        waitUntil: 'networkidle',
        timeout: CONFIG.timeout 
      });

      // Take screenshots for comparison
      const localScreenshot = path.join(CONFIG.outputDir, `${pagePath.replace(/\//g, '_')}_local.png`);
      const liveScreenshot = path.join(CONFIG.outputDir, `${pagePath.replace(/\//g, '_')}_live.png`);
      
      await localPage.screenshot({ path: localScreenshot, fullPage: true });
      await livePage.screenshot({ path: liveScreenshot, fullPage: true });

      // Extract content for comparison
      const localContent = await this.extractPageContent(localPage);
      const liveContent = await this.extractPageContent(livePage);

      // Compare content
      const comparison = this.compareContent(localContent, liveContent, name);
      
      // Test interactive elements
      const interactions = await this.testInteractions(localPage, livePage, name);

      const result = {
        page: name,
        path: pagePath,
        priority,
        localUrl: `${CONFIG.localUrl}${pagePath}`,
        liveUrl: `${CONFIG.liveUrl}${pagePath}`,
        localScreenshot,
        liveScreenshot,
        contentComparison: comparison,
        interactions,
        timestamp: new Date().toISOString()
      };

      this.results.push(result);
      
      // Log issues
      if (comparison.issues.length > 0 || interactions.issues.length > 0) {
        this.issues.push({
          page: name,
          path: pagePath,
          priority,
          contentIssues: comparison.issues,
          interactionIssues: interactions.issues
        });
      }

      console.log(`✅ Completed: ${name}`);
      if (comparison.issues.length > 0) {
        console.log(`⚠️  Found ${comparison.issues.length} content issues`);
      }
      if (interactions.issues.length > 0) {
        console.log(`⚠️  Found ${interactions.issues.length} interaction issues`);
      }

    } catch (error) {
      console.error(`❌ Error testing ${name}:`, error.message);
      this.issues.push({
        page: name,
        path: pagePath,
        priority,
        error: error.message
      });
    } finally {
      await context.close();
    }
  }

  async extractPageContent(page) {
    return await page.evaluate(() => {
      return {
        title: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
        h1: document.querySelector('h1')?.textContent?.trim() || '',
        h2s: Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()),
        images: Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        })),
        links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
          href: a.href,
          text: a.textContent.trim()
        })),
        buttons: Array.from(document.querySelectorAll('button')).map(btn => ({
          text: btn.textContent.trim(),
          type: btn.type,
          disabled: btn.disabled
        })),
        forms: Array.from(document.querySelectorAll('form')).map(form => ({
          action: form.action,
          method: form.method,
          inputs: Array.from(form.querySelectorAll('input')).map(input => ({
            type: input.type,
            name: input.name,
            placeholder: input.placeholder
          }))
        }))
      };
    });
  }

  compareContent(local, live, pageName) {
    const issues = [];

    // Compare title
    if (local.title !== live.title) {
      issues.push({
        type: 'title',
        severity: 'high',
        message: `Title mismatch: "${local.title}" vs "${live.title}"`
      });
    }

    // Compare meta description
    if (local.metaDescription !== live.metaDescription) {
      issues.push({
        type: 'meta_description',
        severity: 'medium',
        message: `Meta description mismatch`
      });
    }

    // Compare H1
    if (local.h1 !== live.h1) {
      issues.push({
        type: 'h1',
        severity: 'high',
        message: `H1 mismatch: "${local.h1}" vs "${live.h1}"`
      });
    }

    // Compare images
    if (local.images.length !== live.images.length) {
      issues.push({
        type: 'image_count',
        severity: 'medium',
        message: `Image count mismatch: ${local.images.length} vs ${live.images.length}`
      });
    }

    // Compare links
    if (local.links.length !== live.links.length) {
      issues.push({
        type: 'link_count',
        severity: 'medium',
        message: `Link count mismatch: ${local.links.length} vs ${live.links.length}`
      });
    }

    return {
      issues,
      local,
      live
    };
  }

  async testInteractions(localPage, livePage, pageName) {
    const issues = [];

    try {
      // Test navigation menu
      const localNav = await localPage.locator('nav').count();
      const liveNav = await livePage.locator('nav').count();
      
      if (localNav !== liveNav) {
        issues.push({
          type: 'navigation',
          severity: 'high',
          message: `Navigation structure mismatch`
        });
      }

      // Test buttons
      const localButtons = await localPage.locator('button').count();
      const liveButtons = await livePage.locator('button').count();
      
      if (localButtons !== liveButtons) {
        issues.push({
          type: 'buttons',
          severity: 'medium',
          message: `Button count mismatch: ${localButtons} vs ${liveButtons}`
        });
      }

      // Test forms
      const localForms = await localPage.locator('form').count();
      const liveForms = await livePage.locator('form').count();
      
      if (localForms !== liveForms) {
        issues.push({
          type: 'forms',
          severity: 'high',
          message: `Form count mismatch: ${localForms} vs ${liveForms}`
        });
      }

    } catch (error) {
      issues.push({
        type: 'interaction_test',
        severity: 'medium',
        message: `Error testing interactions: ${error.message}`
      });
    }

    return { issues };
  }

  async runAllTests() {
    console.log(`\n📋 Testing ${PAGES_TO_TEST.length} pages...`);
    
    for (const pageConfig of PAGES_TO_TEST) {
      await this.testPage(pageConfig);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  async generateReport() {
    console.log('\n📊 Generating QA Report...');
    
    const report = {
      summary: {
        totalPages: PAGES_TO_TEST.length,
        pagesWithIssues: this.issues.length,
        criticalIssues: this.issues.filter(i => i.priority === 'critical').length,
        highPriorityIssues: this.issues.filter(i => i.priority === 'high').length,
        mediumPriorityIssues: this.issues.filter(i => i.priority === 'medium').length,
        timestamp: new Date().toISOString()
      },
      results: this.results,
      issues: this.issues,
      config: CONFIG
    };

    // Save detailed report
    const reportPath = path.join(CONFIG.outputDir, 'qa-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(CONFIG.outputDir, 'qa-report.md');
    fs.writeFileSync(markdownPath, markdownReport);

    console.log(`\n📄 Reports generated:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   Markdown: ${markdownPath}`);
    
    return report;
  }

  generateMarkdownReport(report) {
    let markdown = `# QA Testing Report\n\n`;
    markdown += `**Date:** ${new Date().toLocaleDateString()}\n`;
    markdown += `**Total Pages Tested:** ${report.summary.totalPages}\n`;
    markdown += `**Pages with Issues:** ${report.summary.pagesWithIssues}\n\n`;

    markdown += `## Summary\n\n`;
    markdown += `- **Critical Issues:** ${report.summary.criticalIssues}\n`;
    markdown += `- **High Priority Issues:** ${report.summary.highPriorityIssues}\n`;
    markdown += `- **Medium Priority Issues:** ${report.summary.mediumPriorityIssues}\n\n`;

    if (report.issues.length > 0) {
      markdown += `## Issues Found\n\n`;
      
      report.issues.forEach((issue, index) => {
        markdown += `### ${index + 1}. ${issue.page} (${issue.priority} priority)\n`;
        markdown += `**Path:** ${issue.path}\n\n`;
        
        if (issue.contentIssues) {
          markdown += `**Content Issues:**\n`;
          issue.contentIssues.forEach(contentIssue => {
            markdown += `- ${contentIssue.severity.toUpperCase()}: ${contentIssue.message}\n`;
          });
          markdown += `\n`;
        }
        
        if (issue.interactionIssues) {
          markdown += `**Interaction Issues:**\n`;
          issue.interactionIssues.forEach(interactionIssue => {
            markdown += `- ${interactionIssue.severity.toUpperCase()}: ${interactionIssue.message}\n`;
          });
          markdown += `\n`;
        }
        
        if (issue.error) {
          markdown += `**Error:** ${issue.error}\n\n`;
        }
      });
    } else {
      markdown += `## ✅ No Issues Found\n\n`;
      markdown += `All pages passed the QA testing successfully!\n\n`;
    }

    markdown += `## Test Results\n\n`;
    report.results.forEach(result => {
      markdown += `### ${result.page}\n`;
      markdown += `- **Local:** ${result.localUrl}\n`;
      markdown += `- **Live:** ${result.liveUrl}\n`;
      markdown += `- **Screenshots:** ${result.localScreenshot}, ${result.liveScreenshot}\n`;
      markdown += `- **Content Issues:** ${result.contentComparison.issues.length}\n`;
      markdown += `- **Interaction Issues:** ${result.interactions.issues.length}\n\n`;
    });

    return markdown;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const tester = new QATester();
  
  try {
    await tester.init();
    await tester.runAllTests();
    const report = await tester.generateReport();
    
    console.log('\n🎉 QA Testing Complete!');
    console.log(`📊 Summary: ${report.summary.pagesWithIssues}/${report.summary.totalPages} pages have issues`);
    
  } catch (error) {
    console.error('❌ QA Testing failed:', error);
  } finally {
    await tester.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { QATester, CONFIG, PAGES_TO_TEST };

/**
 * Tests for the content export reporter
 */

import {
  generateExportReport,
  formatReportAsText,
  formatReportAsMarkdown,
  generateQuickSummary,
  ExportReportOptions
} from './export-reporter';
import { ValidationResult } from './validation-runner';

describe('Export Reporter', () => {
  const mockValidationResults: ValidationResult[] = [
    {
      valid: true,
      errors: [],
      warnings: ['SEO description too short: 58 characters. Recommended min: 120.'],
      metadata: {
        contentType: 'project',
        slug: 'test-project',
        title: 'Test Project',
        validationTime: 15,
        checksPerformed: ['Schema validation', 'Front-matter validation', 'MDX validation']
      }
    },
    {
      valid: true,
      errors: [],
      warnings: ['Title (65 chars) is longer than recommended 60 characters'],
      metadata: {
        contentType: 'post',
        slug: 'test-blog-post',
        title: 'Test Blog Post with a Very Long Title That Exceeds Recommended Length',
        validationTime: 12,
        checksPerformed: ['Schema validation', 'Front-matter validation', 'MDX validation']
      }
    },
    {
      valid: false,
      errors: ['Missing or empty required field: title', 'Invalid slug format: Invalid_Slug!. Must contain only lowercase letters, numbers, and hyphens.'],
      warnings: ['SEO description is missing, using content title as fallback'],
      metadata: {
        contentType: 'page',
        slug: 'invalid-page',
        title: 'Invalid Page',
        validationTime: 8,
        checksPerformed: ['Schema validation', 'Front-matter validation']
      }
    },
    {
      valid: false,
      errors: ['Unclosed code block detected'],
      warnings: ['Content is short (25 words), consider adding more detail'],
      metadata: {
        contentType: 'project',
        slug: 'broken-project',
        title: 'Broken Project',
        validationTime: 20,
        checksPerformed: ['Schema validation', 'Front-matter validation', 'MDX validation']
      }
    }
  ];

  describe('generateExportReport', () => {
    test('should generate comprehensive export report', () => {
      const report = generateExportReport(mockValidationResults);
      
      expect(report.summary.total).toBe(4);
      expect(report.summary.successful).toBe(2);
      expect(report.summary.failed).toBe(2);
      expect(report.summary.successRate).toBe(50);
      expect(report.summary.totalErrors).toBe(3);
      expect(report.summary.totalWarnings).toBe(4);
      expect(report.summary.processingTime).toBeGreaterThanOrEqual(0);
    });

    test('should group content by type', () => {
      const report = generateExportReport(mockValidationResults);
      
      expect(report.summary.contentTypes.project).toBeDefined();
      expect(report.summary.contentTypes.post).toBeDefined();
      expect(report.summary.contentTypes.page).toBeDefined();
      
      expect(report.summary.contentTypes.project.total).toBe(2);
      expect(report.summary.contentTypes.project.successful).toBe(1);
      expect(report.summary.contentTypes.project.failed).toBe(1);
      
      expect(report.summary.contentTypes.post.total).toBe(1);
      expect(report.summary.contentTypes.post.successful).toBe(1);
      expect(report.summary.contentTypes.post.failed).toBe(0);
      
      expect(report.summary.contentTypes.page.total).toBe(1);
      expect(report.summary.contentTypes.page.successful).toBe(0);
      expect(report.summary.contentTypes.page.failed).toBe(1);
    });

    test('should categorize items by status', () => {
      const report = generateExportReport(mockValidationResults);
      
      expect(report.details.successful).toHaveLength(2);
      expect(report.details.failed).toHaveLength(2);
      
      expect(report.details.successful[0].title).toBe('Test Project');
      expect(report.details.successful[1].title).toBe('Test Blog Post with a Very Long Title That Exceeds Recommended Length');
      
      expect(report.details.failed[0].title).toBe('Invalid Page');
      expect(report.details.failed[1].title).toBe('Broken Project');
    });

    test('should group errors and warnings by type', () => {
      const report = generateExportReport(mockValidationResults);
      
      expect(report.details.errors.length).toBeGreaterThan(0);
      expect(report.details.warnings.length).toBeGreaterThan(0);
      
      // Check that errors are grouped
      const errorTypes = report.details.errors.map(e => e.type);
      expect(errorTypes).toContain('Missing or empty required field');
      expect(errorTypes).toContain('Invalid slug format');
      expect(errorTypes).toContain('Unclosed code block detected');
      
      // Check that warnings are grouped
      const warningTypes = report.details.warnings.map(w => w.type);
      expect(warningTypes).toContain('SEO description too short');
      expect(warningTypes).toContain('Title (65 chars) is longer than recommended 60 characters');
      expect(warningTypes).toContain('SEO description is missing, using content title as fallback');
      expect(warningTypes).toContain('Content is short (25 words), consider adding more detail');
    });

    test('should include metadata', () => {
      const report = generateExportReport(mockValidationResults);
      
      expect(report.metadata.generatedAt).toBeDefined();
      expect(report.metadata.version).toBe('1.0.0');
      expect(report.metadata.options).toBeDefined();
    });

    test('should handle empty results', () => {
      const report = generateExportReport([]);
      
      expect(report.summary.total).toBe(0);
      expect(report.summary.successful).toBe(0);
      expect(report.summary.failed).toBe(0);
      expect(report.summary.successRate).toBe(0);
      expect(report.summary.totalErrors).toBe(0);
      expect(report.summary.totalWarnings).toBe(0);
      expect(report.details.successful).toHaveLength(0);
      expect(report.details.failed).toHaveLength(0);
      expect(report.details.errors).toHaveLength(0);
      expect(report.details.warnings).toHaveLength(0);
    });

    test('should respect report options', () => {
      const options: ExportReportOptions = {
        includeDetails: false,
        includeTiming: false,
        includeWarnings: false,
        includeMetadata: false
      };
      
      const report = generateExportReport(mockValidationResults, options);
      
      expect(report.summary.processingTime).toBe(0);
      expect(report.metadata.version).toBe('1.0.0'); // Version is always included
    });
  });

  describe('formatReportAsText', () => {
    test('should format report as text', () => {
      const report = generateExportReport(mockValidationResults);
      const textReport = formatReportAsText(report);
      
      expect(textReport).toContain('CONTENT EXPORT REPORT');
      expect(textReport).toContain('SUMMARY');
      expect(textReport).toContain('Total Items: 4');
      expect(textReport).toContain('Successful: 2');
      expect(textReport).toContain('Failed: 2');
      expect(textReport).toContain('Success Rate: 50.0%');
      expect(textReport).toContain('CONTENT TYPES');
      expect(textReport).toContain('PROJECT:');
      expect(textReport).toContain('POST:');
      expect(textReport).toContain('PAGE:');
      expect(textReport).toContain('ERROR SUMMARY');
      expect(textReport).toContain('WARNING SUMMARY');
      expect(textReport).toContain('FAILED ITEMS');
      expect(textReport).toContain('SUCCESSFUL ITEMS');
      expect(textReport).toContain('END OF REPORT');
    });

    test('should include error details', () => {
      const report = generateExportReport(mockValidationResults);
      const textReport = formatReportAsText(report);
      
      expect(textReport).toContain('Missing or empty required field');
      expect(textReport).toContain('Invalid slug format');
      expect(textReport).toContain('Unclosed code block detected');
    });

    test('should include warning details', () => {
      const report = generateExportReport(mockValidationResults);
      const textReport = formatReportAsText(report);
      
      expect(textReport).toContain('SEO description too short');
      expect(textReport).toContain('Title (65 chars) is longer than recommended');
      expect(textReport).toContain('Content is short');
    });

    test('should include failed items details', () => {
      const report = generateExportReport(mockValidationResults);
      const textReport = formatReportAsText(report);
      
      expect(textReport).toContain('1. Invalid Page (page)');
      expect(textReport).toContain('2. Broken Project (project)');
      expect(textReport).toContain('Slug: invalid-page');
      expect(textReport).toContain('Slug: broken-project');
    });

    test('should include successful items summary', () => {
      const report = generateExportReport(mockValidationResults);
      const textReport = formatReportAsText(report);
      
      expect(textReport).toContain('Total: 2 items');
      expect(textReport).toContain('1. Test Project (project) - test-project');
      expect(textReport).toContain('2. Test Blog Post with a Very Long Title That Exceeds Recommended Length (post) - test-blog-post');
    });
  });

  describe('formatReportAsMarkdown', () => {
    test('should format report as markdown', () => {
      const report = generateExportReport(mockValidationResults);
      const markdownReport = formatReportAsMarkdown(report);
      
      expect(markdownReport).toContain('# Content Export Report');
      expect(markdownReport).toContain('## Summary');
      expect(markdownReport).toContain('| Metric | Value |');
      expect(markdownReport).toContain('| Total Items | 4 |');
      expect(markdownReport).toContain('| Successful | 2 |');
      expect(markdownReport).toContain('| Failed | 2 |');
      expect(markdownReport).toContain('| Success Rate | 50.0% |');
      expect(markdownReport).toContain('## Content Types');
      expect(markdownReport).toContain('| Type | Total | Successful | Failed | Errors | Warnings |');
      expect(markdownReport).toContain('| project | 2 | 1 | 1 | 1 | 2 |');
      expect(markdownReport).toContain('| post | 1 | 1 | 0 | 0 | 1 |');
      expect(markdownReport).toContain('| page | 1 | 0 | 1 | 2 | 1 |');
    });

    test('should include error sections', () => {
      const report = generateExportReport(mockValidationResults);
      const markdownReport = formatReportAsMarkdown(report);
      
      expect(markdownReport).toContain('## Error Summary');
      expect(markdownReport).toContain('### Missing or empty required field');
      expect(markdownReport).toContain('### Invalid slug format');
      expect(markdownReport).toContain('### Unclosed code block detected');
    });

    test('should include warning sections', () => {
      const report = generateExportReport(mockValidationResults);
      const markdownReport = formatReportAsMarkdown(report);
      
      expect(markdownReport).toContain('## Warning Summary');
      expect(markdownReport).toContain('### SEO description too short');
      expect(markdownReport).toContain('### Title (65 chars) is longer than recommended');
      expect(markdownReport).toContain('### Content is short');
    });

    test('should include failed items section', () => {
      const report = generateExportReport(mockValidationResults);
      const markdownReport = formatReportAsMarkdown(report);
      
      expect(markdownReport).toContain('## Failed Items');
      expect(markdownReport).toContain('### 1. Invalid Page (page)');
      expect(markdownReport).toContain('### 2. Broken Project (project)');
      expect(markdownReport).toContain('- **Slug:** invalid-page');
      expect(markdownReport).toContain('- **Slug:** broken-project');
    });

    test('should include successful items table', () => {
      const report = generateExportReport(mockValidationResults);
      const markdownReport = formatReportAsMarkdown(report);
      
      expect(markdownReport).toContain('## Successful Items');
      expect(markdownReport).toContain('**Total:** 2 items');
      expect(markdownReport).toContain('| Title | Type | Slug |');
      expect(markdownReport).toContain('| Test Project | project | test-project |');
      expect(markdownReport).toContain('| Test Blog Post with a Very Long Title That Exceeds Recommended Length | post | test-blog-post |');
    });
  });

  describe('generateQuickSummary', () => {
    test('should generate quick summary', () => {
      const summary = generateQuickSummary(mockValidationResults);
      
      expect(summary).toContain('Export Summary: 2/4 successful (50.0%)');
      expect(summary).toContain('3 errors');
      expect(summary).toContain('4 warnings');
    });

    test('should handle empty results', () => {
      const summary = generateQuickSummary([]);
      
      expect(summary).toContain('Export Summary: 0/0 successful (0.0%)');
      expect(summary).toContain('0 errors');
      expect(summary).toContain('0 warnings');
    });

    test('should handle all successful results', () => {
      const successfulResults = mockValidationResults.filter(r => r.valid);
      const summary = generateQuickSummary(successfulResults);
      
      expect(summary).toContain('Export Summary: 2/2 successful (100.0%)');
      expect(summary).toContain('0 errors');
      expect(summary).toContain('2 warnings');
    });

    test('should handle all failed results', () => {
      const failedResults = mockValidationResults.filter(r => !r.valid);
      const summary = generateQuickSummary(failedResults);
      
      expect(summary).toContain('Export Summary: 0/2 successful (0.0%)');
      expect(summary).toContain('3 errors');
      expect(summary).toContain('2 warnings');
    });
  });

  describe('integration tests', () => {
    test('should generate complete report workflow', () => {
      const report = generateExportReport(mockValidationResults);
      const textReport = formatReportAsText(report);
      const markdownReport = formatReportAsMarkdown(report);
      const quickSummary = generateQuickSummary(mockValidationResults);
      
      // Verify all formats are generated
      expect(report).toBeDefined();
      expect(textReport).toBeDefined();
      expect(markdownReport).toBeDefined();
      expect(quickSummary).toBeDefined();
      
      // Verify consistency across formats
      expect(textReport).toContain('Total Items: 4');
      expect(markdownReport).toContain('| Total Items | 4 |');
      expect(quickSummary).toContain('2/4 successful');
    });

    test('should handle large datasets', () => {
      // Create a large dataset
      const largeResults: ValidationResult[] = [];
      for (let i = 0; i < 100; i++) {
        largeResults.push({
          valid: i % 2 === 0,
          errors: i % 2 === 0 ? [] : [`Error ${i}`],
          warnings: [`Warning ${i}`],
          metadata: {
            contentType: i % 3 === 0 ? 'project' : i % 3 === 1 ? 'post' : 'page',
            slug: `item-${i}`,
            title: `Item ${i}`,
            validationTime: i,
            checksPerformed: ['Schema validation', 'Front-matter validation']
          }
        });
      }
      
      const report = generateExportReport(largeResults);
      
      expect(report.summary.total).toBe(100);
      expect(report.summary.successful).toBe(50);
      expect(report.summary.failed).toBe(50);
      expect(report.summary.successRate).toBe(50);
      expect(report.summary.totalErrors).toBe(50);
      expect(report.summary.totalWarnings).toBe(100);
    });
  });
});

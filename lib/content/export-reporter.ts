/**
 * Content export reporter for WordPress to Next.js migration
 * Generates comprehensive reports with success/failure counts and error summaries
 */

import { ContentType } from './schema';
import { ValidationResult, BatchValidationResult } from './validation-runner';
import { SanitizationResult } from './html-sanitizer';

export interface ExportReportOptions {
  includeDetails?: boolean;
  includeTiming?: boolean;
  includeWarnings?: boolean;
  includeMetadata?: boolean;
  format?: 'text' | 'json' | 'markdown';
  groupByType?: boolean;
  groupByStatus?: boolean;
}

export interface ExportReport {
  summary: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
    totalErrors: number;
    totalWarnings: number;
    processingTime: number;
    contentTypes: {
      [key: string]: {
        total: number;
        successful: number;
        failed: number;
        errors: number;
        warnings: number;
      };
    };
  };
  details: {
    successful: ExportItem[];
    failed: ExportItem[];
    errors: ExportError[];
    warnings: ExportWarning[];
  };
  metadata: {
    generatedAt: string;
    version: string;
    options: ExportReportOptions;
  };
}

export interface ExportItem {
  title: string;
  slug: string;
  type: string;
  status: 'success' | 'failed';
  errors: string[];
  warnings: string[];
  processingTime: number;
  checksPerformed: string[];
}

export interface ExportError {
  type: string;
  message: string;
  count: number;
  items: string[];
}

export interface ExportWarning {
  type: string;
  message: string;
  count: number;
  items: string[];
}

/**
 * Generates a comprehensive export report from validation results
 * @param results - Array of validation results
 * @param options - Report generation options
 * @returns Comprehensive export report
 */
export function generateExportReport(
  results: ValidationResult[],
  options: ExportReportOptions = {}
): ExportReport {
  const {
    includeDetails = true,
    includeTiming = true,
    includeWarnings = true,
    includeMetadata = true,
    groupByType = true,
    groupByStatus = true
  } = options;

  const startTime = Date.now();
  
  // Calculate summary statistics
  const total = results.length;
  const successful = results.filter(r => r.valid).length;
  const failed = total - successful;
  const successRate = total > 0 ? (successful / total) * 100 : 0;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const processingTime = Date.now() - startTime;

  // Group by content type
  const contentTypes: { [key: string]: any } = {};
  results.forEach(result => {
    const type = result.metadata.contentType;
    if (!contentTypes[type]) {
      contentTypes[type] = {
        total: 0,
        successful: 0,
        failed: 0,
        errors: 0,
        warnings: 0
      };
    }
    contentTypes[type].total++;
    if (result.valid) {
      contentTypes[type].successful++;
    } else {
      contentTypes[type].failed++;
    }
    contentTypes[type].errors += result.errors.length;
    contentTypes[type].warnings += result.warnings.length;
  });

  // Generate detailed items
  const successfulItems: ExportItem[] = [];
  const failedItems: ExportItem[] = [];
  
  results.forEach(result => {
    const item: ExportItem = {
      title: result.metadata.title,
      slug: result.metadata.slug,
      type: result.metadata.contentType,
      status: result.valid ? 'success' : 'failed',
      errors: result.errors,
      warnings: result.warnings,
      processingTime: result.metadata.validationTime,
      checksPerformed: result.metadata.checksPerformed
    };

    if (result.valid) {
      successfulItems.push(item);
    } else {
      failedItems.push(item);
    }
  });

  // Generate error and warning summaries
  const errorMap = new Map<string, { count: number; items: string[] }>();
  const warningMap = new Map<string, { count: number; items: string[] }>();

  results.forEach(result => {
    result.errors.forEach(error => {
      const key = error.split(':')[0] || error; // Group by error type
      if (!errorMap.has(key)) {
        errorMap.set(key, { count: 0, items: [] });
      }
      const entry = errorMap.get(key)!;
      entry.count++;
      entry.items.push(`${result.metadata.title} (${result.metadata.slug})`);
    });

    result.warnings.forEach(warning => {
      const key = warning.split(':')[0] || warning; // Group by warning type
      if (!warningMap.has(key)) {
        warningMap.set(key, { count: 0, items: [] });
      }
      const entry = warningMap.get(key)!;
      entry.count++;
      entry.items.push(`${result.metadata.title} (${result.metadata.slug})`);
    });
  });

  const errors: ExportError[] = Array.from(errorMap.entries()).map(([type, data]) => ({
    type,
    message: type,
    count: data.count,
    items: data.items
  }));

  const warnings: ExportWarning[] = Array.from(warningMap.entries()).map(([type, data]) => ({
    type,
    message: type,
    count: data.count,
    items: data.items
  }));

  return {
    summary: {
      total,
      successful,
      failed,
      successRate,
      totalErrors,
      totalWarnings,
      processingTime,
      contentTypes
    },
    details: {
      successful: successfulItems,
      failed: failedItems,
      errors,
      warnings
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      options
    }
  };
}

/**
 * Formats the export report as text
 * @param report - Export report to format
 * @returns Formatted text report
 */
export function formatReportAsText(report: ExportReport): string {
  const lines: string[] = [];
  
  // Header
  lines.push('='.repeat(80));
  lines.push('CONTENT EXPORT REPORT');
  lines.push('='.repeat(80));
  lines.push(`Generated: ${new Date(report.metadata.generatedAt).toLocaleString()}`);
  lines.push(`Version: ${report.metadata.version}`);
  lines.push('');

  // Summary
  lines.push('SUMMARY');
  lines.push('-'.repeat(40));
  lines.push(`Total Items: ${report.summary.total}`);
  lines.push(`Successful: ${report.summary.successful}`);
  lines.push(`Failed: ${report.summary.failed}`);
  lines.push(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
  lines.push(`Total Errors: ${report.summary.totalErrors}`);
  lines.push(`Total Warnings: ${report.summary.totalWarnings}`);
  lines.push(`Processing Time: ${report.summary.processingTime}ms`);
  lines.push('');

  // Content Types Summary
  lines.push('CONTENT TYPES');
  lines.push('-'.repeat(40));
  Object.entries(report.summary.contentTypes).forEach(([type, stats]) => {
    lines.push(`${type.toUpperCase()}:`);
    lines.push(`  Total: ${stats.total}`);
    lines.push(`  Successful: ${stats.successful}`);
    lines.push(`  Failed: ${stats.failed}`);
    lines.push(`  Errors: ${stats.errors}`);
    lines.push(`  Warnings: ${stats.warnings}`);
    lines.push('');
  });

  // Error Summary
  if (report.details.errors.length > 0) {
    lines.push('ERROR SUMMARY');
    lines.push('-'.repeat(40));
    report.details.errors
      .sort((a, b) => b.count - a.count)
      .forEach(error => {
        lines.push(`${error.type} (${error.count} occurrences):`);
        error.items.slice(0, 5).forEach(item => {
          lines.push(`  - ${item}`);
        });
        if (error.items.length > 5) {
          lines.push(`  ... and ${error.items.length - 5} more`);
        }
        lines.push('');
      });
  }

  // Warning Summary
  if (report.details.warnings.length > 0) {
    lines.push('WARNING SUMMARY');
    lines.push('-'.repeat(40));
    report.details.warnings
      .sort((a, b) => b.count - a.count)
      .forEach(warning => {
        lines.push(`${warning.type} (${warning.count} occurrences):`);
        warning.items.slice(0, 5).forEach(item => {
          lines.push(`  - ${item}`);
        });
        if (warning.items.length > 5) {
          lines.push(`  ... and ${warning.items.length - 5} more`);
        }
        lines.push('');
      });
  }

  // Failed Items Details
  if (report.details.failed.length > 0) {
    lines.push('FAILED ITEMS');
    lines.push('-'.repeat(40));
    report.details.failed.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.title} (${item.type})`);
      lines.push(`   Slug: ${item.slug}`);
      lines.push(`   Processing Time: ${item.processingTime}ms`);
      lines.push(`   Checks Performed: ${item.checksPerformed.join(', ')}`);
      if (item.errors.length > 0) {
        lines.push(`   Errors (${item.errors.length}):`);
        item.errors.forEach(error => {
          lines.push(`     - ${error}`);
        });
      }
      if (item.warnings.length > 0) {
        lines.push(`   Warnings (${item.warnings.length}):`);
        item.warnings.forEach(warning => {
          lines.push(`     - ${warning}`);
        });
      }
      lines.push('');
    });
  }

  // Successful Items Summary
  if (report.details.successful.length > 0) {
    lines.push('SUCCESSFUL ITEMS');
    lines.push('-'.repeat(40));
    lines.push(`Total: ${report.details.successful.length} items`);
    lines.push('');
    report.details.successful.slice(0, 10).forEach((item, index) => {
      lines.push(`${index + 1}. ${item.title} (${item.type}) - ${item.slug}`);
    });
    if (report.details.successful.length > 10) {
      lines.push(`... and ${report.details.successful.length - 10} more`);
    }
  }

  lines.push('');
  lines.push('='.repeat(80));
  lines.push('END OF REPORT');
  lines.push('='.repeat(80));

  return lines.join('\n');
}

/**
 * Formats the export report as markdown
 * @param report - Export report to format
 * @returns Formatted markdown report
 */
export function formatReportAsMarkdown(report: ExportReport): string {
  const lines: string[] = [];
  
  // Header
  lines.push('# Content Export Report');
  lines.push('');
  lines.push(`**Generated:** ${new Date(report.metadata.generatedAt).toLocaleString()}`);
  lines.push(`**Version:** ${report.metadata.version}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Total Items | ${report.summary.total} |`);
  lines.push(`| Successful | ${report.summary.successful} |`);
  lines.push(`| Failed | ${report.summary.failed} |`);
  lines.push(`| Success Rate | ${report.summary.successRate.toFixed(1)}% |`);
  lines.push(`| Total Errors | ${report.summary.totalErrors} |`);
  lines.push(`| Total Warnings | ${report.summary.totalWarnings} |`);
  lines.push(`| Processing Time | ${report.summary.processingTime}ms |`);
  lines.push('');

  // Content Types Summary
  lines.push('## Content Types');
  lines.push('');
  lines.push('| Type | Total | Successful | Failed | Errors | Warnings |');
  lines.push('|------|-------|------------|--------|--------|----------|');
  Object.entries(report.summary.contentTypes).forEach(([type, stats]) => {
    lines.push(`| ${type} | ${stats.total} | ${stats.successful} | ${stats.failed} | ${stats.errors} | ${stats.warnings} |`);
  });
  lines.push('');

  // Error Summary
  if (report.details.errors.length > 0) {
    lines.push('## Error Summary');
    lines.push('');
    report.details.errors
      .sort((a, b) => b.count - a.count)
      .forEach(error => {
        lines.push(`### ${error.type} (${error.count} occurrences)`);
        lines.push('');
        error.items.slice(0, 10).forEach(item => {
          lines.push(`- ${item}`);
        });
        if (error.items.length > 10) {
          lines.push(`- ... and ${error.items.length - 10} more`);
        }
        lines.push('');
      });
  }

  // Warning Summary
  if (report.details.warnings.length > 0) {
    lines.push('## Warning Summary');
    lines.push('');
    report.details.warnings
      .sort((a, b) => b.count - a.count)
      .forEach(warning => {
        lines.push(`### ${warning.type} (${warning.count} occurrences)`);
        lines.push('');
        warning.items.slice(0, 10).forEach(item => {
          lines.push(`- ${item}`);
        });
        if (warning.items.length > 10) {
          lines.push(`- ... and ${warning.items.length - 10} more`);
        }
        lines.push('');
      });
  }

  // Failed Items Details
  if (report.details.failed.length > 0) {
    lines.push('## Failed Items');
    lines.push('');
    report.details.failed.forEach((item, index) => {
      lines.push(`### ${index + 1}. ${item.title} (${item.type})`);
      lines.push('');
      lines.push(`- **Slug:** ${item.slug}`);
      lines.push(`- **Processing Time:** ${item.processingTime}ms`);
      lines.push(`- **Checks Performed:** ${item.checksPerformed.join(', ')}`);
      lines.push('');
      
      if (item.errors.length > 0) {
        lines.push('**Errors:**');
        lines.push('');
        item.errors.forEach(error => {
          lines.push(`- ${error}`);
        });
        lines.push('');
      }
      
      if (item.warnings.length > 0) {
        lines.push('**Warnings:**');
        lines.push('');
        item.warnings.forEach(warning => {
          lines.push(`- ${warning}`);
        });
        lines.push('');
      }
    });
  }

  // Successful Items Summary
  if (report.details.successful.length > 0) {
    lines.push('## Successful Items');
    lines.push('');
    lines.push(`**Total:** ${report.details.successful.length} items`);
    lines.push('');
    lines.push('| Title | Type | Slug |');
    lines.push('|-------|------|------|');
    report.details.successful.forEach(item => {
      lines.push(`| ${item.title} | ${item.type} | ${item.slug} |`);
    });
  }

  return lines.join('\n');
}

/**
 * Saves the export report to a file
 * @param report - Export report to save
 * @param filename - Output filename
 * @param format - Output format
 */
export async function saveExportReport(
  report: ExportReport,
  filename: string,
  format: 'text' | 'json' | 'markdown' = 'text'
): Promise<void> {
  const fs = await import('fs/promises');
  
  let content: string;
  switch (format) {
    case 'json':
      content = JSON.stringify(report, null, 2);
      break;
    case 'markdown':
      content = formatReportAsMarkdown(report);
      break;
    case 'text':
    default:
      content = formatReportAsText(report);
      break;
  }

  await fs.writeFile(filename, content, 'utf8');
}

/**
 * Generates a quick summary report
 * @param results - Array of validation results
 * @returns Quick summary string
 */
export function generateQuickSummary(results: ValidationResult[]): string {
  const total = results.length;
  const successful = results.filter(r => r.valid).length;
  const failed = total - successful;
  const successRate = total > 0 ? (successful / total) * 100 : 0;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  return `Export Summary: ${successful}/${total} successful (${successRate.toFixed(1)}%), ${totalErrors} errors, ${totalWarnings} warnings`;
}

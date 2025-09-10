#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * MDX Error Parser
 * Analyzes MDX files for common HTML/MDX parsing errors and generates detailed logs
 */

class MDXErrorParser {
  constructor() {
    this.errors = [];
    this.fileStats = {};
  }

  /**
   * Parse a single MDX file for errors
   */
  parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const fileErrors = [];

    // Check for common HTML/MDX issues
    this.checkUnclosedTags(content, lines, filePath, fileErrors);
    this.checkMalformedAttributes(content, lines, filePath, fileErrors);
    this.checkHTMLEntities(content, lines, filePath, fileErrors);
    this.checkInvalidSyntax(content, lines, filePath, fileErrors);
    this.checkNestedIssues(content, lines, filePath, fileErrors);

    if (fileErrors.length > 0) {
      this.errors.push({
        file: filePath,
        errors: fileErrors
      });
    }

    this.fileStats[filePath] = {
      totalLines: lines.length,
      errorCount: fileErrors.length,
      hasErrors: fileErrors.length > 0
    };

    return fileErrors;
  }

  /**
   * Check for unclosed HTML tags
   */
  checkUnclosedTags(content, lines, filePath, fileErrors) {
    const tagStack = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(content)) !== null) {
      const fullTag = match[0];
      const tagName = match[1];
      const isClosing = fullTag.startsWith('</');
      const isSelfClosing = fullTag.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName);

      if (isSelfClosing) continue;

      if (isClosing) {
        if (tagStack.length === 0) {
          const lineNum = this.getLineNumber(content, match.index);
          fileErrors.push({
            type: 'unclosed_tag',
            severity: 'error',
            line: lineNum,
            message: `Unexpected closing tag </${tagName}> without matching opening tag`,
            context: lines[lineNum - 1]?.trim(),
            suggestion: `Remove the closing tag or add opening tag <${tagName}>`
          });
        } else {
          const lastTag = tagStack.pop();
          if (lastTag.name !== tagName) {
            const lineNum = this.getLineNumber(content, match.index);
            fileErrors.push({
              type: 'mismatched_tag',
              severity: 'error',
              line: lineNum,
              message: `Mismatched tags: expected </${lastTag.name}> but found </${tagName}>`,
              context: lines[lineNum - 1]?.trim(),
              suggestion: `Change </${tagName}> to </${lastTag.name}> or fix the opening tag`
            });
          }
        }
      } else {
        tagStack.push({
          name: tagName,
          position: match.index
        });
      }
    }

    // Check for unclosed opening tags
    tagStack.forEach(tag => {
      const lineNum = this.getLineNumber(content, tag.position);
      fileErrors.push({
        type: 'unclosed_tag',
        severity: 'error',
        line: lineNum,
        message: `Unclosed opening tag <${tag.name}>`,
        context: lines[lineNum - 1]?.trim(),
        suggestion: `Add closing tag </${tag.name}>`
      });
    });
  }

  /**
   * Check for malformed HTML attributes
   */
  checkMalformedAttributes(content, lines, filePath, fileErrors) {
    // Check for unquoted attributes
    const unquotedAttrRegex = /\s([a-zA-Z-]+)=([^"'\s>]+)(?=\s|>)/g;
    let match;

    while ((match = unquotedAttrRegex.exec(content)) !== null) {
      const lineNum = this.getLineNumber(content, match.index);
      fileErrors.push({
        type: 'malformed_attribute',
        severity: 'warning',
        line: lineNum,
        message: `Unquoted attribute value: ${match[1]}="${match[2]}"`,
        context: lines[lineNum - 1]?.trim(),
        suggestion: `Quote the attribute value: ${match[1]}="${match[2]}"`
      });
    }

    // Check for malformed href attributes
    const hrefRegex = /href\s*=\s*["']?([^"'\s>]+)["']?/g;
    while ((match = hrefRegex.exec(content)) !== null) {
      const href = match[1];
      if (href.includes(' ') && !href.startsWith('"') && !href.startsWith("'")) {
        const lineNum = this.getLineNumber(content, match.index);
        fileErrors.push({
          type: 'malformed_attribute',
          severity: 'error',
          line: lineNum,
          message: `Malformed href attribute with spaces: ${href}`,
          context: lines[lineNum - 1]?.trim(),
          suggestion: `Quote the href attribute: href="${href}"`
        });
      }
    }
  }

  /**
   * Check for HTML entities that should be converted
   */
  checkHTMLEntities(content, lines, filePath, fileErrors) {
    const entityRegex = /&#[0-9]+;|&[a-zA-Z]+;/g;
    let match;

    while ((match = entityRegex.exec(content)) !== null) {
      const entity = match[0];
      const lineNum = this.getLineNumber(content, match.index);
      
      // Skip common valid entities
      if (['&amp;', '&lt;', '&gt;', '&quot;', '&apos;'].includes(entity)) continue;

      fileErrors.push({
        type: 'html_entity',
        severity: 'info',
        line: lineNum,
        message: `HTML entity found: ${entity}`,
        context: lines[lineNum - 1]?.trim(),
        suggestion: `Consider converting to regular character (e.g., &#8217; → ')`
      });
    }
  }

  /**
   * Check for invalid MDX syntax
   */
  checkInvalidSyntax(content, lines, filePath, fileErrors) {
    // Check for style tags (not allowed in MDX)
    const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/g;
    let match;

    while ((match = styleRegex.exec(content)) !== null) {
      const lineNum = this.getLineNumber(content, match.index);
      fileErrors.push({
        type: 'invalid_syntax',
        severity: 'error',
        line: lineNum,
        message: 'Style tags are not allowed in MDX',
        context: lines[lineNum - 1]?.trim(),
        suggestion: 'Move styles to CSS files or use styled-components'
      });
    }

    // Check for script tags
    const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/g;
    while ((match = scriptRegex.exec(content)) !== null) {
      const lineNum = this.getLineNumber(content, match.index);
      fileErrors.push({
        type: 'invalid_syntax',
        severity: 'error',
        line: lineNum,
        message: 'Script tags are not allowed in MDX',
        context: lines[lineNum - 1]?.trim(),
        suggestion: 'Move JavaScript to separate files or use MDX components'
      });
    }
  }

  /**
   * Check for nested structure issues
   */
  checkNestedIssues(content, lines, filePath, fileErrors) {
    // Check for paragraph tags inside other block elements
    const pInBlockRegex = /<(div|section|article|header|footer|main|aside|nav)[^>]*>[\s\S]*?<p[^>]*>/g;
    let match;

    while ((match = pInBlockRegex.exec(content)) !== null) {
      const lineNum = this.getLineNumber(content, match.index);
      fileErrors.push({
        type: 'nested_issue',
        severity: 'warning',
        line: lineNum,
        message: `Paragraph tag inside ${match[1]} element`,
        context: lines[lineNum - 1]?.trim(),
        suggestion: 'Consider removing paragraph tags or restructuring the HTML'
      });
    }
  }

  /**
   * Get line number from character index
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * Parse all MDX files in a directory
   */
  parseDirectory(dirPath) {
    const files = this.getMDXFiles(dirPath);
    console.log(`Found ${files.length} MDX files to analyze...`);

    files.forEach(file => {
      console.log(`Analyzing: ${file}`);
      this.parseFile(file);
    });
  }

  /**
   * Get all MDX files recursively
   */
  getMDXFiles(dirPath) {
    const files = [];
    
    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.mdx')) {
          files.push(fullPath);
        }
      });
    };

    scanDir(dirPath);
    return files;
  }

  /**
   * Generate detailed error report
   */
  generateReport() {
    const report = {
      summary: {
        totalFiles: Object.keys(this.fileStats).length,
        filesWithErrors: this.errors.length,
        totalErrors: this.errors.reduce((sum, file) => sum + file.errors.length, 0),
        errorTypes: this.getErrorTypeCounts()
      },
      files: this.errors,
      stats: this.fileStats
    };

    return report;
  }

  /**
   * Get error type counts
   */
  getErrorTypeCounts() {
    const counts = {};
    this.errors.forEach(file => {
      file.errors.forEach(error => {
        counts[error.type] = (counts[error.type] || 0) + 1;
      });
    });
    return counts;
  }

  /**
   * Save report to file
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${outputPath}`);
  }

  /**
   * Print summary to console
   */
  printSummary() {
    const report = this.generateReport();
    
    console.log('\n' + '='.repeat(60));
    console.log('MDX ERROR ANALYSIS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files analyzed: ${report.summary.totalFiles}`);
    console.log(`Files with errors: ${report.summary.filesWithErrors}`);
    console.log(`Total errors found: ${report.summary.totalErrors}`);
    
    console.log('\nError types:');
    Object.entries(report.summary.errorTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    if (report.summary.filesWithErrors > 0) {
      console.log('\nFiles with errors:');
      this.errors.forEach(file => {
        console.log(`  ${file.file} (${file.errors.length} errors)`);
      });
    }
  }
}

// Main execution
if (require.main === module) {
  const parser = new MDXErrorParser();
  const contentDir = path.join(__dirname, '..', 'content');
  const outputFile = path.join(__dirname, '..', 'mdx-error-report.json');

  console.log('Starting MDX error analysis...');
  parser.parseDirectory(contentDir);
  parser.printSummary();
  parser.saveReport(outputFile);
}

module.exports = MDXErrorParser;

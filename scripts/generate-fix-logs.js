#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate individual fix logs for the most critical MDX files
 * Focuses on the files that are causing build failures
 */

// Files that are currently causing build failures (from our earlier analysis)
const criticalFiles = [
  'content/page/build-messaging-that-customers-value/index.mdx',
  'content/page/marketing-strategy/index.mdx', 
  'content/page/polything-marketing-consultancy/index.mdx',
  'content/post/client-relationship-management/index.mdx',
  'content/post/digital-marketing-courses-for-free/index.mdx',
  'content/post/easy-growth-marketing/index.mdx',
  'content/post/implementation-of-marketing-plans/index.mdx',
  'content/post/introduction-to-strategic-marketing-consultancy/index.mdx',
  'content/post/marketing-automation-and-technology/index.mdx',
  'content/post/marketing-metrics-to-measure-dtc/index.mdx',
  'content/post/measuring-marketing-effectiveness/index.mdx',
  'content/post/seo-for-better-online-visibility/index.mdx',
  'content/post/starting-with-growth-marketing/index.mdx',
  'content/project/blackriver-ramps-xmas/index.mdx'
];

function analyzeFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const errors = [];

  // Check for specific build-breaking issues
  checkUnclosedTags(content, lines, errors);
  checkMalformedHTML(content, lines, errors);
  checkInvalidSyntax(content, lines, errors);

  return {
    file: filePath,
    totalLines: lines.length,
    errors: errors,
    hasErrors: errors.length > 0
  };
}

function checkUnclosedTags(content, lines, errors) {
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
        const lineNum = getLineNumber(content, match.index);
        errors.push({
          type: 'unclosed_tag',
          severity: 'error',
          line: lineNum,
          message: `Unexpected closing tag </${tagName}> without matching opening tag`,
          context: lines[lineNum - 1]?.trim(),
          fix: `Remove the closing tag or add opening tag <${tagName}>`
        });
      } else {
        const lastTag = tagStack.pop();
        if (lastTag.name !== tagName) {
          const lineNum = getLineNumber(content, match.index);
          errors.push({
            type: 'mismatched_tag',
            severity: 'error',
            line: lineNum,
            message: `Mismatched tags: expected </${lastTag.name}> but found </${tagName}>`,
            context: lines[lineNum - 1]?.trim(),
            fix: `Change </${tagName}> to </${lastTag.name}> or fix the opening tag`
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
    const lineNum = getLineNumber(content, tag.position);
    errors.push({
      type: 'unclosed_tag',
      severity: 'error',
      line: lineNum,
      message: `Unclosed opening tag <${tag.name}>`,
      context: lines[lineNum - 1]?.trim(),
      fix: `Add closing tag </${tag.name}>`
    });
  });
}

function checkMalformedHTML(content, lines, errors) {
  // Check for malformed href attributes
  const hrefRegex = /href\s*=\s*["']?([^"'\s>]+)["']?/g;
  let match;

  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.includes(' ') && !href.startsWith('"') && !href.startsWith("'")) {
      const lineNum = getLineNumber(content, match.index);
      errors.push({
        type: 'malformed_attribute',
        severity: 'error',
        line: lineNum,
        message: `Malformed href attribute with spaces: ${href}`,
        context: lines[lineNum - 1]?.trim(),
        fix: `Quote the href attribute: href="${href}"`
      });
    }
  }

  // Check for unclosed anchor tags
  const anchorRegex = /<a[^>]*href[^>]*>/g;
  while ((match = anchorRegex.exec(content)) !== null) {
    const afterAnchor = content.substring(match.index + match[0].length);
    const nextTag = afterAnchor.match(/<\/a>|<a[^>]*>/);
    
    if (nextTag && nextTag[0].startsWith('<a')) {
      const lineNum = getLineNumber(content, match.index);
      errors.push({
        type: 'unclosed_tag',
        severity: 'error',
        line: lineNum,
        message: 'Unclosed anchor tag - found another <a> before </a>',
        context: lines[lineNum - 1]?.trim(),
        fix: 'Add closing </a> tag or fix the anchor structure'
      });
    }
  }
}

function checkInvalidSyntax(content, lines, errors) {
  // Check for style tags
  const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/g;
  let match;

  while ((match = styleRegex.exec(content)) !== null) {
    const lineNum = getLineNumber(content, match.index);
    errors.push({
      type: 'invalid_syntax',
      severity: 'error',
      line: lineNum,
      message: 'Style tags are not allowed in MDX',
      context: lines[lineNum - 1]?.trim(),
      fix: 'Move styles to CSS files or use styled-components'
    });
  }

  // Check for script tags
  const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/g;
  while ((match = scriptRegex.exec(content)) !== null) {
    const lineNum = getLineNumber(content, match.index);
    errors.push({
      type: 'invalid_syntax',
      severity: 'error',
      line: lineNum,
      message: 'Script tags are not allowed in MDX',
      context: lines[lineNum - 1]?.trim(),
      fix: 'Move JavaScript to separate files or use MDX components'
    });
  }
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

function generateFixLog(fileAnalysis) {
  if (!fileAnalysis || !fileAnalysis.hasErrors) {
    return null;
  }

  const log = [];
  log.push(`# Fix Log: ${fileAnalysis.file}`);
  log.push(`Generated: ${new Date().toISOString()}`);
  log.push(`Total Lines: ${fileAnalysis.totalLines}`);
  log.push(`Errors Found: ${fileAnalysis.errors.length}`);
  log.push('');

  // Group errors by type
  const errorsByType = {};
  fileAnalysis.errors.forEach(error => {
    if (!errorsByType[error.type]) {
      errorsByType[error.type] = [];
    }
    errorsByType[error.type].push(error);
  });

  // Generate fix instructions for each error type
  Object.entries(errorsByType).forEach(([type, errors]) => {
    log.push(`## ${type.toUpperCase()} ERRORS (${errors.length} found)`);
    log.push('');

    errors.forEach((error, index) => {
      log.push(`### Error ${index + 1} - Line ${error.line}`);
      log.push(`**Message:** ${error.message}`);
      log.push(`**Context:** \`${error.context}\``);
      log.push(`**Fix:** ${error.fix}`);
      log.push('');
    });
  });

  // Generate summary fix instructions
  log.push('## SUMMARY FIX INSTRUCTIONS');
  log.push('');

  if (errorsByType.unclosed_tag) {
    log.push('1. **Fix unclosed tags:**');
    log.push('   - Add missing closing tags for all opening tags');
    log.push('   - Remove orphaned closing tags');
    log.push('   - Ensure proper tag nesting');
    log.push('');
  }

  if (errorsByType.mismatched_tag) {
    log.push('2. **Fix mismatched tags:**');
    log.push('   - Check that opening and closing tags match');
    log.push('   - Fix any incorrectly nested tags');
    log.push('');
  }

  if (errorsByType.malformed_attribute) {
    log.push('3. **Fix malformed attributes:**');
    log.push('   - Quote all attribute values');
    log.push('   - Fix href attributes with spaces');
    log.push('');
  }

  if (errorsByType.invalid_syntax) {
    log.push('4. **Remove invalid syntax:**');
    log.push('   - Remove <style> and <script> tags');
    log.push('   - Move styles to CSS files');
    log.push('   - Move JavaScript to separate files');
    log.push('');
  }

  return log.join('\n');
}

function main() {
  console.log('Generating fix logs for critical MDX files...\n');

  const logsDir = path.join(__dirname, '..', 'fix-logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  criticalFiles.forEach(filePath => {
    console.log(`Analyzing: ${filePath}`);
    const analysis = analyzeFile(filePath);
    
    if (analysis && analysis.hasErrors) {
      const fixLog = generateFixLog(analysis);
      const logFileName = filePath.replace(/\//g, '_').replace('.mdx', '.md');
      const logPath = path.join(logsDir, logFileName);
      
      fs.writeFileSync(logPath, fixLog);
      console.log(`  ✅ Generated fix log: ${logFileName} (${analysis.errors.length} errors)`);
    } else {
      console.log(`  ✅ No critical errors found`);
    }
  });

  console.log(`\nFix logs generated in: ${logsDir}`);
  console.log('\nNext steps:');
  console.log('1. Review the generated fix logs');
  console.log('2. Apply the fixes to each file');
  console.log('3. Run the build again to verify fixes');
}

if (require.main === module) {
  main();
}

module.exports = { analyzeFile, generateFixLog };

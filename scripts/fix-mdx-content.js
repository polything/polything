#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix common MDX issues
function fixMdxContent(content) {
  let fixed = content;
  
  // Fix unclosed <br> tags by making them self-closing
  fixed = fixed.replace(/<br>/g, '<br />');
  
  // Remove HTML comments (MDX doesn't support them)
  fixed = fixed.replace(/<!--[\s\S]*?-->/g, '');
  
  // Fix malformed attributes with spaces before the attribute name
  fixed = fixed.replace(/\s+rel="noopener"/g, ' rel="noopener"');
  
  // Fix malformed href attributes
  fixed = fixed.replace(/href="([^"]*)\s+rel="noopener"/g, 'href="$1" rel="noopener"');
  
  // Fix self-closing img tags that might be malformed
  fixed = fixed.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
  
  // Fix any remaining malformed tags by ensuring proper closing
  // This is a more aggressive fix for common issues
  fixed = fixed.replace(/<([^>]+)>\s*<\/\1>/g, ''); // Remove empty tags
  
  return fixed;
}

// Function to process all MDX files
function processMdxFiles(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processMdxFiles(filePath);
    } else if (file.endsWith('.mdx')) {
      console.log(`Processing: ${filePath}`);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixed = fixMdxContent(content);
        
        if (content !== fixed) {
          fs.writeFileSync(filePath, fixed, 'utf8');
          console.log(`  ✓ Fixed issues in ${filePath}`);
        } else {
          console.log(`  - No issues found in ${filePath}`);
        }
      } catch (error) {
        console.error(`  ✗ Error processing ${filePath}:`, error.message);
      }
    }
  }
}

// Main execution
const contentDir = path.join(__dirname, '..', 'content');
console.log('Starting MDX content fixes...');
processMdxFiles(contentDir);
console.log('MDX content fixes completed!');

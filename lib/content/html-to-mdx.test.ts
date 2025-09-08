/**
 * @jest-environment node
 */

import {
  convertHTMLToMDX,
  validateMDXContent,
  ConversionOptions
} from './html-to-mdx';

describe('HTML to MDX Converter', () => {
  const sampleHTMLContent = `
    <div class="wp-block-group">
      <h2 class="wp-block-heading">Sample Heading</h2>
      <p class="wp-block-paragraph">This is a <strong>sample paragraph</strong> with <em>formatting</em>.</p>
      <img src="https://polything.co.uk/wp-content/uploads/2024/01/image.jpg" alt="Sample image" class="wp-image-123">
      <ul class="wp-block-list">
        <li>First item</li>
        <li>Second item</li>
      </ul>
      <blockquote class="wp-block-quote">
        <p>This is a quote</p>
      </blockquote>
      <pre class="wp-block-code"><code>console.log('Hello World');</code></pre>
      <a href="https://example.com" class="wp-block-button">Click here</a>
    </div>
  `;

  const sampleHTMLWithEmbeds = `
    <div>
      <h1>Video Content</h1>
      <iframe src="https://www.youtube.com/embed/abc123" width="560" height="315" frameborder="0" allowfullscreen></iframe>
      <embed src="https://example.com/embed.swf" type="application/x-shockwave-flash">
    </div>
  `;

  describe('convertHTMLToMDX', () => {
    test('should convert basic HTML to MDX format', () => {
      const result = convertHTMLToMDX(sampleHTMLContent);
      
      expect(result.errors).toHaveLength(0);
      expect(result.content).toContain('## Sample Heading');
      expect(result.content).toContain('**sample paragraph**');
      expect(result.content).toContain('*formatting*');
      expect(result.content).toContain('- First item');
      expect(result.content).toContain('- Second item');
      expect(result.content).toContain('> This is a quote');
      expect(result.content).toContain('```');
      expect(result.content).toContain('console.log');
      expect(result.content).toContain('[Click here](https://example.com)');
    });

    test('should extract media references', () => {
      const result = convertHTMLToMDX(sampleHTMLContent);
      
      expect(result.mediaReferences).toContain('https://polything.co.uk/wp-content/uploads/2024/01/image.jpg');
    });

    test('should convert WordPress uploads URLs to local paths', () => {
      const result = convertHTMLToMDX(sampleHTMLContent);
      
      expect(result.content).toContain('/images/2024/01/image.jpg');
      expect(result.content).not.toContain('wp-content/uploads');
    });

    test('should preserve embeds when requested', () => {
      const result = convertHTMLToMDX(sampleHTMLWithEmbeds, { preserveEmbeds: true });
      
      expect(result.content).toContain('<iframe');
      expect(result.content).toContain('youtube.com');
      expect(result.content).toContain('<embed');
    });

    test('should remove embeds when not requested', () => {
      const result = convertHTMLToMDX(sampleHTMLWithEmbeds, { preserveEmbeds: false });
      
      expect(result.content).not.toContain('<iframe');
      expect(result.content).not.toContain('<embed');
    });

    test('should remove WordPress classes when requested', () => {
      const result = convertHTMLToMDX(sampleHTMLContent, { removeWordPressClasses: true });
      
      expect(result.content).not.toContain('wp-block-');
      expect(result.content).not.toContain('wp-image-');
    });

    test('should handle empty content', () => {
      const result = convertHTMLToMDX('');
      
      expect(result.content).toBe('');
      expect(result.mediaReferences).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    test('should handle null/undefined content', () => {
      const result1 = convertHTMLToMDX(null as any);
      const result2 = convertHTMLToMDX(undefined as any);
      
      expect(result1.errors).toContain('Invalid HTML content provided');
      expect(result2.errors).toContain('Invalid HTML content provided');
    });

    test('should handle complex HTML structure', () => {
      const complexHTML = `
        <div class="wp-block-group">
          <h1>Main Title</h1>
          <div class="wp-block-columns">
            <div class="wp-block-column">
              <h2>Column 1</h2>
              <p>Content in column 1</p>
            </div>
            <div class="wp-block-column">
              <h2>Column 2</h2>
              <p>Content in column 2</p>
            </div>
          </div>
          <img src="https://polything.co.uk/wp-content/uploads/2024/01/hero.jpg" alt="Hero">
        </div>
      `;
      
      const result = convertHTMLToMDX(complexHTML);
      
      expect(result.errors).toHaveLength(0);
      expect(result.content).toContain('# Main Title');
      expect(result.content).toContain('## Column 1');
      expect(result.content).toContain('## Column 2');
      expect(result.content).toContain('/images/2024/01/hero.jpg');
    });

    test('should handle HTML entities', () => {
      const htmlWithEntities = `
        <p>This &amp; that &lt;b&gt;bold&lt;/b&gt; text with &quot;quotes&quot; and &nbsp;spaces.</p>
      `;
      
      const result = convertHTMLToMDX(htmlWithEntities);
      
      expect(result.content).toContain('This & that <b>bold</b> text with "quotes" and  spaces.');
    });

    test('should handle nested lists', () => {
      const nestedListHTML = `
        <ul>
          <li>First item
            <ul>
              <li>Nested item 1</li>
              <li>Nested item 2</li>
            </ul>
          </li>
          <li>Second item</li>
        </ul>
      `;
      
      const result = convertHTMLToMDX(nestedListHTML);
      
      expect(result.content).toContain('- First item');
      expect(result.content).toContain('- Nested item 1');
      expect(result.content).toContain('- Nested item 2');
      expect(result.content).toContain('- Second item');
    });

    test('should handle code blocks and inline code', () => {
      const codeHTML = `
        <p>Use <code>console.log()</code> to debug.</p>
        <pre><code>function hello() {
  console.log('Hello World');
}</code></pre>
      `;
      
      const result = convertHTMLToMDX(codeHTML);
      
      expect(result.content).toContain('`console.log()`');
      expect(result.content).toContain('```');
      expect(result.content).toContain('function hello()');
    });

    test('should handle links with various attributes', () => {
      const linkHTML = `
        <p>Visit <a href="https://example.com" target="_blank" rel="noopener">our website</a> for more info.</p>
        <a href="/internal-page" class="button">Internal Link</a>
      `;
      
      const result = convertHTMLToMDX(linkHTML);
      
      expect(result.content).toContain('[our website](https://example.com)');
      expect(result.content).toContain('[Internal Link](/internal-page)');
    });

    test('should handle mixed content types', () => {
      const mixedHTML = `
        <h1>Title</h1>
        <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <img src="https://polything.co.uk/wp-content/uploads/2024/01/image.jpg" alt="Image">
        <ul>
          <li>List item</li>
        </ul>
        <blockquote>
          <p>Quote text</p>
        </blockquote>
        <pre><code>Code block</code></pre>
        <a href="https://example.com">Link</a>
      `;
      
      const result = convertHTMLToMDX(mixedHTML);
      
      expect(result.errors).toHaveLength(0);
      expect(result.content).toContain('# Title');
      expect(result.content).toContain('**bold**');
      expect(result.content).toContain('*italic*');
      expect(result.content).toContain('/images/2024/01/image.jpg');
      expect(result.content).toContain('- List item');
      expect(result.content).toContain('> Quote text');
      expect(result.content).toContain('```');
      expect(result.content).toContain('[Link](https://example.com)');
    });
  });

  describe('validateMDXContent', () => {
    test('should validate correct MDX content', () => {
      const validMDX = `
# Title

This is a **bold** and *italic* text.

- List item 1
- List item 2

> This is a quote

\`\`\`
Code block
\`\`\`
      `;
      
      const result = validateMDXContent(validMDX);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect unclosed code blocks', () => {
      const invalidMDX = `
# Title

\`\`\`
Unclosed code block
      `;
      
      const result = validateMDXContent(invalidMDX);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unclosed code block detected');
    });

    test('should detect unclosed inline code', () => {
      const invalidMDX = `
# Title

This has \`unclosed inline code.
      `;
      
      const result = validateMDXContent(invalidMDX);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unclosed inline code detected');
    });

    test('should warn about unclosed bold formatting', () => {
      const invalidMDX = `
# Title

This has **unclosed bold formatting.
      `;
      
      const result = validateMDXContent(invalidMDX);
      
      expect(result.valid).toBe(true); // Still valid, just a warning
      expect(result.warnings).toContain('Unclosed bold formatting detected');
    });

    test('should warn about unclosed italic formatting', () => {
      const invalidMDX = `
# Title

This has *unclosed italic formatting.
      `;
      
      const result = validateMDXContent(invalidMDX);
      
      expect(result.valid).toBe(true); // Still valid, just a warning
      expect(result.warnings).toContain('Unclosed italic formatting detected');
    });

    test('should warn about excessive line breaks', () => {
      const invalidMDX = `
# Title




Too many line breaks.
      `;
      
      const result = validateMDXContent(invalidMDX);
      
      expect(result.valid).toBe(true); // Still valid, just a warning
      expect(result.warnings).toContain('Excessive line breaks detected');
    });

    test('should handle empty content', () => {
      const result = validateMDXContent('');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Content is empty or invalid');
    });

    test('should handle null/undefined content', () => {
      const result1 = validateMDXContent(null as any);
      const result2 = validateMDXContent(undefined as any);
      
      expect(result1.valid).toBe(false);
      expect(result2.valid).toBe(false);
      expect(result1.errors).toContain('Content is empty or invalid');
      expect(result2.errors).toContain('Content is empty or invalid');
    });
  });

  describe('Conversion options', () => {
    test('should respect preserveImages option', () => {
      const htmlWithImages = '<img src="https://example.com/image.jpg" alt="Test">';
      
      const resultWithImages = convertHTMLToMDX(htmlWithImages, { preserveImages: true });
      const resultWithoutImages = convertHTMLToMDX(htmlWithImages, { preserveImages: false });
      
      expect(resultWithImages.mediaReferences).toContain('https://example.com/image.jpg');
      expect(resultWithoutImages.mediaReferences).toHaveLength(0);
    });

    test('should respect convertToMDX option', () => {
      const htmlContent = '<p>This is a <strong>bold</strong> paragraph.</p>';
      
      const resultWithMDX = convertHTMLToMDX(htmlContent, { convertToMDX: true });
      const resultWithoutMDX = convertHTMLToMDX(htmlContent, { convertToMDX: false });
      
      expect(resultWithMDX.content).toContain('**bold**');
      expect(resultWithoutMDX.content).toContain('<strong>bold</strong>');
    });

    test('should respect removeWordPressClasses option', () => {
      const htmlWithClasses = '<div class="wp-block-group">Content</div>';
      
      const resultWithRemoval = convertHTMLToMDX(htmlWithClasses, { removeWordPressClasses: true, convertToMDX: false });
      const resultWithoutRemoval = convertHTMLToMDX(htmlWithClasses, { removeWordPressClasses: false, convertToMDX: false });
      
      expect(resultWithRemoval.content).not.toContain('wp-block-group');
      expect(resultWithoutRemoval.content).toContain('wp-block-group');
    });
  });
});

/**
 * Tests for the enhanced HTML sanitizer
 */

import {
  sanitizeHTMLContent,
  sanitizeHTMLContentBatch,
  SanitizationOptions
} from './html-sanitizer';

describe('HTML Sanitizer', () => {
  const sampleWordPressHTML = `
    <div class="wp-block-group has-background">
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

  const htmlWithBrokenLinks = `
    <div>
      <a href="/relative-link">Relative Link</a>
      <a href="https://polything.co.uk/wp-content/uploads/image.jpg">WP Upload Link</a>
      <a href="https://polything.co.uk/wp-admin/edit.php">Admin Link</a>
      <a href="mailto:invalid-email">Invalid Email</a>
      <a href="tel:invalid-phone">Invalid Phone</a>
    </div>
  `;

  const htmlWithEmptyElements = `
    <div>
      <p></p>
      <p><br/></p>
      <div class="empty"></div>
      <span></span>
      <h1></h1>
      <ul></ul>
      <p>Valid content</p>
    </div>
  `;

  describe('sanitizeHTMLContent', () => {
    test('should sanitize WordPress HTML content', () => {
      const result = sanitizeHTMLContent(sampleWordPressHTML);
      
      expect(result.content).not.toContain('wp-block-group');
      expect(result.content).not.toContain('has-background');
      expect(result.content).not.toContain('wp-block-heading');
      expect(result.content).not.toContain('wp-block-paragraph');
      expect(result.content).not.toContain('wp-image-123');
      expect(result.content).not.toContain('wp-block-list');
      expect(result.content).not.toContain('wp-block-quote');
      expect(result.content).not.toContain('wp-block-code');
      expect(result.content).not.toContain('wp-block-button');
      expect(result.removedClasses.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should fix broken links', () => {
      const result = sanitizeHTMLContent(htmlWithBrokenLinks, { baseUrl: 'https://polything.co.uk' });
      
      expect(result.content).toContain('href="https://polything.co.uk/relative-link"');
      expect(result.content).toContain('href="/images/image.jpg"');
      expect(result.content).toContain('href="#"'); // Admin link should be fixed
      expect(result.content).toContain('href="#"'); // Invalid email should be fixed
      expect(result.content).toContain('href="#"'); // Invalid phone should be fixed
      expect(result.fixedLinks.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should remove empty elements', () => {
      const result = sanitizeHTMLContent(htmlWithEmptyElements, { removeEmptyElements: true });
      
      expect(result.content).not.toContain('<p></p>');
      expect(result.content).not.toContain('<p><br/></p>');
      expect(result.content).not.toContain('<div class="empty"></div>');
      expect(result.content).not.toContain('<span></span>');
      expect(result.content).not.toContain('<h1></h1>');
      expect(result.content).not.toContain('<ul></ul>');
      expect(result.content).toContain('<p>Valid content</p>'); // Should preserve valid content
      expect(result.removedElements.length).toBeGreaterThan(0);
    });

    test('should normalize whitespace', () => {
      const htmlWithExcessiveWhitespace = `
        <div>   Multiple    spaces   </div>
        <p>
        
        Line breaks
        
        </p>
      `;
      
      const result = sanitizeHTMLContent(htmlWithExcessiveWhitespace, { normalizeWhitespace: true });
      
      expect(result.content).not.toContain('   Multiple    spaces   ');
      expect(result.content).toContain('Multiple spaces');
      expect(result.content).not.toContain('\n\n\n');
    });

    test('should preserve embeds and images when requested', () => {
      const htmlWithMedia = `
        <div>
          <img src="/images/test.jpg" alt="Test image">
          <iframe src="https://youtube.com/embed/123"></iframe>
          <embed src="/flash.swf">
        </div>
      `;
      
      const result = sanitizeHTMLContent(htmlWithMedia, { preserveEmbeds: true, preserveImages: true });
      
      expect(result.content).toContain('<img');
      expect(result.content).toContain('<iframe');
      expect(result.content).toContain('<embed');
    });

    test('should handle invalid input gracefully', () => {
      const result1 = sanitizeHTMLContent('');
      const result2 = sanitizeHTMLContent(null as any);
      const result3 = sanitizeHTMLContent(undefined as any);
      
      expect(result1.content).toBe('');
      expect(result1.warnings).toContain('Invalid HTML content provided');
      
      expect(result2.content).toBe('');
      expect(result2.warnings).toContain('Invalid HTML content provided');
      
      expect(result3.content).toBe('');
      expect(result3.warnings).toContain('Invalid HTML content provided');
    });

    test('should respect sanitization options', () => {
      const options: SanitizationOptions = {
        removeWordPressClasses: false,
        fixBrokenLinks: false,
        removeEmptyElements: false,
        normalizeWhitespace: false
      };
      
      const result = sanitizeHTMLContent(sampleWordPressHTML, options);
      
      // Should preserve WordPress classes when option is disabled
      expect(result.content).toContain('wp-block-group');
      expect(result.content).toContain('has-background');
      expect(result.removedClasses).toHaveLength(0);
      expect(result.fixedLinks).toHaveLength(0);
      expect(result.removedElements).toHaveLength(0);
    });

    test('should remove WordPress block comments', () => {
      const htmlWithComments = `
        <!-- wp:paragraph -->
        <p>Content</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading -->
        <h2>Heading</h2>
        <!-- /wp:heading -->
      `;
      
      const result = sanitizeHTMLContent(htmlWithComments);
      
      expect(result.content).not.toContain('<!-- wp:paragraph -->');
      expect(result.content).not.toContain('<!-- /wp:paragraph -->');
      expect(result.content).not.toContain('<!-- wp:heading -->');
      expect(result.content).not.toContain('<!-- /wp:heading -->');
      expect(result.content).toContain('<p>Content</p>');
      expect(result.content).toContain('<h2>Heading</h2>');
    });

    test('should remove WordPress data attributes', () => {
      const htmlWithDataAttributes = `
        <div data-wp-block="group" data-block-id="123" data-custom="value">
          <p data-wp-paragraph="true">Content</p>
        </div>
      `;
      
      const result = sanitizeHTMLContent(htmlWithDataAttributes);
      
      expect(result.content).not.toContain('data-wp-block');
      expect(result.content).not.toContain('data-block-id');
      expect(result.content).not.toContain('data-wp-paragraph');
      expect(result.content).toContain('<div>');
      expect(result.content).toContain('<p>Content</p>');
    });

    test('should remove WordPress IDs', () => {
      const htmlWithIDs = `
        <div id="wp-block-123">
          <h2 id="wp-heading-456">Heading</h2>
          <p id="block-789">Content</p>
        </div>
      `;
      
      const result = sanitizeHTMLContent(htmlWithIDs);
      
      expect(result.content).not.toContain('id="wp-block-123"');
      expect(result.content).not.toContain('id="wp-heading-456"');
      expect(result.content).not.toContain('id="block-789"');
      expect(result.content).toContain('<div>');
      expect(result.content).toContain('<h2>Heading</h2>');
      expect(result.content).toContain('<p>Content</p>');
    });

    test('should validate email addresses', () => {
      const htmlWithEmails = `
        <a href="mailto:valid@example.com">Valid Email</a>
        <a href="mailto:invalid-email">Invalid Email</a>
        <a href="mailto:another@domain.co.uk">Another Valid</a>
      `;
      
      const result = sanitizeHTMLContent(htmlWithEmails);
      
      expect(result.content).toContain('href="mailto:valid@example.com"');
      expect(result.content).toContain('href="mailto:another@domain.co.uk"');
      expect(result.content).toContain('href="#"'); // Invalid email should be fixed
      expect(result.warnings).toContain('Fixed invalid email link: invalid-email');
    });

    test('should validate phone numbers', () => {
      const htmlWithPhones = `
        <a href="tel:+1234567890">Valid Phone</a>
        <a href="tel:invalid-phone">Invalid Phone</a>
        <a href="tel:+44-20-7946-0958">UK Phone</a>
      `;
      
      const result = sanitizeHTMLContent(htmlWithPhones);
      
      expect(result.content).toContain('href="tel:+1234567890"');
      expect(result.content).toContain('href="tel:+44-20-7946-0958"');
      expect(result.content).toContain('href="#"'); // Invalid phone should be fixed
      expect(result.warnings).toContain('Fixed invalid phone link: invalid-phone');
    });
  });

  describe('sanitizeHTMLContentBatch', () => {
    test('should sanitize multiple HTML contents', () => {
      const htmlContents = [sampleWordPressHTML, htmlWithBrokenLinks, htmlWithEmptyElements];
      const result = sanitizeHTMLContentBatch(htmlContents);
      
      expect(result.results).toHaveLength(3);
      expect(result.summary.total).toBe(3);
      expect(result.summary.processed).toBe(3);
      expect(result.summary.totalWarnings).toBeGreaterThan(0);
      expect(result.summary.totalRemovedClasses).toBeGreaterThan(0);
      expect(result.summary.totalFixedLinks).toBeGreaterThan(0);
      expect(result.summary.totalRemovedElements).toBeGreaterThan(0);
    });

    test('should handle empty batch', () => {
      const result = sanitizeHTMLContentBatch([]);
      
      expect(result.results).toHaveLength(0);
      expect(result.summary.total).toBe(0);
      expect(result.summary.processed).toBe(0);
      expect(result.summary.totalWarnings).toBe(0);
      expect(result.summary.totalErrors).toBe(0);
    });

    test('should apply options to all items in batch', () => {
      const htmlContents = [sampleWordPressHTML, htmlWithBrokenLinks];
      const options: SanitizationOptions = {
        removeWordPressClasses: false,
        fixBrokenLinks: true
      };
      
      const result = sanitizeHTMLContentBatch(htmlContents, options);
      
      expect(result.results).toHaveLength(2);
      // First item should preserve WordPress classes
      expect(result.results[0].content).toContain('wp-block-group');
      expect(result.results[0].removedClasses).toHaveLength(0);
      // Second item should fix links
      expect(result.results[1].fixedLinks.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    test('should handle malformed HTML', () => {
      const malformedHTML = `
        <div>
          <p>Unclosed paragraph
          <img src="test.jpg" alt="Test
          <a href="test">Unclosed link
        </div>
      `;
      
      const result = sanitizeHTMLContent(malformedHTML);
      
      expect(result.content).toBeDefined();
      expect(result.errors).toHaveLength(0); // Should not throw errors
    });

    test('should handle HTML with special characters', () => {
      const htmlWithSpecialChars = `
        <div>
          <p>Content with &amp; entities</p>
          <p>Content with &lt; and &gt; symbols</p>
          <p>Content with &quot;quotes&quot; and &apos;apostrophes&apos;</p>
        </div>
      `;
      
      const result = sanitizeHTMLContent(htmlWithSpecialChars);
      
      expect(result.content).toContain('& entities');
      expect(result.content).toContain('< and > symbols');
      expect(result.content).toContain('"quotes" and \'apostrophes\'');
    });

    test('should handle very large HTML content', () => {
      const largeHTML = '<div>' + '<p>Content</p>'.repeat(1000) + '</div>';
      
      const result = sanitizeHTMLContent(largeHTML);
      
      expect(result.content).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(result.content).toContain('<p>Content</p>');
    });
  });
});

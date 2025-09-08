// Test sitemap functionality without contentlayer dependency
describe('Sitemap', () => {
  it('should export sitemap function', () => {
    // Test that the sitemap file exists and exports a function
    const sitemapModule = require('./sitemap-simple')
    expect(typeof sitemapModule.default).toBe('function')
  })

  it('should have correct base URL', () => {
    // Test that the sitemap uses the correct base URL
    const sitemapModule = require('./sitemap-simple')
    const result = sitemapModule.default()
    
    // Should contain the base URL
    expect(result.some(item => item.url === 'https://polything.co.uk')).toBe(true)
  })

  it('should include static routes', () => {
    const sitemapModule = require('./sitemap-simple')
    const result = sitemapModule.default()
    
    // Check for key static routes
    const urls = result.map(item => item.url)
    expect(urls).toContain('https://polything.co.uk')
    expect(urls).toContain('https://polything.co.uk/work')
    expect(urls).toContain('https://polything.co.uk/blog')
  })

  it('should have correct priority for homepage', () => {
    const sitemapModule = require('./sitemap-simple')
    const result = sitemapModule.default()
    
    const homepage = result.find(item => item.url === 'https://polything.co.uk')
    expect(homepage?.priority).toBe(1)
  })

  it('should have correct change frequency for homepage', () => {
    const sitemapModule = require('./sitemap-simple')
    const result = sitemapModule.default()
    
    const homepage = result.find(item => item.url === 'https://polything.co.uk')
    expect(homepage?.changeFrequency).toBe('weekly')
  })

  it('should return array of sitemap entries', () => {
    const sitemapModule = require('./sitemap-simple')
    const result = sitemapModule.default()
    
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should have valid sitemap entry structure', () => {
    const sitemapModule = require('./sitemap-simple')
    const result = sitemapModule.default()
    
    const entry = result[0]
    expect(entry).toHaveProperty('url')
    expect(entry).toHaveProperty('lastModified')
    expect(entry).toHaveProperty('changeFrequency')
    expect(entry).toHaveProperty('priority')
  })

  it('should have correct priority hierarchy', () => {
    const sitemapModule = require('./sitemap-simple')
    const result = sitemapModule.default()
    
    const homepage = result.find(item => item.url === 'https://polything.co.uk')
    const work = result.find(item => item.url === 'https://polything.co.uk/work')
    const contact = result.find(item => item.url === 'https://polything.co.uk/contact')
    const about = result.find(item => item.url === 'https://polything.co.uk/about')
    
    expect(homepage?.priority).toBe(1)
    expect(work?.priority).toBe(0.8)
    expect(contact?.priority).toBe(0.7)
    expect(about?.priority).toBe(0.6)
  })
})

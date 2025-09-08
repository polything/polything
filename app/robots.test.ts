import robots from './robots'

describe('Robots', () => {
  it('should generate robots.txt with correct structure', () => {
    const result = robots()
    
    expect(result).toHaveProperty('rules')
    expect(result).toHaveProperty('sitemap')
    expect(result).toHaveProperty('host')
  })

  it('should allow all user agents by default', () => {
    const result = robots()
    
    const defaultRule = result.rules.find(rule => rule.userAgent === '*')
    expect(defaultRule).toBeDefined()
    expect(defaultRule?.allow).toBe('/')
  })

  it('should disallow specific directories', () => {
    const result = robots()
    
    const defaultRule = result.rules.find(rule => rule.userAgent === '*')
    expect(defaultRule?.disallow).toContain('/api/')
    expect(defaultRule?.disallow).toContain('/_next/')
    expect(defaultRule?.disallow).toContain('/admin/')
    expect(defaultRule?.disallow).toContain('/private/')
  })

  it('should block AI crawlers', () => {
    const result = robots()
    
    const aiCrawlers = [
      'GPTBot',
      'ChatGPT-User',
      'CCBot',
      'anthropic-ai',
      'Claude-Web',
    ]
    
    aiCrawlers.forEach(crawler => {
      const rule = result.rules.find(rule => rule.userAgent === crawler)
      expect(rule).toBeDefined()
      expect(rule?.disallow).toBe('/')
    })
  })

  it('should include sitemap URL', () => {
    const result = robots()
    
    expect(result.sitemap).toBe('https://polything.co.uk/sitemap.xml')
  })

  it('should include host URL', () => {
    const result = robots()
    
    expect(result.host).toBe('https://polything.co.uk')
  })

  it('should have correct number of rules', () => {
    const result = robots()
    
    // 1 default rule + 5 AI crawler rules = 6 total
    expect(result.rules).toHaveLength(6)
  })
})

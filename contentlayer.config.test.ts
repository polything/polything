import { describe, it, expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Contentlayer Configuration', () => {
  it('should have contentlayer.config.ts file', () => {
    const configPath = path.join(process.cwd(), 'contentlayer.config.ts')
    expect(fs.existsSync(configPath)).toBe(true)
  })

  it('should export Post, Project, and Page document types', async () => {
    // Import the config dynamically to avoid ES module issues
    const config = await import('./contentlayer.config')
    
    expect(config.Post).toBeDefined()
    expect(config.Project).toBeDefined()
    expect(config.Page).toBeDefined()
    expect(config.default).toBeDefined()
  })

  it('should have correct file path patterns', async () => {
    const config = await import('./contentlayer.config')
    
    expect(config.Post.filePathPattern).toBe('posts/**/*.mdx')
    expect(config.Project.filePathPattern).toBe('projects/**/*.mdx')
    expect(config.Page.filePathPattern).toBe('pages/**/*.mdx')
  })

  it('should have correct content types', async () => {
    const config = await import('./contentlayer.config')
    
    expect(config.Post.contentType).toBe('mdx')
    expect(config.Project.contentType).toBe('mdx')
    expect(config.Page.contentType).toBe('mdx')
  })

  it('should have required fields for all document types', async () => {
    const config = await import('./contentlayer.config')
    
    // Check Post fields
    expect(config.Post.fields.title.required).toBe(true)
    expect(config.Post.fields.slug.required).toBe(true)
    expect(config.Post.fields.date.required).toBe(true)
    
    // Check Project fields
    expect(config.Project.fields.title.required).toBe(true)
    expect(config.Project.fields.slug.required).toBe(true)
    expect(config.Project.fields.date.required).toBe(true)
    
    // Check Page fields
    expect(config.Page.fields.title.required).toBe(true)
    expect(config.Page.fields.slug.required).toBe(true)
    expect(config.Page.fields.date.required).toBe(true)
  })

  it('should have computed URL fields', async () => {
    const config = await import('./contentlayer.config')
    
    expect(config.Post.computedFields.url).toBeDefined()
    expect(config.Project.computedFields.url).toBeDefined()
    expect(config.Page.computedFields.url).toBeDefined()
  })
})

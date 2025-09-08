import { describe, it, expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Blog Post Page', () => {
  it('should have blog post page file', () => {
    const pagePath = path.join(process.cwd(), 'app/blog/[slug]/page.tsx')
    expect(fs.existsSync(pagePath)).toBe(true)
  })

  it('should export generateStaticParams function', async () => {
    const pageModule = await import('./page')
    expect(typeof pageModule.generateStaticParams).toBe('function')
  })

  it('should export generateMetadata function', async () => {
    const pageModule = await import('./page')
    expect(typeof pageModule.generateMetadata).toBe('function')
  })

  it('should export default function', async () => {
    const pageModule = await import('./page')
    expect(typeof pageModule.default).toBe('function')
  })
})

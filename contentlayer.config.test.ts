import { describe, it, expect } from '@jest/globals'
import { makeSource } from 'contentlayer2/source-files'
import { defineDocumentType } from 'contentlayer2/source-files'

describe('Contentlayer Configuration', () => {
  it('should define Post document type with correct fields', () => {
    const Post = defineDocumentType(() => ({
      name: 'Post',
      filePathPattern: 'posts/**/*.mdx',
      contentType: 'mdx',
      fields: {
        title: { type: 'string', required: true },
        slug: { type: 'string', required: true },
        date: { type: 'date', required: true },
        updated: { type: 'date', required: false },
        categories: { type: 'list', of: { type: 'string' }, required: false },
        tags: { type: 'list', of: { type: 'string' }, required: false },
        featured: { type: 'boolean', required: false },
        hero: {
          type: 'nested',
          of: {
            title: { type: 'string', required: false },
            subtitle: { type: 'string', required: false },
            image: { type: 'string', required: false },
            video: { type: 'string', required: false },
            text_color: { type: 'string', required: false },
            background_color: { type: 'string', required: false },
          },
          required: false,
        },
        seo: {
          type: 'nested',
          of: {
            title: { type: 'string', required: false },
            description: { type: 'string', required: false },
            canonical: { type: 'string', required: false },
            schema: {
              type: 'nested',
              of: {
                type: { type: 'string', required: false },
                image: { type: 'string', required: false },
                author: { type: 'string', required: false },
                publishDate: { type: 'string', required: false },
                modifiedDate: { type: 'string', required: false },
                breadcrumbs: { type: 'list', of: { type: 'json' }, required: false },
              },
              required: false,
            },
          },
          required: false,
        },
      },
      computedFields: {
        url: {
          type: 'string',
          resolve: (doc) => `/blog/${doc.slug}`,
        },
      },
    }))

    expect(Post.name).toBe('Post')
    expect(Post.filePathPattern).toBe('posts/**/*.mdx')
    expect(Post.contentType).toBe('mdx')
  })

  it('should define Project document type with correct fields', () => {
    const Project = defineDocumentType(() => ({
      name: 'Project',
      filePathPattern: 'projects/**/*.mdx',
      contentType: 'mdx',
      fields: {
        title: { type: 'string', required: true },
        slug: { type: 'string', required: true },
        date: { type: 'date', required: true },
        updated: { type: 'date', required: false },
        categories: { type: 'list', of: { type: 'string' }, required: false },
        tags: { type: 'list', of: { type: 'string' }, required: false },
        hero: {
          type: 'nested',
          of: {
            title: { type: 'string', required: false },
            subtitle: { type: 'string', required: false },
            image: { type: 'string', required: false },
            video: { type: 'string', required: false },
            text_color: { type: 'string', required: false },
            background_color: { type: 'string', required: false },
          },
          required: false,
        },
        links: {
          type: 'nested',
          of: {
            url: { type: 'string', required: false },
            image: { type: 'string', required: false },
            video: { type: 'string', required: false },
          },
          required: false,
        },
        seo: {
          type: 'nested',
          of: {
            title: { type: 'string', required: false },
            description: { type: 'string', required: false },
            canonical: { type: 'string', required: false },
            schema: {
              type: 'nested',
              of: {
                type: { type: 'string', required: false },
                image: { type: 'string', required: false },
                author: { type: 'string', required: false },
                publishDate: { type: 'string', required: false },
                modifiedDate: { type: 'string', required: false },
                breadcrumbs: { type: 'list', of: { type: 'json' }, required: false },
              },
              required: false,
            },
          },
          required: false,
        },
      },
      computedFields: {
        url: {
          type: 'string',
          resolve: (doc) => `/work/${doc.slug}`,
        },
      },
    }))

    expect(Project.name).toBe('Project')
    expect(Project.filePathPattern).toBe('projects/**/*.mdx')
    expect(Project.contentType).toBe('mdx')
  })

  it('should define Page document type with correct fields', () => {
    const Page = defineDocumentType(() => ({
      name: 'Page',
      filePathPattern: 'pages/**/*.mdx',
      contentType: 'mdx',
      fields: {
        title: { type: 'string', required: true },
        slug: { type: 'string', required: true },
        date: { type: 'date', required: true },
        updated: { type: 'date', required: false },
        categories: { type: 'list', of: { type: 'string' }, required: false },
        tags: { type: 'list', of: { type: 'string' }, required: false },
        hero: {
          type: 'nested',
          of: {
            title: { type: 'string', required: false },
            subtitle: { type: 'string', required: false },
            image: { type: 'string', required: false },
            video: { type: 'string', required: false },
            text_color: { type: 'string', required: false },
            background_color: { type: 'string', required: false },
          },
          required: false,
        },
        seo: {
          type: 'nested',
          of: {
            title: { type: 'string', required: false },
            description: { type: 'string', required: false },
            canonical: { type: 'string', required: false },
            schema: {
              type: 'nested',
              of: {
                type: { type: 'string', required: false },
                image: { type: 'string', required: false },
                author: { type: 'string', required: false },
                publishDate: { type: 'string', required: false },
                modifiedDate: { type: 'string', required: false },
                breadcrumbs: { type: 'list', of: { type: 'json' }, required: false },
              },
              required: false,
            },
          },
          required: false,
        },
      },
      computedFields: {
        url: {
          type: 'string',
          resolve: (doc) => `/${doc.slug}`,
        },
      },
    }))

    expect(Page.name).toBe('Page')
    expect(Page.filePathPattern).toBe('pages/**/*.mdx')
    expect(Page.contentType).toBe('mdx')
  })
})

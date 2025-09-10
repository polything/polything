import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'post/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    type: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date', required: false },
    categories: { type: 'json', required: false },
    tags: { type: 'json', required: false },
    featured: { type: 'boolean', required: false },
    hero: { type: 'json', required: false },
    seo: { type: 'json', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc.slug}`,
    },
  },
}))

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'project/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    type: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date', required: false },
    categories: { type: 'json', required: false },
    tags: { type: 'json', required: false },
    hero: { type: 'json', required: false },
    links: { type: 'json', required: false },
    seo: { type: 'json', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/work/${doc.slug}`,
    },
  },
}))

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'page/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    type: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date', required: false },
    categories: { type: 'json', required: false },
    tags: { type: 'json', required: false },
    hero: { type: 'json', required: false },
    seo: { type: 'json', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        // Service pages go to /services/[slug]
        const serviceSlugs = ['marketing-strategy', 'marketing-services', 'business-mentoring'];
        if (serviceSlugs.includes(doc.slug)) {
          return `/services/${doc.slug}`;
        }
        return `/${doc.slug}`;
      },
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post, Project, Page],
})

// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "post/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    type: { type: "string", required: true },
    date: { type: "date", required: true },
    updated: { type: "date", required: false },
    categories: { type: "json", required: false },
    tags: { type: "json", required: false },
    featured: { type: "boolean", required: false },
    hero: { type: "json", required: false },
    seo: { type: "json", required: false }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc.slug}`
    }
  }
}));
var Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "project/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    type: { type: "string", required: true },
    date: { type: "date", required: true },
    updated: { type: "date", required: false },
    categories: { type: "json", required: false },
    tags: { type: "json", required: false },
    hero: { type: "json", required: false },
    links: { type: "json", required: false },
    seo: { type: "json", required: false }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/work/${doc.slug}`
    }
  }
}));
var Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "page/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    type: { type: "string", required: true },
    date: { type: "date", required: true },
    updated: { type: "date", required: false },
    categories: { type: "json", required: false },
    tags: { type: "json", required: false },
    hero: { type: "json", required: false },
    seo: { type: "json", required: false }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        const serviceSlugs = ["marketing-strategy", "marketing-services", "business-mentoring"];
        if (serviceSlugs.includes(doc.slug)) {
          return `/services/${doc.slug}`;
        }
        return `/${doc.slug}`;
      }
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "./content",
  documentTypes: [Post, Project, Page],
  ignore: [
    // Exclude problematic files from build
    "page/build-messaging-that-customers-value/index.mdx",
    "page/marketing-strategy/index.mdx",
    "page/polything-marketing-consultancy/index.mdx",
    "post/client-relationship-management/index.mdx",
    "post/digital-marketing-courses-for-free/index.mdx",
    "post/implementation-of-marketing-plans/index.mdx",
    "post/introduction-to-strategic-marketing-consultancy/index.mdx",
    "post/marketing-automation-and-technology/index.mdx",
    "post/marketing-metrics-to-measure-dtc/index.mdx",
    "post/measuring-marketing-effectiveness/index.mdx",
    "post/seo-for-better-online-visibility/index.mdx"
  ]
});
export {
  Page,
  Post,
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-TO3C576H.mjs.map

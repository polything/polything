// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    date: { type: "date", required: true },
    updated: { type: "date", required: false },
    categories: { type: "list", of: { type: "string" }, required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    featured: { type: "boolean", required: false },
    hero: {
      type: "nested",
      of: {
        title: { type: "string", required: false },
        subtitle: { type: "string", required: false },
        image: { type: "string", required: false },
        video: { type: "string", required: false },
        text_color: { type: "string", required: false },
        background_color: { type: "string", required: false }
      },
      required: false
    },
    seo: {
      type: "nested",
      of: {
        title: { type: "string", required: false },
        description: { type: "string", required: false },
        canonical: { type: "string", required: false },
        schema: {
          type: "nested",
          of: {
            type: { type: "string", required: false },
            image: { type: "string", required: false },
            author: { type: "string", required: false },
            publishDate: { type: "string", required: false },
            modifiedDate: { type: "string", required: false },
            breadcrumbs: { type: "list", of: { type: "json" }, required: false }
          },
          required: false
        }
      },
      required: false
    }
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
  filePathPattern: "projects/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    date: { type: "date", required: true },
    updated: { type: "date", required: false },
    categories: { type: "list", of: { type: "string" }, required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    hero: {
      type: "nested",
      of: {
        title: { type: "string", required: false },
        subtitle: { type: "string", required: false },
        image: { type: "string", required: false },
        video: { type: "string", required: false },
        text_color: { type: "string", required: false },
        background_color: { type: "string", required: false }
      },
      required: false
    },
    links: {
      type: "nested",
      of: {
        url: { type: "string", required: false },
        image: { type: "string", required: false },
        video: { type: "string", required: false }
      },
      required: false
    },
    seo: {
      type: "nested",
      of: {
        title: { type: "string", required: false },
        description: { type: "string", required: false },
        canonical: { type: "string", required: false },
        schema: {
          type: "nested",
          of: {
            type: { type: "string", required: false },
            image: { type: "string", required: false },
            author: { type: "string", required: false },
            publishDate: { type: "string", required: false },
            modifiedDate: { type: "string", required: false },
            breadcrumbs: { type: "list", of: { type: "json" }, required: false }
          },
          required: false
        }
      },
      required: false
    }
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
  filePathPattern: "pages/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    date: { type: "date", required: true },
    updated: { type: "date", required: false },
    categories: { type: "list", of: { type: "string" }, required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    hero: {
      type: "nested",
      of: {
        title: { type: "string", required: false },
        subtitle: { type: "string", required: false },
        image: { type: "string", required: false },
        video: { type: "string", required: false },
        text_color: { type: "string", required: false },
        background_color: { type: "string", required: false }
      },
      required: false
    },
    seo: {
      type: "nested",
      of: {
        title: { type: "string", required: false },
        description: { type: "string", required: false },
        canonical: { type: "string", required: false },
        schema: {
          type: "nested",
          of: {
            type: { type: "string", required: false },
            image: { type: "string", required: false },
            author: { type: "string", required: false },
            publishDate: { type: "string", required: false },
            modifiedDate: { type: "string", required: false },
            breadcrumbs: { type: "list", of: { type: "json" }, required: false }
          },
          required: false
        }
      },
      required: false
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/${doc.slug}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "./content",
  documentTypes: [Post, Project, Page]
});
export {
  Page,
  Post,
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-OFTUCDSP.mjs.map

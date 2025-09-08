import { MetadataRoute } from 'next'
import { allPosts, allProjects, allPages } from 'contentlayer2/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://polything.co.uk'
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic routes from content
  const postRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const projectRoutes: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: new Date(project.updated || project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const pageRoutes: MetadataRoute.Sitemap = allPages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updated || page.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...postRoutes, ...projectRoutes, ...pageRoutes]
}

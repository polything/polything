import { notFound } from 'next/navigation'
import { allProjects } from 'contentlayer2/generated'
import Hero from '@/components/hero'
import { MDXContent } from 'next-contentlayer2/hooks'
import { generateProjectMetadata } from '@/lib/seo/metadata'
import { generateAllJsonLd } from '@/lib/seo/structured-data'
import Script from 'next/script'

interface ProjectDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const project = allProjects.find((project) => project.slug === params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return generateProjectMetadata(project as any, {
    baseUrl: 'https://polything.co.uk',
    siteName: 'Polything',
    defaultDescription: 'Strategic Marketing for Visionary Brands',
    defaultImage: '/images/og-default.jpg',
    twitterHandle: '@polything'
  })
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = allProjects.find((project) => project.slug === params.slug)

  if (!project) {
    notFound()
  }

  // Generate JSON-LD structured data
  const jsonLdArray = generateAllJsonLd('https://polything.co.uk', project as any)

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((jsonLd, index) => (
        <Script
          key={`jsonld-${index}`}
          id={`ld-project-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      <main className="min-h-screen">
        {/* Hero Section */}
        {project.hero && <Hero hero={project.hero} />}

        {/* Project Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Project Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-raleway">
                {project.title}
              </h1>
              
              {/* Categories and Tags */}
              <div className="flex flex-wrap gap-4 mb-8">
                {project.categories && project.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-brand-yellow text-gray-900 rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
                
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Links */}
              {project.links?.url && (
                <div className="mb-8">
                  <a
                    href={project.links.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors font-medium"
                  >
                    Visit Project
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="prose prose-lg max-w-none">
              <MDXContent code={project.body.code} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

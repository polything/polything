import { notFound } from 'next/navigation'
import { allPages } from 'contentlayer2/generated'
import Hero from '@/components/hero'
import { MDXContent } from 'next-contentlayer2/hooks'
import { generateStaticPageMetadata } from '@/lib/seo/metadata'
import { generateAllJsonLd } from '@/lib/seo/structured-data'
import Script from 'next/script'

interface StaticPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: StaticPageProps) {
  const page = allPages.find((page) => page.slug === params.slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || `Learn more about ${page.title}`,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || `Learn more about ${page.title}`,
      images: page.seo?.schema?.image ? [page.seo.schema.image] : [],
      type: 'website',
    },
    canonical: page.seo?.canonical,
  }
}

export default async function StaticPage({ params }: StaticPageProps) {
  const page = allPages.find((page) => page.slug === params.slug)

  if (!page) {
    notFound()
  }

  // Generate JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': page.seo?.schema?.type || 'WebPage',
    name: page.title,
    url: `https://polything.co.uk${page.url}`,
    description: page.seo?.description,
    image: page.seo?.schema?.image,
    author: {
      '@type': 'Organization',
      name: page.seo?.schema?.author || 'Polything Ltd',
    },
    datePublished: page.seo?.schema?.publishDate || page.date,
    dateModified: page.seo?.schema?.modifiedDate || page.updated || page.date,
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen">
        {/* Hero Section */}
        {page.hero && <Hero hero={page.hero} />}

        {/* Page Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-raleway">
                {page.title}
              </h1>
              
              {/* Categories and Tags */}
              {(page.categories || page.tags) && (
                <div className="flex flex-wrap gap-4 mb-8">
                  {page.categories && page.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {page.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-brand-green text-white rounded-full text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {page.tags && page.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {page.tags.map((tag) => (
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
              )}
            </div>

            {/* Page Content */}
            <div className="prose prose-lg max-w-none">
              <MDXContent code={page.body.code} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

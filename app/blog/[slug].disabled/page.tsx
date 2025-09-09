import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer2/generated'
import Hero from '@/components/hero'
import { MDXContent } from 'next-contentlayer2/hooks'
import { generateBlogPostMetadata } from '@/lib/seo/metadata'
import { generateAllJsonLd } from '@/lib/seo/structured-data'
import Script from 'next/script'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return generateBlogPostMetadata(post as any, {
    baseUrl: 'https://polything.co.uk',
    siteName: 'Polything',
    defaultDescription: 'Strategic Marketing for Visionary Brands',
    defaultImage: '/images/og-default.jpg',
    twitterHandle: '@polything'
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  // Generate JSON-LD structured data
  const jsonLdArray = generateAllJsonLd('https://polything.co.uk', post as any)

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((jsonLd, index) => (
        <Script
          key={`jsonld-${index}`}
          id={`ld-article-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      <main className="min-h-screen">
        {/* Hero Section */}
        {post.hero && <Hero hero={post.hero} />}

        {/* Blog Post Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Blog Post Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-raleway">
                {post.title}
              </h1>
              
              {/* Post Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600">
                <time dateTime={post.date} className="font-medium">
                  {new Date(post.date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                
                {post.updated && post.updated !== post.date && (
                  <span className="text-sm">
                    Updated: {new Date(post.updated).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
                
                {post.featured && (
                  <span className="px-3 py-1 bg-brand-yellow text-gray-900 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              {/* Categories and Tags */}
              <div className="flex flex-wrap gap-4 mb-8">
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-brand-lightBlue text-white rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
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
            </div>

            {/* Blog Post Content */}
            <div className="prose prose-lg max-w-none">
              <MDXContent code={post.body.code} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

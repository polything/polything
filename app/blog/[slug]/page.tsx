import { notFound } from 'next/navigation'
import { allPosts } from '../../../.contentlayer/generated'
import { Container, Section, Heading, Text, SmallText } from '@/components/design-system'

interface BlogPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.seo?.description || `Blog post: ${post.title}`,
  }
}

export default function BlogPage({ params }: BlogPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <Section background="white">
      <Container>
        <Heading level={1} className="mb-4">
          {post.title}
        </Heading>
        
        <div className="mb-8">
          <SmallText className="text-gray-600">
            {new Date(post.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </SmallText>
        </div>

        {post.hero?.title && (
          <Heading level={2} className="mb-4">
            {post.hero.title}
          </Heading>
        )}
        
        {post.hero?.subtitle && (
          <Text size="large" className="mb-8">
            {post.hero.subtitle}
          </Text>
        )}

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.body.raw }} />
        </div>
      </Container>
    </Section>
  )
}

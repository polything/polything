import { notFound } from 'next/navigation'
import { allPages } from '../../.contentlayer/generated'
import { Container, Section, Heading, Text } from '@/components/design-system'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const page = allPages.find((page) => page.slug === params.slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.title,
    description: page.seo?.description || page.title,
  }
}

export default function StaticPage({ params }: PageProps) {
  const page = allPages.find((page) => page.slug === params.slug)

  if (!page) {
    notFound()
  }

  return (
    <Section background="white">
      <Container>
        <Heading level={1} className="mb-6">
          {page.title}
        </Heading>
        
        {page.hero?.title && (
          <Heading level={2} className="mb-4">
            {page.hero.title}
          </Heading>
        )}
        
        {page.hero?.subtitle && (
          <Text size="large" className="mb-8">
            {page.hero.subtitle}
          </Text>
        )}

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.body.raw }} />
        </div>
      </Container>
    </Section>
  )
}

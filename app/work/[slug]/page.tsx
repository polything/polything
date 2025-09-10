import { notFound } from 'next/navigation'
import { allProjects } from '../../../.contentlayer/generated'
import { Container, Section, Heading, Text } from '@/components/design-system'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const project = allProjects.find((project) => project.slug === params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.title,
    description: project.seo?.description || `Case study: ${project.title}`,
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = allProjects.find((project) => project.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <Section background="white">
      <Container>
        <Heading level={1} className="mb-6">
          {project.title}
        </Heading>
        
        {project.hero?.title && (
          <Heading level={2} className="mb-4">
            {project.hero.title}
          </Heading>
        )}
        
        {project.hero?.subtitle && (
          <Text size="large" className="mb-8">
            {project.hero.subtitle}
          </Text>
        )}

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: project.body.raw }} />
        </div>
      </Container>
    </Section>
  )
}

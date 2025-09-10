import { allProjects } from '../../.contentlayer/generated'
import { Container, Section, Heading, Text, Grid, Card } from '@/components/design-system'
import Link from 'next/link'

export const metadata = {
  title: 'Case Studies - Polything',
  description: 'Explore our successful marketing case studies and client results.',
}

export default function WorkPage() {
  return (
    <Section background="white">
      <Container>
        <Heading level={1} className="mb-6">
          Case Studies
        </Heading>
        
        <Text size="large" className="mb-12">
          Discover how we've helped businesses achieve remarkable marketing results through strategic campaigns and innovative approaches.
        </Text>

        <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
          {allProjects.map((project) => (
            <Card key={project.slug} variant="elevated" hover>
              <Heading level={3} className="mb-4">
                {project.title}
              </Heading>
              
              <Text className="mb-6">
                {project.seo?.description || `Case study: ${project.title}`}
              </Text>
              
              <Link 
                href={`/work/${project.slug}`}
                className="inline-flex items-center text-brand-yellow hover:text-brand-orange transition-colors"
              >
                Read Case Study →
              </Link>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

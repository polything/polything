import { allPages } from '../../.contentlayer/generated'
import { Container, Section, Heading, Text, Grid, Card } from '@/components/design-system'
import Link from 'next/link'

export const metadata = {
  title: 'Services - Polything',
  description: 'Comprehensive marketing consultancy services to help your business grow and succeed.',
}

export default function ServicesPage() {
  // Filter for service pages
  const serviceSlugs = ['marketing-strategy', 'marketing-services', 'business-mentoring']
  const servicePages = allPages.filter((page) => serviceSlugs.includes(page.slug))

  return (
    <Section background="white">
      <Container>
        <Heading level={1} className="mb-6">
          Marketing Services
        </Heading>
        
        <Text size="large" className="mb-12">
          Discover our comprehensive range of strategic marketing consultancy services, designed to help your business grow and succeed.
        </Text>

        <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
          {servicePages.map((service) => (
            <Card key={service.slug} variant="elevated" hover>
              <Heading level={3} className="mb-4">
                {service.title}
              </Heading>
              
              <Text className="mb-6">
                {service.seo?.description || `Service: ${service.title}`}
              </Text>
              
              <Link 
                href={`/services/${service.slug}`}
                className="inline-flex items-center text-brand-yellow hover:text-brand-orange transition-colors"
              >
                Learn More →
              </Link>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

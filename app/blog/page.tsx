import { allPosts } from '../../.contentlayer/generated'
import { Container, Section, Heading, Text, Grid, Card, SmallText } from '@/components/design-system'
import Link from 'next/link'

export const metadata = {
  title: 'Blog - Polything',
  description: 'Marketing insights, strategies, and industry expertise from the Polything team.',
}

export default function BlogPage() {
  return (
    <Section background="white">
      <Container>
        <Heading level={1} className="mb-6">
          Marketing Blog
        </Heading>
        
        <Text size="large" className="mb-12">
          Stay updated with the latest marketing strategies, industry insights, and expert advice from our team.
        </Text>

        <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
          {allPosts.map((post) => (
            <Card key={post.slug} variant="elevated" hover>
              <Heading level={3} className="mb-4">
                {post.title}
              </Heading>
              
              <SmallText className="text-gray-600 mb-4">
                {new Date(post.date).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </SmallText>
              
              <Text className="mb-6">
                {post.seo?.description || `Blog post: ${post.title}`}
              </Text>
              
              <Link 
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-brand-yellow hover:text-brand-orange transition-colors"
              >
                Read More →
              </Link>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

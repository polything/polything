// ⚠️  PROTECTED FILE - DO NOT MODIFY ⚠️
// This is the design system demo page and showcases the new design system.
// Any changes to this file require explicit approval.
// Last protected: 2025-01-27

import { 
  Container, 
  Section, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Heading, 
  Text, 
  LeadText, 
  SmallText,
  Button,
  ButtonGroup,
  HeroDesignSystem,
  HeroContent,
  HeroHomepage,
  GlassContainer,
  BauhausCircle,
  BauhausSquare,
  BauhausTriangle,
  GeometricPattern
} from '@/components/design-system'

export default function DesignSystemDemo() {
  const heroData = {
    title: 'Design System Demo',
    subtitle: 'Polything Design System',
    description: 'A comprehensive showcase of our design system components and utilities.',
    cta_text: 'Explore Components',
    cta_href: '#components',
    background_color: '#2A2F67',
    text_color: '#ffffff',
  }

  const features = [
    {
      title: 'Typography',
      description: 'Consistent heading and text components with Raleway and Inter fonts.',
      icon: 'T'
    },
    {
      title: 'Layout',
      description: 'Flexible container, section, and grid components for responsive design.',
      icon: 'L'
    },
    {
      title: 'Components',
      description: 'Reusable UI components including cards, buttons, and interactive elements.',
      icon: 'C'
    },
    {
      title: 'Bauhaus Elements',
      description: 'Geometric design elements inspired by the Bauhaus movement.',
      icon: 'B'
    }
  ]

  return (
    <main className="relative overflow-x-hidden">
      {/* Geometric Pattern Background */}
      <GeometricPattern pattern="grid" opacity={0.05} color="gray" />
      
      {/* Hero Section */}
      <HeroDesignSystem 
        hero={heroData}
        variant="fullscreen"
        showBauhausElements={true}
        showGlassEffect={true}
      />

      {/* Features Section */}
      <Section id="components" background="white">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} color="brand" className="mb-6">
              Design System Components
            </Heading>
            <LeadText color="muted">
              A comprehensive collection of reusable components built with consistency and accessibility in mind.
            </LeadText>
          </div>

          <Grid cols={2} responsive={{ md: 2, lg: 4 }} gap="lg">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" hover interactive>
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mb-4">
                    <span className="text-black font-bold text-xl">{feature.icon}</span>
                  </div>
                  <Heading level={3}>{feature.title}</Heading>
                </CardHeader>
                <CardContent>
                  <Text color="muted">{feature.description}</Text>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Typography Showcase */}
      <Section background="gray">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} color="brand" className="mb-6">
              Typography System
            </Heading>
            <Text color="muted">
              Consistent typography using Raleway for headings and Inter for body text.
            </Text>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <Heading level={1}>Heading Level 1</Heading>
              <SmallText>Raleway Bold, 4xl on mobile, 6xl on desktop</SmallText>
            </div>
            
            <div>
              <Heading level={2}>Heading Level 2</Heading>
              <SmallText>Raleway Bold, 3xl on mobile, 5xl on desktop</SmallText>
            </div>
            
            <div>
              <Heading level={3}>Heading Level 3</Heading>
              <SmallText>Raleway Bold, 2xl on mobile, 4xl on desktop</SmallText>
            </div>
            
            <div>
              <LeadText>
                This is a lead text paragraph. It's larger than regular body text and used for introductory content.
              </LeadText>
            </div>
            
            <div>
              <Text size="large">
                This is large body text. Perfect for important content that needs to stand out from regular paragraphs.
              </Text>
            </div>
            
            <div>
              <Text>
                This is regular body text. It's the standard size for most content and provides excellent readability.
              </Text>
            </div>
            
            <div>
              <SmallText>
                This is small text. Used for captions, footnotes, and secondary information.
              </SmallText>
            </div>
          </div>
        </Container>
      </Section>

      {/* Button Showcase */}
      <Section background="white">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} color="brand" className="mb-6">
              Button Variants
            </Heading>
            <Text color="muted">
              Multiple button styles for different use cases and hierarchy.
            </Text>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Heading level={3} className="mb-6">Button Variants</Heading>
                <div className="space-y-4">
                  <Button variant="primary" size="lg" className="w-full">
                    Primary Button
                  </Button>
                  <Button variant="secondary" size="lg" className="w-full">
                    Secondary Button
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Outline Button
                  </Button>
                  <Button variant="ghost" size="lg" className="w-full">
                    Ghost Button
                  </Button>
                </div>
              </div>

              <div>
                <Heading level={3} className="mb-6">Button Sizes</Heading>
                <div className="space-y-4">
                  <Button variant="primary" size="sm" className="w-full">
                    Small Button
                  </Button>
                  <Button variant="primary" size="md" className="w-full">
                    Medium Button
                  </Button>
                  <Button variant="primary" size="lg" className="w-full">
                    Large Button
                  </Button>
                  <Button variant="primary" size="xl" className="w-full">
                    Extra Large Button
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Heading level={3} className="mb-6 text-center">Button Groups</Heading>
              <div className="flex justify-center">
                <ButtonGroup orientation="horizontal" spacing="md">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Bauhaus Elements Showcase */}
      <Section background="brand">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} color="white" className="mb-6">
              Bauhaus Elements
            </Heading>
            <Text color="white" className="opacity-90">
              Geometric design elements that add visual interest and maintain brand consistency.
            </Text>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card variant="glass" className="text-center">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <BauhausCircle size="lg" color="yellow" opacity={0.6} />
                  </div>
                  <Heading level={3} color="white">Circles</Heading>
                  <Text color="white" className="opacity-90">
                    Perfect circles with customizable colors and animations.
                  </Text>
                </CardContent>
              </Card>

              <Card variant="glass" className="text-center">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <BauhausSquare size="lg" color="lightBlue" opacity={0.6} />
                  </div>
                  <Heading level={3} color="white">Squares</Heading>
                  <Text color="white" className="opacity-90">
                    Clean geometric squares with outline and filled variants.
                  </Text>
                </CardContent>
              </Card>

              <Card variant="glass" className="text-center">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <BauhausTriangle size="lg" color="orange" opacity={0.6} />
                  </div>
                  <Heading level={3} color="white">Triangles</Heading>
                  <Text color="white" className="opacity-90">
                    Dynamic triangular shapes for visual hierarchy.
                  </Text>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Hero Variants Showcase */}
      <Section background="white">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} color="brand" className="mb-6">
              Hero Component Variants
            </Heading>
            <Text color="muted">
              Three different hero components for different use cases and content types.
            </Text>
          </div>

          <div className="space-y-16">
            {/* Design System Hero */}
            <div>
              <Heading level={3} color="brand" className="mb-6 text-center">
                Design System Hero
              </Heading>
              <Text color="muted" className="text-center mb-8">
                Flexible hero component with design system integration, supporting multiple variants and layouts.
              </Text>
              <div className="max-w-4xl mx-auto">
                <HeroDesignSystem 
                  hero={{
                    title: "Design System Hero",
                    subtitle: "Flexible hero component with design system integration",
                    background_color: "#2A2F67",
                    text_color: "#ffffff"
                  }}
                  variant="centered"
                  showBauhausElements={true}
                />
              </div>
            </div>

            {/* Content Hero */}
            <div>
              <Heading level={3} color="brand" className="mb-6 text-center">
                Content Hero (WordPress Content)
              </Heading>
              <Text color="muted" className="text-center mb-8">
                Designed for extracted WordPress content with dynamic background colors, images, and videos.
              </Text>
              <div className="max-w-4xl mx-auto">
                <HeroContent 
                  hero={{
                    title: "Strategic Marketing for Visionary Brands",
                    subtitle: "We help founders and teams cut through the noise, sharpen their strategy, and build marketing that actually works.",
                    background_color: "#1a1a1a",
                    text_color: "#ffffff"
                  }}
                />
              </div>
            </div>

            {/* Homepage Hero */}
            <div>
              <Heading level={3} color="brand" className="mb-6 text-center">
                Homepage Hero (Video Background)
              </Heading>
              <Text color="muted" className="text-center mb-8">
                Homepage-specific hero with video background, glass morphic effects, and interactive elements.
              </Text>
              <div className="max-w-4xl mx-auto">
                <HeroHomepage />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Glass Container Showcase */}
      <Section background="brand">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} color="white" className="mb-6">
              Glass Morphic Containers
            </Heading>
            <Text color="white" className="opacity-90">
              Beautiful glass morphic containers with decorative geometric elements.
            </Text>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <GlassContainer>
              <Heading level={3} color="brand" className="mb-4">
                Light Glass Container
              </Heading>
              <Text>
                This is a light glass container with the default glass morphic effect. 
                It includes decorative geometric elements in the corners and maintains 
                the beautiful frosted glass appearance.
              </Text>
            </GlassContainer>

            <GlassContainer variant="dark">
              <Heading level={3} color="white" className="mb-4">
                Dark Glass Container
              </Heading>
              <Text color="white">
                This is a dark glass container variant. Perfect for overlaying on 
                darker backgrounds while maintaining the glass morphic aesthetic.
              </Text>
            </GlassContainer>

            <GlassContainer 
              showDecorations={false}
              padding="xl"
              rounded="2xl"
            >
              <Heading level={3} color="brand" className="mb-4">
                Custom Glass Container
              </Heading>
              <Text>
                This glass container has custom padding, rounded corners, and no 
                decorative elements. It demonstrates the flexibility of the component.
              </Text>
            </GlassContainer>
          </div>
        </Container>
      </Section>

      {/* Color Palette */}
      <Section background="white">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} color="brand" className="mb-6">
              Brand Colors
            </Heading>
            <Text color="muted">
              Our carefully selected color palette that reflects the Polything brand.
            </Text>
          </div>

          <div className="max-w-4xl mx-auto">
            <Grid cols={2} responsive={{ md: 3, lg: 4 }} gap="lg">
              {[
                { name: 'Yellow', value: '#FEC502', class: 'bg-brand-yellow' },
                { name: 'Light Blue', value: '#02AFF4', class: 'bg-brand-lightBlue' },
                { name: 'Orange', value: '#FD5B06', class: 'bg-brand-orange' },
                { name: 'Red', value: '#D50618', class: 'bg-brand-red' },
                { name: 'Green', value: '#04A876', class: 'bg-brand-green' },
                { name: 'Dark Green', value: '#01633C', class: 'bg-brand-darkGreen' },
                { name: 'Navy', value: '#2A2F67', class: 'bg-brand-navy' },
              ].map((color, index) => (
                <Card key={index} variant="elevated">
                  <CardContent>
                    <div className={`w-full h-20 rounded-lg ${color.class} mb-4`}></div>
                    <Heading level={4}>{color.name}</Heading>
                    <SmallText color="muted">{color.value}</SmallText>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* Footer CTA */}
      <Section background="gray">
        <Container>
          <div className="text-center">
            <Heading level={2} color="brand" className="mb-6">
              Ready to Use the Design System?
            </Heading>
            <Text size="large" color="muted" className="mb-8">
              All components are fully tested, documented, and ready for production use.
            </Text>
            <ButtonGroup orientation="horizontal" spacing="lg">
              <Button variant="primary" size="lg">
                View Documentation
              </Button>
              <Button variant="outline" size="lg">
                View Source Code
              </Button>
            </ButtonGroup>
          </div>
        </Container>
      </Section>
    </main>
  )
}

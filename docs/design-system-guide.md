# Polything Design System Guide

## Overview

The Polything Design System is a comprehensive, reusable component library built on top of Tailwind CSS. It maintains the existing Polything brand identity while providing consistent, scalable design tokens and utilities.

## Design Tokens

### Brand Colors

```typescript
const brandColors = {
  yellow: '#FEC502',      // Primary brand color
  lightBlue: '#02AFF4',   // Secondary brand color
  orange: '#FD5B06',      // Accent color
  red: '#D50618',         // Error/warning color
  green: '#04A876',       // Success color
  darkGreen: '#01633C',   // Dark success variant
  navy: '#2A2F67',        // Dark accent color
}
```

### Typography

- **Heading Font**: Raleway (Bold, geometric)
- **Body Font**: Inter (Clean, readable)
- **Sizes**: xs (12px) to 7xl (72px)
- **Weights**: normal (400) to extrabold (800)

### Spacing Scale

Based on Tailwind's spacing scale:
- xs: 4px
- sm: 8px  
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
- 4xl: 96px
- 5xl: 128px

## Components

### Container

Responsive container with configurable sizes and padding.

```tsx
import { Container } from '@/components/design-system'

<Container size="lg" padding="md">
  <div>Your content here</div>
</Container>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

### Section

Semantic section wrapper with background and spacing options.

```tsx
import { Section } from '@/components/design-system'

<Section size="lg" background="gray">
  <div>Section content</div>
</Section>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `background`: 'white' | 'gray' | 'brand' | 'transparent'
- `container`: boolean (default: true)
- `containerSize`: 'sm' | 'md' | 'lg' | 'xl' | 'full'

### GlassContainer

Beautiful glass morphic container with decorative geometric elements, perfect for creating modern, elegant layouts.

```tsx
import { GlassContainer } from '@/components/design-system'

<GlassContainer>
  <h3>Glass Morphic Content</h3>
  <p>Beautiful frosted glass effect with decorative elements</p>
</GlassContainer>
```

**Props:**
- `children`: React.ReactNode - Content to display inside the container
- `className`: string - Additional CSS classes
- `variant`: 'light' | 'dark' - Glass effect variant (default: 'light')
- `showDecorations`: boolean - Show decorative geometric elements (default: true)
- `decorationColors`: { topLeft?: string, bottomRight?: string } - Custom decoration colors
- `padding`: 'sm' | 'md' | 'lg' | 'xl' - Container padding (default: 'lg')
- `rounded`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' - Border radius (default: 'xl')

**Examples:**
```tsx
// Light glass container with default decorations
<GlassContainer>
  <p>Default glass container</p>
</GlassContainer>

// Dark glass container
<GlassContainer variant="dark">
  <p>Dark glass container</p>
</GlassContainer>

// Custom glass container without decorations
<GlassContainer 
  showDecorations={false}
  padding="xl"
  rounded="2xl"
>
  <p>Custom glass container</p>
</GlassContainer>

// Glass container with custom decoration colors
<GlassContainer 
  decorationColors={{
    topLeft: '#FF0000',
    bottomRight: '#00FF00'
  }}
>
  <p>Custom colored decorations</p>
</GlassContainer>
```

### Grid

Flexible grid system with responsive columns.

```tsx
import { Grid } from '@/components/design-system'

<Grid cols={3} gap="lg" responsive={{ md: 2, lg: 3 }}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

**Props:**
- `cols`: 1 | 2 | 3 | 4 | 6 | 12
- `gap`: 'sm' | 'md' | 'lg' | 'xl'
- `responsive`: Object with breakpoint-specific column counts

### Typography

Semantic typography components with consistent styling.

```tsx
import { Heading, Text, LeadText, SmallText } from '@/components/design-system'

<Heading level={1} color="brand">Main Heading</Heading>
<Text size="large" color="muted">Body text</Text>
<LeadText>Introductory paragraph</LeadText>
<SmallText>Small supporting text</SmallText>
```

**Heading Props:**
- `level`: 1 | 2 | 3 | 4 | 5 | 6
- `color`: 'default' | 'brand' | 'muted' | 'white'
- `as`: HTML element override

**Text Props:**
- `size`: 'small' | 'base' | 'large'
- `color`: 'default' | 'muted' | 'brand' | 'white'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold'

### Card

Flexible card component with multiple variants.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/design-system'

<Card variant="glass" padding="lg" hover>
  <CardHeader>
    <Heading level={3}>Card Title</Heading>
  </CardHeader>
  <CardContent>
    <Text>Card content goes here</Text>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: 'default' | 'glass' | 'elevated'
- `glassVariant`: 'light' | 'dark' | 'subtle' | 'strong'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `hover`: boolean
- `interactive`: boolean

### Button

Consistent button component with multiple variants and sizes.

```tsx
import { Button, ButtonGroup } from '@/components/design-system'

<Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
  Get Started
</Button>

<ButtonGroup orientation="horizontal" spacing="md">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
</ButtonGroup>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `icon`: LucideIcon component
- `iconPosition`: 'left' | 'right'
- `loading`: boolean
- `href`: string (renders as link)

### Hero Components

Three different hero components for different use cases and content types.

#### HeroDesignSystem

Enhanced hero component with design system integration and flexible layouts.

```tsx
import { HeroDesignSystem } from '@/components/design-system'

<HeroDesignSystem 
  hero={heroData}
  variant="default"
  showBauhausElements={true}
  showGlassEffect={true}
/>
```

**Props:**
- `hero`: HeroData object
- `variant`: 'default' | 'minimal' | 'fullscreen' | 'split'
- `showBauhausElements`: boolean
- `showGlassEffect`: boolean

#### HeroContent

Content-specific hero component designed for extracted WordPress content with dynamic backgrounds.

```tsx
import { HeroContent } from '@/components/design-system'

<HeroContent 
  hero={{
    title: "Strategic Marketing for Visionary Brands",
    subtitle: "We help founders and teams cut through the noise",
    image: "/images/hero-bg.jpg",
    video: "/videos/hero-bg.mp4",
    background_color: "#1a1a1a",
    text_color: "#ffffff"
  }}
/>
```

**Props:**
- `hero`: HeroData object with title, subtitle, image, video, colors
- `className`: string

**Features:**
- Supports both image and video backgrounds
- Dynamic background and text colors
- Responsive design with proper image/video handling
- Graceful fallback when no hero data is provided

#### HeroHomepage

Homepage-specific hero component with video background and glass morphic effects.

```tsx
import { HeroHomepage } from '@/components/design-system'

<HeroHomepage />
```

**Features:**
- Video background with autoplay and loop
- Glass morphic container with decorative elements
- Interactive call-to-action button
- Bauhaus-inspired geometric decorations
- Mobile-optimized video handling

**HeroData Interface:**
```typescript
interface HeroData {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  video?: string
  text_color?: string
  background_color?: string
  cta_text?: string
  cta_href?: string
}
```

### Bauhaus Elements

Geometric design elements inspired by Bauhaus movement.

```tsx
import { BauhausCircle, BauhausSquare, BauhausTriangle, GeometricPattern } from '@/components/design-system'

<BauhausCircle 
  size="lg" 
  color="yellow" 
  opacity={0.4} 
  animation="float"
/>

<BauhausSquare 
  size="md" 
  color="lightBlue" 
  variant="outline"
/>

<BauhausTriangle 
  size="sm" 
  color="orange" 
  position="absolute"
/>

<GeometricPattern 
  pattern="grid" 
  opacity={0.1} 
  color="brand"
/>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'yellow' | 'lightBlue' | 'orange' | 'red' | 'green' | 'navy'
- `opacity`: number (0-1)
- `animation`: 'none' | 'float' | 'floatDelay1' | 'floatDelay2' | 'rotate' | 'pulse'
- `position`: 'absolute' | 'relative' | 'fixed'
- `variant`: 'filled' | 'outline' (for shapes with borders)

## Usage Examples

### Basic Page Layout

```tsx
import { 
  Container, 
  Section, 
  Heading, 
  Text, 
  Button,
  Grid 
} from '@/components/design-system'

export default function HomePage() {
  return (
    <Section background="white">
      <Container>
        <Heading level={1} color="brand">
          Welcome to Polything
        </Heading>
        <Text size="large" className="mb-8">
          Strategic marketing for visionary brands
        </Text>
        <Button variant="primary" size="lg">
          Get Started
        </Button>
      </Container>
    </Section>
  )
}
```

### Feature Grid

```tsx
import { Grid, Card, Heading, Text } from '@/components/design-system'

const features = [
  { title: 'Strategy', description: 'Data-driven marketing strategies' },
  { title: 'Execution', description: 'End-to-end campaign management' },
  { title: 'Analytics', description: 'Performance tracking and optimization' },
]

export default function FeaturesSection() {
  return (
    <Grid cols={3} gap="lg">
      {features.map((feature, index) => (
        <Card key={index} variant="elevated" hover>
          <Heading level={3}>{feature.title}</Heading>
          <Text>{feature.description}</Text>
        </Card>
      ))}
    </Grid>
  )
}
```

### Hero Section

```tsx
import { Hero } from '@/components/design-system'

const heroData = {
  title: 'Build a Brand That Leads',
  subtitle: 'Strategic Marketing',
  description: 'We help founders and teams cut through the noise, sharpen their strategy, and build marketing that actually works.',
  cta_text: 'Book a Free Discovery Call',
  cta_href: '#contact',
  background_color: '#000000',
  text_color: '#ffffff',
}

export default function HomePage() {
  return (
    <Hero 
      hero={heroData}
      variant="fullscreen"
      showBauhausElements={true}
      showGlassEffect={true}
    />
  )
}
```

## Best Practices

### 1. Consistent Spacing
Use the design system's spacing scale for consistent layouts:
```tsx
// Good
<Section size="lg">
  <Container>
    <Heading level={1} className="mb-8">Title</Heading>
    <Text className="mb-6">Description</Text>
  </Container>
</Section>

// Avoid
<div style={{ padding: '50px' }}>
  <h1 style={{ marginBottom: '30px' }}>Title</h1>
</div>
```

### 2. Semantic Typography
Use semantic typography components instead of raw HTML:
```tsx
// Good
<Heading level={2} color="brand">Section Title</Heading>
<Text size="large">Important content</Text>

// Avoid
<h2 className="text-2xl font-bold text-brand-yellow">Section Title</h2>
<p className="text-lg">Important content</p>
```

### 3. Responsive Design
Leverage the responsive utilities built into components:
```tsx
// Good
<Grid cols={1} responsive={{ md: 2, lg: 3 }}>

// Avoid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 4. Brand Consistency
Use brand colors and maintain visual hierarchy:
```tsx
// Good
<Button variant="primary">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>

// Avoid
<button className="bg-blue-500">Primary Action</button>
<button className="bg-gray-500">Secondary Action</button>
```

## Testing

All design system components include comprehensive test coverage:

```bash
# Run design system tests
npm test components/design-system/

# Run specific component tests
npm test components/design-system/hero.test.tsx
```

## Migration from Existing Components

When migrating existing components to use the design system:

1. **Replace raw HTML with semantic components**
2. **Use design tokens instead of hardcoded values**
3. **Leverage responsive utilities**
4. **Maintain existing functionality while improving consistency**

Example migration:

```tsx
// Before
<div className="container mx-auto px-4 py-16">
  <h1 className="text-4xl font-bold text-gray-900 mb-6">Title</h1>
  <p className="text-lg text-gray-600 mb-8">Description</p>
  <button className="bg-yellow-500 text-black px-6 py-3 rounded">Button</button>
</div>

// After
<Section>
  <Container>
    <Heading level={1} className="mb-6">Title</Heading>
    <Text size="large" color="muted" className="mb-8">Description</Text>
    <Button variant="primary">Button</Button>
  </Container>
</Section>
```

## Future Enhancements

- [ ] Dark mode support
- [ ] Animation utilities
- [ ] Form components
- [ ] Navigation components
- [ ] Data visualization components
- [ ] Accessibility improvements
- [ ] Performance optimizations

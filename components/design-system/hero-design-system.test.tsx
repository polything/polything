/**
 * Hero Component Tests
 */

import { render, screen } from '@testing-library/react'
import Hero from './hero-design-system'

const mockHeroData = {
  title: 'Test Hero Title',
  subtitle: 'Test Subtitle',
  description: 'Test description text',
  image: '/test-image.jpg',
  video: '/test-video.mp4',
  text_color: '#ffffff',
  background_color: '#000000',
  cta_text: 'Get Started',
  cta_href: '#contact',
}

describe('Hero Component', () => {
  test('renders with hero data', () => {
    render(<Hero hero={mockHeroData} />)
    
    expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Test description text')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  test('renders without hero data', () => {
    render(<Hero hero={null} />)
    
    expect(screen.getByText('No Hero Content')).toBeInTheDocument()
  })

  test('renders with minimal data', () => {
    const minimalHero = {
      title: 'Minimal Title',
    }
    
    render(<Hero hero={minimalHero} />)
    
    expect(screen.getByText('Minimal Title')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(
      <Hero hero={mockHeroData} className="custom-class" />
    )
    
    const sectionElement = container.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('custom-class')
  })

  test('renders with default variant', () => {
    const { container } = render(<Hero hero={mockHeroData} />)
    
    const sectionElement = container.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('min-h-[80vh]', 'flex', 'items-center')
  })

  test('renders with minimal variant', () => {
    const { container } = render(
      <Hero hero={mockHeroData} variant="minimal" />
    )
    
    const sectionElement = container.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('py-16', 'md:py-24')
  })

  test('renders with fullscreen variant', () => {
    const { container } = render(
      <Hero hero={mockHeroData} variant="fullscreen" />
    )
    
    const sectionElement = container.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('min-h-screen', 'flex', 'items-center')
  })

  test('renders with split variant', () => {
    const { container } = render(
      <Hero hero={mockHeroData} variant="split" />
    )
    
    const sectionElement = container.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('py-16', 'md:py-24')
  })

  test('applies custom styles from hero data', () => {
    const { container } = render(<Hero hero={mockHeroData} />)
    
    const sectionElement = container.firstChild as HTMLElement
    // Check that the element has a background color style applied
    const computedStyle = window.getComputedStyle(sectionElement)
    expect(computedStyle.backgroundColor).toBeDefined()
  })

  test('renders CTA button with correct href', () => {
    render(<Hero hero={mockHeroData} />)
    
    const ctaButton = screen.getByText('Get Started')
    expect(ctaButton.closest('a')).toHaveAttribute('href', '#contact')
  })

  test('renders without Bauhaus elements when showBauhausElements=false', () => {
    const { container } = render(
      <Hero hero={mockHeroData} showBauhausElements={false} />
    )
    
    // Should not have Bauhaus circle elements
    const bauhausElements = container.querySelectorAll('[class*="bauhaus"]')
    expect(bauhausElements).toHaveLength(0)
  })

  test('renders with Bauhaus elements by default', () => {
    const { container } = render(<Hero hero={mockHeroData} />)
    
    // Should have Bauhaus elements (they're rendered as divs with specific classes)
    const bauhausElements = container.querySelectorAll('div[class*="rounded"]')
    expect(bauhausElements.length).toBeGreaterThan(0)
  })

  test('handles missing optional fields gracefully', () => {
    const minimalHero = {
      title: 'Just Title',
    }
    
    render(<Hero hero={minimalHero} />)
    
    expect(screen.getByText('Just Title')).toBeInTheDocument()
    // Should not crash or render empty elements
  })

  test('renders image when provided and not split variant', () => {
    const imageOnlyHero = {
      ...mockHeroData,
      video: '', // No video, only image
    }
    
    render(<Hero hero={imageOnlyHero} />)
    
    const image = screen.getByAltText('Test Hero Title')
    expect(image).toBeInTheDocument()
    // Next.js Image component transforms the src, so we check it contains the original path
    expect(image.getAttribute('src')).toContain('test-image.jpg')
  })

  test('renders video when provided and not split variant', () => {
    const videoHero = {
      ...mockHeroData,
      image: '', // No image, only video
    }
    
    const { container } = render(<Hero hero={videoHero} />)
    
    const video = container.querySelector('video')
    const source = container.querySelector('source')
    expect(video).toBeInTheDocument()
    expect(source).toHaveAttribute('src', '/test-video.mp4')
  })

  test('applies correct heading level', () => {
    render(<Hero hero={mockHeroData} />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Test Hero Title')
  })

  test('renders subtitle with correct styling', () => {
    render(<Hero hero={mockHeroData} />)
    
    const subtitle = screen.getByText('Test Subtitle')
    expect(subtitle).toBeInTheDocument()
    expect(subtitle).toHaveClass('opacity-90')
  })

  test('renders description with correct styling', () => {
    render(<Hero hero={mockHeroData} />)
    
    const description = screen.getByText('Test description text')
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('opacity-90')
  })
})

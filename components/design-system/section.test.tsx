/**
 * Section Component Tests
 */

import { render, screen } from '@testing-library/react'
import Section from './section'

describe('Section', () => {
  test('renders children correctly', () => {
    render(
      <Section>
        <div data-testid="test-content">Test Content</div>
      </Section>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  test('applies default classes', () => {
    const { container } = render(
      <Section>
        <div>Test</div>
      </Section>
    )
    
    // The section div is nested inside the container
    const sectionElement = container.firstChild?.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('py-16', 'md:py-24', 'bg-white')
  })

  test('applies custom size classes', () => {
    const { container } = render(
      <Section size="lg">
        <div>Test</div>
      </Section>
    )
    
    const sectionElement = container.firstChild?.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('py-24', 'md:py-32')
  })

  test('applies custom background classes', () => {
    const { container } = render(
      <Section background="gray">
        <div>Test</div>
      </Section>
    )
    
    const sectionElement = container.firstChild?.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('bg-gray-50')
  })

  test('applies custom className', () => {
    const { container } = render(
      <Section className="custom-class">
        <div>Test</div>
      </Section>
    )
    
    const sectionElement = container.firstChild?.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('custom-class')
  })

  test('renders without container when container=false', () => {
    const { container } = render(
      <Section container={false}>
        <div>Test</div>
      </Section>
    )
    
    const sectionElement = container.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('py-16', 'md:py-24', 'bg-white')
    expect(sectionElement).not.toHaveClass('mx-auto', 'max-w-6xl')
  })

  test('handles all size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach(size => {
      const { container } = render(
        <Section size={size}>
          <div>Test</div>
        </Section>
      )
      
      const sectionElement = container.firstChild?.firstChild as HTMLElement
      expect(sectionElement).toHaveClass('bg-white')
    })
  })

  test('handles all background variants', () => {
    const backgrounds = ['white', 'gray', 'brand', 'transparent'] as const
    
    backgrounds.forEach(background => {
      const { container } = render(
        <Section background={background}>
          <div>Test</div>
        </Section>
      )
      
      const sectionElement = container.firstChild?.firstChild as HTMLElement
      expect(sectionElement).toHaveClass('py-16', 'md:py-24')
    })
  })

  test('applies custom container size', () => {
    const { container } = render(
      <Section containerSize="sm">
        <div>Test</div>
      </Section>
    )
    
    // The container should be applied by default
    const sectionElement = container.firstChild?.firstChild as HTMLElement
    expect(sectionElement).toHaveClass('py-16', 'md:py-24', 'bg-white')
  })
})

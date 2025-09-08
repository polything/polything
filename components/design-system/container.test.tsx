/**
 * Container Component Tests
 */

import { render, screen } from '@testing-library/react'
import Container from './container'

describe('Container', () => {
  test('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="test-content">Test Content</div>
      </Container>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  test('applies default size and padding classes', () => {
    const { container } = render(
      <Container>
        <div>Test</div>
      </Container>
    )
    
    const containerElement = container.firstChild as HTMLElement
    expect(containerElement).toHaveClass('mx-auto', 'max-w-6xl', 'px-4', 'md:px-8')
  })

  test('applies custom size classes', () => {
    const { container } = render(
      <Container size="sm">
        <div>Test</div>
      </Container>
    )
    
    const containerElement = container.firstChild as HTMLElement
    expect(containerElement).toHaveClass('max-w-2xl')
  })

  test('applies custom padding classes', () => {
    const { container } = render(
      <Container padding="lg">
        <div>Test</div>
      </Container>
    )
    
    const containerElement = container.firstChild as HTMLElement
    expect(containerElement).toHaveClass('px-6', 'md:px-12')
  })

  test('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Test</div>
      </Container>
    )
    
    const containerElement = container.firstChild as HTMLElement
    expect(containerElement).toHaveClass('custom-class')
  })

  test('handles all size variants', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const
    
    sizes.forEach(size => {
      const { container } = render(
        <Container size={size}>
          <div>Test</div>
        </Container>
      )
      
      const containerElement = container.firstChild as HTMLElement
      expect(containerElement).toHaveClass('mx-auto')
    })
  })

  test('handles all padding variants', () => {
    const paddings = ['none', 'sm', 'md', 'lg'] as const
    
    paddings.forEach(padding => {
      const { container } = render(
        <Container padding={padding}>
          <div>Test</div>
        </Container>
      )
      
      const containerElement = container.firstChild as HTMLElement
      expect(containerElement).toHaveClass('mx-auto')
    })
  })
})

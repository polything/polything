import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GlassContainer } from './glass-container'

describe('GlassContainer', () => {
  it('renders children correctly', () => {
    render(
      <GlassContainer>
        <p>Test content</p>
      </GlassContainer>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies glass class by default', () => {
    const { container } = render(
      <GlassContainer>
        <p>Test content</p>
      </GlassContainer>
    )
    
    const glassElement = container.firstChild as HTMLElement
    expect(glassElement).toHaveClass('glass')
  })

  it('applies glass-dark class when variant is dark', () => {
    const { container } = render(
      <GlassContainer variant="dark">
        <p>Test content</p>
      </GlassContainer>
    )
    
    const glassElement = container.firstChild as HTMLElement
    expect(glassElement).toHaveClass('glass-dark')
  })

  it('applies correct padding classes', () => {
    const { container } = render(
      <GlassContainer padding="sm">
        <p>Test content</p>
      </GlassContainer>
    )
    
    const glassElement = container.firstChild as HTMLElement
    expect(glassElement).toHaveClass('p-4')
  })

  it('applies correct rounded classes', () => {
    const { container } = render(
      <GlassContainer rounded="2xl">
        <p>Test content</p>
      </GlassContainer>
    )
    
    const glassElement = container.firstChild as HTMLElement
    expect(glassElement).toHaveClass('rounded-2xl')
  })

  it('applies custom className', () => {
    const { container } = render(
      <GlassContainer className="custom-class">
        <p>Test content</p>
      </GlassContainer>
    )
    
    const glassElement = container.firstChild as HTMLElement
    expect(glassElement).toHaveClass('custom-class')
  })

  it('renders decorative elements by default', () => {
    const { container } = render(
      <GlassContainer>
        <p>Test content</p>
      </GlassContainer>
    )
    
    // Check for decorative elements
    const decorations = container.querySelectorAll('[class*="absolute"]')
    expect(decorations).toHaveLength(2) // top-left and bottom-right decorations
  })

  it('does not render decorative elements when showDecorations is false', () => {
    const { container } = render(
      <GlassContainer showDecorations={false}>
        <p>Test content</p>
      </GlassContainer>
    )
    
    // Check that decorative elements are not present
    const decorations = container.querySelectorAll('[class*="absolute"]')
    expect(decorations).toHaveLength(0)
  })

  it('applies custom decoration colors', () => {
    const { container } = render(
      <GlassContainer 
        decorationColors={{
          topLeft: '#FF0000',
          bottomRight: '#00FF00'
        }}
      >
        <p>Test content</p>
      </GlassContainer>
    )
    
    const decorations = container.querySelectorAll('[class*="absolute"]')
    expect(decorations[0]).toHaveStyle('background-color: #FF0000')
    expect(decorations[1]).toHaveStyle('background-color: #00FF00')
  })

  it('renders content with relative z-10 positioning', () => {
    const { container } = render(
      <GlassContainer>
        <p>Test content</p>
      </GlassContainer>
    )
    
    const contentWrapper = container.querySelector('.relative.z-10')
    expect(contentWrapper).toBeInTheDocument()
    expect(contentWrapper).toHaveClass('relative', 'z-10')
  })
})

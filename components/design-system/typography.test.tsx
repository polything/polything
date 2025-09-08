/**
 * Typography Component Tests
 */

import { render, screen } from '@testing-library/react'
import { Heading, Text, LeadText, SmallText } from './typography'

describe('Typography Components', () => {
  describe('Heading', () => {
    test('renders h1 with correct classes', () => {
      render(
        <Heading level={1}>
          Test Heading
        </Heading>
      )
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('text-4xl', 'md:text-6xl', 'font-bold', 'font-raleway', 'leading-tight')
    })

    test('renders h2 with correct classes', () => {
      render(
        <Heading level={2}>
          Test Heading
        </Heading>
      )
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-3xl', 'md:text-5xl', 'font-bold', 'font-raleway', 'leading-tight')
    })

    test('renders h3 with correct classes', () => {
      render(
        <Heading level={3}>
          Test Heading
        </Heading>
      )
      
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveClass('text-2xl', 'md:text-4xl', 'font-bold', 'font-raleway', 'leading-snug')
    })

    test('applies custom color classes', () => {
      render(
        <Heading level={1} color="brand">
          Test Heading
        </Heading>
      )
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-brand-yellow')
    })

    test('applies custom className', () => {
      render(
        <Heading level={1} className="custom-class">
          Test Heading
        </Heading>
      )
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('custom-class')
    })

    test('renders with custom as prop', () => {
      render(
        <Heading level={1} as="div">
          Test Heading
        </Heading>
      )
      
      const element = screen.getByText('Test Heading')
      expect(element.tagName).toBe('DIV')
    })

    test('handles all heading levels', () => {
      const levels = [1, 2, 3, 4, 5, 6] as const
      
      levels.forEach(level => {
        const { container } = render(
          <Heading level={level}>
            Test Heading {level}
          </Heading>
        )
        
        const heading = container.firstChild as HTMLElement
        expect(heading).toHaveClass('font-raleway', 'font-bold')
      })
    })
  })

  describe('Text', () => {
    test('renders with default classes', () => {
      render(
        <Text>
          Test text
        </Text>
      )
      
      const text = screen.getByText('Test text')
      expect(text).toHaveClass('text-base', 'md:text-lg', 'font-inter', 'leading-relaxed', 'font-normal')
    })

    test('applies custom size classes', () => {
      render(
        <Text size="large">
          Test text
        </Text>
      )
      
      const text = screen.getByText('Test text')
      expect(text).toHaveClass('text-lg', 'md:text-xl', 'font-inter', 'leading-relaxed')
    })

    test('applies custom color classes', () => {
      render(
        <Text color="muted">
          Test text
        </Text>
      )
      
      const text = screen.getByText('Test text')
      expect(text).toHaveClass('text-gray-600')
    })

    test('applies custom weight classes', () => {
      render(
        <Text weight="bold">
          Test text
        </Text>
      )
      
      const text = screen.getByText('Test text')
      expect(text).toHaveClass('font-bold')
    })

    test('renders with custom as prop', () => {
      render(
        <Text as="span">
          Test text
        </Text>
      )
      
      const element = screen.getByText('Test text')
      expect(element.tagName).toBe('SPAN')
    })

    test('handles all size variants', () => {
      const sizes = ['small', 'base', 'large'] as const
      
      sizes.forEach(size => {
        const { container } = render(
          <Text size={size}>
            Test text {size}
          </Text>
        )
        
        const text = container.firstChild as HTMLElement
        expect(text).toHaveClass('font-inter')
      })
    })
  })

  describe('LeadText', () => {
    test('renders with correct classes', () => {
      render(
        <LeadText>
          Test lead text
        </LeadText>
      )
      
      const text = screen.getByText('Test lead text')
      expect(text).toHaveClass('text-lg', 'md:text-xl', 'leading-relaxed', 'font-inter')
    })

    test('applies custom color classes', () => {
      render(
        <LeadText color="brand">
          Test lead text
        </LeadText>
      )
      
      const text = screen.getByText('Test lead text')
      expect(text).toHaveClass('text-brand-yellow')
    })
  })

  describe('SmallText', () => {
    test('renders with correct classes', () => {
      render(
        <SmallText>
          Test small text
        </SmallText>
      )
      
      const text = screen.getByText('Test small text')
      expect(text).toHaveClass('text-sm', 'md:text-base', 'font-inter')
    })

    test('applies custom color classes', () => {
      render(
        <SmallText color="brand">
          Test small text
        </SmallText>
      )
      
      const text = screen.getByText('Test small text')
      expect(text).toHaveClass('text-brand-yellow')
    })
  })
})

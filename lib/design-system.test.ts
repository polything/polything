/**
 * Design System Tests
 * 
 * Tests for the design system utilities, tokens, and helper functions
 */

import { 
  designTokens, 
  createResponsiveClasses, 
  buttonVariants, 
  cardVariants, 
  typographyClasses, 
  layoutClasses, 
  bauhausElements, 
  glassClasses 
} from './design-system'

describe('Design System', () => {
  describe('designTokens', () => {
    test('should have all required brand colors', () => {
      expect(designTokens.colors.brand).toHaveProperty('yellow')
      expect(designTokens.colors.brand).toHaveProperty('lightBlue')
      expect(designTokens.colors.brand).toHaveProperty('orange')
      expect(designTokens.colors.brand).toHaveProperty('red')
      expect(designTokens.colors.brand).toHaveProperty('green')
      expect(designTokens.colors.brand).toHaveProperty('darkGreen')
      expect(designTokens.colors.brand).toHaveProperty('navy')
    })

    test('should have semantic color mappings', () => {
      expect(designTokens.colors.primary).toBe('#FEC502')
      expect(designTokens.colors.secondary).toBe('#02AFF4')
      expect(designTokens.colors.accent).toBe('#FD5B06')
    })

    test('should have typography tokens', () => {
      expect(designTokens.typography.fonts.heading).toBe('var(--font-raleway)')
      expect(designTokens.typography.fonts.body).toBe('var(--font-inter)')
      expect(designTokens.typography.sizes).toHaveProperty('xs')
      expect(designTokens.typography.sizes).toHaveProperty('7xl')
    })

    test('should have spacing tokens', () => {
      expect(designTokens.spacing.xs).toBe('0.25rem')
      expect(designTokens.spacing['5xl']).toBe('8rem')
    })

    test('should have border radius tokens', () => {
      expect(designTokens.borderRadius.none).toBe('0')
      expect(designTokens.borderRadius.full).toBe('9999px')
    })

    test('should have shadow tokens', () => {
      expect(designTokens.shadows).toHaveProperty('sm')
      expect(designTokens.shadows).toHaveProperty('2xl')
    })

    test('should have breakpoint tokens', () => {
      expect(designTokens.breakpoints.sm).toBe('640px')
      expect(designTokens.breakpoints['2xl']).toBe('1536px')
    })

    test('should have z-index tokens', () => {
      expect(designTokens.zIndex.hide).toBe(-1)
      expect(designTokens.zIndex.tooltip).toBe(1800)
    })
  })

  describe('createResponsiveClasses', () => {
    test('should create responsive classes correctly', () => {
      const base = 'text-lg'
      const variants = {
        'md:': 'text-xl',
        'lg:': 'text-2xl'
      }
      
      const result = createResponsiveClasses(base, variants)
      expect(result).toBe('text-lg md:text-xl lg:text-2xl')
    })

    test('should handle empty variants', () => {
      const base = 'text-lg'
      const variants = {}
      
      const result = createResponsiveClasses(base, variants)
      expect(result).toBe('text-lg')
    })
  })

  describe('buttonVariants', () => {
    test('should have all button variants', () => {
      expect(buttonVariants).toHaveProperty('primary')
      expect(buttonVariants).toHaveProperty('secondary')
      expect(buttonVariants).toHaveProperty('outline')
      expect(buttonVariants).toHaveProperty('ghost')
    })

    test('should have correct primary variant classes', () => {
      expect(buttonVariants.primary).toContain('bg-brand-yellow')
      expect(buttonVariants.primary).toContain('hover:bg-yellow-500')
      expect(buttonVariants.primary).toContain('text-black')
    })

    test('should have correct secondary variant classes', () => {
      expect(buttonVariants.secondary).toContain('bg-brand-lightBlue')
      expect(buttonVariants.secondary).toContain('hover:bg-blue-500')
      expect(buttonVariants.secondary).toContain('text-white')
    })
  })

  describe('cardVariants', () => {
    test('should have all card variants', () => {
      expect(cardVariants).toHaveProperty('default')
      expect(cardVariants).toHaveProperty('glass')
      expect(cardVariants).toHaveProperty('elevated')
    })

    test('should have correct default variant classes', () => {
      expect(cardVariants.default).toContain('bg-white')
      expect(cardVariants.default).toContain('rounded-xl')
      expect(cardVariants.default).toContain('shadow-md')
    })
  })

  describe('typographyClasses', () => {
    test('should have all heading classes', () => {
      expect(typographyClasses.heading).toHaveProperty('h1')
      expect(typographyClasses.heading).toHaveProperty('h2')
      expect(typographyClasses.heading).toHaveProperty('h3')
      expect(typographyClasses.heading).toHaveProperty('h4')
      expect(typographyClasses.heading).toHaveProperty('h5')
      expect(typographyClasses.heading).toHaveProperty('h6')
    })

    test('should have all body classes', () => {
      expect(typographyClasses.body).toHaveProperty('large')
      expect(typographyClasses.body).toHaveProperty('base')
      expect(typographyClasses.body).toHaveProperty('small')
    })

    test('should have correct h1 classes', () => {
      expect(typographyClasses.heading.h1).toContain('text-4xl')
      expect(typographyClasses.heading.h1).toContain('md:text-6xl')
      expect(typographyClasses.heading.h1).toContain('font-raleway')
    })
  })

  describe('layoutClasses', () => {
    test('should have container classes', () => {
      expect(layoutClasses.container).toContain('container')
      expect(layoutClasses.container).toContain('mx-auto')
      expect(layoutClasses.container).toContain('px-4')
    })

    test('should have section classes', () => {
      expect(layoutClasses.section).toContain('py-16')
      expect(layoutClasses.section).toContain('md:py-24')
    })

    test('should have grid classes', () => {
      expect(layoutClasses.grid).toHaveProperty('twoCol')
      expect(layoutClasses.grid).toHaveProperty('threeCol')
      expect(layoutClasses.grid).toHaveProperty('fourCol')
    })
  })

  describe('bauhausElements', () => {
    test('should have geometric classes', () => {
      expect(bauhausElements.circle).toBe('rounded-full')
      expect(bauhausElements.square).toBe('rounded-none')
      expect(bauhausElements.triangle).toBe('bauhaus-triangle')
    })

    test('should have animation classes', () => {
      expect(bauhausElements.animations.float).toBe('float')
      expect(bauhausElements.animations.floatDelay1).toBe('float float-delay-1')
      expect(bauhausElements.animations.rotate).toBe('rotate-animation')
    })
  })

  describe('glassClasses', () => {
    test('should have all glass variants', () => {
      expect(glassClasses).toHaveProperty('light')
      expect(glassClasses).toHaveProperty('dark')
      expect(glassClasses).toHaveProperty('subtle')
      expect(glassClasses).toHaveProperty('strong')
    })

    test('should have correct light glass classes', () => {
      expect(glassClasses.light).toBe('glass')
    })

    test('should have correct dark glass classes', () => {
      expect(glassClasses.dark).toBe('glass-dark')
    })
  })
})

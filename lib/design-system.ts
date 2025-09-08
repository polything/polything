/**
 * Polything Design System
 * 
 * A comprehensive design system built on top of Tailwind CSS
 * that maintains the existing Polything brand identity while
 * providing consistent, reusable design tokens and utilities.
 */

// Design Tokens
export const designTokens = {
  // Brand Colors (matching existing CSS variables)
  colors: {
    brand: {
      yellow: '#FEC502',
      lightBlue: '#02AFF4', 
      orange: '#FD5B06',
      red: '#D50618',
      green: '#04A876',
      darkGreen: '#01633C',
      navy: '#2A2F67',
    },
    // Semantic color mappings
    primary: '#FEC502',
    secondary: '#02AFF4',
    accent: '#FD5B06',
    success: '#04A876',
    warning: '#FD5B06',
    error: '#D50618',
    info: '#02AFF4',
  },
  
  // Typography
  typography: {
    fonts: {
      heading: 'var(--font-raleway)',
      body: 'var(--font-inter)',
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      tight: '1.1',
      snug: '1.2',
      normal: '1.5',
      relaxed: '1.6',
      loose: '1.8',
    },
  },
  
  // Spacing (based on Tailwind's spacing scale)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
    '5xl': '8rem',   // 128px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  // Breakpoints (matching Tailwind)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const

// Utility Functions
export const createResponsiveClasses = (base: string, variants: Record<string, string>) => {
  return Object.entries(variants).reduce((acc, [breakpoint, value]) => {
    return `${acc} ${breakpoint}${value}`
  }, base)
}

// Component Variants
export const buttonVariants = {
  primary: 'bg-brand-yellow hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors',
  secondary: 'bg-brand-lightBlue hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors',
  outline: 'border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black font-semibold px-6 py-3 rounded-lg transition-colors',
  ghost: 'text-brand-yellow hover:bg-brand-yellow/10 font-semibold px-6 py-3 rounded-lg transition-colors',
} as const

export const cardVariants = {
  default: 'bg-white rounded-xl shadow-md border border-gray-100',
  glass: 'bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-xl',
  elevated: 'bg-white rounded-xl shadow-xl border border-gray-100',
} as const

// Typography Utilities
export const typographyClasses = {
  heading: {
    h1: 'text-4xl md:text-6xl font-bold font-raleway leading-tight',
    h2: 'text-3xl md:text-5xl font-bold font-raleway leading-tight',
    h3: 'text-2xl md:text-4xl font-bold font-raleway leading-snug',
    h4: 'text-xl md:text-3xl font-bold font-raleway leading-snug',
    h5: 'text-lg md:text-2xl font-bold font-raleway leading-snug',
    h6: 'text-base md:text-xl font-bold font-raleway leading-snug',
  },
  body: {
    large: 'text-lg md:text-xl font-inter leading-relaxed',
    base: 'text-base md:text-lg font-inter leading-relaxed',
    small: 'text-sm md:text-base font-inter leading-normal',
  },
} as const

// Layout Utilities
export const layoutClasses = {
  container: 'container mx-auto px-4 md:px-8',
  section: 'py-16 md:py-24',
  sectionSmall: 'py-8 md:py-16',
  sectionLarge: 'py-24 md:py-32',
  grid: {
    twoCol: 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12',
    threeCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12',
    fourCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12',
  },
} as const

// Bauhaus Design Elements
export const bauhausElements = {
  circle: 'rounded-full',
  square: 'rounded-none',
  triangle: 'bauhaus-triangle',
  geometric: {
    circle: 'bauhaus-circle',
    square: 'bauhaus-square',
    triangle: 'bauhaus-triangle',
  },
  animations: {
    float: 'float',
    floatDelay1: 'float float-delay-1',
    floatDelay2: 'float float-delay-2',
    rotate: 'rotate-animation',
    pulse: 'pulse-animation',
  },
} as const

// Glassmorphism Utilities
export const glassClasses = {
  light: 'glass',
  dark: 'glass-dark',
  subtle: 'bg-white/10 backdrop-blur-sm border border-white/20',
  strong: 'bg-white/30 backdrop-blur-lg border border-white/40',
} as const

// Export types for TypeScript
export type ButtonVariant = keyof typeof buttonVariants
export type CardVariant = keyof typeof cardVariants
export type TypographySize = keyof typeof typographyClasses.heading | keyof typeof typographyClasses.body
export type GlassVariant = keyof typeof glassClasses
